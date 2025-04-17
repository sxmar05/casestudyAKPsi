import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/landing.css';
import arrowImage from '../assets/arrow.png';
import { register, login, signInWithGoogle } from '../firebase/authService';

function Landing() {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!isLogin && !termsAccepted) {
      setError('Please accept the terms & policy');
      return;
    }
    
    try {
      if (isLogin) {
        await login(email, password);
        navigate('/home');
      } else {
        await register(email, password);
        navigate('/home');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/home');
    } catch (err) {
      setError(err.message);
    }
  };

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
        <Link to="/home" className="find-place-button">
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
            <h2>{isLogin ? 'Welcome Back!' : 'Get Set Up!'}</h2>
            <form onSubmit={handleSubmit}>
              {/* {!isLogin && (
                <div className="form-group">
                  <input 
                    type="text" 
                    placeholder="Name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )} */}
              <div className="form-group">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {!isLogin && (
                <div className="form-group checkbox">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                  />
                  <label htmlFor="terms">I agree to the terms & policy</label>
                </div>
              )}
              {error && <div className="error-message">{error}</div>}
              <button type="submit" className="signup-button">
                {isLogin ? 'Log in' : 'Sign up'}
              </button>
              <div className="divider">
                <span>or</span>
              </div>
              <button 
                type="button" 
                className="google-button"
                onClick={handleGoogleSignIn}
              >
                <img src="/google-icon.png" alt="Google" />
                Sign in with Google
              </button>
              <p className="login-text">
                {isLogin ? (
                  <>Don't have an account? <button type="button" onClick={() => setIsLogin(false)}>Sign up</button></>
                ) : (
                  <>Have an account? <button type="button" onClick={() => setIsLogin(true)}>Log in</button></>
                )}
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