import React, { useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { auth, saveMealPlanToFirestore } from "../firebase"; // Adjust the path as needed
import pancakeImage from '../assets/bg1.png';
import bgimage from '../assets/bg2.avif';

const MealPlanner = () => {
    const [showPlanner, setShowPlanner] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [selectedRecipes, setSelectedRecipes] = useState([]);  // Changed to array
    const [favoriteRecipes] = useState([
        { id: 1, name: 'Pancakes' },
        { id: 2, name: 'Pasta Carbonara' },
        { id: 3, name: 'Chicken Curry' },
        { id: 4, name: 'Greek Salad' },
        { id: 5, name: 'Burger' },
        { id: 6, name: 'Pizza' },
        { id: 7, name: 'Noodles' },
        { id: 8, name: 'Rice' }
    ]);

    const plannerRef = useRef(null);


    const saveMealPlan = async () => {
        if (!selectedDate || !selectedMeal || selectedRecipes.length === 0) {
            alert('Please select all required fields');
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

    const handleAddNewRecipe = () => {
        window.location.href = '/recipes';
    };

    const handleGetStartedClick = () => {
        setShowPlanner(true);
        if (plannerRef.current) {
            plannerRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleRecipeButtonClick = (recipeId) => {
        setSelectedRecipes((prevSelected) => {
            if (prevSelected.includes(recipeId)) {
                return prevSelected.filter((id) => id !== recipeId); // Deselect
            } else {
                return [...prevSelected, recipeId]; // Select
            }
        });
    };

    const containerStyle = {
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
        fontFamily: 'sans-serif',
        WebkitFontSmoothing: 'antialiased',
    };

    const heroSectionStyle = {
        background: `url(${bgimage})`,
        padding: '80px 0',
        minHeight: '91vh',
        backgroundSize: 'cover',  // ✅ Corrected camelCase
        backgroundPosition: 'center', // ✅ Corrected camelCase
        backgroundRepeat: 'no-repeat' // ✅ Corrected camelCase
      };
      

    const heroContainerStyle = {
        maxWidth: '1600px',
        margin: '0 auto',
        padding: '0 16px',
    };

    const heroInnerStyle = {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'right',
    };

    const heroTextContainerStyle = {
        width: '700px',
        textAlign: 'left',
        marginBottom: '24px',
        marginRight:'100px',
        paddingTop:'100px'
    };

    const heroTitleStyle = {
        fontSize:   '45px',
        fontWeight: '800',
        color: '#fde047',
        lineHeight: '1.2',
    };

    const heroSubtitleStyle = {
        fontSize: '18px',
        color: 'black',
        fontWeight: '500',
        marginRight: '50px',
        paddingTop: '20px',
        paddingBottom: '25px',
    };

    const heroButtonStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '12px 24px',
        backgroundColor: '#fde047',
        color: '#1e3a8a',
        fontWeight: '600',
        borderRadius: '9999px',
        transition: 'background-color 0.2s',
        border: 'none',
        cursor: 'pointer',
    };

    const heroImageGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px',
        flex: '1',
    };

   

    const plannerSectionStyle = {
        padding: '96px 0',
        background: 'linear-gradient(to bottom, #d3bca5,rgb(255, 255, 255))',
        minHeight: '50vh',
        maxHeight: '130vh',
    };

    const plannerContainerStyle = {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 16px',
    };

    const plannerTitleStyle = {
        fontSize: '30px',
        fontWeight: '700',
        color: '#374151',
        textAlign: 'center',
        marginBottom: '48px',
    };

    const plannerGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(1, 1fr)',
        gap: '32px',
    };

    const plannerCardStyle = {
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        overflow: 'hidden',
        maxHeight: '50vh',
    };

    const cardContentStyle = {
        padding: '24px',
    };

    const cardTitleStyle = {
        fontSize: '18px',
        fontWeight: '600',
        color: '#4b5563',
        marginBottom: '16px',
    };

    const inputStyle = {
        width: '100%',
        padding: '12px',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        outline: 'none',
        transition: 'box-shadow 0.2s',
    };

    const mealButtonStyle = {
        width: '100%',
        padding: '12px 16px',
        textAlign: 'left',
        borderRadius: '8px',
        border: '1px solid #d1d5db',
        transition: 'all 0.2s',
        backgroundColor: '#fff',
        color: '#374151',
        cursor: 'pointer',
    };

    const recipeButtonStyle = {
        width: '100%',
        padding: '12px',
        textAlign: 'center',
        borderRadius: '8px',
        border: '1px solid #d1d5db',
        transition: 'all 0.2s',
        backgroundColor: '#fff',
        color: '#374151',
        aspectRatio: '1/1',
        cursor: 'pointer',
    };

    const addNewRecipeButtonStyle = {
        width: '100%',
        padding: '12px',
        textAlign: 'center',
        borderRadius: '8px',
        border: '2px dashed #d1d5db',
        transition: 'all 0.2s',
        backgroundColor: '#fff',
        color: '#6b7280',
        aspectRatio: '1/1',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const saveButtonStyle = {
        padding: '12px 32px',
        backgroundColor: '#16a34a',
        color: '#fff',
        fontWeight: '600',
        borderRadius: '9999px',
        transition: 'background-color 0.2s',
        border: 'none',
        cursor: 'pointer',
    };

    const footerStyle = {
        backgroundColor: '#374151',
        color: '#fff',
        padding: '32px 0',
        textAlign: 'center',
    };

    const handleMealButtonClick = (meal) => {
        setSelectedMeal(meal);
    };

    const recipeSelectionStyle = {
        maxHeight: '300px', // Adjust this value as needed
        overflowY: 'auto', // Enable vertical scrolling
        paddingRight: '10px' // Add some padding to prevent scrollbar from overlapping content
    };

    // Custom styles for the DatePicker
    const customDatePickerStyles = {
        '.react-datepicker': {
            fontFamily: 'sans-serif',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            border: 'none',
        },
        '.react-datepicker__header': {
            backgroundColor: '#f3f4f6',
            borderBottom: '1px solid #d1d5db',
            paddingTop: '0.75em',
            paddingBottom: '0.75em',
        },
        '.react-datepicker__day-name': {
            color: '#4b5563',
            fontWeight: '600',
            fontSize: '0.875rem',
            margin: '0.5em',
        },
        '.react-datepicker__day': {
            color: '#374151',
            fontSize: '0.875rem',
            margin: '0.5em',
            borderRadius: '9999px',
            transition: 'background-color 0.2s, color 0.2s',
            '&:hover': {
                backgroundColor: '#dbeafe',
                color: '#1e3a8a',
            },
        },
        '.react-datepicker__day--selected': {
            backgroundColor: '#60a5fa',
            color: '#fff',
            '&:hover': {
                backgroundColor: '#3b82f6',
            },
        },
        '.react-datepicker__navigation': {
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '9999px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '2em',
            width: '2em',
            marginTop: '-0.5em',
            transition: 'background-color 0.2s',
            '&:hover': {
                backgroundColor: '#dbeafe',
            },
        },
        '.react-datepicker__navigation-icon::before': {
            border: '0.45em solid #4b5563',
            top: '0.7em',
            left: '0.7em',
        },
    };

    return (
        <div style={containerStyle}>
            {/* Hero Section */}
            <div style={heroSectionStyle}>
                <div style={heroContainerStyle}>
                    <div style={heroInnerStyle}>
                        <div style={heroTextContainerStyle}>
                            <h1 style={heroTitleStyle}>
                                Plan Your Meals <span style={{ color: '#fde047' }}>with Ease</span>!
                            </h1>
                            <p style={heroSubtitleStyle}>
                            Take control of your weekly meals with our intuitive meal planner. Discover a wide range of delicious and healthy recipes tailored to your taste. Effortlessly organize your breakfasts, lunches, and dinners, saving time and reducing food waste. Whether you're meal prepping for the week or looking for new culinary inspirations, our planner helps you stay on track with ease. Enjoy stress-free cooking and make every meal a delightful experience!
                            </p>
                            <button
                                onClick={handleGetStartedClick}
                                style={heroButtonStyle}
                            >
                                Get Started
                                <svg style={{ marginLeft: '8px', width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                        </div>
                          
                            
                    </div>
                </div>
            </div>

            {/* Planner Section */}
            {showPlanner && (
                <div ref={plannerRef} style={plannerSectionStyle}>
                    <div style={plannerContainerStyle}>
                        <h2 style={plannerTitleStyle}>Design Your Perfect Meal Plan</h2>
                        <div style={{ ...plannerGridStyle, ...(window.innerWidth < 768 ? {} : { gridTemplateColumns: 'repeat(3, 1fr)' }) }}>
                            {/* Date Selection */}
                            <div style={plannerCardStyle}>
                                <center>
                                    <div style={cardContentStyle}>
                                        <h3 style={cardTitleStyle}>Choose the Date</h3>
                                        <DatePicker
                                            selected={selectedDate}
                                            onChange={(date) => setSelectedDate(date)}
                                            inline
                                            //  style={inputStyle}  // it doesn't work
                                            calendarClassName="react-datepicker"  // Add a custom class name
                                        />
                                    </div>
                                </center>
                            </div>

                            {/* Meal Selection */}
                            <div style={plannerCardStyle}>
                                <div style={cardContentStyle}>
                                    <h3 style={cardTitleStyle}>Select the Meal</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {['Breakfast', 'Brunch', 'Lunch', 'Dinner'].map((meal) => (
                                            <button
                                                key={meal}
                                                onClick={() => handleMealButtonClick(meal)}
                                                style={{
                                                    ...mealButtonStyle,
                                                    ...(selectedMeal === meal ? {
                                                        backgroundColor: '#dbeafe',
                                                        borderColor: '#60a5fa',
                                                        color: '#1e3a8a',
                                                        boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
                                                    } : {
                                                        ':hover': {
                                                            boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
                                                        }
                                                    })
                                                }}
                                            >
                                                {meal}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Recipe Selection */}
                            <div style={plannerCardStyle}>
                                <div style={cardContentStyle}>
                                    <h3 style={cardTitleStyle}>Pick Your Favorite Recipes</h3>
                                    <div style={recipeSelectionStyle}>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                                            {favoriteRecipes.map((recipe) => (
                                                <button
                                                    key={recipe.id}
                                                    onClick={() => handleRecipeButtonClick(recipe.id)}
                                                    style={{
                                                        ...recipeButtonStyle,
                                                        ...(selectedRecipes.includes(recipe.id) ? {  // Check if selected
                                                            backgroundColor: '#dbeafe',
                                                            borderColor: '#60a5fa',
                                                            color: '#1e3a8a',
                                                            boxShadow:  'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
                                                        } : {
                                                            ':hover': {
                                                                borderColor: '#60a5fa',
                                                                backgroundColor: '#dbeafe',
                                                            }
                                                        })
                                                    }}
                                                >
                                                    {recipe.name}
                                                </button>
                                            ))}
                                            <button
                                                onClick={handleAddNewRecipe}
                                                style={addNewRecipeButtonStyle}
                                            >
                                                Add New
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'center' }}>
                            <button
                                onClick={saveMealPlan}
                                style={saveButtonStyle}
                            >
                                Save Meal Plan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer style={footerStyle}>
                <p>&copy; 2025 Meal Planner. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default MealPlanner;