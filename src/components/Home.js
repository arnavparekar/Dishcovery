import React, { useState } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import { generateRecipe } from '../geminiApi'; 
import { Search, X, CircleDot } from 'lucide-react';
// import { BsCircleFill } from 'react-icons/bs';
// import { GiWheat } from 'react-icons/gi';

function Home() {
  const [showRecipeGenerator, setShowRecipeGenerator] = useState(false);
  const [selectedType, setSelectedType] = useState('Essentials');
  const [selectedIngredients, setSelectedIngredients] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showRecipe, setShowRecipe] = useState(false);
  const [recipeText, setRecipeText] = useState('');
  const [loadingRecipe, setLoadingRecipe] = useState(false);


  const ingredientTypes = {
    Essentials: ['Butter', 'Eggs', 'Wheat Flour', 'Rice', 'Oil', 'Sugar'],
    Vegetables: ['Garlic', 'Onion', 'Carrot', 'Tomato', 'Potato', 'Cauliflower', 'Cabbage', 'Corn', 'Spinach', 'Eggplant'],
    Fruits: ['Apple', 'Banana', 'Orange', 'Mango', 'Pineapple', 'Lemon', 'Lime', 'Peach', 'Pear', 'Grapes', 'Pomegranate', 'Watermelon', 'Strawberry', 'Cherry'],
    'Dry Fruits and Seeds': ['Cashew', 'Figs', 'Walnuts', 'Almonds', 'Raisins', 'Hazelnut', 'Chia Seeds', 'Dates', 'Peanuts', 'Flax seeds'],
    Dairy: ['Butter', 'Eggs', 'Milk', 'Cream', 'Curd', 'Cheese','Ghee', 'Mava', 'Bread'],
    Chicken: ['Legs', 'Breast', 'Thighs', 'Wings', 'Whole', 'Sausage', 'Bones'],
    Seafood: ['Salmon', 'Sea Bass', 'Trout', 'Red snapper', 'Cod', 'Surmai', 'Pomfret', 'Shrimp', 'Prawns', 'Crab', 'Scallops', 'Squid', 'Clam', 'Lobster'],
    'Herbs and Spices': ['Cinnamon', 'Parsley', 'Cilantro', 'Cumin', 'Basil', 'Thyme', 'Ginger', 'Garlic', 'Oregano', 'Jalapeno', 'Nutmeg', 'Chili Flakes', 'Chilli Powder', 'Turmeric', 'Clove', 'Bay Leaf', 'Cardamom', 'Saffron', 'Star Anise'],
    Baking: ['Flour', 'Vanilla', 'Baking Powder', 'Baking Soda', 'Cornstarch', 'Yeast', 'Chocolate chips', 'Sugar', 'Cocoa', 'Chocolate']
  };

  const nonVegItems = ['Eggs', 'Chicken', 'Salmon', 'Sea Bass', 'Trout', 'Red snapper', 'Cod', 'Surmai', 'Pomfret', 'Shrimp', 'Prawns', 'Crab', 'Scallops', 'Squid', 'Clam', 'Lobster', 'Legs', 'Breast', 'Thighs', 'Wings', 'Whole', 'Sausage', 'Bones'];

  const handleIngredientSelect = (ingredient) => {
    setSelectedIngredients(prev => {
      const newIngredients = { ...prev };
      if (ingredient in newIngredients) {
        delete newIngredients[ingredient];
      } else {
        newIngredients[ingredient] = 1;
      }
      return newIngredients;
    });
  };

  const updateQuantity = (ingredient, delta) => {
    setSelectedIngredients(prev => ({
      ...prev,
      [ingredient]: Math.max(1, (prev[ingredient] || 1) + delta)
    }));
  };

  const clearIngredients = () => {
    setSelectedIngredients({});
  };

  const filterIngredients = () => {
    if (!searchQuery) return ingredientTypes[selectedType];

    let foundIngredient = null;
    let foundType = null;
    for (const [type, ingredients] of Object.entries(ingredientTypes)) {
      for (const ingredient of ingredients) {
        if (ingredient.toLowerCase() === searchQuery.toLowerCase()) {
          foundIngredient = ingredient;
          foundType = type;
          break;
        }
      }
      if (foundIngredient) break;
    }

    if (foundIngredient && foundType !== selectedType) {
      setSelectedType(foundType);
    }

    return foundIngredient ? [foundIngredient] : [];
  };

  const handleGenerateRecipe = async () => {
    if (Object.keys(selectedIngredients).length === 0) return;
    
    setLoadingRecipe(true);
    setRecipeText(''); // Clear previous recipe
  
    const recipe = await generateRecipe(selectedIngredients);
    
    setRecipeText(recipe);
    setShowRecipe(true);
    setLoadingRecipe(false);
  
    document.querySelector('.recipe-diary')?.scrollIntoView({ behavior: 'smooth' });
  };
  

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="home-container">
        <header className="header">
          <div className="logo">Dishcovery</div>
          <nav className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/recipes">Recipes</Link>
            <Link to="/mealplanner">Meal Planner</Link>
            <Link to="/pantry">Pantry</Link>
            <Link to="/login" className="login-button">Login</Link>
          </nav>
        </header>
      <div className="hero-section">
        <div className="background-overlay"></div>
        <main className="main-content">
          <h2 className="welcome-text">WELCOME</h2>
          <h1 className="hero-title">
            Easy recipes
            <br />
            for any occasion
          </h1>
          <p className="hero-description">
            Explore a world of flavors with Dishcovery—your go-to platform for discovering new dishes, 
            sharing your favorite recipes, and building your personal cookbook. Save your top picks to 
            your Favorites List and make grocery shopping effortless compiling ingredient lists from 
            your saved recipes. Plus, dive into our blogs for cooking tips, food stories, and culinary 
            inspiration. Start your journey of taste and creativity today!
          </p>
          <button 
            className="get-started-button"
            onClick={() => {
              document.querySelector('.recipe-generator')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Get Started
          </button>
        </main>
      </div>

      {/* Recipe Generator Section */}
        <div className="recipe-generator">
        <div className="recipe-generator-content">
          <div className="ingredients-section">
            <p className="essentials-note">* We assume you have salt, water, and sugar.</p>
            <div className="search-container">
              <div className="search-bar">
                <Search size={20} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search ingredients..." 
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
              
              <div className="type-selector">
              <label className="type-label">Type</label>
                <select 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  {Object.keys(ingredientTypes).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="ingredients-list">
              {filterIngredients().length > 0 ? (
                filterIngredients().sort().map(ingredient => (
                  <div 
                    key={ingredient}
                    className={`ingredient-item ${ingredient in selectedIngredients ? 'selected' : ''}`}
                    onClick={() => handleIngredientSelect(ingredient)}
                  >
                    {/* <span className={`dot ${nonVegItems.includes(ingredient) ? 'non-veg' : 'veg'}`}></span>
                    {ingredient} */}
                    {nonVegItems.includes(ingredient) ? (
                      <CircleDot className="indicator non-veg" />
                    ) : (
                      <CircleDot className="indicator veg" />
                    )}
                    {ingredient}
                  </div>
                ))
              ) : (
                <div className="no-results">No matching ingredients found</div>
              )}
            </div>
          </div>

          <div className="recipe-builder">
            <h2>Create a new recipe using your leftover ingredients</h2>
              <div className="selected-ingredients">
                <h3>Your recipe has</h3>
                {Object.keys(selectedIngredients).length === 0 ? (
                  <p className="empty-message">Nothing, Add ingredients to get started</p>
                ) : (
                  <>
                    {Object.entries(selectedIngredients).map(([ingredient, quantity]) => (
                      <div key={ingredient} className="selected-ingredient">
                        <span>
                        <pre>{nonVegItems.includes(ingredient) ? (
                          <CircleDot className="indicator non-veg" />
                        ) : (
                          <CircleDot className="indicator veg" />
                        )}  {ingredient}</pre></span>
                        <div className="quantity-controls">
                          <button onClick={() => updateQuantity(ingredient, -1)}>-</button>
                          <span>{quantity}</span>
                          <button onClick={() => updateQuantity(ingredient, 1)}>+</button>
                        </div>
                      </div>
                    ))}
                    <button className="clear-button" onClick={clearIngredients}>
                      Clear All
                    </button>
                  </>
                )}
              </div>
              {Object.keys(selectedIngredients).length > 0 && (
                <button className="generate-button" onClick={handleGenerateRecipe}>
                  Generate Recipe
                </button>
              )}
               {/* {showRecipe && (
                  <div className="recipe-diary">
                    <div className="diary-content">
                      {loadingRecipe ? (
                        <p>Loading recipe...</p>
                      ) : (
                        <div className="diary-page">
                          <h3>Generated Recipe</h3>
                          <p>{recipeText || "No recipe generated yet."}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )} */}
                {showRecipe && (
                <div className="recipe-diary bg-white p-6 rounded-lg shadow-lg text-gray-800 mt-4">
                    <div className="diary-content">
                        {loadingRecipe ? (
                            <p>Loading recipe...</p>
                        ) : (
                            <div className="diary-page">
                                <h3 className="text-xl font-bold mb-2">Generated Recipe</h3>
                                <div dangerouslySetInnerHTML={{ __html: recipeText }} />
                            </div>
                        )}
                    </div>
                </div>
              )}
            </div>
          </div>
      </div>
    </div>
  );
}

export default Home;