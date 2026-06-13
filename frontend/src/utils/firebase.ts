import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "code-mind-ai-94820.firebaseapp.com",
  projectId: "code-mind-ai-94820",
  storageBucket: "code-mind-ai-94820.firebasestorage.app",
  messagingSenderId: "370756742302",
  appId: "1:370756742302:web:71f2bfb4ae623ca4855f8f",
  measurementId: "G-X4R14QH1WK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
