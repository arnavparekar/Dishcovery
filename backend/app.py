# import json
# import os
# import google.generativeai as genai
# from flask import Flask, request, jsonify

# app = Flask(__name__)

# # Set your API key
# GENAI_API_KEY = "AIzaSyCfdj6F_f11yQ6tubv-0w9HuVbifLiseDk"  # Replace with your Google AI Studio API key
# genai.configure(api_key=GENAI_API_KEY)

# def generate_recipe(ingredients):
#     # prompt = f"Generate a unique and tasty recipe using these ingredients in stepwise format: {', '.join(ingredients)}. Provide a short title and step-by-step instructions."
#     prompt = f"""
#         Generate a unique recipe using these ingredients: {', '.join(ingredients)}.

#         Follow this exact format:
#         - Title: <Recipe Title>
#         - Cook Time: <Total cook time in minutes>
#         - Ingredients:
#             * <Ingredient 1>
#             * <Ingredient 2>
#         - Instructions:
#             1. <Step 1>
#             2. <Step 2>

#         The response should be in plain text following this format exactly.
#     """



#     try:
#         model = genai.GenerativeModel(model_name="gemini-1.5-flash")  # Ensure the correct model
#         response = model.generate_content(prompt)

#         return response.text if response else "No response from model."

#     except Exception as e:
#         return f"Error generating recipe: {str(e)}"

# # API endpoint for recipe generation
# @app.route("/generate_recipe", methods=["POST"])
# def generate_recipe_api():
#     try:
#         data = request.get_json()
#         ingredients = data.get("ingredients", [])

#         if not ingredients:
#             return jsonify({"error": "No ingredients provided"}), 400

#         recipe = generate_recipe(ingredients)

#         return jsonify({"recipe": recipe})

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# # Run Flask app
# if __name__ == "__main__":
#     app.run(debug=True)



import json
import os
import re
import google.generativeai as genai
from flask import Flask, request, jsonify

app = Flask(__name__)

# Set your API key
GENAI_API_KEY = "AIzaSyCfdj6F_f11yQ6tubv-0w9HuVbifLiseDk"  
genai.configure(api_key=GENAI_API_KEY)

def format_recipe(ai_response):
    """Extract structured recipe details using regex."""
    title_match = re.search(r"Title:\s*(.+)", ai_response)
    cook_time_match = re.search(r"Cook Time:\s*(.+)", ai_response)
    ingredients_match = re.search(r"Ingredients:\n([\s\S]+?)\n\nInstructions:", ai_response)
    instructions_match = re.search(r"Instructions:\n([\s\S]+)", ai_response)

    title = title_match.group(1).strip() if title_match else "Untitled Recipe"
    cook_time = cook_time_match.group(1).strip() if cook_time_match else "Unknown"

    ingredients = []
    if ingredients_match:
        ingredients = [line.strip("* ").strip() for line in ingredients_match.group(1).split("\n") if line.strip()]

    instructions = []
    if instructions_match:
        instructions = [line.strip("0123456789. ").strip() for line in instructions_match.group(1).split("\n") if line.strip()]

    return {
        "title": title,
        "cook_time": cook_time,
        "ingredients": ingredients,
        "instructions": instructions
    }

def generate_recipe(ingredients):
    prompt = f"""
        Generate a unique recipe using these ingredients: {', '.join(ingredients)}.
        
        Follow this exact format:
        - Title: <Recipe Title>
        - Cook Time: <Total cook time in minutes>
        - Ingredients:
            * <Ingredient 1>
            * <Ingredient 2>
        - Instructions:
            1. <Step 1>
            2. <Step 2>
        
        The response should be in plain text following this format exactly.
    """
    try:
        model = genai.GenerativeModel(model_name="gemini-1.5-flash")  # Ensure the correct model
        response = model.generate_content(prompt)
        
        ai_response = response.text if response else ""
        return format_recipe(ai_response)
    
    except Exception as e:
        return {"error": f"Error generating recipe: {str(e)}"}

# API endpoint for recipe generation
@app.route("/generate_recipe", methods=["POST"])
def generate_recipe_api():
    try:
        data = request.get_json()
        ingredients = data.get("ingredients", [])

        if not ingredients:
            return jsonify({"error": "No ingredients provided"}), 400

        recipe = generate_recipe(ingredients)
        return jsonify(recipe)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run Flask app
if __name__ == "__main__":
    app.run(debug=True)
