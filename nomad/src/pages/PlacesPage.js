import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from '../context/AuthContext';

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const PlacesPage = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentAddress, setCurrentAddress] = useState('');

  useEffect(() => {
    // Load Google Maps Script
    const loadGoogleMapsScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    };

    if (!window.google) {
      loadGoogleMapsScript();
    }
  }, []);

  // Fetch user preferences from Firebase
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const prefsDocRef = doc(db, "preferences", user.uid);
        const docSnap = await getDoc(prefsDocRef);
        
        if (docSnap.exists()) {
          setPreferences(docSnap.data());
        } else {
          setError("No preferences found. Please set your preferences first.");
        }
      } catch (err) {
        setError("Error fetching preferences: " + err.message);
      }
    };

    if (user) {
      fetchPreferences();
    }
  }, [user]);

  // Function to calculate distance and duration using Google Distance Matrix API
  const calculateCommuteTimes = async (places, origin) => {
    const service = new window.google.maps.DistanceMatrixService();
    
    const destinations = places.map(place => place.geometry.location);
    
    try {
      const response = await new Promise((resolve, reject) => {
        service.getDistanceMatrix({
          origins: [origin],
          destinations: destinations,
          travelMode: 'DRIVING',
        }, (response, status) => {
          if (status === 'OK') {
            resolve(response);
          } else {
            reject(new Error('Failed to calculate distances'));
          }
        });
      });

      return response.rows[0].elements;
    } catch (err) {
      throw new Error('Error calculating commute times: ' + err.message);
    }
  };

  // Function to search places using Google Places API
  const searchPlaces = async () => {
    if (!preferences || !currentAddress) return;

    setLoading(true);
    setError(null);

    try {
      const geocoder = new window.google.maps.Geocoder();
      
      // First, geocode the current address
      const { results: [location] } = await new Promise((resolve, reject) => {
        geocoder.geocode({ address: currentAddress }, (results, status) => {
          if (status === 'OK') {
            resolve({ results });
          } else {
            reject(new Error('Geocoding failed'));
          }
        });
      });

      const service = new window.google.maps.places.PlacesService(document.createElement('div'));
      
      // Construct search query based on preferences
      const searchRequest = {
        location: location.geometry.location,
        radius: preferences.searchRadius || 5000, // Default 5km radius
        type: ['establishment'],
        keyword: [
          preferences.spaceType,
          preferences.amenities,
          preferences.businessLevel
        ].filter(Boolean).join(' ')
      };

      // Search for places
      const placesResult = await new Promise((resolve, reject) => {
        service.nearbySearch(searchRequest, (results, status) => {
          if (status === 'OK') {
            resolve(results);
          } else {
            reject(new Error('Places search failed'));
          }
        });
      });

      // Calculate commute times for each place
      const commuteTimes = await calculateCommuteTimes(placesResult, location.geometry.location);
      
      // Filter places based on commute time preference
      const maxCommuteTime = preferences.maxCommuteTime || 30; // Default 30 minutes
      
      const filteredPlaces = placesResult.filter((place, index) => {
        const commuteInfo = commuteTimes[index];
        return commuteInfo.duration.value <= (maxCommuteTime * 60); // Convert minutes to seconds
      });

      setPlaces(filteredPlaces);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Find Your Perfect Workspace</h1>
        
        {/* Address Input */}
        <div className="mb-8">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Your Current Address
          </label>
          <input
            type="text"
            id="address"
            value={currentAddress}
            onChange={(e) => setCurrentAddress(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter your address"
          />
          <button
            onClick={searchPlaces}
            disabled={!currentAddress || loading || !window.google}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
          >
            {loading ? 'Searching...' : 'Search Places'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-8">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Results Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {places.map((place) => (
            <div key={place.place_id} className="bg-white overflow-hidden shadow rounded-lg">
              {place.photos && place.photos[0] && (
                <img
                  src={place.photos[0].getUrl()}
                  alt={place.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900">{place.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{place.vicinity}</p>
                <div className="mt-2 flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1 text-sm text-gray-600">
                    {place.rating ? `${place.rating} (${place.user_ratings_total} reviews)` : 'No ratings'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlacesPage; 