import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase/firebase';
import { Link } from 'react-router-dom';
import {
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  collection,
  query,
  where,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const GOOGLE_MAPS_API_KEY = 'AIzaSyB_giVz4GeO3xEQ5bt4PAG8DCFtjaTFORI';

const PlacesPage = () => {
  const [places, setPlaces] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [formData, setFormData] = useState({
    currentAddress: '',
    maxCommuteTime: 30,
    amenities: {
      printers: false,
      coffee: false,
      wifi: true,
      other: '',
    },
    paidAccess: 'no',
    spaceType: 'cafe',
    noiseLevel: 'moderate',
    foodOptions: 'some',
    workspaceSize: 'medium',
    workdays: {
      sunday: false,
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
    },
    workTimes: {
      start: '09:00',
      end: '17:00',
    }
  });

  // Load Google Maps Script
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (window.google) {
        setMapsLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapsLoaded(true);
      document.head.appendChild(script);
    };

    loadGoogleMapsScript();
    
    // Cleanup function to handle component unmounting
    return () => {
      setMapsLoaded(false);
    };
  }, []);

  // Replace the static userId with currentUser?.uid
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!currentUser) return;
      
      const q = query(collection(db, "favorites"), where("userId", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);
      const favoriteIds = querySnapshot.docs.map(doc => doc.data().placeId);
      setFavorites(favoriteIds);
    };

    loadFavorites();
  }, [currentUser]);

  const toggleFavorite = async (place) => {
    if (!currentUser) return;
    
    const docRef = doc(db, "favorites", `${currentUser.uid}_${place.place_id}`);

    if (favorites.includes(place.place_id)) {
      await deleteDoc(docRef);
      setFavorites((prev) => prev.filter((id) => id !== place.place_id));
    } else {
      await setDoc(docRef, {
        userId: currentUser.uid,
        placeId: place.place_id,
        name: place.name,
        address: place.vicinity,
        timestamp: new Date(),
      });
      setFavorites((prev) => [...prev, place.place_id]);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle checkbox changes for amenities
  const handleAmenityChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      amenities: {
        ...formData.amenities,
        [name]: checked,
      }
    });
  };

  // Handle checkbox changes for workdays
  const handleWorkdayChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      workdays: {
        ...formData.workdays,
        [name]: checked,
      }
    });
  };

  // Handle work time changes
  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      workTimes: {
        ...formData.workTimes,
        [name]: value,
      }
    });
  };

  // Function to calculate distance and duration using Google Distance Matrix API
  const calculateCommuteTimes = async (places, origin) => {
    if (!window.google) {
      throw new Error("Google Maps not loaded");
    }
    
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
            reject(new Error(`Distance Matrix failed: ${status}`));
          }
        });
      });

      return response.rows[0].elements;
    } catch (err) {
      throw new Error('Error calculating commute times: ' + err.message);
    }
  };

  // Function to check if a place is open during the specified workdays and times
  const isPlaceOpenDuringWorkHours = (place) => {
    if (!place.opening_hours || !place.opening_hours.periods) {
      return false; // Can't determine if it's open
    }

    // Convert user's work times to minutes for easier comparison
    const convertTimeToMinutes = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };
    
    const userStartMinutes = convertTimeToMinutes(formData.workTimes.start);
    const userEndMinutes = convertTimeToMinutes(formData.workTimes.end);
    
    // Check each selected workday
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const selectedWorkdays = daysOfWeek.filter(day => formData.workdays[day]);
    
    // Must be open on all selected workdays during specified hours
    return selectedWorkdays.every(day => {
      const dayIndex = daysOfWeek.indexOf(day);
      
      // Find matching period for this day
      const period = place.opening_hours.periods.find(p => p.open.day === dayIndex);
      if (!period) return false;
      
      // Convert place's hours to minutes
      const placeOpenMinutes = parseInt(period.open.hours) * 60 + parseInt(period.open.minutes);
      const placeCloseMinutes = parseInt(period.close.hours) * 60 + parseInt(period.close.minutes);
      
      // Check if place's hours contain user's work hours
      return placeOpenMinutes <= userStartMinutes && placeCloseMinutes >= userEndMinutes;
    });
  };

  // Function to search places using Google Places API
  const searchPlaces = async (e) => {
    e.preventDefault();
    setFormSubmitted(true); // Mark form as submitted
    
    if (!formData.currentAddress || !mapsLoaded) {
      setError("Please ensure you've entered an address and Google Maps has loaded");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const geocoder = new window.google.maps.Geocoder();
      
      // First, geocode the current address
      const geocodeResult = await new Promise((resolve, reject) => {
        geocoder.geocode({ address: formData.currentAddress }, (results, status) => {
          if (status === 'OK' && results.length > 0) {
            resolve(results[0]);
          } else {
            reject(new Error(`Geocoding failed: ${status}`));
          }
        });
      });

      const service = new window.google.maps.places.PlacesService(document.createElement('div'));
      
      // Determine place types based on preferences
      let placeType;
      switch(formData.spaceType) {
        case 'cafe':
          placeType = 'cafe';
          break;
        case 'library':
          placeType = 'library';
          break;
        case 'office':
          placeType = 'coworking_space';
          break;
        default:
          placeType = 'establishment';
      }

      // Prepare amenities as keywords
      const amenityKeywords = Object.keys(formData.amenities)
        .filter(key => formData.amenities[key] && key !== 'other')
        .concat(formData.amenities.other ? [formData.amenities.other] : [])
        .join(' ');

      // Build search query based on preferences
      const searchRequest = {
        location: geocodeResult.geometry.location,
        radius: 15000, // 15km radius to ensure we get results
        type: placeType,
        // Add opening_hours to get opening hours data
        fields: ['name', 'place_id', 'geometry', 'photos', 'rating', 'user_ratings_total', 'vicinity', 'opening_hours']
      };

      // If we have specific amenities, add them as keywords
      if (amenityKeywords) {
        searchRequest.keyword = amenityKeywords;
      }

      // Search for places
      const placesResult = await new Promise((resolve, reject) => {
        service.nearbySearch(searchRequest, (results, status) => {
          if (status === 'OK') {
            resolve(results);
          } else {
            reject(new Error(`Places search failed: ${status}`));
          }
        });
      });

      // For each place, get detailed information including opening hours
      const detailedPlaces = await Promise.all(
        placesResult.map(place => {
          return new Promise((resolve, reject) => {
            service.getDetails({
              placeId: place.place_id,
              fields: ['opening_hours', 'price_level', 'types', 'reviews']
            }, (result, status) => {
              if (status === 'OK') {
                // Merge the detailed data with the basic place data
                resolve({
                  ...place,
                  opening_hours: result.opening_hours,
                  price_level: result.price_level,
                  types: result.types,
                  reviews: result.reviews
                });
              } else {
                // If details couldn't be fetched, just use the basic place data
                resolve(place);
              }
            });
          });
        })
      );

      // Calculate commute times for each place
      const commuteTimes = await calculateCommuteTimes(detailedPlaces, geocodeResult.geometry.location);
      
      // Filter places based on user preferences
      const filteredPlaces = detailedPlaces.filter((place, index) => {
        const commuteInfo = commuteTimes[index];
        
        // Make sure place meets commute time requirements
        if (!(commuteInfo && commuteInfo.status === "OK" && 
              commuteInfo.duration.value <= (formData.maxCommuteTime * 60))) {
          return false;
        }

        // Check if place is open during work hours (if data is available)
        if (place.opening_hours && place.opening_hours.periods) {
          if (!isPlaceOpenDuringWorkHours(place)) {
            return false;
          }
        }

        // Check paid access preference
        if (formData.paidAccess === 'no' && place.price_level > 1) {
          return false;
        }

        // Additional filters could be added here for noise level, food options, etc.
        // These would need to be estimated from place types, reviews or other attributes

        return true;
      });

      // Add commute info to each place for display
      const placesWithCommuteInfo = filteredPlaces.map((place, index) => {
        const commuteInfo = commuteTimes[index];
        return {
          ...place,
          commuteInfo: commuteInfo && commuteInfo.status === "OK" ? {
            distance: commuteInfo.distance.text,
            duration: commuteInfo.duration.text
          } : null
        };
      });

      setPlaces(placesWithCommuteInfo);
      
      if (placesWithCommuteInfo.length === 0) {
        setError("No places found matching your criteria. Try adjusting your preferences or search radius.");
      }
    } catch (err) {
      setError("Search error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const viewOnMaps = (place) => {
    const { lat, lng } = place.geometry.location;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${place.place_id}`;
    window.open(mapsUrl, '_blank');
  };

  return (
<div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center mb-2">
    <h1 className="text-3xl font-bold text-gray-900">Find Your Perfect Workspace</h1>
  <Link 
    to="/Profile" 
    className="px-6 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition-colors"
  >
    Profile
  </Link>
</div>
<p className="text-gray-600 mb-8 text-left">Fill in your preferences to find the ideal workspace</p>
    
    {/* Preferences Form */}
    <div className="mb-8">
      <form onSubmit={searchPlaces}>
        {/* Current Address */}
        <div className="mb-6">
          <label htmlFor="currentAddress" className="block text-sm font-medium text-gray-700 mb-1 text-left">
            Current Address
          </label>
          <input
            type="text"
            name="currentAddress"
            id="currentAddress"
            value={formData.currentAddress}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Your Address Here"
            required
          />
        </div>
        
        {/* Main preferences container with light blue background */}
        <div className="bg-[#EDf5ff] p-6 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              {/* Max Commute Time */}
              <div className="mb-6">
                <label htmlFor="maxCommuteTime" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  Max Commute Time (mins)
                </label>
                <input
                  type="number"
                  name="maxCommuteTime"
                  id="maxCommuteTime"
                  value={formData.maxCommuteTime}
                  onChange={handleInputChange}
                  min="1"
                  max="120"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              {/* Amenities */}
              <div className="mb-6 bg-blue-100 p-4 rounded-md">
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Amenities
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="printers"
                      name="printers"
                      type="checkbox"
                      checked={formData.amenities.printers}
                      onChange={handleAmenityChange}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="printers" className="ml-2 text-sm text-gray-700">
                      Printer
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="coffee"
                      name="coffee"
                      type="checkbox"
                      checked={formData.amenities.coffee}
                      onChange={handleAmenityChange}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="coffee" className="ml-2 text-sm text-gray-700">
                      Coffee
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="wifi"
                      name="wifi"
                      type="checkbox"
                      checked={formData.amenities.wifi}
                      onChange={handleAmenityChange}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="wifi" className="ml-2 text-sm text-gray-700">
                      WiFi
                    </label>
                  </div>
                  <div className="flex items-center">
                    <label htmlFor="other" className="text-sm text-gray-700 mr-2">
                      Other:
                    </label>
                    <input
                      type="text"
                      name="other"
                      id="other"
                      value={formData.amenities.other}
                      onChange={(e) => setFormData({
                        ...formData,
                        amenities: {
                          ...formData.amenities,
                          other: e.target.value
                        }
                      })}
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              {/* Work Days */}
              <div className="mb-6 bg-blue-100 p-4 rounded-md">
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Work Days
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { day: 'Sunday', key: 'sunday' },
                    { day: 'Monday', key: 'monday' },
                    { day: 'Tuesday', key: 'tuesday' },
                    { day: 'Wednesday', key: 'wednesday' },
                    { day: 'Thursday', key: 'thursday' },
                    { day: 'Friday', key: 'friday' },
                    { day: 'Saturday', key: 'saturday' }
                  ].map(({ day, key }) => (
                    <div key={key} className="flex items-center">
                      <input
                        id={key}
                        name={key}
                        type="checkbox"
                        checked={formData.workdays[key]}
                        onChange={handleWorkdayChange}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={key} className="ml-2 text-sm text-gray-700">
                        {day}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right Column */}
            <div>
              {/* Preferred Workspace Type */}
              <div className="mb-6">
                <label htmlFor="spaceType" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  Preferred Workspace Type
                </label>
                <select
                  id="spaceType"
                  name="spaceType"
                  value={formData.spaceType}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="cafe">Cafe</option>
                  <option value="library">Library</option>
                  <option value="office">Office/Coworking Space</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              {/* Paid Access */}
              <div className="mb-6">
                <label htmlFor="paidAccess" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  Paid Access
                </label>
                <select
                  id="paidAccess"
                  name="paidAccess"
                  value={formData.paidAccess}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="yes">Yes (willing to pay)</option>
                  <option value="no">No (Free Access Only)</option>
                </select>
              </div>
              
              {/* Preferred Noise Level */}
              <div className="mb-6">
                <label htmlFor="noiseLevel" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  Preferred Noise Level
                </label>
                <select
                  id="noiseLevel"
                  name="noiseLevel"
                  value={formData.noiseLevel}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="quiet">Quiet</option>
                  <option value="moderate">Moderate</option>
                  <option value="lively">Lively</option>
                </select>
              </div>
              
              {/* Workspace Size */}
              <div className="mb-6">
                <label htmlFor="workspaceSize" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  Preferred Workspace Size
                </label>
                <select
                  id="workspaceSize"
                  name="workspaceSize"
                  value={formData.workspaceSize}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="small">Small (1-2 People)</option>
                  <option value="medium">Medium (3-5 People)</option>
                  <option value="large">Large (6+ People)</option>
                </select>
              </div>
              
              {/* Food Options */}
              <div className="mb-6">
                <label htmlFor="foodOptions" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  Food Options
                </label>
                <select
                  id="foodOptions"
                  name="foodOptions"
                  value={formData.foodOptions}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="none">No food needed</option>
                  <option value="some">Some Options</option>
                  <option value="many">Many options</option>
                </select>
              </div>
              
              {/* Work Times */}
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-6">
                  <label htmlFor="start" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                    Work Start Time
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      name="start"
                      id="start"
                      value={formData.workTimes.start}
                      onChange={handleTimeChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="end" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                    Work End Time
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      name="end"
                      id="end"
                      value={formData.workTimes.end}
                      onChange={handleTimeChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <button
            type="submit"
            disabled={!formData.currentAddress || loading || !mapsLoaded}
            className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 transition-colors"
          >
            {loading ? 'Searching...' : 'Find Workspaces'}
          </button>
        </div>
      </form>
    </div>

        {/* Error Message - Only show after form submission */}
        {error && formSubmitted && (
          <div className="rounded-md bg-red-50 p-4 mb-8">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Results Grid - Only show if we have results */}
        {places.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Search Results</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {places.map((place) => (
                <div key={place.place_id} className="bg-white overflow-hidden shadow rounded-lg">
                  {place.photos && place.photos[0] && (
                    <div className="h-48 bg-gray-200">
                      <img
                        src={place.photos[0].getUrl()}
                        alt={place.name}
                        className="w-full h-full object-cover"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900">{place.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{place.vicinity}</p>
                    
                    {/* Rating */}
                    <div className="mt-2 flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1 text-sm text-gray-600">
                        {place.rating ? `${place.rating} (${place.user_ratings_total} reviews)` : 'No ratings'}
                      </span>
                    </div>
                    
                    {/* Commute Info */}
                    {place.commuteInfo && (
                      <div className="mt-2 text-sm text-gray-700">
                        <p><span className="font-medium">Distance:</span> {place.commuteInfo.distance}</p>
                        <p><span className="font-medium">Travel time:</span> {place.commuteInfo.duration}</p>
                      </div>
                    )}
                    
                    {/* Hours (if available) */}
                    {place.opening_hours && place.opening_hours.weekday_text && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700">Hours:</p>
                        <div className="mt-1 text-xs text-gray-500">
                          {place.opening_hours.weekday_text.map((day, i) => (
                            <p key={i}>{day}</p>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => toggleFavorite(place)}
                        className={`text-sm font-medium rounded px-3 py-1 ${
                          favorites.includes(place.place_id)
                            ? 'bg-yellow-300 text-yellow-900'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {favorites.includes(place.place_id)
                          ? '★ Favorited'
                          : '☆ Add to Favorites'}
                      </button>
                      <button
                        onClick={() => viewOnMaps(place)}
                        className="text-sm font-medium rounded px-3 py-1 bg-blue-500 text-white hover:bg-blue-600"
                      >
                        View on Maps
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Show a message when form has been submitted but no results found */}
        {formSubmitted && places.length === 0 && !loading && !error && (
          <div className="bg-yellow-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">No results found</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    No workspaces found matching your criteria. Try adjusting your preferences or search radius.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlacesPage;
