document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.getElementById('searchButton');
  const randomButton = document.getElementById('randomButton');
  const recipeList = document.getElementById('recipeList');

  searchButton.addEventListener('click', async () => {
    const ingredientsInput = document.getElementById('ingredients');
    const ingredients = ingredientsInput.value.trim();
    if (ingredients === '') {
      alert('Please enter ingredients.');
      return;
    }

    try {
      const response = await axios.get("https://api.spoonacular.com/recipes/search", {
        params: {
          query: ingredients,
          apiKey: '79c7d6caa65041f181dce11200b64cba', 
        }
      });

      const recipes = response.data.results;
      displayRecipes(recipes);
    } catch (error) {
      recipeList.innerHTML = 'An error occurred while fetching recipe data.';
    }

    ingredientsInput.value = '';
  });

  randomButton.addEventListener('click', async () => {
    try {
      const response = await axios.get("https://api.spoonacular.com/recipes/random", {
        params: {
          apiKey: '79c7d6caa65041f181dce11200b64cba',
        }
      });

      const recipe = response.data.recipes[0];
      const recipes = [recipe];
      displayRecipes(recipes);
    } catch (error) {
      recipeList.innerHTML = 'An error occurred while fetching random recipe.';
    }
  });

  function displayRecipes(recipes) {
    recipeList.innerHTML = '';
    if (recipes.length === 0) {
      recipeList.innerHTML = 'No recipes found.';
    } else {
      recipes.forEach(recipe => {
        const recipeDiv = document.createElement('div');
        recipeDiv.classList.add('recipe-item');
        recipeDiv.innerHTML = `
          <h3>${recipe.title}</h3>
          <button class="view-steps" data-id="${recipe.id}">View Steps</button>
          <hr>
        `;
        recipeList.appendChild(recipeDiv);
      });
    }
  }

  recipeList.addEventListener('click', async function handleSteps(event) {
    if (event.target.classList.contains('view-steps')) {
      const recipeId = event.target.getAttribute('data-id');
      const stepsContainer = event.target.parentNode.querySelector('.steps-container');
  
      if (stepsContainer) {
        // Toggle visibility of steps container
        stepsContainer.classList.toggle('hidden');
        if (stepsContainer.classList.contains('hidden')) {
          event.target.textContent = 'View Steps';
        } else {
          event.target.textContent = 'Hide Steps';
        }
      } else {
        // Steps are not displayed, fetch and display them
        try {
          const recipeDetailsResponse = await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/analyzedInstructions`, {
            params: {
              apiKey: '79c7d6caa65041f181dce11200b64cba', // Use the same API key as in other requests
            }
          });

  
          const steps = recipeDetailsResponse.data[0].steps;
          const newStepsContainer = document.createElement('div');
          newStepsContainer.classList.add('steps-container');
          steps.forEach((step, index) => {
            const stepElement = document.createElement('p');
            stepElement.textContent = `${index + 1}. ${step.step}`;
            newStepsContainer.appendChild(stepElement);
          });
  
          event.target.parentNode.appendChild(newStepsContainer);
          event.target.textContent = 'Hide Steps';
        } catch (error) {
          console.log('Error occurred while fetching recipe steps:', error);
          recipeList.innerHTML = 'An error occurred while fetching recipe steps.';
        }
      }
    }
  });    
});