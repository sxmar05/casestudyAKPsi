// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Replace with your actual config from Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyCKb5qtit2r2UjilC6qnsRPQ8dRgGz9jsk",
    authDomain: "nomad-f4ad6.firebaseapp.com",
    projectId: "nomad-f4ad6",
    storageBucket: "nomad-f4ad6.firebasestorage.app",
    messagingSenderId: "833504780898",
    appId: "1:833504780898:web:b03bd6f8295bb5b0b5673b",
    measurementId: "G-TGF4V70L0Q"
  };

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { analytics, auth, db };
