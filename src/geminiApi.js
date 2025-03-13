import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyCfdj6F_f11yQ6tubv-0w9HuVbifLiseDk"; 

const genAI = new GoogleGenerativeAI(API_KEY);

export const generateRecipe = async (ingredients) => {
  const ingredientList = Object.keys(ingredients).join(", ");
  const prompt = `
    Generate a unique recipe using these ingredients: ${ingredientList}.
        
        Follow this exact format:
        - Title: <Recipe Title>
        - Cook Time: <Total cook time in minutes>
        - Servings: <Total servings>
        - Ingredients:
            * <Ingredient 1> - <quantity>
            * <Ingredient 2> - <quantity>
        - Instructions:
            1. <Step 1>
            2. <Step 2>
            3. <Step 3>
            4. <Step 4>
        The recipe can have how many ever steps required as per the recipe. The response should be in plain text following this format exactly.
    `;


  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response.text();
    return formatRecipeText(response); // Gemini returns markdown-like text
  } catch (error) {
    console.error("Error generating recipe:", error);
    return "Failed to fetch recipe. Please try again.";
  }
};

const formatRecipeText = (text) => {
    return text
    .replace(/- Title:\s*(.*)/, "<h2 class='text-xl font-semibold mb-1'>Title: <span class='font-normal'>$1</span></h2>")
    .replace(/- Cook Time:\s*(.*)/, "<h2 class='text-lg font-semibold mt-2 inline-block'>Cook Time:</h2> <span class='ml-1'>$1</span>")
    .replace(/- Servings:\s*(.*)/, "<h2 class='text-lg font-semibold mt-2 inline-block'>Servings:</h2> <span class='ml-1'>$1</span>")
    .replace(/- Ingredients:/, "<h2 class='text-lg font-semibold mt-2 mb-1'>Ingredients:</h2><ul class='list-disc ml-6'>")
    .replace(/\* (.+)/g, "<li>$1</li>") 
    .replace(/- Instructions:/, "</ul><h2 class='text-lg font-semibold mt-2 mb-1'>Instructions:</h2><ol class='list-decimal ml-6'>")
    .replace(/(\d+)\.\s*(.*)/g, "<li>$2</li>") 
    .concat("</ol>");// Close ordered list
  };
  
