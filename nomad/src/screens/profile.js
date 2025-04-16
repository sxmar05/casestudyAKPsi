// profile.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/profile.css';

function Profile() {
  const currentDate = new Date();
  const options = { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('en-US', options);

  return (
    <div className="profile-container">
      {/* Header */}
      <header className="header">
        <div className="logo-section">
          <img src="/logo.png" alt="nomad" className="logo" />
          <span className="logo-text">nomad</span>
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
            <button className="edit-button">Edit</button>
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
              <select>
                <option value="">Your First Name</option>
              </select>
            </div>
            <div className="form-group">
              <label>Country</label>
              <select>
                <option value="">Country Location</option>
              </select>
            </div>
            <div className="form-group">
              <label>Language</label>
              <select>
                <option value="">Your First Name</option>
              </select>
            </div>
            <div className="form-group">
              <label>Time Zone</label>
              <select>
                <option value="">Time Zone</option>
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
                <label>Commute time</label>
                <select>
                  <option value="">10-30 Mins</option>
                </select>
              </div>
              <div className="form-group">
                <label>Price</label>
                <select>
                  <option value="">No Preference</option>
                </select>
              </div>
              <div className="form-group">
                <label>Preferred Workspace</label>
                <select>
                  <option value="">Cafe</option>
                </select>
              </div>
              <div className="form-group">
                <label>Food Options</label>
                <select>
                  <option value="">No Food</option>
                </select>
              </div>
              <div className="form-group">
                <label>Noise Level</label>
                <select>
                  <option value="">Silence</option>
                </select>
              </div>
              <div className="form-group">
                <label>Size</label>
                <select>
                  <option value="">Conference Room</option>
                </select>
              </div>
              <div className="form-group">
                <label>Privacy</label>
                <select>
                  <option value="">semi-private</option>
                </select>
              </div>
              <div className="form-group">
                <label>My Work Involves</label>
                <select>
                  <option value="">Meetings, Calls</option>
                </select>
              </div>
              <div className="form-group">
                <label>Amenities</label>
                <select>
                  <option value="">wifi, printer</option>
                </select>
              </div>
              <div className="form-group">
                <label>Work Hours</label>
                <select>
                  <option value="">6AM-3PM</option>
                </select>
              </div>
              <div className="form-group">
                <label>Industry</label>
                <select>
                  <option value="">IT Services</option>
                </select>
              </div>
              <div className="form-group">
                <label>Work Days</label>
                <select>
                  <option value="">Mon-Fri</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
