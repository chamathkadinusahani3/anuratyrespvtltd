import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Replace these values with your actual Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyBwuqRQTAWQRMy1Aqw_fs0FAnyfWmoPv1s",
  authDomain: "project-1-27ab5.firebaseapp.com",
  projectId: "project-1-27ab5",
  storageBucket: "project-1-27ab5.firebasestorage.app",
  messagingSenderId: "492180090869",
  appId: "1:492180090869:web:899add5c11558a46e53abc",
  measurementId: "G-TXJD36M73Y"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);



