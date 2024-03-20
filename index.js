const axios = require('axios');

function getIngredients() {
  let inputIngredients = prompt("Enter the items in your fridge (comma-separated):");
  let ingredients = inputIngredients.split(',').map(ingredient => ingredient.trim());
  return ingredients;
}

async function find_recipes(ingredients) {
  const response = await axios.get("https://api.spoonacular.com/recipes/search", {
    params: {
      query: ingredients,
      apiKey: '2e56568c12e341c997c5ae18cab88b76',
    }
  });

  console.log(response.data);
}

find_recipes("eggs, cheese, honey");