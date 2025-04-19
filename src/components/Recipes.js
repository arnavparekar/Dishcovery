import { firestore, storage } from "../firebase";
import { collection, deleteDoc, doc, onSnapshot,getDocs } from "firebase/firestore";
import { ref, getDownloadURL, getStorage } from "firebase/storage";
import { Search, X, Clock, ChefHat, Frown, Filter } from 'lucide-react';
import './Recipes.css';
import CommunityJoinSection from './CommunityJoinSection';
import './CommunityJoinSection.css';
import { useState, useEffect } from "react";

const fetchImageURL = async (imagePath) => {
  try {
    const storage = getStorage();
    const imageRef = ref(storage, imagePath.replace("gs://dishcovery-b0db1.firebasestore.app/", ""));
    return await getDownloadURL(imageRef);
  } catch (error) {
    console.error("Error fetching image URL:", error);
    return null;
  }
};

const Recipes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    cuisine: "",
    mealType: "",
    veg: "",
  });
  const [activeFilters, setActiveFilters] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFilterVisible, setIsFilterVisible] = useState(true);

  const recipesPerPage = 6;

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const toggleFilters = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const clearFilters = () => {
    setFilters({
      cuisine: "",
      mealType: "",
      veg: "",
    });
    setActiveFilters([]);
  };

  const removeFilter = (filterType) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: ""
    }));
    setActiveFilters(prev => prev.filter(f => f.type !== filterType));
  };

  const addFilter = (type, value, label) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));

    // Update active filters
    setActiveFilters(prev => {
      const filteredList = prev.filter(f => f.type !== type);
      if (value) {
        setCurrentPage(0); // Reset to first page when a new filter is added
        return [...filteredList, { type, value, label }];
      }
      return filteredList;
    });
  };

  const deleteAllRecipesFromFirebase = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "recipes"));

      if (querySnapshot.empty) {
        console.log("No recipes found to delete.");
        return;
      }

      const deletePromises = querySnapshot.docs.map((docSnapshot) =>
        deleteDoc(doc(firestore, "recipes", docSnapshot.id))
      );

      await Promise.all(deletePromises);

      console.log("All recipes deleted from Firebase.");
    } catch (error) {
      console.error("Error deleting recipes:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, "recipes"), (querySnapshot) => {
      const recipesData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.name, // Map Firestore 'name' field to 'title'
          cookingTime: data.cookingTime || "30 mins",
          ...data
        };
      });
      setRecipes(recipesData);
      console.log("Fetched Recipes:", recipesData);
    });

    return () => unsubscribe(); // Cleanup the listener on component unmount
  }, []);

  const filteredRecipes = recipes.filter(recipe => {
    // Title search (case-insensitive)
    const matchesSearch = searchQuery === "" || recipe.title?.toLowerCase().includes(searchQuery.toLowerCase());
  
    // Cuisine filter (exact match, only if a filter is set)
    const matchesCuisine = !filters.cuisine || recipe.cuisine === filters.cuisine;
  
    // Meal type filter (exact match, only if a filter is set)
    const matchesMealType = !filters.mealType || recipe.mealType === filters.mealType;
  
    // Veg/Non-Veg filter
    let matchesVeg = true;
    if (filters.veg === "veg") {
      matchesVeg = recipe.veg === true;
    } else if (filters.veg === "nonveg") {
      matchesVeg = recipe.veg === false;
    }
  
    // Combine all filters
    return matchesSearch && matchesCuisine && matchesMealType && matchesVeg;
  });
  

  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
  const paginatedRecipes = filteredRecipes.slice(
    currentPage * recipesPerPage,
    (currentPage + 1) * recipesPerPage
  );

  const renderPagination = () => {
    const pages = [];
    const maxPageDisplay = 5;
    const startPage = Math.max(0, Math.min(currentPage - Math.floor(maxPageDisplay / 2), totalPages - maxPageDisplay));
    const endPage = Math.min(startPage + maxPageDisplay, totalPages);

    for (let i = startPage; i < endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`page-number ${currentPage === i ? 'active' : ''}`}
          onClick={() => setCurrentPage(i)}
        >
          {i + 1}
        </button>
      );
    }

    return (
      <div className="pagination">
        <button
          className="page-nav"
          onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
          disabled={currentPage === 0}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Previous
        </button>
        <div className="page-numbers">
          {pages}
        </div>
        <button
          className="page-nav"
          onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
          disabled={currentPage === totalPages - 1}
        >
          Next
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    );
  };

  return (
    <div className="r-container1">
      <div className="h-section">
        <div className="h-content">
          <h1>Discover <span className="heading-accent">Amazing</span> Recipes</h1>
          <p>Explore our collection of delicious recipes from around the world. Filter by cuisine, meal type, or dietary preferences to find exactly what you're craving.</p>
        </div>
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
  <div className="filters-header">
    <div className="filters-title-container">
      <h3>Filter Recipes</h3>
      <button 
        className="filter-toggle-btn"
        onClick={toggleFilters}
        aria-label="Toggle filters"
      >
        <Filter size={18} />
      </button>
    </div>
    {(filters.cuisine || filters.mealType || filters.veg) && (
      <button className="clear-filters" onClick={clearFilters}>
        Clear All Filters
      </button>
    )}
  </div>

  {isFilterVisible && (
    <div className="filter-groups">
      <div className="filter-group">
        <label>Cuisine</label>
        <select
          value={filters.cuisine}
          onChange={(e) => addFilter('cuisine', e.target.value, e.target.options[e.target.selectedIndex].text)}
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
      </div>

      <div className="filter-group">
        <label>Meal Type</label>
        <select
          value={filters.mealType}
          onChange={(e) => addFilter('mealType', e.target.value, e.target.options[e.target.selectedIndex].text)}
        >
          <option value="">All Meal Types</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
          <option value="Dessert">Dessert</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Diet Preference</label>
        <div className="diet-filters">
          <label className={filters.veg === "" ? "active" : ""}>
            <input
              type="radio"
              name="veg"
              value=""
              checked={filters.veg === ""}
              onChange={() => addFilter('veg', '', 'All')}
            />
            All
          </label>
          <label className={filters.veg === "veg" ? "active" : ""}>
            <input
              type="radio"
              name="veg"
              value="veg"
              checked={filters.veg === "veg"}
              onChange={() => addFilter('veg', 'veg', 'Vegetarian')}
            />
            Vegetarian
          </label>
          <label className={filters.veg === "nonveg" ? "active" : ""}>
            <input
              type="radio"
              name="veg"
              value="nonveg"
              checked={filters.veg === "nonveg"}
              onChange={() => addFilter('veg', 'nonveg', 'Non-Vegetarian')}
            />
            Non-Vegetarian
          </label>
        </div>
      </div>
    </div>
  )}
</div>

      {activeFilters.length > 0 && (
        <div className="filter-chips">
          {activeFilters.map(filter =>
            filter.value && (
              <div className="filter-chip" key={filter.type}>
                {filter.label}
                <button onClick={() => removeFilter(filter.type)}>
                  <X size={16} />
                </button>
              </div>
            )
          )}
        </div>
      )}

      {paginatedRecipes.length > 0 ? (
        <div className="r-grid">
          {paginatedRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="recipe-card"
              onClick={() => setSelectedRecipe(recipe)}
            >
              <div className="recipe-image">
                <img src={recipe.image} alt={recipe.title} />
                <div className="recipe-overlay">
                  <div className="recipe-quick-view">View Recipe</div>
                </div>
                <div className="favorite-container">
                  <button
                    className={`favorite-btn ${favorites.includes(recipe.id) ? 'active' : ''}`}
                    onClick={(e) => toggleFavorite(recipe.id, e)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill={favorites.includes(recipe.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </button>
                  <div className="like-count">
                    {Math.floor(Math.random() * 100)}
                  </div>
                </div>
              </div>
              <div className="recipe-content1">
                <div className="recipe-tags">
                  <span className="cuisine-tag">{recipe.cuisine}</span>
                  <span className="meal-type-tag">{recipe.mealType}</span>
                  <span className={`diet-tag ${recipe.veg ? 'veg' : 'non-veg'}`}>
                    {recipe.veg ? 'Vegetarian' : 'Non-Veg'}
                  </span>
                </div>
                <h3>{recipe.title}</h3>
                <p>{recipe.description}</p>
                <div className="recipe-footer">
                  <span className="upload-info">By {recipe.uploadedBy || 'Chef'}</span>
                  <span className="cooking-time">
                    <Clock size={16} />
                    {recipe.cookingTime}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-results">
          <Frown size={25}/>
          <h3>No Recipes Found</h3>
          <p>We couldn't find any recipes matching your search criteria. Try adjusting your filters or search term.</p>
          <button className="reset-button" onClick={clearFilters}>Reset Filters</button>
        </div>
      )}

      {totalPages > 1 && renderPagination()}

      <CommunityJoinSection />

      {selectedRecipe && (
        <div className="modal-overlay" onClick={() => setSelectedRecipe(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedRecipe(null)}>×</button>
            <div className="recipe-detail">
              <div className="recipe-detail-header">
                <div className="recipe-image-container">
                  <img src={selectedRecipe.image} alt={selectedRecipe.title} />
                  <div className="recipe-detail-tags">
                    <span className="cuisine-tag">{selectedRecipe.cuisine}</span>
                    <span className="meal-type-tag">{selectedRecipe.mealType}</span>
                    <span className={`diet-tag ${selectedRecipe.veg ? 'veg' : 'non-veg'}`}>
                      {selectedRecipe.veg ? 'Vegetarian' : 'Non-Veg'}
                    </span>
                  </div>
                </div>
                <div className="recipe-detail-info">
                  <h2>{selectedRecipe.title}</h2>
                  <p className="description">{selectedRecipe.description}</p>
                  <div className="recipe-meta-info">
                    <div className="meta-item">
                      <Clock size={18} />
                      <span>{selectedRecipe.cookingTime} Cooking Time</span>
                    </div>
                    <div className="meta-item">
                      <ChefHat size={18} />
                      <span>By {selectedRecipe.uploadedBy || 'Chef'}</span>
                    </div>
                  </div>
                  <button
                    className={`favorite-detail-btn ${favorites.includes(selectedRecipe.id) ? 'active' : ''}`}
                    onClick={(e) => toggleFavorite(selectedRecipe.id, e)}
                  >
                    {favorites.includes(selectedRecipe.id) ? 'Saved to Favorites' : 'Add to Favorites'}
                  </button>
                </div>
              </div>

              <div className="recipe-detail-content">
                <div className="ingredients-section">
                  <h3>Ingredients</h3>
                  <ul>
                    {selectedRecipe.ingredients && selectedRecipe.ingredients.map((ingredient, index) => (
                      <li key={index}>
                        <span className="ingredient-name">{ingredient.title}</span>
                        <span className="ingredient-quantity">
                          {ingredient.quantity} {ingredient.unit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="instructions-section">
                    <h3>Instructions</h3>
                    <ol>
                      {typeof selectedRecipe.instructions === 'string' ? (
                        <li>{selectedRecipe.instructions}</li>
                      ) : (
                        selectedRecipe.instructions && selectedRecipe.instructions.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))
                      )}
                    </ol>
                  </div>

                  {selectedRecipe.notes && (
                    <div className="notes-section">
                      <h3>Chef's Notes</h3>
                      <p>{selectedRecipe.notes}</p>
                    </div>
                  )}
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