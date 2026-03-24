import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

//Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzxjECSgLs90uk2DQIbGcdi0Q4D4XeqIc",
  authDomain: "petpal-335ad.firebaseapp.com",
  projectId: "petpal-335ad",
  storageBucket: "petpal-335ad.appspot.com", // ✅ FIXED
  messagingSenderId: "181274451090",
  appId: "1:181274451090:web:6e6d2a77e5375839531a4b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth to use in other files
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);