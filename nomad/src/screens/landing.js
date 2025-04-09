import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/landing.css';

function Landing() {
  return (
    <div className="landing-container">
      {/*header section */}
      <header className="landing-header">
        <div className="logo-container">
          <img src="../assets/logo.png" alt="Nomad Logo" className="logo" />
          <span className="logo-text">nomad</span>
        </div>
        <div className="user-greeting">
          Hi User!
        </div>
      </header>

      {/*quiz section*/}
      <div className="quiz-section">
        <h1>Where will you work today?</h1>
        <Link to="/quiz" className="find-place-button">
          find me a place
        </Link>
      </div>

      {/*info section */}
      <div className="info-section">
        <div className="info-content">
          <div className="info-text">
            <h2>Work From Home, Anywhere!</h2>
            <p>We are a remote workspace finder helping to find the best remote working location for <strong>you</strong>!</p>
            <p>We use your <strong>preferences</strong>, <strong>working style</strong>, and <strong>location</strong> to The application will then respond with all remote workspaces that are optimized for the user's location and work preferences</p>
          </div>
          <div className="info-image">
            <img src="../assets/landingimage.png" alt="Person working remotely" />
          </div>
        </div>
      </div>

      {/*signup Section */}
      <div className="signup-section">
        <div className="signup-container">
          <div className="signup-form-container">
            <h2>Get Set Up!</h2>
            <form className="signup-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input type="email" id="email" name="email" />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" />
              </div>
              <div className="form-group checkbox">
                <input type="checkbox" id="terms" name="terms" />
                <label htmlFor="terms">I agree to the <a href="#">terms & policy</a></label>
              </div>
              <button type="submit" className="signup-button">Signup</button>
              <div className="or-divider">
                <span>or</span>
              </div>
              <button type="button" className="google-signin-button">
                <img src="../google-icon.png" alt="Google" />
                Sign in with Google
              </button>
              <div className="login-link">
                Have an account? <a href="#">Log in</a>
              </div>
            </form>
          </div>
          <div className="signup-message">
            <h2>Find your perfect workspace, for free!</h2>
            <div className="arrow-pointer"></div>
          </div>
        </div>
      </div>

      {/*footer section */}
      <footer className="footer">
        <div className="contact-section">
          <h3>Contact Us</h3>
          <p>800 W Campbell Rd, Richardson, TX 75080 | +1 (469)-286-7670 | hiba.mubeen7@gmail.com</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;