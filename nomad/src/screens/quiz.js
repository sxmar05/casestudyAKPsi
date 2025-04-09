import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/profile.css';

function Quiz() {
  return (
    <div className="App-header">
      <h1>Resource Quiz</h1>
      <p>Find the right resources for your needs</p>
      <Link to="/" className="App-link">Back to Home</Link>
    </div>
  );
}

export default Quiz;