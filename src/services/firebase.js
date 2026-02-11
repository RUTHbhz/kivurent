import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBeQH9Tr4U7j8ACpT-H3e5XsA8IoEeHH3A",
  authDomain: "e-commerce-639fc.firebaseapp.com",
  projectId: "e-commerce-639fc",
  storageBucket: "e-commerce-639fc.firebasestorage.app",
  messagingSenderId: "765142515077",
  appId: "1:765142515077:web:3f5cb77822c0cb77db98ec",
  measurementId: "G-6P2Z668XPD"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
