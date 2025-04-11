import React, { useState } from 'react';
import PlacesSearch from '../components/Places/PlacesSearch';

const PlacesPage = () => {
  const [places, setPlaces] = useState([]);

  const handlePlaceSelected = (selectedPlaces) => {
    setPlaces(selectedPlaces);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Find Your Perfect Workspace</h1>
        
        <PlacesSearch onPlaceSelected={handlePlaceSelected} />

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {places.map((place, index) => (
            <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
              {place.photos && place.photos[0] && (
                <img
                  src={place.photos[0].getUrl({ maxWidth: 400, maxHeight: 300 })}
                  alt={place.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900">{place.name}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {place.formatted_address}
                </p>
                <div className="mt-2 flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1 text-sm text-gray-600">
                    {place.rating ? `${place.rating} (${place.user_ratings_total} reviews)` : 'No ratings'}
                  </span>
                </div>
                {place.price_level && (
                  <p className="mt-1 text-sm text-gray-500">
                    Price Level: {'$'.repeat(place.price_level)}
                  </p>
                )}
                {place.opening_hours && (
                  <p className="mt-1 text-sm text-gray-500">
                    {place.opening_hours.isOpen() ? 'Open Now' : 'Closed'}
                  </p>
                )}
                {place.website && (
                  <a
                    href={place.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm text-blue-600 hover:text-blue-800"
                  >
                    Visit Website
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlacesPage; 