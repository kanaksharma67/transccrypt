// src/firebase/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail
  } from "firebase/auth";

  const firebaseConfig = {
    apiKey: "AIzaSyASsrE541xpOeL7HDkfDX2AeDeT0AieTmU",
    authDomain: "transcrypt-5ef6c.firebaseapp.com",
    projectId: "transcrypt-5ef6c",
    storageBucket: "transcrypt-5ef6c.firebasestorage.app",
    messagingSenderId: "206781681707",
    appId: "1:206781681707:web:aa2e18a2d8467a7fa71a6e",
    measurementId: "G-85RY3H1W7Q"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// At the bottom of firebaseConfig.ts

  
  export { 
    auth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail
  };