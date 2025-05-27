from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
import json
app = Flask(__name__)
CORS(app) 
def configure_genai(api_key):
    genai.configure(api_key=api_key)
@app.route('/generate-recipe', methods=['POST'])
def generate_recipe():
    data = request.json
    selected_ingredients = data.get('ingredients', [])
    
    if not selected_ingredients or len(selected_ingredients) < 3:
        return jsonify({"error": "Please provide at least 3 ingredients"}), 400
    
    try:
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            api_key = data.get("api_key")
            if not api_key:
                return jsonify({"error": "API key is required"}), 400
        configure_genai(api_key)
        ingredient_names = ", ".join([ingredient['name'] for ingredient in selected_ingredients])
        prompt = f"""
        Create a detailed recipe using these ingredients: {ingredient_names}.
        Return your response in the following JSON format:
        {{
            "title": "Recipe Title with Main Ingredients",
            "ingredients": ["Ingredient 1 - amount", "Ingredient 2 - amount", ...],
            "instructions": ["Step 1", "Step 2", ...],
            "cookTime": "XX minutes",
            "serves": X
        }}
        Be creative but practical. Include appropriate measurements and cooking instructions.
        Make sure the JSON is valid with no trailing commas.
        """
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        recipe_text = response.text
        if "```json" in recipe_text:
            recipe_text = recipe_text.split("```json")[1].split("```")[0].strip()
        elif "```" in recipe_text:
            recipe_text = recipe_text.split("```")[1].split("```")[0].strip()
        recipe_data = json.loads(recipe_text)
        return jsonify(recipe_data)
    except Exception as e:
        print(f"Error generating recipe: {str(e)}")
        return jsonify({"error": f"Failed to generate recipe: {str(e)}"}), 500
if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5001)
