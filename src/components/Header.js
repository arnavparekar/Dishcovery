import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="sticky-header">
      <div className="logo">
        <Link to="/">Dishcovery</Link>
      </div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/recipes">Recipes</Link>
        <Link to="/meal-planner">Meal Planner</Link>
        <Link to="/pantry">Pantry</Link>
        <Link to="/login">Login/SignIn</Link>
      </nav>
    </header>
  );
}

export default Header;