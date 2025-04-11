import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyCfdj6F_f11yQ6tubv-0w9HuVbifLiseDk"; 

const genAI = new GoogleGenerativeAI(API_KEY);

export const generateRecipe = async (ingredients) => {
  const ingredientList = Object.keys(ingredients).join(", ");
  const prompt = `
    Generate a recipe using these ingredients: ${ingredientList}.

    Follow this format exactly:
    - Title: <Recipe Title>
    - Cook Time: <Total cook time in minutes>
    - Ingredients:
        * <Ingredient 1>
        * <Ingredient 2>
    - Instructions:
        1. <Step 1>
        2. <Step 2>

    The response should be in plain text following this format exactly.
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
      .replace(/- Title:/, "<h2 class='text-xl font-semibold mb-1'>Title: <span class='font-normal'></span></h2>")
      .replace(/- Cook Time:/, "<h2 class='text-lg font-semibold mt-2 inline-block'>Cook Time:</h2> <span class='ml-1'></span>")
      .replace(/- Ingredients:/, "<h2 class='text-lg font-semibold mt-2 mb-1'>Ingredients:</h2><ul class='list-disc ml-6'>")
      .replace(/\* /g, "<li>") // Convert bullet points to list items
      .replace(/- Instructions:/, "</ul><h2 class='text-lg font-semibold mt-2 mb-1'>Instructions:</h2><ol class='list-decimal ml-6'>")
      .replace(/(\d+\.) /g, "<li>") // Convert numbered steps to list items
      .concat("</ol>"); // Close ordered list
  };
  
