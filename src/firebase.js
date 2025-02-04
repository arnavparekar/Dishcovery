import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD9SQfwFBAkG9Q2VWGbatfOnatMU9fZ6Vc",
  authDomain: "dishcovery-b0db1.firebaseapp.com",
  projectId: "dishcovery-b0db1",
  storageBucket: "dishcovery-b0db1.firebasestorage.app",
  messagingSenderId: "404742003331",
  appId: "1:404742003331:web:060f521c8eb2381459d9b6",
  measurementId: "G-19S71YWNZF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);