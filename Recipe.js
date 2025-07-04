const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ 
    message: 'Recipe API Server',
    routes: {
      'GET /search/:ingredient': 'Find recipes by ingredient',
      'GET /find': 'Search with query parameter'
    }
  });
});

app.get('/find', async (req, res) => {
  try {
    const ingredient = req.query.ingredient;
    
    if (!ingredient) {
      return res.status(400).json({ 
        error: 'Ingredient query parameter required' 
      });
    }

    const mealDbUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredient)}`;
    const fetchResponse = await fetch(mealDbUrl);
    
    if (!fetchResponse.ok) {
      throw new Error(`API request failed: ${fetchResponse.status}`);
    }
    
    const mealResults = await fetchResponse.json();
    
    res.json({
      meals: mealResults.meals || [],
      total: mealResults.meals ? mealResults.meals.length : 0,
      searchTerm: ingredient
    });
    
  } catch (err) {
    console.error('Search operation failed:', err);
    res.status(500).json({ 
      error: 'Recipe search unsuccessful',
      details: err.message,
      meals: []
    });
  }
});

app.get('/search/:ingredient', async (req, res) => {
  try {
    const ingredient = req.params.ingredient;
    
    if (!ingredient) {
      return res.status(400).json({ 
        error: 'Missing ingredient parameter' 
      });
    }

    const apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredient)}`;
    const apiResponse = await fetch(apiUrl);
    
    if (!apiResponse.ok) {
      throw new Error(`Request failed with status: ${apiResponse.status}`);
    }
    
    const recipeData = await apiResponse.json();
    
    res.json({
      meals: recipeData.meals || [],
      total: recipeData.meals ? recipeData.meals.length : 0,
      searchTerm: ingredient
    });
    
  } catch (err) {
    console.error('Recipe search failed:', err);
    res.status(500).json({ 
      error: 'Unable to fetch recipes',
      details: err.message,
      meals: []
    });
  }
});

app.get('/details/:mealId', async (req, res) => {
  try {
    const mealId = req.params.mealId;
    
    if (!mealId) {
      return res.status(400).json({ 
        error: 'Recipe ID required' 
      });
    }

    const lookupUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
    const lookupResponse = await fetch(lookupUrl);
    
    if (!lookupResponse.ok) {
      throw new Error(`Lookup failed: ${lookupResponse.status}`);
    }
    
    const recipeDetails = await lookupResponse.json();
    
    if (!recipeDetails.meals || recipeDetails.meals.length === 0) {
      return res.status(404).json({ 
        error: 'Recipe not found',
        id: mealId
      });
    }
    
    res.json({
      meal: recipeDetails.meals[0]
    });
    
  } catch (err) {
    console.error('Recipe lookup error:', err);
    res.status(500).json({ 
      error: 'Could not retrieve recipe details',
      details: err.message
    });
  }
});

app.get('/status', (req, res) => {
  res.json({ 
    running: true, 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    available: [
      'GET /',
      'GET /search/:ingredient',
      'GET /find?ingredient=value',
      'GET /details/:mealId',
      'GET /status'
    ]
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Server error occurred',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`Recipe server running on port ${PORT}`);
  console.log(`Access at http://localhost:${PORT}`);
});

module.exports = app;