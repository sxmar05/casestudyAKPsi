// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase";
import './App.css';

// Import all components
import Home from "./Home";
import FirebaseTestPage from "./pages/FirebaseTestPage";
import PlacesPage from "./pages/PlacesPage";
import ProfilePage from "./pages/ProfilePage";
import AuthForm from "./components/Auth/AuthForm";
import PlacesResults from './components/Places/PlacesResults';
import Landing from './screens/landing';
import Locator from './screens/locator';


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={!user ? <AuthForm /> : <Navigate to="/home" />} />
          
          {/* Protected routes */}
          <Route path="/home" element={user ? <Home /> : <Navigate to="/auth" />} />
          <Route path="/firebase" element={user ? <FirebaseTestPage /> : <Navigate to="/auth" />} />
          <Route path="/places" element={user ? <PlacesPage /> : <Navigate to="/auth" />} />
          <Route path="/places/results" element={user ? <PlacesResults /> : <Navigate to="/auth" />} />
          <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/auth" />} />
          <Route path="/locator" element={user ? <Locator /> : <Navigate to="/auth" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;