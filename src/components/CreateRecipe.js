import React, { useState, useEffect } from 'react';
import { WandSparkles, Loader2 } from 'lucide-react';
import './CreateRecipe.css';
import bg_create_recipe from '../assets/bg_create_recipe.png'; 


const CreateRecipe = () => {

  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeCategories, setActiveCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [error, setError] = useState(null);

  const categories = [
    'protein', 'vegetable', 'fruit', 'grain', 
    'dairy', 'herb', 'spice', 'condiment'
  ];

  const allIngredients = [
    { id: 'chicken', name: 'Chicken Breast', category: 'protein' },
    { id: 'beef', name: 'Ground Beef', category: 'protein' },
    { id: 'salmon', name: 'Salmon', category: 'protein' },
    { id: 'tofu', name: 'Tofu', category: 'protein' },
    { id: 'eggs', name: 'Eggs', category: 'protein' },
    { id: 'shrimp', name: 'Shrimp', category: 'protein' },
    { id: 'pork', name: 'Pork Chops', category: 'protein' },
    { id: 'turkey', name: 'Ground Turkey', category: 'protein' },

    { id: 'spinach', name: 'Spinach', category: 'vegetable' },
    { id: 'carrot', name: 'Carrots', category: 'vegetable' },
    { id: 'broccoli', name: 'Broccoli', category: 'vegetable' },
    { id: 'tomato', name: 'Tomatoes', category: 'vegetable' },
    { id: 'potato', name: 'Potatoes', category: 'vegetable' },
    { id: 'onion', name: 'Onions', category: 'vegetable' },
    { id: 'bellpepper', name: 'Bell Peppers', category: 'vegetable' },
    { id: 'mushroom', name: 'Mushrooms', category: 'vegetable' },
    
    { id: 'apple', name: 'Apples', category: 'fruit' },
    { id: 'banana', name: 'Bananas', category: 'fruit' },
    { id: 'strawberry', name: 'Strawberries', category: 'fruit' },
    { id: 'lemon', name: 'Lemons', category: 'fruit' },
    { id: 'orange', name: 'Oranges', category: 'fruit' },
    { id: 'avocado', name: 'Avocados', category: 'fruit' },
    
    { id: 'rice', name: 'Rice', category: 'grain' },
    { id: 'pasta', name: 'Pasta', category: 'grain' },
    { id: 'bread', name: 'Bread', category: 'grain' },
    { id: 'quinoa', name: 'Quinoa', category: 'grain' },
    { id: 'oats', name: 'Oats', category: 'grain' },
    
    { id: 'milk', name: 'Milk', category: 'dairy' },
    { id: 'cheese', name: 'Cheese', category: 'dairy' },
    { id: 'yogurt', name: 'Yogurt', category: 'dairy' },
    { id: 'butter', name: 'Butter', category: 'dairy' },
    { id: 'cream', name: 'Heavy Cream', category: 'dairy' },
    
    { id: 'basil', name: 'Basil', category: 'herb' },
    { id: 'parsley', name: 'Parsley', category: 'herb' },
    { id: 'cilantro', name: 'Cilantro', category: 'herb' },
    { id: 'mint', name: 'Mint', category: 'herb' },
    { id: 'thyme', name: 'Thyme', category: 'herb' },
    { id: 'rosemary', name: 'Rosemary', category: 'herb' },
    
    { id: 'pepper', name: 'Black Pepper', category: 'spice' },
    { id: 'salt', name: 'Salt', category: 'spice' },
    { id: 'cumin', name: 'Cumin', category: 'spice' },
    { id: 'paprika', name: 'Paprika', category: 'spice' },
    { id: 'cinnamon', name: 'Cinnamon', category: 'spice' },
    { id: 'oregano', name: 'Oregano', category: 'spice' },
    
    { id: 'soysauce', name: 'Soy Sauce', category: 'condiment' },
    { id: 'oliveoil', name: 'Olive Oil', category: 'condiment' },
    { id: 'vinegar', name: 'Vinegar', category: 'condiment' },
    { id: 'ketchup', name: 'Ketchup', category: 'condiment' },
    { id: 'mayo', name: 'Mayonnaise', category: 'condiment' },
    { id: 'mustard', name: 'Mustard', category: 'condiment' },
    { id: 'honey', name: 'Honey', category: 'condiment' }
  ];
  
  const toggleCategory = (category) => {
    if (activeCategories.includes(category)) {
      setActiveCategories(activeCategories.filter(cat => cat !== category));
    } else {
      setActiveCategories([...activeCategories, category]);
    }
  };
  
  const addIngredient = (ingredient) => {
    if (!selectedIngredients.some(item => item.id === ingredient.id)) {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };
  
  const removeIngredient = (ingredientId) => {
    setSelectedIngredients(selectedIngredients.filter(
      ingredient => ingredient.id !== ingredientId
    ));
  };
  
  const filteredIngredients = allIngredients.filter(ingredient => {
    const matchesSearch = ingredient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategories.length === 0 || activeCategories.includes(ingredient.category);
    return matchesSearch && matchesCategory;
  });

  // Generate recipe using Gemini API via Flask backend
  const generateRecipe = async () => {
    if (selectedIngredients.length < 3) {
      alert('Please select at least 3 ingredients to generate a recipe.');
      return;
    }
    setIsGenerating(true);
    setError(null);
    try {
      // Your Flask backend URL
      const response = await fetch('http://localhost:5001/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients: selectedIngredients,
          // You can include the API key here or set it as an environment variable in your Flask app
           api_key: 'AIzaSyCfdj6F_f11yQ6tubv-0w9HuVbifLiseDk' 
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate recipe');
      }
      
      const recipeData = await response.json();
      setGeneratedRecipe(recipeData);
    } catch (err) {
      console.error('Error generating recipe:', err);
      setError(err.message);
      // Fallback to dummy recipe generation if the API fails
      generateDummyRecipe();
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Fallback function to generate a dummy recipe
  const generateDummyRecipe = () => {
    const ingredientNames = selectedIngredients.map(ing => ing.name).join(", ");
    
    const dummyRecipe = {
      title: `${selectedIngredients[0].name} ${selectedIngredients[1].name} Delight`,
      ingredients: selectedIngredients.map(ing => `${ing.name} - ${Math.floor(Math.random() * 3) + 1} ${ing.category === 'spice' || ing.category === 'herb' ? 'tsp' : ing.category === 'liquid' ? 'cups' : 'units'}`),
      instructions: [
        `Prepare all your ingredients: ${ingredientNames}.`,
        "Heat a large pan over medium heat.",
        `Add ${selectedIngredients[0].name} and cook for 5 minutes.`,
        `Add ${selectedIngredients.filter(ing => ing.category === 'vegetable').map(ing => ing.name).join(", ") || "remaining ingredients"} and cook for another 3 minutes.`,
        "Season to taste with salt and pepper.",
        "Serve hot and enjoy your creation!"
      ],
      cookTime: `${Math.floor(Math.random() * 30) + 15} minutes`,
      serves: Math.floor(Math.random() * 4) + 2
    };
    
    setGeneratedRecipe(dummyRecipe);
  };

  const closeRecipe = () => {
    setGeneratedRecipe(null);
    setSelectedIngredients([]);
  };

  // Capitalize first letter for display
  const capitalizeFirst = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="recipe-generator"
      style={{
        backgroundImage: `url(${bg_create_recipe})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}>
      <div className="container">
        
        {/* Header */}
        <div className="headernew">
          <h1>Create a Recipe with Your Ingredients</h1>
          <p>Select ingredients you have on hand, and we'll generate a unique recipe just for you.</p>
        </div>
        
        {/* How It Works Section */}
        {!generatedRecipe && (
          <div className="how-it-works">
            <h2>How It Works</h2>
            
            <div className="steps">
              <div className="step">
                <div className="step-number">1</div>
                <h3>Select Your Ingredients</h3>
                <p>Choose from our extensive list of ingredients that you already have in your kitchen.</p>
              </div>
              
              <div className="step">
                <div className="step-number">2</div>
                <h3>Generate Recipe</h3>
                <p>Our AI algorithm will create a unique recipe based on your selected ingredients.</p>
              </div>
              
              <div className="step">
                <div className="step-number">3</div>
                <h3>Cook & Enjoy</h3>
                <p>Follow the recipe instructions to create a delicious meal with what you have.</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Main Content */}
        {!generatedRecipe ? (
          <div className="main-content">
            <div className="ingredients-selection">
              <div className="ingredients-header">
                <h2>Select Ingredients</h2>
                <button 
                  className="filter-toggle-btn"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                  </svg>
                </button>
              </div>
              
              {/* Search Bar */}
              <div className="searching-bar">
                <input 
                  type="text" 
                  placeholder="Search ingredients..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Category Filters */}
              <div className={`category-filters ${showFilters ? 'visible' : ''}`}>
                {categories.map(category => (
                  <button 
                    key={category}
                    className={`category-btn ${activeCategories.includes(category) ? 'active' : ''}`}
                    onClick={() => toggleCategory(category)}
                  >
                    {capitalizeFirst(category)}
                  </button>
                ))}
              </div>
              
              {/* Ingredients List */}
              <div className="ingredients-list">
                {filteredIngredients.map(ingredient => (
                  <div key={ingredient.id} className="ingredient-item">
                    <div className="ingredient-info">
                      <span className="ingredient-name">{ingredient.name}</span>
                      <span className="ingredient-category">{capitalizeFirst(ingredient.category)}</span>
                    </div>
                    <button 
                      className="add-ingredient-btn"
                      onClick={() => addIngredient(ingredient)}
                    >
                      +
                    </button>
                  </div>
                ))}
                
                {filteredIngredients.length === 0 && (
                  <div className="no-ingredients">
                    <p>No ingredients match your criteria</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="recipe-generator-panel">
              <h3>Recipe Generator</h3>
              
              <div className="selected-ingredients">
                {selectedIngredients.length === 0 ? (
                  <div className="no-ingredients-selected">
                    <div className="wand-icon">
                        <WandSparkles className='wand1'></WandSparkles>
                    </div>
                    <p>Select ingredients from the list to get started.</p>
                  </div>
                ) : (
                  <div>
                    <p className="ingredients-count">
                      You've selected <span>{selectedIngredients.length}</span> ingredients:
                    </p>
                    <ul className="selected-ingredients-list">
                      {selectedIngredients.map(ingredient => (
                        <li key={ingredient.id} className="selected-ingredient">
                          <span>{ingredient.name}</span>
                          <button 
                            className="remove-ingredient-btn"
                            onClick={() => removeIngredient(ingredient.id)}
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                    
                    {selectedIngredients.length < 3 ? (
                      <p className="warning-message">
                        Please select at least 3 ingredients to generate a recipe.
                      </p>
                    ) : (
                      <p className="success-message">
                        Ready to generate your unique recipe!
                      </p>
                    )}
                  </div>
                )}
              </div>
              
              {error && (
                <div className="error-message">
                  Error: {error}. Using fallback recipe generator.
                </div>
              )}
              
              <button
                className={`generate-button ${selectedIngredients.length < 3 || isGenerating ? 'disabled' : ''}`}
                onClick={generateRecipe}
                disabled={selectedIngredients.length < 3 || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="loader"></Loader2>
                    Generating Recipe...
                  </>
                ) : (
                  <>
                    <WandSparkles className='wand'></WandSparkles>
                    Generate Recipe
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          // Generated Recipe Display
          <div className="generated-recipe">
            <button className="back-btn" onClick={closeRecipe}>
              ← Back to Ingredients
            </button>
            
            <div className="recipe-card1">
              <h2 className="recipe-title">{generatedRecipe.title}</h2>
              
              <div className="recipe-meta">
                <span>⏱️ Cook Time: {generatedRecipe.cookTime}</span>
                <span>👥 Serves: {generatedRecipe.serves}</span>
              </div>
              
              <div className="recipe-content">
                <div className="recipe-ingredients">
                  <h3>Ingredients</h3>
                  <ul>
                    {generatedRecipe.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="recipe-instructions">
                  <h3>Instructions</h3>
                  <ol>
                    {generatedRecipe.instructions.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateRecipe;