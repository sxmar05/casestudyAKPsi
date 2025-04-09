import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/locator.css';

function Locator() {
  return (
    <div className="App-header">
      <h1>Location Finder</h1>
      <p>Find resources near you</p>
      <Link to="/" className="App-link">Back to Home</Link>
    </div>
  );
}

export default Locator;