import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewiq-c9e01.firebaseapp.com",
  projectId: "interviewiq-c9e01",
  storageBucket: "interviewiq-c9e01.firebasestorage.app",
  messagingSenderId: "399315344806",
  appId: "1:399315344806:web:f5b6b2fc9176c53a774367"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export {auth , provider}