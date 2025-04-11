import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/quiz.css';

export default function Quiz() {
  return (
    <div className="quiz-container">
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

      <main className="quiz-main">
        <div className="quiz-content">
          <h1 className="quiz-title">Let's Get Started!</h1>
          <p className="quiz-subtitle">
            This questionnaire will let us know what you want out of a remote workspace!
          </p>

          <div className="question-container">
            <div className="question">
              <h3 className="question-text">What is your preferred workspace?</h3>
              <div className="select-wrapper">
                <select defaultValue="">
                  <option value="" disabled>Select</option>
                  <option value="cafe">Cafe</option>
                  <option value="library">Library</option>
                  <option value="coworking">Co-working Space</option>
                </select>
              </div>
            </div>

            <div className="question">
              <h3 className="question-text">What is your noise level preference?</h3>
              <div className="select-wrapper">
                <select defaultValue="">
                  <option value="" disabled>Select</option>
                  <option value="silent">Silent</option>
                  <option value="quiet">Quiet</option>
                  <option value="peaceful">Peaceful</option>
                  <option value="moderate">Moderate</option>
                  <option value="no-preference">No Preference</option>
                </select>
              </div>
            </div>

            <div className="question">
              <h3 className="question-text">Would you prefer paid or free spaces?</h3>
              <div className="select-wrapper">
                <select defaultValue="">
                  <option value="" disabled>Select</option>
                  <option value="paid">Paid</option>
                  <option value="free">Free</option>
                  <option value="no-preference">No Preference</option>
                </select>
              </div>
            </div>

            <div className="question">
              <h3 className="question-text">Would you like food options at the workspace?</h3>
              <div className="select-wrapper">
                <select defaultValue="">
                  <option value="" disabled>Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="no-preference">No Preference</option>
                </select>
              </div>
            </div>

            <div className="question">
              <h3 className="question-text">How large should the workspace be?</h3>
              <div className="select-wrapper">
                <select defaultValue="">
                  <option value="" disabled>Select</option>
                  <option value="cubicle">Cubicle</option>
                  <option value="room">Room</option>
                  <option value="table">Table</option>
                  <option value="conference">Conference Hall</option>
                  <option value="no-preference">No Preference</option>
                </select>
              </div>
            </div>

            <div className="question">
              <h3 className="question-text">What level of privacy would you like?</h3>
              <div className="select-wrapper">
                <select defaultValue="">
                  <option value="" disabled>Select</option>
                  <option value="private">Private</option>
                  <option value="semi-private">Semi-private</option>
                  <option value="public">Public</option>
                  <option value="no-preference">No Preference</option>
                </select>
              </div>
            </div>

            <div className="question">
              <h3 className="question-text">What sort of amenities would you like at the space?</h3>
              <div className="select-wrapper">
                <select defaultValue="">
                  <option value="" disabled>Select</option>
                  <option value="coffee">Coffee Maker</option>
                  <option value="printer">Printer</option>
                  <option value="wifi">WiFi</option>
                  <option value="all">All of the above</option>
                </select>
              </div>
            </div>

            <div className="question">
              <h3 className="question-text">What industry is your work related to?</h3>
              <div className="select-wrapper">
                <select defaultValue="">
                  <option value="" disabled>Select</option>
                  <option value="it">IT</option>
                  <option value="finance">Finance</option>
                  <option value="banking">Banking</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="question">
              <h3 className="question-text">What does your work involve?</h3>
              <div className="select-wrapper">
                <select defaultValue="">
                  <option value="" disabled>Select</option>
                  <option value="meetings">Meetings</option>
                  <option value="calls">Calls</option>
                  <option value="emails">Emails</option>
                  <option value="coding">Coding</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="question">
              <h3 className="question-text">What hours do you work?</h3>
              <div className="input-wrapper">
                <input 
                  type="text" 
                  placeholder="Enter your working hours (e.g. 9 AM - 5 PM)"
                />
              </div>
            </div>

            <div className="question">
              <h3 className="question-text">What days do you work?</h3>
              <div className="select-wrapper">
                <select defaultValue="">
                  <option value="" disabled>Select</option>
                  <option value="mon-fri">Monday-Friday</option>
                  <option value="weekends">Weekends</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>

            <div className="navigation-buttons">
              
             <Link to="/locator" className="nav-button submit-button">submit →</Link>
              
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}