# import json
# import os
# import re
# import google.generativeai as genai
# from flask import Flask, request, jsonify

# app = Flask(__name__)

# # Set your API key
# GENAI_API_KEY = "AIzaSyCfdj6F_f11yQ6tubv-0w9HuVbifLiseDk"  
# genai.configure(api_key=GENAI_API_KEY)

# def format_recipe(ai_response):
#     """Extract structured recipe details using regex."""
#     title_match = re.search(r"Title:\s*(.+)", ai_response)
#     cook_time_match = re.search(r"Cook Time:\s*(.+)", ai_response)
#     ingredients_match = re.search(r"Ingredients:\n([\s\S]+?)\n\nInstructions:", ai_response)
#     instructions_match = re.search(r"Instructions:\n([\s\S]+)", ai_response)

#     title = title_match.group(1).strip() if title_match else "Untitled Recipe"
#     cook_time = cook_time_match.group(1).strip() if cook_time_match else "Unknown"

#     ingredients = []
#     if ingredients_match:
#         ingredients = [line.strip("* ").strip() for line in ingredients_match.group(1).split("\n") if line.strip()]

#     instructions = []
#     if instructions_match:
#         instructions = [line.strip("0123456789. ").strip() for line in instructions_match.group(1).split("\n") if line.strip()]

#     return {
#         "title": title,
#         "cook_time": cook_time,
#         "ingredients": ingredients,
#         "instructions": instructions
#     }

# def generate_recipe(ingredients):
#     prompt = f"""
#         Generate a unique recipe using these ingredients: {', '.join(ingredients)}.
        
#         Follow this exact format:
#         - Title: <Recipe Title>
#         - Cook Time: <Total cook time in minutes>
#         - Servings: <Total servings>
#         - Ingredients:
#             * <Ingredient 1> - <quantity>
#             * <Ingredient 2> - <quantity>
#         - Instructions:
#             1. <Step 1>
#             2. <Step 2>
#             3. <Step 3>
#             4. <Step 4>
#         The recipe can have how many ever steps required as per the recipe. The response should be in plain text following this format exactly.
#     """
#     try:
#         model = genai.GenerativeModel(model_name="gemini-1.5-flash")  # Ensure the correct model
#         response = model.generate_content(prompt)
        
#         ai_response = response.text if response else ""
#         return format_recipe(ai_response)
    
#     except Exception as e:
#         return {"error": f"Error generating recipe: {str(e)}"}

# # API endpoint for recipe generation
# @app.route("/generate_recipe", methods=["POST"])
# def generate_recipe_api():
#     try:
#         data = request.get_json()
#         ingredients = data.get("ingredients", [])

#         if not ingredients:
#             return jsonify({"error": "No ingredients provided"}), 400

#         recipe = generate_recipe(ingredients)
#         return jsonify(recipe)

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# # Run Flask app
# if __name__ == "__main__":
#     app.run(debug=True)

from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure the Gemini API with your API key
def configure_genai(api_key):
    genai.configure(api_key=api_key)

# Route to generate recipe using Gemini
@app.route('/generate-recipe', methods=['POST'])
def generate_recipe():
    # Get ingredients from request
    data = request.json
    selected_ingredients = data.get('ingredients', [])
    
    if not selected_ingredients or len(selected_ingredients) < 3:
        return jsonify({"error": "Please provide at least 3 ingredients"}), 400
    
    try:
        # Get API key from environment variable or request
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            api_key = data.get("api_key")
            if not api_key:
                return jsonify({"error": "API key is required"}), 400
        
        # Configure Gemini
        configure_genai(api_key)
        
        # Format ingredients for the prompt
        ingredient_names = ", ".join([ingredient['name'] for ingredient in selected_ingredients])
        
        # Create the prompt for Gemini
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
        
        # Generate content with Gemini
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        
        # Extract and parse the JSON from the response
        recipe_text = response.text
        
        # Clean up the text to get valid JSON
        # Remove markdown code blocks if present
        if "```json" in recipe_text:
            recipe_text = recipe_text.split("```json")[1].split("```")[0].strip()
        elif "```" in recipe_text:
            recipe_text = recipe_text.split("```")[1].split("```")[0].strip()
            
        # Parse the JSON
        recipe_data = json.loads(recipe_text)
        
        return jsonify(recipe_data)
        
    except Exception as e:
        print(f"Error generating recipe: {str(e)}")
        return jsonify({"error": f"Failed to generate recipe: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)