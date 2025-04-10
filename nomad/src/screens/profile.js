// profile.js
import React from "react";
import { Link } from 'react-router-dom';
import "../styles/profile.css";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";

export default function Profile() {
  return (
    <div className="profile-container">
      <header className="profile-header">
        <div className="logo">📍 nomad</div>
        <div className="user-greeting">Hi User!</div>
      </header>

      <main className="profile-main">
        <section className="welcome-section">
          <h1>Welcome, User</h1>
          <p>Monday, 07 April 2025</p>
        </section>

        <Card className="profile-card">
          <div className="user-info">
            <img
              src="https://via.placeholder.com/100"
              alt="User Avatar"
              className="avatar"
            />
            <div>
              <h2>User Name</h2>
              <p>username@gmail.com</p>
              <p className="email-date">1 month ago</p>
              <Button variant="outline">+ Add Email Address</Button>
            </div>
          </div>

          <form className="profile-form">
            <div className="input-group">
              <input placeholder="Your Full Name" />
              <input placeholder="Your Primary Residence Address" />
            </div>
            <div className="input-group">
              <select><option>Your Gender</option></select>
              <select><option>Country Location</option></select>
            </div>
            <div className="input-group">
              <select><option>Language</option></select>
              <select><option>Time Zone</option></select>
            </div>
            <Button className="edit-button">Edit</Button>
          </form>
        </Card>

        <Card className="questionnaire-card">
          <h2>Questionnaire Data</h2>
          <form className="questionnaire-form">
            <div className="grid">
              <select><option>10-30 Mins</option></select>
              <select><option>No Preference</option></select>
              <select><option>Cafe</option></select>
              <select><option>No Food</option></select>
              <select><option>Silence</option></select>
              <select><option>Conference Room</option></select>
              <select><option>semi-private</option></select>
              <select><option>Meetings, Calls</option></select>
              <select><option>wifi, printer</option></select>
              <select><option>6AM-3PM</option></select>
              <select><option>IT Services</option></select>
              <select><option>Mon-Fri</option></select>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}
