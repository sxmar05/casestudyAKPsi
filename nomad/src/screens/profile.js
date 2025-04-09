import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/profile.css';

function Profile() {
  return (
    <div className="App-header">
      <h1>Your Profile</h1>
      <p>Manage your information here</p>
      <Link to="/" className="App-link">Back to Home</Link>
    </div>
  );
}

export default Profile;