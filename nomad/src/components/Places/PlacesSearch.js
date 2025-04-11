import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const PlacesSearch = () => {
  const [searchInput, setSearchInput] = useState('');
  const [showPreferences, setShowPreferences] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const inputRef = useRef(null);
  const serviceRef = useRef(null);
  const [preferences, setPreferences] = useState({
    commuteTime: 30,
    workspaceTypes: ['office_space', 'library', 'cafe', 'other'],
    noiseLevels: ['no_preference'],
    priceTypes: ['no_preference'],
    spaceSizes: ['no_preference'],
    privacyLevels: ['no_preference'],
    amenities: [],
    foodOptions: 'yes'
  });
  const navigate = useNavigate();

  useEffect(() => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      console.error('Google Maps API key is missing');
      setError('Google Maps API key is not configured. Please check your .env file.');
      return;
    }

    // Check if script is already loaded
    if (window.google && window.google.maps && window.google.maps.places) {
      initializeService();
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      // If script is still loading, wait for it
      existingScript.onload = () => {
        initializeService();
      };
      return;
    }

    setIsLoading(true);
    setError(null);

    // Load Google Places API script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsLoading(false);
      initializeService();
    };
    script.onerror = (error) => {
      setIsLoading(false);
      setError('Failed to load Google Maps API. Please check your API key and internet connection.');
    };
    document.head.appendChild(script);

    return () => {
      serviceRef.current = null;
    };
  }, []);

  const initializeService = () => {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      setError('Google Places API not loaded');
      return;
    }

    try {
      if (!serviceRef.current) {
        serviceRef.current = new window.google.maps.places.AutocompleteService();
      }
    } catch (error) {
      console.error('Error initializing AutocompleteService:', error);
      setError('Failed to initialize search service. Please try refreshing the page.');
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    setError(null);

    if (value.length > 0 && serviceRef.current) {
      const request = {
        input: value,
        types: ['address'],
        componentRestrictions: { country: 'us' }
      };

      serviceRef.current.getPlacePredictions(request, (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setPredictions(predictions);
        } else {
          setPredictions([]);
        }
      });
    } else {
      setPredictions([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (predictions.length > 0) {
        handlePlaceSelect(predictions[0].place_id);
      } else if (searchInput.length > 0) {
        setShowPreferences(true);
        setSelectedLocation({ geometry: { location: { lat: 0, lng: 0 } } });
      }
    }
  };

  const handlePlaceSelect = async (placeId) => {
    try {
      const geocoder = new window.google.maps.Geocoder();
      const place = await new Promise((resolve, reject) => {
        geocoder.geocode({ placeId }, (results, status) => {
          if (status === window.google.maps.GeocoderStatus.OK) {
            resolve(results[0]);
          } else {
            reject(status);
          }
        });
      });

      setSelectedLocation(place);
      setShowPreferences(true);
      setError(null);
      setPredictions([]);
      setSearchInput(place.formatted_address);
    } catch (error) {
      console.error('Error getting place details:', error);
      setError('Failed to get place details. Please try again.');
    }
  };

  const searchNearbyPlaces = async (location) => {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      setError('Google Places API not loaded. Please try refreshing the page.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const map = new window.google.maps.Map(document.createElement('div'));
      const service = new window.google.maps.places.PlacesService(map);
      
      // Convert commute time to meters (assuming 1 minute = 100 meters)
      const radius = preferences.commuteTime * 100;
      
      console.log('Searching with location:', location);
      console.log('Search radius:', radius);
      console.log('Preferences:', preferences);
      
      // Create a list of place types based on selected workspace types
      const placeTypes = preferences.workspaceTypes.map(type => {
        switch(type) {
          case 'office_space': return 'coworking_space';
          case 'cafe': return 'cafe';
          case 'library': return 'library';
          default: return null;
        }
      }).filter(Boolean);

      console.log('Place types to search:', placeTypes);

      const request = {
        location: location,
        radius: radius.toString(),
        type: placeTypes,
        keyword: 'workspace'
      };

      console.log('Search request:', request);

      service.nearbySearch(request, (results, status) => {
        console.log('Search results:', results);
        console.log('Search status:', status);
        
        setIsLoading(false);
        
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          const filteredPlaces = results.filter(place => {
            // Filter by price type
            if (preferences.priceTypes.length > 0 && !preferences.priceTypes.includes('no_preference')) {
              const isPaid = place.price_level && place.price_level > 0;
              const isFree = !place.price_level || place.price_level === 0;
              
              if (preferences.priceTypes.includes('paid') && !isPaid) return false;
              if (preferences.priceTypes.includes('free') && !isFree) return false;
            }

            // Filter by food options if required
            if (preferences.foodOptions === 'yes') {
              if (!place.types.includes('cafe')) return false;
            }

            return true;
          });

          console.log('Filtered places:', filteredPlaces);

          if (filteredPlaces.length === 0) {
            setError('No workspaces found matching your criteria. Try adjusting your preferences.');
            return;
          }

          // Get detailed information for each place
          const placesWithDetails = filteredPlaces.map(place => {
            return new Promise((resolve) => {
              service.getDetails(
                { 
                  placeId: place.place_id,
                  fields: ['name', 'formatted_address', 'rating', 'price_level', 'opening_hours', 'website', 'photos', 'types']
                }, 
                (result, status) => {
                  if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    resolve(result);
                  } else {
                    console.error('Error getting place details:', status);
                    resolve(place);
                  }
                }
              );
            });
          });

          Promise.all(placesWithDetails).then(places => {
            console.log('Final places with details:', places);
            // Navigate to results page with the filtered places
            navigate('/places/results', { 
              state: { 
                places,
                preferences
              }
            });
          });
        } else {
          console.error('Search failed with status:', status);
          setError('Failed to search for workspaces. Please try again later.');
        }
      });
    } catch (error) {
      setIsLoading(false);
      console.error('Error in searchNearbyPlaces:', error);
      setError('An error occurred while searching for workspaces. Please try again.');
    }
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = () => {
    if (selectedLocation && selectedLocation.geometry) {
      console.log('Selected location:', selectedLocation);
      searchNearbyPlaces(selectedLocation.geometry.location);
    } else {
      console.error('No valid location selected');
      setError('Please select a valid location first');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-4">What is your current address?</h2>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={searchInput}
            onChange={(e) => {
              console.log('Input changed:', e.target.value);
              setSearchInput(e.target.value);
            }}
            placeholder="Enter your address..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
            autoComplete="off"
            style={{ zIndex: 1 }}
          />
          {predictions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
              {predictions.map((prediction) => (
                <div
                  key={prediction.place_id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handlePlaceSelect(prediction.place_id)}
                >
                  {prediction.description}
                </div>
              ))}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-2 text-red-500 text-sm">{error}</p>
        )}
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {showPreferences && !isLoading && (
        <>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-4">What kind of workspace are you looking for?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Commute Time (minutes)</label>
                <input
                  type="range"
                  min="0"
                  max="120"
                  value={preferences.commuteTime}
                  onChange={(e) => handlePreferenceChange('commuteTime', parseInt(e.target.value))}
                  className="w-full"
                  disabled={isLoading}
                />
                <span className="text-sm text-gray-500">{preferences.commuteTime} minutes</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Workspace Types</label>
                <div className="space-y-2">
                  {[
                    { value: 'office_space', label: 'Office Space' },
                    { value: 'library', label: 'Library' },
                    { value: 'cafe', label: 'Cafe' },
                    { value: 'other', label: 'Other' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.workspaceTypes.includes(option.value)}
                        onChange={(e) => {
                          const newTypes = e.target.checked
                            ? [...preferences.workspaceTypes, option.value]
                            : preferences.workspaceTypes.filter(type => type !== option.value);
                          handlePreferenceChange('workspaceTypes', newTypes);
                        }}
                        className="mr-2"
                        disabled={isLoading}
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Noise Level</label>
                <div className="space-y-2">
                  {[
                    { value: 'no_preference', label: 'No Preference' },
                    { value: 'silent', label: 'Silent' },
                    { value: 'quiet', label: 'Quiet' },
                    { value: 'moderate', label: 'Moderate' },
                    { value: 'other', label: 'Other' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.noiseLevels.includes(option.value)}
                        onChange={(e) => {
                          const newLevels = e.target.checked
                            ? [...preferences.noiseLevels, option.value]
                            : preferences.noiseLevels.filter(level => level !== option.value);
                          handlePreferenceChange('noiseLevels', newLevels);
                        }}
                        className="mr-2"
                        disabled={isLoading}
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Price Preference</label>
                <div className="space-y-2">
                  {[
                    { value: 'no_preference', label: 'No Preference' },
                    { value: 'paid', label: 'Paid Spaces' },
                    { value: 'free', label: 'Free Spaces' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.priceTypes.includes(option.value)}
                        onChange={(e) => {
                          const newTypes = e.target.checked
                            ? [...preferences.priceTypes, option.value]
                            : preferences.priceTypes.filter(type => type !== option.value);
                          handlePreferenceChange('priceTypes', newTypes);
                        }}
                        className="mr-2"
                        disabled={isLoading}
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Space Size</label>
                <div className="space-y-2">
                  {[
                    { value: 'no_preference', label: 'No Preference' },
                    { value: 'cubicle', label: 'Cubicle' },
                    { value: 'room', label: 'Room' },
                    { value: 'table', label: 'Table' },
                    { value: 'conference_room', label: 'Conference Room' },
                    { value: 'hall', label: 'Hall' },
                    { value: 'other', label: 'Other' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.spaceSizes.includes(option.value)}
                        onChange={(e) => {
                          const newSizes = e.target.checked
                            ? [...preferences.spaceSizes, option.value]
                            : preferences.spaceSizes.filter(size => size !== option.value);
                          handlePreferenceChange('spaceSizes', newSizes);
                        }}
                        className="mr-2"
                        disabled={isLoading}
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Privacy Level</label>
                <div className="space-y-2">
                  {[
                    { value: 'no_preference', label: 'No Preference' },
                    { value: 'private', label: 'Private' },
                    { value: 'semi_private', label: 'Semi-Private' },
                    { value: 'public', label: 'Public' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.privacyLevels.includes(option.value)}
                        onChange={(e) => {
                          const newLevels = e.target.checked
                            ? [...preferences.privacyLevels, option.value]
                            : preferences.privacyLevels.filter(level => level !== option.value);
                          handlePreferenceChange('privacyLevels', newLevels);
                        }}
                        className="mr-2"
                        disabled={isLoading}
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Food Options Nearby</label>
                <div className="space-y-2">
                  {[
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="foodOptions"
                        value={option.value}
                        checked={preferences.foodOptions === option.value}
                        onChange={(e) => handlePreferenceChange('foodOptions', e.target.value)}
                        className="mr-2"
                        disabled={isLoading}
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
              <div className="space-y-2">
                {[
                  { value: 'wifi', label: 'WiFi' },
                  { value: 'printer', label: 'Printer' },
                  { value: 'coffee', label: 'Coffee' },
                  { value: 'other', label: 'Other' }
                ].map(option => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.amenities.includes(option.value)}
                      onChange={(e) => {
                        const newAmenities = e.target.checked
                          ? [...preferences.amenities, option.value]
                          : preferences.amenities.filter(a => a !== option.value);
                        handlePreferenceChange('amenities', newAmenities);
                      }}
                      className="mr-2"
                      disabled={isLoading}
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleSearch}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Searching...' : 'Find Workspaces'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PlacesSearch;