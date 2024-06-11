// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASEAPIKEY,
  authDomain: "blogapp-9b0de.firebaseapp.com",
  projectId: "blogapp-9b0de",
  storageBucket: "blogapp-9b0de.appspot.com",
  messagingSenderId: "672939205022",
  appId: "1:672939205022:web:3eee022be9c4d3e442b68f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);