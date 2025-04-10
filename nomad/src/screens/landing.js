import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/landing.css';
import arrowImage from '../assets/arrow.png';

function Landing() {
  return (
    <div className="landing-container">
      {/* Header */}
      <header className="header">
        <div className="logo-section">
          <img src="/logo.png" alt="nomad" className="logo" />
          <span className="logo-text">nomad</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <h1>Where will you work today?</h1>
        <Link to="/quiz" className="find-place-button">
          find me a place
        </Link>
      </section>

      {/* Info Section */}
      <section className="info-section">
        <div className="info-content">
          <div className="info-text">
            <h2>Work From Home, Anywhere!</h2>
            <p>
              We are a remote workspace finder helping to find the best remote working location for <strong>you</strong>!
            </p>
            <p>
              We use your <strong>preferences</strong>, <strong>working style</strong>, and <strong>location</strong> to The application will then respond with all remote workspaces that are optimized for the user's location and work preferences
            </p>
          </div>
          <div className="info-image">
            <img src="/remote-work.png" alt="Person working remotely" />
          </div>
        </div>
      </section>

      {/* Signup Section */}
      <section className="signup-section">
        <div className="signup-container">
          <div className="signup-form">
            <h2>Get Set Up!</h2>
            <form>
              <div className="form-group">
                <input type="text" placeholder="Name" />
              </div>
              <div className="form-group">
                <input type="email" placeholder="Email address" />
              </div>
              <div className="form-group">
                <input type="password" placeholder="Password" />
              </div>
              <div className="form-group checkbox">
                <input type="checkbox" id="terms" />
                <label htmlFor="terms">I agree to the terms & policy</label>
              </div>
              <button type="submit" className="signup-button">Signup</button>
              <div className="divider">
                <span>or</span>
              </div>
              <button type="button" className="google-button">
                <img src="/google-icon.png" alt="Google" />
                Sign in with Google
              </button>
              <p className="login-text">
                Have an account? <Link to="/login">Log in</Link>
              </p>
            </form>
          </div>
          <div className="signup-message">
            <h2>Find your perfect workspace, for free!</h2>
            <img src={arrowImage} alt="" className="arrow" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <h3>Contact Us</h3>
        <p>800 W Campbell Rd, Richardson, TX 75080 | +1 (469)-286-7670 | hiba.mubeen7@gmail.com</p>
      </footer>
    </div>
  );
}

export default Landing;