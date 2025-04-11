import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PlacesResults = () => {
  const location = useLocation();
  
  useEffect(() => {
    console.log('Location state:', location.state);
    console.log('Places:', location.state?.places);
    console.log('Preferences:', location.state?.preferences);
  }, [location]);

  if (!location.state) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">No Search Data</h1>
        <p className="text-gray-600">
          Please go back and perform a search first.
        </p>
      </div>
    );
  }

  const { places, preferences } = location.state;

  if (!places || !Array.isArray(places) || places.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">No Results Found</h1>
        <p className="text-gray-600">
          We couldn't find any workspaces matching your criteria. Try adjusting your preferences and search again.
        </p>
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h2 className="font-semibold mb-2">Debug Information:</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify({ preferences }, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Workspace Results</h1>
      <div className="space-y-6">
        {places.map((place, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">{place.name}</h2>
            <p className="text-gray-600 mb-4">{place.formatted_address}</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              {place.rating && (
                <div>
                  <span className="font-medium">Rating:</span> {place.rating}/5
                </div>
              )}
              {place.price_level && (
                <div>
                  <span className="font-medium">Price Level:</span> {'$'.repeat(place.price_level)}
                </div>
              )}
              {place.website && (
                <div className="col-span-2">
                  <a 
                    href={place.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Visit Website
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlacesResults; 