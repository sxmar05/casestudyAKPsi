// profile.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/profile.css';


function Profile() {
  const currentDate = new Date();
  const options = { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('en-US', options);
  const [selectedTimeZone, setSelectedTimeZone] = React.useState('America/Chicago');
  const formattedTime = currentDate.toLocaleTimeString('en-US', { timeZone: selectedTimeZone, hour: '2-digit', minute: '2-digit' });

  const handleTimeZoneChange = (event) => {
    const newTimeZone = event.target.value || 'America/Chicago';
    setSelectedTimeZone(newTimeZone);
  };

  return (
    <div className="profile-container">
  
        <header className="header">
          <div className="logo-section">
            <Link to="/locator" className="logo" style={{ textDecoration: 'none' }}>
          <img src="/logo.png" alt="nomad" className="logo" />
          <span className="logo-text">nomad</span>
            </Link>
          </div>
          <div className="header-right">
            <div className="user-greeting">Hi User!</div>
            <Link to="/" className="logout-button">Log Out</Link>
          </div>
        </header>

        {/* Main Content */}
      <main className="main-content">
        <h1 className="welcome-text">Welcome, User</h1>
        <p className="date">{formattedDate}</p>

        {/* User Info Section */}
        <div className="user-info-section">
          <div className="user-header">
            <div className="user-profile">
              <img src="/profile-placeholder.png" alt="Profile" className="profile-image" />
              <div className="user-details">
                <h2>User Name</h2>
                <p>username@gmail.com</p>
              </div>
            </div>
            <button className="edit-button">Save</button>
          </div>

          {/* Form Grid */}
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="Your Full Name" />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input type="text" placeholder="Your Primary Residence Address" />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select defaultValue="">
                    <option value="" disabled>Select</option>
                    <option value="5-10 mins">Woman</option>
                    <option value="10-30 mins">Man</option>
                    <option value="30-60 mins">Non-Binary</option>
                    <option value="1+ Hour">Other</option>
                  </select>
            </div>
            <div className="form-group">
              <label>Country</label>
              <input type="text" placeholder="Your Full Name" />
            </div>
            <div className="form-group">
              <label>Time Zone</label>
              <select defaultValue="">
                    <option value="" disabled>Select</option>
                    <option value="5-10 mins">Central Daylight</option>
                    <option value="10-30 mins">Mountain Daylight</option>
                    <option value="30-60 mins">Mountain Standard</option>
                    <option value="1+ Hour">Pacific Daylight</option>
                    <option value="1+ Hour">Alaska Daylight</option>
                </select>
            </div>
          </div>

          {/* Email Section */}
          <div className="email-section">
            <h3>My email Address</h3>
            <div className="email-item">
              <div className="email-icon">📧</div>
              <div className="email-details">
                <p>username@gmail.com</p>
                <span>1 month ago</span>
              </div>
            </div>
            <button className="add-email-button">+Add Email Address</button>
          </div>

          {/* Questionnaire Section */}
          <div className="questionnaire-section">
            <h2>Questionnaire Data</h2>
            <div className="form-grid">
              <div className="form-group">
              <label>Commute Time</label>
                <div className="select-wrapper">
                  <select defaultValue="">
                    <option value="" disabled>Select</option>
                    <option value="5-10 mins">5-10 mins</option>
                    <option value="10-30 mins">10-30 mins</option>
                    <option value="30-60 mins">30-60 mins</option>
                    <option value="1+ Hour">1+ Hour</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
              <label>Price</label>
                <div className="select-wrapper">
                  <select defaultValue="">
                    <option value="" disabled>Select</option>
                    <option value="1">Paid</option>
                    <option value="2">Free</option>
                    <option value="3">No Preference</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
              <label>Preferred Workspace</label>
                <div className="select-wrapper">
                  <select defaultValue="">
                    <option value="" disabled>Select</option>
                    <option value="1">Office Space</option>
                    <option value="2">Library</option>
                    <option value="3">Cafè</option>
                    <option value="3">Other</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
              <label>Food Option</label>
                <div className="select-wrapper">
                  <select defaultValue="">
                    <option value="" disabled>Select</option>
                    <option value="1">Yes</option>
                    <option value="2">No</option>
                    <option value="3">No Preference</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
              <label>Noise Level</label>
                <div className="select-wrapper">
                  <select defaultValue="">
                    <option value="" disabled>Select</option>
                    <option value="1">Silence</option>
                    <option value="2">Quiet</option>
                    <option value="3">Moderate</option>
                    <option value="3">No Preference</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
              <label>Size</label>
                <div className="select-wrapper">
                  <select defaultValue="">
                    <option value="" disabled>Select</option>
                    <option value="1">Cubicle</option>
                    <option value="2">Room</option>
                    <option value="3">Table</option>
                    <option value="3">Conference Room</option>
                    <option value="4">Hall</option>
                    <option value="5">No Preference</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Privacy</label>
                <div className="select-wrapper">
                  <select defaultValue="">
                    <option value="" disabled>Select</option>
                    <option value="1">Private</option>
                    <option value="2">Semi-Private</option>
                    <option value="3">Public</option>
                    <option value="5">No Preference</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>My Work Involves</label>
                <div className="select-wrapper">
                  <select defaultValue="">
                    <option value="" disabled>Select</option>
                    <option value="1">Meetings</option>
                    <option value="2">Calls</option>
                    <option value="3">emails</option>
                    <option value="5">No Preference</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Amenities</label>
                <div className="select-wrapper">
                  <select defaultValue="">
                    <option value="" disabled>Select</option>
                    <option value="1">Printer</option>
                    <option value="2">Coffee Maker</option>
                    <option value="3">Comfortable Seating</option>
                    <option value="3">Microwave</option>
                    <option value="5">N/A</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Work Hours</label>
                <div className="select-wrapper">
                  <select multiple defaultValue={[]}>
                    <option value="" disabled>Select</option>
                    <option value="1">6AM-11AM</option>
                    <option value="2">11AM-2PM</option>
                    <option value="3">2PM-5PM</option>
                    <option value="3">5PM-9PM</option>
                    <option value="5">No Preference</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Industry</label>
                <div className="select-wrapper">
                  <select defaultValue="">
                    <option value="" disabled>Select</option>
                    <option value="1">Software</option>
                    <option value="2">Marketing</option>
                    <option value="3">Customer Service</option>
                    <option value="3">Finance</option>
                    <option value="4">Education</option>
                    <option value="5">I do not want to share</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Work Days</label>
                <div className="select-wrapper">
                <select multiple defaultValue={[]}>
                    <option value="" disabled>Select</option>
                    <option value="1">Monday</option>
                    <option value="2">Tuesday</option>
                    <option value="3">Wednesday</option>
                    <option value="3">Thursday</option>
                    <option value="4">Friday</option>
                    <option value="5">Saturday</option>
                    <option value="5">Sunday</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
