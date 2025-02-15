import React, { useState } from "react";
import "./pantry.css";

<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
const Pantry = () => {
  const favoriteRecipes = [
    {
      "id": 1,
      "name": "Spaghetti Bolognese",
      "image": "/assets/spaghetti.jpg",
      "ingredients": [
        { "name": "Pasta", "qty": 200 },
        { "name": "Tomato Sauce", "qty": 2 },
        { "name": "Ground Beef", "qty": 150 },
        { "name": "Garlic", "qty": 2 },
        { "name": "Herbs", "qty": 1 }
      ]
    },
    {
      "id": 2,
      "name": "Caesar Salad",
      "image": "/assets/caeser-salad.jpg",
      "ingredients": [
        { "name": "Lettuce", "qty": 1 },
        { "name": "Croutons", "qty": 10 },
        { "name": "Parmesan", "qty": 50 },
        { "name": "Caesar Dressing", "qty": 1 }
      ]
    },
    {
      "id": 3,
      "name": "Sushi Rolls",
      "image": "/assets/sushi.jpeg",
      "ingredients": [
        { "name": "Rice", "qty": 200 },
        { "name": "Seaweed", "qty": 2 },
        { "name": "Fish", "qty": 150 },
        { "name": "Avocado", "qty": 1 },
        { "name": "Soy Sauce", "qty": 50 }
      ]
    },
    {
      "id": 4,
      "name": "Butter Chicken",
      "image": "/assets/butter-chicken.jpeg",
      "ingredients": [
        { "name": "Chicken", "qty": 250 },
        { "name": "Tomato Puree", "qty": 100 },
        { "name": "Butter", "qty": 50 },
        { "name": "Cream", "qty": 100 },
        { "name": "Spices", "qty": 1 }
      ]
    },
    {
      "id": 5,
      "name": "Paneer Tikka",
      "image": "/assets/paneer tikka.jpg",
      "ingredients": [
        { "name": "Paneer", "qty": 200 },
        { "name": "Yogurt", "qty": 100 },
        { "name": "Spices", "qty": 1 },
        { "name": "Bell Peppers", "qty": 1 },
        { "name": "Onions", "qty": 1 }
      ]
    },
    {
      "id": 6,
      "name": "Avocado Toast",
      "image": "/assets/avocado-toast.jpeg",
      "ingredients": [
        { "name": "Bread", "qty": 2 },
        { "name": "Avocado", "qty": 1 },
        { "name": "Salt", "qty": 1 },
        { "name": "Pepper", "qty": 1 },
        { "name": "Olive Oil", "qty": 1 }
      ]
    },
    {
      "id": 7,
      "name": "Tacos al Pastor",
      "image": "/assets/tacos.jpg",
      "ingredients": [
        { "name": "Pork", "qty": 200 },
        { "name": "Tortillas", "qty": 2 },
        { "name": "Pineapple", "qty": 50 },
        { "name": "Onions", "qty": 1 },
        { "name": "Cilantro", "qty": 1 }
      ]
    },
    {
      "id": 8,
      "name": "Margherita Pizza",
      "image": "/assets/margherita-pizza.jpg",
      "ingredients": [
        { "name": "Pizza Dough", "qty": 1 },
        { "name": "Tomato Sauce", "qty": 100 },
        { "name": "Mozzarella", "qty": 150 },
        { "name": "Basil", "qty": 1 }
      ]
    },
    {
      "id": 9,
      "name": "Ramen Noodles",
      "image": "/assets/ramen.jpg",
      "ingredients": [
        { "name": "Noodles", "qty": 200 },
        { "name": "Broth", "qty": 300 },
        { "name": "Egg", "qty": 1 },
        { "name": "Green Onions", "qty": 1 },
        { "name": "Pork", "qty": 100 }
      ]
    },
    {
      "id": 10,
      "name": "Falafel Wrap",
      "image": "../assets/falafel-wrap.jpg",
      "ingredients": [
        { "name": "Chickpeas", "qty": 200 },
        { "name": "Pita Bread", "qty": 1 },
        { "name": "Tahini", "qty": 50 },
        { "name": "Cucumber", "qty": 1 },
        { "name": "Tomato", "qty": 1 }
      ]
    }
  ];

  const [hoveredRecipe, setHoveredRecipe] = useState(favoriteRecipes[0]);
  const [selectedRecipeIds, setSelectedRecipeIds] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const handleRecipeSelect = (recipeId) => {
    setSelectedRecipeIds((prev) =>
      prev.includes(recipeId)
        ? prev.filter((id) => id !== recipeId) // Remove if already selected
        : [...prev, recipeId] // Add if not selected
    );
  };

  


  const calculateTotalIngredients = () => {
    const ingredientMap = new Map();

    favoriteRecipes
      .filter((recipe) => selectedRecipeIds.includes(recipe.id))
      .forEach((recipe) => {
        recipe.ingredients.forEach(({ name, qty }) => {
          if (ingredientMap.has(name)) {
            ingredientMap.set(name, ingredientMap.get(name) + qty);
          } else {
            ingredientMap.set(name, qty);
          }
        });
      });

    return Array.from(ingredientMap, ([name, qty]) => ({ name, qty }));
  };

  return (
    <div className="pantry-container">
      {/* Wrap List & Card in Flex Container */}
      <div className="content-wrapper">

        {/* Left Section: Recipe List */}
        <div className="left-section">
          <input type="text" placeholder="Search recipes..." className="search-box" />
          <div class="recipe-container">
            <ul className="recipe-list">
              {favoriteRecipes.map((recipe) => (
                <li key={recipe.id} onMouseEnter={() => setHoveredRecipe(recipe)} className="recipe-item">
                  
                  <label className="recipe-id">{recipe.id}.</label>
                  <label className="recipe-name">{recipe.name}</label>
                  <input
                    className="recipe-checkbox"
                    type="checkbox"
                    checked={selectedRecipeIds.includes(recipe.id)}
                    onChange={() => handleRecipeSelect(recipe.id)}
                  />
                </li>
              ))}
            </ul>
          </div>
          <button
            className="generate-btn"
            onClick={() => setShowTable(true)}
            disabled={selectedRecipeIds.length === 0}
          >
            Generate
          </button>
        </div>

        {/* Right Section: Recipe Card (Aligned Next to List) */}
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
                          <li key={index}>{ing.name} - {ing.qty}</li>
                        ))}
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Ingredients Table (Below Both Sections) */}
      {showTable && selectedRecipeIds.length > 0 && (
        <div className="ingredients-table">
          <h3>Ingredients List</h3>
          <table>
            <thead>
              <tr>
                <th>Sr.No.</th>
                <th>Ingredient</th>
                <th>Quantity</th>
                <th>Calories</th>
              </tr>
            </thead>
            <tbody>
              {calculateTotalIngredients().map((ing, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{ing.name}</td>
                  <td>{ing.qty}</td>
                  <td>{(ing.qty * 10).toFixed(2)} kcal</td>  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
    </div>
  );
};

export default Pantry;