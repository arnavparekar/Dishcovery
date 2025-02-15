import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./MealPlanner.css";

<meta name='viewport' content="width=device-width,initial-scale=1.0/"></meta>
function MealPlanner() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("favorites");
  const [selectedMeals, setSelectedMeals] = useState([]); 
  const [progress, setProgress] = useState(0); 
  const [isConfirmed, setIsConfirmed] = useState(false);

  const recipes = {
    favorites: [
      { name: "Paneer Butter Masala", img: "../assets/paneer tikka.jpg", type: "Veg", cuisine: "Indian" },
      { name: "Chicken Biryani", img: "../assets/butter-chicken.jpg", type: "Non-Veg", cuisine: "Indian" },
      { name: "Pasta Alfredo", img: "../assets/falafel-wrap.jpg", type: "Veg", cuisine: "Italian" },
      { name: "Grilled Chicken", img: "../assets/ramen.jpg", type: "Non-Veg", cuisine: "Continental" }
    ],
    recents: [
      { name: "Pasta Alfredo", img: "../assets/falafel-wrap.jpg", type: "Veg", cuisine: "Italian" },
      { name: "Grilled Chicken", img: "../assets/butter-chicken.jpg", type: "Non-Veg", cuisine: "Continental" }
    ],
    diwali: [
      { name: "Gulab Jamun", img: "../assets/butter-chicken.jpg", type: "Veg", cuisine: "Indian" },
      { name: "Kaju Katli", img: "../assets/falafel-wrap.jpg", type: "Veg", cuisine: "Indian" }
    ]
  };

  // Update Progress Bar
  useEffect(() => {
    let progressCount = 0;
    if (selectedDate) progressCount += 33;
    if (selectedMeal) progressCount += 33;
    if (selectedMeals.length > 0) progressCount += 34;
    setProgress(progressCount);
  }, [selectedDate, selectedMeal, selectedMeals]);
  useEffect(() => {
    const scrollToMeals = () => {
      const mealSections = document.getElementById("meal-sections");
      if (mealSections) {
        mealSections.scrollIntoView({ behavior: "smooth" });
      }
    };
  
    const startPlanningBtn = document.getElementById("start-planning-btn");
    if (startPlanningBtn) {
      startPlanningBtn.addEventListener("click", scrollToMeals);
    }
  
    return () => {
      if (startPlanningBtn) {
        startPlanningBtn.removeEventListener("click", scrollToMeals);
      }
    };
  }, []);
  
  // Handle meal checkbox selection
  const handleMealSelection = (recipeName) => {
    setSelectedMeals((prev) =>
      prev.includes(recipeName) ? prev.filter((item) => item !== recipeName) : [...prev, recipeName]
    );
  
    // Make confirm button bounce
    let confirmButton = document.getElementById("confirmButton");
    if (confirmButton) {
      confirmButton.classList.add("bounce");
      setTimeout(() => confirmButton.classList.remove("bounce"), 500);
    }
  };

  // Show Success Pop-up
  const handleConfirm = () => {
    if (progress === 100) {
      setIsConfirmed(true);
      setTimeout(() => setIsConfirmed(false), 3000);
    }
  };

  return (
    <>
    <section className="hero">
        <h1>Plan Your Meals with Precision!</h1>
        <p >Plan your meals effortlessly with personalized recommendations</p>
        <button id="start-planning-btn" className="personal-plan">Start Planning</button>

      </section>

      <div className="meal-container">
        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>

        <div id="meal-sections" className="meal-container">
          {/* Select Date */}
          <div className="meal-section">
            <h2>Choose a Date</h2>
            <div className="custom-calendar">
            <Calendar 
  onChange={(date) => {
    setSelectedDate(date);
    setTimeout(() => {
      document.getElementById("mealTypeSection")?.scrollIntoView({ behavior: "smooth" });
    }, 300); // Small delay for better UX
  }} 
  value={selectedDate} 
  className="clean-calendar" 
/>


            </div>
          </div>

          <div className="separator"></div>

          {/* Select Meal Type */}
          <div id="mealTypeSection" className="meal-section">
          <h2>Select a Meal</h2>

            <div className="meal-types">
              {["Breakfast", "Brunch", "Lunch", "Dinner"].map((meal) => (
                <button
                key={meal}
                className={selectedMeal === meal ? "meal selected" : "meal"}
                onClick={() => {
                  setSelectedMeal(meal);
                  setTimeout(() => {
                    document.getElementById("chooseMealsSection")?.scrollIntoView({ behavior: "smooth" });
                  }, 300);
                }}
              >
                {meal}
              </button>
              
              
              ))}
            </div>
          </div>

          <div className="separator"></div>

          {/* Choose Meals */}
          {/* <div className="meal-section">
            <h2>Choose Your Meals</h2> */}
            <div id="chooseMealsSection" className="meal-section">
            <h2>Choose Your recipes</h2>

            <div className="recipe-selection">
              <label htmlFor="recipe-list">Select a Recipe Collection:</label>
              <select
                id="recipe-list"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {Object.keys(recipes).map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="meal-options">
              {recipes[selectedCategory].map((recipe, index) => (
                <div key={index} className="meal-card">
                  <input
                    type="checkbox"
                    className="meal-checkbox"
                    checked={selectedMeals.includes(recipe.name)}
                    onChange={() => handleMealSelection(recipe.name)}
                  />
                  <img src={recipe.img} alt={recipe.name} />
                  <div className="recipe-name">{recipe.name}</div>
                  <div className="recipe-info">
                    <span>{recipe.type}</span>
                    <span>{recipe.cuisine}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Confirm Button */}
        <button
          id="confirmButton"
          className={progress === 100 ? "active" : ""}
          onClick={handleConfirm}
          disabled={progress !== 100}
        >
          Confirm Meal Plan
        </button>
      </div>

      {/* Success Popup */}
      {isConfirmed && (
        <div className="success-overlay">
          <div className="success-message">Meal Planed Succefully! 🎉</div>
        </div>
      )}
    </>
  );
}

export default MealPlanner;