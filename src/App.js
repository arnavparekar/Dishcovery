import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Recipes from './components/Recipes';
import MealPlanner from './components/MealPlanner';
import Pantry from './components/Pantry';
import Login from './components/Login';

  function App() {
    return (
      <Router>
        <Header />
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/meal-planner" element={<MealPlanner />} />
        <Route path="/pantry" element={<Pantry />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;