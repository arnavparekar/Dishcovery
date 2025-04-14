import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Utensils, Calendar, ShoppingBag, ArrowRight } from 'lucide-react';
import './Home.css';

const Home = () => {

  return (
    <div className="hello-container">
      <div className="hello-section">
        <div className="hello-overlay"></div>
        <div className="hello-background"></div>
        
        <div className="hello-content">
          <div className="hello-text">
            <h1>Discover Delicious Recipes for Every Occasion</h1>
            <p>Find, create, and share amazing recipes with our vibrant food community.</p>
            <div className="hello-buttons">
              <Link to="/login" className="btn btn-primary">
                Explore Recipes
              </Link>
              <Link to="/login" className="btn btn-outline">
                Create Recipe
              </Link>
            </div>
          </div>
        </div>
        
        <div className="hello-gradient"></div>
      </div>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Discover Our Features</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <ChefHat size={32} />
              </div>
              <h3>Create Recipes</h3>
              <p>Create unique recipes using ingredients you already have at home.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <Utensils size={32} />
              </div>
              <h3>Discover Recipes</h3>
              <p>Browse through our collection of delicious recipes from around the world.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <Calendar size={32} />
              </div>
              <h3>Meal Planner</h3>
              <p>Plan your meals for the week with our easy-to-use meal planner.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <ShoppingBag size={32} />
              </div>
              <h3>Grocery List</h3>
              <p>Generate shopping lists based on your selected recipes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Create Recipe Section */}
      <section className="recipe-generator-section">
        <div className="container">
          <div className="recipe-generator-content">
            <div className="recipe-generator-text">
              <h2>Create New Recipes Using Your Leftovers</h2>
              <p>Don't know what to cook with the ingredients you have? Our recipe generator will help you create delicious meals using what's already in your kitchen.</p>
              <Link to="/create-recipe" className="btn btn-gradient">
                Try Recipe Generator <ArrowRight size={18} className="icon-right" />
              </Link>
            </div>
            <div className="recipe-generator-image">
              <img 
                src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                alt="Cooking with leftovers" 
              />
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Start Cooking?</h2>
          <p>Join our community of food lovers and discover amazing recipes that will transform your cooking experience.</p>
          <div className="cta-buttons">
            <Link to="/login" className="btn btn-primary">
              Explore Recipes
            </Link>
            <Link to="/login" className="btn btn-outline">
              Create Recipe
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;