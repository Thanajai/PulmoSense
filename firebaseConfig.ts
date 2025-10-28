import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// IMPORTANT: Replace this with your own Firebase configuration
// You can find this in your Firebase project settings -> General -> Your apps -> Web app
const firebaseConfig = {
  apiKey: "AIzaSyAP3WWT_qBpPsjSBu0FufsrT4JYB8F0v3o",
  authDomain: "http://pulmosense.firebaseapp.com",
  databaseURL: "https://pulmosense-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "pulmosense",
  storageBucket: "http://pulmosense.firebasestorage.app",
  messagingSenderId: "368824962943",
  appId: "1:368824962943:web:7c4fb649d1cd549e05944a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);
const provider = new GoogleAuthProvider();

export { auth, db, rtdb, provider };