import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyCn3Z2DFIzAg7VRZBPjHldA3-Nmq66ONUk",
    authDomain: "taskify-backend-73aee.firebaseapp.com",
    projectId: "taskify-backend-73aee",
    storageBucket: "taskify-backend-73aee.appspot.com",
    messagingSenderId: "437126675797",
    appId: "1:437126675797:web:e6d894cae820954842c3dc",
    measurementId: "G-GK93MFCK41"
  };

const app = getApps().length === 0? initializeApp(firebaseConfig):getApp();
const db = getFirestore(app)

export {db}