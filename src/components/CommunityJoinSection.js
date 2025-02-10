import React, { useState } from 'react';

const CommunityJoinSection = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cuisine: '',
    mealType: '',
    veg: false,
    ingredients: '',
    instructions: '',
    image: null
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
    setShowModal(false);
  };

  return (
    <div className="community-wrapper">
      <div className="community-container">
        <div className="community-image-section">
          <img 
            src="../assets/comm.jpg" 
            alt="Cooking Community" 
            className="community-image"
          />
        </div>
        <div className="community-content">
          <h2>Join our culinary community today!</h2>
          <p>Share your recipes, connect with fellow food enthusiasts, and explore a world of flavors.</p>
          <button className="join-button" onClick={() => setShowModal(true)}>
            Share Your Recipe
          </button>
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="recipe-modal">
            <div className="modal-header">
              <h3>Share your Recipe!</h3>
              <button className="close-button" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Recipe Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter recipe title"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your recipe"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Cuisine</label>
                  <select name="cuisine" value={formData.cuisine} onChange={handleInputChange} required>
                    <option value="">Select Cuisine</option>
                    <option value="Italian">Italian</option>
                    <option value="Indian">Indian</option>
                    <option value="American">American</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Mexican">Mexican</option>
                    <option value="Middle Eastern">Middle Eastern</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Meal Type</label>
                  <select name="mealType" value={formData.mealType} onChange={handleInputChange} required>
                    <option value="">Select Meal Type</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Dessert">Dessert</option>
                  </select>
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="veg"
                    checked={formData.veg}
                    onChange={handleInputChange}
                  />
                  &nbsp;Vegetarian
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="nonveg"
                    checked={formData.nonveg}
                    onChange={handleInputChange}
                  />
                  &nbsp;Non-Vegetarian
                </label>
              </div>

              <div className="form-group">
                <label>Ingredients</label>
                <textarea
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleInputChange}
                  placeholder="Enter each ingredient on a new line"
                  required
                />
              </div>

              <div className="form-group">
                <label>Cooking Instructions</label>
                <textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleInputChange}
                  placeholder="Enter cooking instructions"
                  required
                />
              </div>

              <div className="form-group">
                <label>Recipe Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                  required
                />
              </div>

              <button type="submit" className="submit-button">Share Recipe</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityJoinSection;