import { firestore, storage } from "../firebase";  
import { collection, addDoc, getDocs, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import './Recipes.css';
import CommunityJoinSection from './CommunityJoinSection';
import './CommunityJoinSection.css'; 
import { useState, useEffect } from "react";

const Recipes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    cuisine: "",
    mealType: "",
    veg: "",
  });
 
  const [recipes, setRecipes] = useState([]);
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const recipesPerPage = 6;

  useEffect(() => {
    // Only call addRecipesBatch once when the component first mounts
    // You may want to add a check to prevent adding duplicate recipes
    const initializeRecipes = async () => {
      try {
        // First check if recipes already exist
        const querySnapshot = await getDocs(collection(firestore, "recipes"));
        if (querySnapshot.empty) {
          // Only add batch recipes if none exist
          await addRecipesBatch();
        }
        
        // Set up real-time listener
        setupRecipesListener();
      } catch (error) {
        console.error("Error initializing recipes:", error);
        setIsLoading(false);
      }
    };

    initializeRecipes();

    // Clean up the listener when component unmounts
    return () => {
      // If you store the unsubscribe function, call it here
    };
  }, []);

  // Setup real-time listener for recipes collection
  const setupRecipesListener = () => {
    const recipesRef = collection(firestore, "recipes");
    
    // onSnapshot provides real-time updates
    const unsubscribe = onSnapshot(recipesRef, (snapshot) => {
      const recipesData = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      setRecipes(recipesData);
      console.log("Real-time recipes update:", recipesData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error in recipes listener:", error);
      setIsLoading(false);
    });
    
    // Return unsubscribe function for cleanup
    return unsubscribe;
  };

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const filteredRecipes = recipes.filter(recipe => {
    if (searchQuery && !recipe.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filters.cuisine && recipe.cuisine !== filters.cuisine) return false;
    if (filters.mealType && recipe.mealType !== filters.mealType) return false;
    if (filters.veg) {
      const isVeg = filters.veg === "veg";
      if (recipe.veg !== isVeg) return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
  const paginatedRecipes = filteredRecipes.slice(
    currentPage * recipesPerPage,
    (currentPage + 1) * recipesPerPage
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsOpen(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const removeDuplicatesFromFirebase = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "recipes"));
      const recipesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const uniqueRecipes = new Map();

      for (const recipe of recipesData) {
        if (!uniqueRecipes.has(recipe.title)) {
          uniqueRecipes.set(recipe.title, recipe.id);
        } else {
          await deleteDoc(doc(firestore, "recipes", recipe.id));
        }
      }

      console.log("Duplicate recipes removed from Firebase.");
    } catch (error) {
      console.error("Error removing duplicates:", error);
    }
  };

  const addRecipesBatch = async () => {
    const recipes = [
      {
        id: 1,
        title: "Spaghetti Bolognese",
        image: "https://via.placeholder.com/300x200.png?text=Spaghetti+Bolognese",
        description: "Classic Italian pasta with rich meat sauce.",
        cuisine: "Italian",
        mealType: "Dinner",
        veg: false,
        uploadedBy: "Chef Mario",
        instructions: "Boil pasta until al dente. Prepare the meat sauce with tomatoes, garlic, and herbs. Simmer and combine.",
        ingredients: ["Pasta", "Tomato Sauce", "Ground Beef", "Garlic", "Herbs"],
      },
      // Add more sample recipes if needed
    ];

    try {
      const recipesCollection = collection(firestore, "recipes");
      for (const recipe of recipes) {
        await addDoc(recipesCollection, recipe);
      }
      console.log("Sample recipes added successfully!");
    } catch (error) {
      console.error("Error adding recipes:", error);
    }
  };

  // Function to add a new recipe (you can implement this for user submission)
  const addNewRecipe = async (recipeData) => {
    try {
      const recipesCollection = collection(firestore, "recipes");
      await addDoc(recipesCollection, recipeData);
      console.log("New recipe added successfully!");
    } catch (error) {
      console.error("Error adding new recipe:", error);
    }
  };

  return (
    <div className="recipes-container">
      <div className="hero-section">
        <h1>Discover Amazing Recipes</h1>        
        <div className="search-container">
          <div className="search-bar">
              <Search size={20} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search for recipes..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <X 
                  size={20} 
                  className="clear-icon" 
                  onClick={clearSearch}
                />
              )}
            </div>
        </div>
      </div>
      <div className="filters-section">
        <select
          value={filters.cuisine}
          onChange={(e) => setFilters({ ...filters, cuisine: e.target.value })}
        >
          <option value="">All Cuisines</option>
          <option value="Italian">Italian</option>
          <option value="Indian">Indian</option>
          <option value="American">American</option>
          <option value="Japanese">Japanese</option>
          <option value="Mexican">Mexican</option>
          <option value="Middle Eastern">Middle Eastern</option>
          <option value="French">French</option>
        </select>

        <select
          value={filters.mealType}
          onChange={(e) => setFilters({ ...filters, mealType: e.target.value })}
        >
          <option value="">All Meal Types</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
          <option value="Dessert">Dessert</option>
        </select>

        <div className="diet-filters">
          <label>
            <input
              type="radio"
              name="veg"
              value=""
              checked={filters.veg === ""}
              onChange={(e) => setFilters({ ...filters, veg: e.target.value })}
            />
            <span>All</span>
          </label>
          <label>
            <input
              type="radio"
              name="veg"
              value="veg"
              checked={filters.veg === "veg"}
              onChange={(e) => setFilters({ ...filters, veg: e.target.value })}
            />
            <span>Veg</span>
          </label>
          <label>
            <input
              type="radio"
              name="veg"
              value="nonveg"
              checked={filters.veg === "nonveg"}
              onChange={(e) => setFilters({ ...filters, veg: e.target.value })}
            />
            <span>Non-Veg</span>
          </label>
        </div>
      </div>
      
      {isLoading ? (
        <div className="loading">Loading recipes...</div>
      ) : paginatedRecipes.length > 0 ? (
        <div className="recipes-grid">
          {paginatedRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="recipe-card"
              onClick={() => setSelectedRecipe(recipe)}
            >
              <div className="recipe-image">
                <img src={recipe.image} alt={recipe.title} />
                <button
                  className={`favorite-btn ${favorites.includes(recipe.id) ? 'active' : ''}`}
                  onClick={(e) => toggleFavorite(recipe.id, e)}
                >
                  {favorites.includes(recipe.id) ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="red"
                      width="24"
                      height="24"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      width="24"
                      height="24"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="recipe-content">
                <div className="recipe-tags">
                  <span className="cuisine-tag">{recipe.cuisine}</span>
                  <span className="meal-type-tag">{recipe.mealType}</span>
                </div>
                <h3>{recipe.title}</h3>
                <p>{recipe.description}</p>
                <div className="recipe-footer">
                  <span className="upload-info">By {recipe.uploadedBy}</span>
                  <span className="diet-info">{recipe.veg ? 'Vegetarian' : 'Non-Veg'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-results">No recipes found matching your criteria.</div>
      )}
      
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
          >
            Previous
          </button>
          <span>Page {currentPage + 1} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage === totalPages - 1}
          >
            Next
          </button>
        </div>
      )}

      <CommunityJoinSection />
      
      {selectedRecipe && (
        <div className="modal-overlay" onClick={() => setSelectedRecipe(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedRecipe(null)}>×</button>
            <div className="recipe-detail">
              <div className="recipe-detail-left">
                <img src={selectedRecipe.image} alt={selectedRecipe.title} />
                <h2>{selectedRecipe.title}</h2>
                <p className="description">{selectedRecipe.description}</p>
                <div className="recipe-tags">
                  <span className="cuisine-tag">{selectedRecipe.cuisine}</span>
                  <span className="meal-type-tag">{selectedRecipe.mealType}</span>
                </div>
              </div>
              <div className="recipe-detail-right">
                <div className="ingredients-section">
                  <h3>Ingredients</h3>
                  <ul>
                    {selectedRecipe.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
                <div className="instructions-section">
                  <h3>Instructions</h3>
                  <p>{selectedRecipe.instructions}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipes;