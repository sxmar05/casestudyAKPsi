// src/App.js
/*import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase";
import Home from "./Home";
import FirebaseTestPage from "./pages/FirebaseTestPage";
import AuthForm from "./components/Auth/AuthForm";

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
      <Routes>
        <Route
          path="/"
          element={user ? <Home /> : <Navigate to="/auth" />}
        />
        <Route
          path="/auth"
          element={!user ? <AuthForm /> : <Navigate to="/" />}
        />
        <Route
          path="/firebase"
          element={user ? <FirebaseTestPage /> : <Navigate to="/auth" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
*/
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase/firebase"; // Make sure your firebase config exports both auth and the Firestore db.
import { doc, getDoc } from "firebase/firestore";
import Home from "./Home";
import FirebaseTestPage from "./pages/FirebaseTestPage";
import AuthForm from "./components/Auth/AuthForm";
import PlacesPage from "./pages/PlacesPage";
import { AuthProvider, useAuth } from './context/AuthContext';

// Replace with your actual Google API key (or load from .env)
// IMPORTANT: Exposing your API key on the client is not recommended in a production app.
const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

// Helper function: construct and execute a Places API request based on user preferences.
const fetchMatchingPlaces = async (prefs) => {
  try {
    // Using user preferences to define search parameters:
    // For example, converting commute time (in minutes) to an approximate search radius in meters.
    // Note: 1 minute ≈ 1000 m of driving distance is very rough; you may use a more refined method (e.g. an API for travel time).
    const radius = Math.min(prefs.commuteTime || 30, 120) * 1000;
    // Use the current address from the preferences.
    // In a real app you might convert the address to lat/lng using geocoding. Here we assume that prefs.currentAddress holds lat/lng info.
    // For example: prefs.currentAddress = { lat: 40.7128, lng: -74.0060 }
    if (!prefs.currentAddress || !prefs.currentAddress.lat || !prefs.currentAddress.lng) {
      throw new Error("No valid current address provided in preferences.");
    }
    const location = `${prefs.currentAddress.lat},${prefs.currentAddress.lng}`;

    // Build search keyword from preferences.
    // For instance, include food preferences, amenities, business level, paid access, and space size.
    // You could join multiple parameters to form a keyword string.
    let keywordParts = [];
    if (prefs.foodPreferences) {
      keywordParts.push(prefs.foodPreferences); // e.g., "vegan", "Italian"
    }
    if (prefs.amenities && prefs.amenities.length > 0) {
      keywordParts.push(...prefs.amenities); // e.g., "wifi", "coffee"
    }
    if (prefs.businessLevel) {
      keywordParts.push(prefs.businessLevel);
    }
    if (typeof prefs.paidAccess === "boolean") {
      keywordParts.push(prefs.paidAccess ? "paid" : "free");
    }
    if (prefs.spaceSize) {
      keywordParts.push(prefs.spaceSize);
    }
    // Create a keyword string (Google accepts space-separated keywords)
    const keyword = keywordParts.join(" ");

    // The Google Places API Nearby Search URL
    // Note: This example uses the Nearby Search API. Depending on your needs, you might use Text Search or a different endpoint.
    // Also note that filtering by workdays/work hours is not directly supported, so you'll need to filter the results manually based on the place details.
    const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${GOOGLE_API_KEY}&location=${location}&radius=${radius}&keyword=${encodeURIComponent(keyword)}`;

    // Perform the API request.
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.status !== "OK") {
      throw new Error(`Google Places API error: ${data.status}`);
    }
    // At this point, data.results contains matching places.
    // Now filter based on workdays and work hours if needed.
    // For example, if our preferences include open days/hours:
    // prefs.workdays: an array (e.g., ["Monday", "Tuesday", ...])
    // prefs.workHours: an object such as { open: "08:00", close: "18:00" }
    const filteredResults = data.results.filter((place) => {
      // Each place may have "opening_hours" data.
      // The Google Places API returns an "open_now" boolean, but for full schedule details you might need a Place Details call.
      // For demonstration, we assume if the place is open now and the workday is among the user's workdays,
      // then it passes the filter.
      // You may replace this with a more sophisticated check.
      if (!place.opening_hours) return false;
      if (!place.opening_hours.open_now) return false;
      // Here you would add logic to check the detailed opening hours against prefs.workdays and prefs.workHours.
      // For now, assume that if a place is open now it is acceptable.
      return true;
    });

    return filteredResults;
  } catch (error) {
    console.error("Error fetching matching places:", error);
    return [];
  }
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={<ProtectedRoute><Home /></ProtectedRoute>}
          />
          <Route
            path="/auth"
            element={<AuthForm />}
          />
          <Route
            path="/firebase"
            element={<ProtectedRoute><FirebaseTestPage /></ProtectedRoute>}
          />
          <Route
            path="/places"
            element={<ProtectedRoute><PlacesPage /></ProtectedRoute>}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Create a ProtectedRoute component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return children;
}

export default App;
