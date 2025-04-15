import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
export { auth, firestore, storage};

// Firestore References
export const mealPlansCollection = collection(firestore, "mealPlans");

// Function to Save Meal Plan to Firestore
export const saveMealPlanToFirestore = async (userId, mealPlanData) => {
  try {
    await addDoc(collection(firestore, "mealPlans"), {
      userId,
      ...mealPlanData,
      createdAt: new Date(),
    });
    return { success: true, message: "Meal plan saved successfully!" };
  } catch (error) {
    return { success: false, message: `Error: ${error.message}` };
  }
};

// Function to Fetch User's Meal Plans
export const getUserMealPlans = async (userId) => {
  try {
    const q = query(mealPlansCollection, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching meal plans:", error);
    return [];
  }
};