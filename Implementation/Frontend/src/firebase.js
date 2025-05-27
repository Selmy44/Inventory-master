 // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyAyP2A-qmjw-3ZMAd6eBUuUtJFAeRyTD2E",
  authDomain: "inventoryquotation.firebaseapp.com",
  projectId: "inventoryquotation",
  storageBucket: "inventoryquotation.appspot.com",
  messagingSenderId: "1090049896933",
  appId: "1:1090049896933:web:35e343cb6356435c3abf0c",
  measurementId: "G-B4RNBMPTEQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app);