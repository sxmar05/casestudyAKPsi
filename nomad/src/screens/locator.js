import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import '../styles/locator.css';

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const darkMapStyles = [
  {
    "elementType": "geometry",
    "stylers": [{ "color": "#242f3e" }]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#746855" }]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#242f3e" }]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{ "color": "#38414e" }]
  },
  {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [{ "color": "#212a37" }]
  }
];

function Locator() {
  const [center, setCenter] = useState({ lat: 32.7767, lng: -96.7970 }); // Dallas coordinates
  const [locations] = useState([
    { lat: 32.7767, lng: -96.7970, type: 'workspace' },
    { lat: 32.7800, lng: -96.8000, type: 'workspace' },
    { lat: 32.7750, lng: -96.7950, type: 'workspace' },
    { lat: 32.7780, lng: -96.7930, type: 'workspace' },
  ]);

  return (
    <div className="locator-container">
      {/* Header */}
      <header className="header">
                <div className="logo-section">
                  <Link to="/locator" className="logo" style={{ textDecoration: 'none' }}>
                <img src="/logo.png" alt="nomad" className="logo" />
                <span className="logo-text">nomad</span>
                  </Link>
                </div>
                <div className="header-right">
                  
                  <Link to="/profile" className="user-greeting">Hi User!</Link>
                </div>
              </header>

      <div className="locator-content">
        {/* Search Section */}
        <div className="search-section">
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Richardson, TX, USA" 
              className="location-input"
            />
            <button className="filter-button">
              Filter
            </button>
          </div>
          
          <p className="location-hint">
            not your primary location? 
            <Link to="/profile" className="edit-link">edit your preferences here</Link>
          </p>

          <div className="instructions">
            <h2>Enter an address to find a workspace near you</h2>
            <div className="compass-icon">🧭</div>
            <p>Click any location to see its details</p>
          </div>

          <p className="preset-note">*the preset location is from your initial questionnaire</p>
        </div>

        {/* Map Section */}
        <div className="map-section">
          <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={14}
              options={{
                styles: darkMapStyles,
                disableDefaultUI: true,
                zoomControl: true
              }}
            >
              {/* Markers removed */}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    </div>
  );
}

export default Locator;
