const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore') ; // If you're using Cloud Firestore

const firebaseConfig = {
  apiKey: "AIzaSyCuSIwXddow0N0wuYqhfzb4EFIET_LkkfA",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  databaseURL: "YOUR_DATABASE_URL" // If you're using Realtime Database
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // If you're using Cloud Firestore

module.exports = { db }; // Export the database instance for use in your Vercel functions
