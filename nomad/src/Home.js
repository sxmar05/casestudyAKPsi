// src/Home.js
import React from "react";
import { Link } from "react-router-dom";

const Home = () => (
  <div style={{ padding: "2rem" }}>
    <h1>🏠 Home Page</h1>
    <p>Test Firebase stuff here:</p>
    <Link to="/firebase">Go to Firebase Page</Link>
  </div>
);

export default Home;
