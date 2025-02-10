import React, { useState } from 'react';
import './Recipes.css';
import CommunityJoinSection from './CommunityJoinSection';
import './CommunityJoinSection.css'; // If you have the CSS file for CommunityJoinSection


// Dummy recipes data
const dummyRecipes = [
  {
    id: 1,
    title: "Spaghetti Bolognese",
    image: "/assets/spaghetti.jpg",
    description: "Classic Italian pasta with rich meat sauce.",
    cuisine: "Italian",
    mealType: "Dinner",
    veg: false,
    uploadedBy: "Chef Mario",
    instructions: "Boil pasta until al dente. Prepare the meat sauce with tomatoes, garlic, and herbs. Simmer and combine.",
    ingredients: ["Pasta", "Tomato Sauce", "Ground Beef", "Garlic", "Herbs"],
  },
  {
    id: 2,
    title: "Paneer Tikka",
    image: "/assets/paneer tikka.jpg",
    description: "Grilled paneer cubes with spices.",
    cuisine: "Indian",
    mealType: "Lunch",
    veg: true,
    uploadedBy: "Chef Priya",
    instructions: "Marinate paneer in yogurt and spices, then grill until charred. Serve with mint chutney.",
    ingredients: ["Paneer", "Yogurt", "Spices", "Bell Peppers", "Onions"],
  },
  {
    id: 3,
    title: "Sushi Rolls",
    image: "/assets/sushi.jpeg",
    description: "Fresh sushi rolls with rice, seaweed, and fillings.",
    cuisine: "Japanese",
    mealType: "Dinner",
    veg: false,
    uploadedBy: "Chef Saito",
    instructions: "Roll sushi rice and fillings in seaweed. Slice and serve with soy sauce.",
    ingredients: ["Rice", "Seaweed", "Fish", "Avocado", "Soy Sauce"],
  },
  {
    id: 4,
    title: "Caesar Salad",
    image: "/assets/caeser-salad.jpg",
    description: "Crispy romaine lettuce with creamy dressing and croutons.",
    cuisine: "American",
    mealType: "Lunch",
    veg: true,
    uploadedBy: "Chef Julia",
    instructions: "Toss lettuce with dressing, croutons, and cheese. Serve chilled.",
    ingredients: ["Lettuce", "Croutons", "Parmesan", "Caesar Dressing"],
  },
  {
    id: 5,
    title: "Butter Chicken",
    image: "/assets/butter-chicken.jpeg",
    description: "Creamy tomato-based chicken curry.",
    cuisine: "Indian",
    mealType: "Dinner",
    veg: false,
    uploadedBy: "Chef Aman",
    instructions: "Cook chicken in a creamy tomato sauce with butter and spices. Serve with naan or rice.",
    ingredients: ["Chicken", "Tomato Puree", "Butter", "Cream", "Spices"],
  },
  {
    id: 6,
    title: "Avocado Toast",
    image: "/assets/avocado-toast.jpeg",
    description: "Simple avocado toast with toppings.",
    cuisine: "American",
    mealType: "Breakfast",
    veg: true,
    uploadedBy: "Chef Emily",
    instructions: "Mash avocado on toasted bread. Add toppings like eggs or tomatoes.",
    ingredients: ["Bread", "Avocado", "Salt", "Pepper", "Olive Oil"],
  },
  {
    id: 7,
    title: "Tacos al Pastor",
    image: "/assets/tacos.jpg",
    description: "Mexican-style pork tacos with pineapple.",
    cuisine: "Mexican",
    mealType: "Lunch",
    veg: false,
    uploadedBy: "Chef Juan",
    instructions: "Grill marinated pork with pineapple, then serve in tortillas.",
    ingredients: ["Pork", "Tortillas", "Pineapple", "Onions", "Cilantro"],
  },
  {
    id: 8,
    title: "Margherita Pizza",
    image: "/assets/margherita-pizza.jpg",
    description: "Classic pizza with tomato, mozzarella, and basil.",
    cuisine: "Italian",
    mealType: "Dinner",
    veg: true,
    uploadedBy: "Chef Antonio",
    instructions: "Bake pizza dough with tomato sauce, mozzarella, and basil.",
    ingredients: ["Pizza Dough", "Tomato Sauce", "Mozzarella", "Basil"],
  },
  {
    id: 9,
    title: "Ramen Noodles",
    image: "/assets/ramen.jpg",
    description: "Hot noodle soup with broth and toppings.",
    cuisine: "Japanese",
    mealType: "Dinner",
    veg: false,
    uploadedBy: "Chef Kenji",
    instructions: "Cook noodles in broth, add meat and vegetables. Serve hot.",
    ingredients: ["Noodles", "Broth", "Egg", "Green Onions", "Pork"],
  },
  {
    id: 10,
    title: "Falafel Wrap",
    image: "/assets/falafel-wrap.jpg",
    description: "Crispy falafels wrapped in pita with tahini sauce.",
    cuisine: "Middle Eastern",
    mealType: "Lunch",
    veg: true,
    uploadedBy: "Chef Layla",
    instructions: "Fry falafel balls, place in pita, and top with veggies and sauce.",
    ingredients: ["Chickpeas", "Pita Bread", "Tahini", "Cucumber", "Tomato"],
  }
];



const Recipes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    cuisine: "",
    mealType: "",
    veg: "",
  });
  const [recipes] = useState(dummyRecipes);
  const [favorites, setFavorites] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const recipesPerPage = 6;

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
  const [isOpen, setIsOpen] = useState(false);

const handleSubmit = (e) => {
e.preventDefault();
setIsOpen(false);
};

  return (
    <div className="recipes-container">
      {/* Hero Section */}
      <div className="hero-section">
        <h1>Discover Amazing Recipes</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      

      {/* Filters */}
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

      {/* Recipe Grid */}
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

      
      {/* Pagination */}
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

      {/* Recipe Detail Modal */}
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