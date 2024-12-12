// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-real-state-f66a6.firebaseapp.com",
  projectId: "mern-real-state-f66a6",
  storageBucket: "mern-real-state-f66a6.firebasestorage.app",
  messagingSenderId: "446880265772",
  appId: "1:446880265772:web:5e8c8854fe8c2c5c0e4389"
};

// Initialize Firebase
export const  app = initializeApp(firebaseConfig);




 
