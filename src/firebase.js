import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD9SQfwFBAkG9Q2VWGbatfOnatMU9fZ6Vc",
  authDomain: "dishcovery-b0db1.firebaseapp.com",
  projectId: "dishcovery-b0db1",
  storageBucket: "dishcovery-b0db1.firebasestorage.app",
  messagingSenderId: "404742003331",
  appId: "1:404742003331:web:060f521c8eb2381459d9b6",
  measurementId: "G-19S71YWNZF"
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
export const getAllRecipes = async () => {
  try {
    const recipesCollection = collection(firestore, "recipes");
    const querySnapshot = await getDocs(recipesCollection);
    const recipes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return recipes;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
};