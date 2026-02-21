// src/firebase/config.js
// ⚠️  GANTI dengan konfigurasi Firebase project kamu sendiri
// Buka https://console.firebase.google.com → Project Settings → SDK Setup

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBJjiT0vtiLW9UH39NT0qZsXEF4kjhwWG0",
  authDomain: "kanaverse-b7d4e.firebaseapp.com",
  projectId: "kanaverse-b7d4e",
  storageBucket: "kanaverse-b7d4e.firebasestorage.app",
  messagingSenderId: "90888486704",
  appId: "1:90888486704:web:782a044df12309a04252f5"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
