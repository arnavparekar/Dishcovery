import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import "./Pantry.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc } from "firebase/firestore";
import bgimage from '../assets/bg2.avif';

<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
const Pantry = () => {
  const favoriteRecipes = [
    {
      "id": 1,
      "name": "Spaghetti Bolognese",
      "image": require("../assets/spaghetti.jpg"),
      "type": "non-veg",
      "servingSize": 1,
      "ingredients": [
        { "name": "Pasta", "qty": 200, "unit": "g" },
        { "name": "Tomato Sauce", "qty": 2, "unit": "cups" },
        { "name": "Ground Beef", "qty": 150, "unit": "g" }
      ]
    },
    {
      "id": 2,
      "name": "Caesar Salad",
      "image": require("../assets/caeser-salad.jpg"),
      "type": "veg",
      "servingSize": 2,
      "ingredients": [
        { "name": "Lettuce", "qty": 1, "unit": "head" },
        { "name": "Croutons", "qty": 10, "unit": "oz" },
        { "name": "Parmesan", "qty": 50, "unit": "g" },
        { "name": "Caesar Dressing", "qty": 1, "unit": "cup" }
      ]
    },
    {
      "id": 3,
      "name": "Sushi Rolls",
      "image": require("../assets/sushi.jpeg"),
      "type": "non-veg",
      "servingSize": 4,
      "ingredients": [
        { "name": "Rice", "qty": 200, "unit": "g" },
        { "name": "Seaweed", "qty": 2, "unit": "sheets" },
        { "name": "Fish", "qty": 150, "unit": "g" },
        { "name": "Avocado", "qty": 1, "unit": "each" },
        { "name": "Soy Sauce", "qty": 50, "unit": "ml" }
      ]
    },
    {
      "id": 4,
      "name": "Butter Chicken",
      "image": require("../assets/butter-chicken.jpeg"),
      "type": "non-veg",
      "servingSize": 2,
      "ingredients": [
        { "name": "Chicken", "qty": 250, "unit": "g" },
        { "name": "Tomato Puree", "qty": 100, "unit": "ml" },
        { "name": "Butter", "qty": 50, "unit": "g" },
        { "name": "Cream", "qty": 100, "unit": "ml" },
        { "name": "Spices", "qty": 1, "unit": "tbsp" }
      ]
    },
    {
      "id": 5,
      "name": "Paneer Tikka",
      "image": require("../assets/paneer tikka.jpg"),
      "type": "veg",
      "servingSize": 2,
      "ingredients": [
        { "name": "Paneer", "qty": 200, "unit": "g" },
        { "name": "Yogurt", "qty": 100, "unit": "ml" },
        { "name": "Spices", "qty": 1, "unit": "tbsp" },
        { "name": "Bell Peppers", "qty": 1, "unit": "each" },
        { "name": "Onions", "qty": 1, "unit": "each" }
      ]
    },
    {
      "id": 6,
      "name": "Avocado Toast",
      "image": require("../assets/avocado-toast.jpeg"),
      "type": "veg",
      "servingSize": 1,
      "ingredients": [
        { "name": "Bread", "qty": 2, "unit": "slices" },
        { "name": "Avocado", "qty": 1, "unit": "each" },
        { "name": "Salt", "qty": 1, "unit": "tsp" },
        { "name": "Pepper", "qty": 1, "unit": "tsp" },
        { "name": "Olive Oil", "qty": 1, "unit": "tbsp" }
      ]
    },
    {
      "id": 7,
      "name": "Tacos al Pastor",
      "image": require("../assets/tacos.jpg"),
      "type": "non-veg",
      "servingSize": 4,
      "ingredients": [
        { "name": "Pork", "qty": 200, "unit": "g" },
        { "name": "Tortillas", "qty": 2, "unit": "each" },
        { "name": "Pineapple", "qty": 50, "unit": "g" },
        { "name": "Onions", "qty": 1, "unit": "each" },
        { "name": "Cilantro", "qty": 1, "unit": "cup" }
      ]
    },
    {
      "id": 8,
      "name": "Margherita Pizza",
      "image": require("../assets/margherita-pizza.jpg"),
      "type": "veg",
      "servingSize": 1,
      "ingredients": [
        { "name": "Pizza Dough", "qty": 1, "unit": "pizza" },
        { "name": "Tomato Sauce", "qty": 100, "unit": "ml" },
        { "name": "Mozzarella", "qty": 150, "unit": "g" },
        { "name": "Basil", "qty": 1, "unit": "cup" }
      ]
    },
    {
      "id": 9,
      "name": "Ramen Noodles",
      "image": require("../assets/ramen.jpg"),
      "type": "non-veg",
      "servingSize": 1,
      "ingredients": [
        { "name": "Noodles", "qty": 200, "unit": "g" },
        { "name": "Broth", "qty": 300, "unit": "ml" },
        { "name": "Egg", "qty": 1, "unit": "each" },
        { "name": "Green Onions", "qty": 1, "unit": "each" },
        { "name": "Pork", "qty": 100, "unit": "g" }
      ]
    },
    {
      "id": 10,
      "name": "Falafel Wrap",
      "image": require("../assets/falafel-wrap.jpg"),
      "type": "veg",
      "servingSize": 1,
      "ingredients": [
        { "name": "Chickpeas", "qty": 200, "unit": "g" },
        { "name": "Pita Bread", "qty": 1, "unit": "pita" },
        { "name": "Tahini", "qty": 50, "unit": "ml" },
        { "name": "Cucumber", "qty": 1, "unit": "each" },
        { "name": "Tomato", "qty": 1, "unit": "each" }
      ]
    }
  ];

  const [hoveredRecipe, setHoveredRecipe] = useState(favoriteRecipes[0]);
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dietFilter, setDietFilter] = useState("all");
  const [servings, setServings] = useState(1);
  const [filteredRecipes, setFilteredRecipes] = useState(favoriteRecipes);
  const [recipeServings, setRecipeServings] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackRecipeId, setFeedbackRecipeId] = useState(null);
  const db = getFirestore();
  
  //new
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let results = favoriteRecipes.filter(recipe => 
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (dietFilter !== "all") {
      results = results.filter(recipe => recipe.type === dietFilter);
    }

    setFilteredRecipes(results);
  }, [searchTerm, dietFilter]);
  const handleServingChange = (recipeId, value) => {
    setRecipeServings(prev => ({
      ...prev,
      [recipeId]: Math.max(1, parseInt(value) || 1)
    }));
  };

  // const addRecipe = (recipe) => {
  //   const servingCount = recipeServings[recipe.id] || 1;
  //   setSelectedRecipes(prev => [
  //     ...prev,
  //     { ...recipe, selectedServings: servingCount }
  //   ]);
  //   setRecipeServings(prev => ({
  //     ...prev,
  //     [recipe.id]: 1
  //   }));
  // };
  
  const addRecipe = (recipe) => {
    const servings = recipeServings[recipe.id] || 1;
    setSelectedRecipes([...selectedRecipes, { ...recipe, selectedServings: servings }]);
    setShowFeedback(true);
    setFeedbackRecipeId(recipe.id);
    setTimeout(() => {
      setShowFeedback(false);
      setFeedbackRecipeId(null);
    }, 1500);
  };
  
  const removeRecipe = (recipeIndex) => {
    setSelectedRecipes(prev => prev.filter((_, index) => index !== recipeIndex));
  };

  const addRecipeAgain = (recipe) => {
    const servingCount = recipeServings[recipe.id] || 1;
    setSelectedRecipes(prev => [
      ...prev,
      { ...recipe, selectedServings: servingCount }
    ]);
    setRecipeServings(prev => ({
      ...prev,
      [recipe.id]: 1
    }));
  };

  //new
  const savePantryToFirestore = async () => {
    if (!user) return;
  
    const pantryRef = collection(db, "users", user.uid, "pantry");
  
    const pantryData = calculateTotalIngredients().map((ing) => ({
      ingredient: ing.name,
      quantity: ing.qty,
      unit: ing.unit,
      calories: (ing.qty * 10).toFixed(2),
    }));
  
    try {
      await addDoc(pantryRef, { ingredients: pantryData, timestamp: new Date() });
      alert("Pantry list saved successfully!");
    } catch (error) {
      console.error("Error saving pantry list: ", error);
    }
  };

  const calculateTotalIngredients = () => {
    const ingredientMap = new Map();
    selectedRecipes.forEach((recipe) => {
      recipe.ingredients.forEach(({ name, qty, unit }) => {
        const totalQty = qty * recipe.selectedServings;
        const key = `${name}_${unit}`;
        if (ingredientMap.has(key)) {
          ingredientMap.set(key, {
            name,
            qty: ingredientMap.get(key).qty + totalQty,
            unit
          });
        } else {
          ingredientMap.set(key, { name, qty: totalQty, unit });
        }
      });
    });
    return Array.from(ingredientMap.values());
  };
  const handleRestart = () => {
    setSelectedRecipes([]);
    setShowTable(false);
    setRecipeServings({});
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
  };
  const handleEdit = () => {
    setIsEditing(true);
    setShowTable(false);
  };
  const handleGenerate = async () => {
    if (selectedRecipes.length === 0) {
      alert("Please select at least one recipe");
      return;
    }

    setShowTable(true);
    
    // Use setTimeout to ensure the DOM has updated
    setTimeout(() => {
      const ingredientsList = document.querySelector('.ingredients-table');
      if (ingredientsList) {
        ingredientsList.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 100);
  };
  
  return (
    <div className="pantry-container">
      <div className="content-wrapper">
        <div className="left-section">
          <div className="search-controls">
            <input
              type="text"
              className="search-box"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="filter-controls">
              <button
                className={`all-filter ${dietFilter === "all" ? "active" : ""}`}
                onClick={() => setDietFilter("all")}
              >
                All
              </button>
              <button
                className={`veg-filter ${dietFilter === "veg" ? "active" : ""}`}
                onClick={() => setDietFilter("veg")}
              >
                Veg
              </button>
              <button
                className={`non-veg-filter ${dietFilter === "non-veg" ? "active" : ""}`}
                onClick={() => setDietFilter("non-veg")}
              >
                Non-Veg
              </button>
            </div>
          </div>

          <div className="recipe-container">
            <ul className="recipe-list">
              {filteredRecipes.map((recipe) => (
                <li key={recipe.id} className="recipe-item">
                  <span className="recipe-name">{recipe.name}</span>
                  <div className="recipe-controls">
                    <input
                      type="number"
                      className="servings-input"
                      min="1"
                      value={recipeServings[recipe.id] || 1}
                      onChange={(e) => handleServingChange(recipe.id, e.target.value)}
                    />
                    <button
                      className="add-btn"
                      onClick={() => addRecipe(recipe)}
                    >
                      Add
                    </button>
                    {showFeedback && feedbackRecipeId === recipe.id && (
                      <span className="add-feedback show">✓</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="action-buttons">
            <button
              className="generate-btn"
              onClick={handleGenerate}
              disabled={selectedRecipes.length === 0}
            >
              Generate List
            </button>
          </div>

          {selectedRecipes.length > 0 && (
            <div className="selected-items">
              <h3>Selected Recipes</h3>
              {selectedRecipes.map((recipe, index) => (
                <div key={index} className="selected-item">
                  <span>{recipe.name} (Servings: {recipe.selectedServings})</span>
                  <div className="selected-item-controls">
                    <button
                      className="remove-btn"
                      onClick={() => removeRecipe(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="right-section">
          <div className="main">
            <ul className="cards">
              <li className="cards_item">
                <div className="card">
                  <div className="card_image">
                    <img src={hoveredRecipe.image} alt={hoveredRecipe.name} />
                  </div>
                  <div className="card_content">
                    <h2 className="card_title">{hoveredRecipe.name}</h2>
                    <div className="card_text">
                        {hoveredRecipe.ingredients.map((ing, index) => (
                          <li key={index}>{ing.name} - {ing.qty} {ing.unit}</li>
                        ))}
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {showTable && selectedRecipes.length > 0 && (
        <div className="generated-content">
          <div className="ingredients-table">
            <h3>Recipe Ingredients List</h3>
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: 'black' }}>Selected Recipes:</h4>
              <ul style={{ listStyle: 'none', padding: '10px' }}>
                {selectedRecipes.map((recipe, index) => (
                  <li key={index} style={{ color: 'black', marginBottom: '5px' }}>
                    {recipe.name} ({recipe.selectedServings} servings)
                  </li>
                ))}
              </ul>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Sr.No.</th>
                  <th>Ingredient</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                  <th>Calories</th>
                </tr>
              </thead>
              <tbody>
                {calculateTotalIngredients().map((ing, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{ing.name}</td>
                    <td>{ing.qty}</td>
                    <td>{ing.unit}</td>
                    <td>{(ing.qty * 10).toFixed(2)} kcal</td>
                  </tr>
                ))}
              </tbody>
            </table>
          <div className="action-buttons">
            
            <button 
              className="action-btn restart-btn"
              onClick={handleRestart}
            >
              Restart
            </button>
          </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Pantry;



// import React from 'react';

// function Home() {
//   return (
//     <div className="home">
//       <h1>Welcome to Pantry page</h1>
//       <p>Discover amazing recipes and plan your meals!</p>
//     </div>
//   );
// }

// export default Home;