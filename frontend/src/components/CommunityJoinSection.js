import React, { useState } from 'react';
import { firestore, auth, storage } from '../firebase';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const CommunityJoinSection = () => {
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cuisine: '',
    mealType: '',
    veg: true,
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

  const handleImageChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const parseIngredients = (input) => {
    return input.split("\n").map(line => {
      const match = line.match(/^(.+?)\s([\d.]+)\s?(.+)?$/);
      if (match) {
        return {
          title: match[1].trim(),
          quantity: Number(match[2]),
          unit: match[3] ? match[3].trim() : ""
        };
      } else {
        return { title: line.trim(), quantity: 0, unit: "" };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      alert("Please select an image.");
      return;
    }
  
    setUploading(true);
  
    try {
      const uid = auth.currentUser?.uid;
      let uploadedBy = "Anonymous";
  
      if (uid) {
        const userDocRef = doc(firestore, "users", uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          uploadedBy = userSnap.data().name || "Anonymous";
        }
      }
  
      const storageRef = ref(storage, `recipes/${formData.image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, formData.image);
  
      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Error uploading image:", error);
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
  
          await addDoc(collection(firestore, "recipes"), {
            name: formData.title,
            description: formData.description,
            cuisine: formData.cuisine,
            mealType: formData.mealType,
            veg: formData.veg,
            ingredients: parseIngredients(formData.ingredients),
            instructions: formData.instructions,
            image: downloadURL,
            uploadedBy: uploadedBy,
          });
  
          alert("Recipe uploaded successfully!");
          setFormData({
            title: '',
            description: '',
            cuisine: '',
            mealType: '',
            veg: true,
            ingredients: '',
            instructions: '',
            image: null
          });
          setShowModal(false);
          setUploading(false);
        }
      );
    } catch (error) {
      console.error("Error uploading recipe:", error);
      setUploading(false);
    }
  };
  

  return (
    <div className="community-wrapper">
      <div className="community-container">
        <div className="community-image-section">
          <img
            src={require('../assets/comm.jpg')}
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

              <div className="form-group veg-toggle">
                <label>Type:</label>
                <div className="veg-buttons">
                  <button
                    type="button"
                    className={`veg ${formData.veg ? "active" : ""}`}
                    onClick={() => setFormData(prev => ({ ...prev, veg: true }))}
                  >
                    Veg
                  </button>
                  <button
                    type="button"
                    className={`nonveg ${!formData.veg ? "active" : ""}`}
                    onClick={() => setFormData(prev => ({ ...prev, veg: false }))}
                  >
                    Non-Veg
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Ingredients</label>
                <textarea
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleInputChange}
                  placeholder="Enter each ingredient on a new line (e.g. Chicken Thighs 500 grams)"
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
                  onChange={handleImageChange}
                  required
                />
              </div>

              <button type="submit" className="submit-button" disabled={uploading}>
                {uploading ? "Uploading..." : "Share Recipe"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityJoinSection;