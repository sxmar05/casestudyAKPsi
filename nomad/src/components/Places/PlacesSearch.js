import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PlacesSearch = () => {
  const [searchInput, setSearchInput] = useState('');
  const [showPreferences, setShowPreferences] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
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

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchInput.length > 0) {
        setShowPreferences(true);
        setSelectedLocation({ geometry: { location: { lat: 0, lng: 0 } } });
      }
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
      navigate('/places/results', { 
        state: { 
          places: [],
          preferences
        }
      });
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
            type="text"
            value={searchInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter your address..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
            autoComplete="off"
          />
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