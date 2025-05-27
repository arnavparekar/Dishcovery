import React, { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import { auth, saveMealPlanToFirestore, getAllRecipes } from "../firebase";
import "./MealPlanner.css";
import "react-datepicker/dist/react-datepicker.css";

const MealPlanner = () => {
  const [showPlanner, setShowPlanner] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [hoveredMeal, setHoveredMeal] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [pageLoaded, setPageLoaded] = useState(false);
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const fetchedRecipes = await getAllRecipes();
        setRecipes(fetchedRecipes);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  const plannerRef = useRef(null);

  const handleGetStartedClick = () => {
    setShowPlanner(true);
    if (plannerRef.current) {
      plannerRef.current.style.scrollMarginTop = "0px";
      plannerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleMealButtonClick = (meal) => {
    setSelectedMeal(meal);
  };

  const handleRecipeButtonClick = (recipeId) => {
    setSelectedRecipes((prevSelected) => {
      if (prevSelected.includes(recipeId)) {
        return prevSelected.filter((id) => id !== recipeId);
      } else {
        return [...prevSelected, recipeId];
      }
    });
  };

  const saveMealPlan = async () => {
    if (!selectedDate || !selectedMeal || selectedRecipes.length === 0) {
      alert("Please select all required fields");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to save a meal plan.");
      return;
    }

    const mealPlanData = {
      date: selectedDate.toISOString(),
      mealType: selectedMeal,
      recipeIds: selectedRecipes,
    };

    const result = await saveMealPlanToFirestore(user.uid, mealPlanData);
    alert(result.message);

    if (result.success) {
      setSelectedDate(null);
      setSelectedMeal(null);
      setSelectedRecipes([]);
    }
  };

  return (
    <div className="meal-container">
      <div className="meal-heroSection">
        <div className="meal-heroContainer">
          <div className="meal-heroInner">
            <div className="meal-heroTextContainer">
              <h1 className="meal-heroTitle">
                Plan Your Meals{" "}
                <span
                  className="meal-highlight"
                  style={{
                    fontFamily: "Lucida Handwriting",
                    fontSize: "2.3rem",
                  }}
                >
                  with Ease !
                </span>
              </h1>
              <p className="meal-heroSubtitle">
                Take control of your weekly meals with our intuitive meal
                planner. Discover a wide range of delicious and healthy recipes
                tailored to your taste. Effortlessly organize your breakfasts,
                lunches, and dinners, saving time and reducing food waste.
                Whether you're meal prepping for the week or looking for new
                culinary inspirations, our planner helps you stay on track with
                ease. Enjoy stress-free cooking and make every meal a delightful
                experience!
              </p>
              <button
                onClick={handleGetStartedClick}
                className="meal-heroButton"
              >
                Get Started
                <svg
                  className="meal-buttonIcon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showPlanner && (
        <div ref={plannerRef} className="plannerSection">
          <div className="plannerContainer">
            <h2 className="plannerTitle">Design Your Perfect Meal Plan</h2>

            <div className="plannerLayout">
              <div className="leftColumn">
                <div className="plannerCard">
                  <div className="cardContent">
                    <h3 className="cardTitle">Choose the Date</h3>
                    <center>
                      <div className="datePickerWrapper">
                        <DatePicker
                          selected={selectedDate}
                          onChange={(date) => setSelectedDate(date)}
                          inline
                          className="datePicker"
                        />
                      </div>
                    </center>
                  </div>
                </div>

                <div className="plannerCard">
                  <div className="cardContent">
                    <h3 className="cardTitle">Select the Meal</h3>
                    <div className="mealButtons">
                      {["Breakfast", "Brunch", "Lunch", "Dinner"].map(
                        (meal) => (
                          <button
                            key={meal}
                            onClick={() => handleMealButtonClick(meal)}
                            onMouseEnter={() => setHoveredMeal(meal)}
                            onMouseLeave={() => setHoveredMeal(null)}
                            className={`mealButton 
                                ${
                                  selectedMeal === meal
                                    ? "selectedMeal"
                                    : ""
                                } 
                                ${
                                  hoveredMeal === meal
                                    ? "hoveredMeal"
                                    : ""
                                }`}
                          >
                            {meal}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rightColumn">
                <div className="plannerCard">
                  <div className="cardContent">
                    <h3 className="cardTitle">Pick Your Favorite Recipes</h3>
                    <div className="recipeSelection">
                      <div className="recipeGrid">
                        {recipes.map((recipe) => (
                          <div key={recipe.id} className="recipeCard">
                            <div className="imageContainer">
                              <div
                                className="recipeImage"
                                style={{
                                  backgroundImage: `linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.7)), url(${recipe.image})`,
                                }}
                              />
                            </div>
                            <button
                              onClick={() => handleRecipeButtonClick(recipe.id)}
                              className={`recipeButton ${
                                selectedRecipes.includes(recipe.id)
                                  ? "selectedRecipe"
                                  : ""
                              }`}
                            >
                              {recipe.name || "Recipe Title"}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="saveButtonContainer">
              <button onClick={saveMealPlan} className="saveButton">
                Save Meal Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlanner;