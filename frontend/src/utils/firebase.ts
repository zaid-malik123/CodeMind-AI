
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
const firebaseConfig = {
  apiKey: process.env.NEXT_FIREBASE_APIKEY,
  authDomain: "project-263d4.firebaseapp.com",
  projectId: "project-263d4",
  storageBucket: "project-263d4.firebasestorage.app",
  messagingSenderId: "690615746774",
  appId: "1:690615746774:web:35f9d1a44c9a17040f0977"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export {auth, provider}