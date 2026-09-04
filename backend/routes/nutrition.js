import { db } from '../db.js';

export function handleNutritionRoutes(req, res, url) {
  // GET /api/nutrition/categories
  if (url.pathname === '/api/nutrition/categories' && req.method === 'GET') {
    const categories = {};
    db.nutritionDataset.forEach(item => {
      categories[item.category] = (categories[item.category] || 0) + 1;
    });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      totalFoods: db.nutritionDataset.length,
      categories: Object.entries(categories).map(([name, count]) => ({ name, count }))
    }));
  }

  // GET /api/nutrition/search?q=...
  if (url.pathname === '/api/nutrition/search' && req.method === 'GET') {
    const query = (url.searchParams.get('q') || '').toLowerCase().trim();
    const category = (url.searchParams.get('category') || '').trim();

    let results = db.nutritionDataset;
    if (category && category.toLowerCase() !== 'all') {
      results = results.filter(f => f.category.toLowerCase() === category.toLowerCase());
    }
    if (query) {
      results = results.filter(f => 
        f.name.toLowerCase().includes(query) ||
        f.category.toLowerCase().includes(query) ||
        (f.keyVitamin && f.keyVitamin.toLowerCase().includes(query))
      );
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      count: results.length,
      query,
      results: results.slice(0, 100)
    }));
  }

  // GET /api/nutrition/:id
  const matchId = url.pathname.match(/^\/api\/nutrition\/([^/]+)$/);
  if (matchId && req.method === 'GET') {
    const id = matchId[1];
    const food = db.nutritionDataset.find(f => f.id === id);
    if (!food) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: "Food item not found" }));
    }

    const grams = parseFloat(url.searchParams.get('grams')) || food.baseGrams;
    const ratio = grams / food.baseGrams;

    const scaled = {
      ...food,
      requestedGrams: grams,
      calories: Math.round(food.calories * ratio * 10) / 10,
      protein: Math.round(food.protein * ratio * 100) / 100,
      carbs: Math.round(food.carbs * ratio * 100) / 100,
      fat: Math.round(food.fat * ratio * 100) / 100,
      fiber: Math.round(food.fiber * ratio * 100) / 100,
      iron: Math.round(food.iron * ratio * 1000) / 1000
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(scaled));
  }

  // GET /api/nutrition
  if (url.pathname === '/api/nutrition' && req.method === 'GET') {
    const category = url.searchParams.get('category');
    let items = db.nutritionDataset;
    if (category && category.toLowerCase() !== 'all') {
      items = items.filter(f => f.category.toLowerCase() === category.toLowerCase());
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      total: items.length,
      referenceServing: "50g edible portion",
      source: "USDA FoodData Central / FitSport Nutrition Dataset",
      items
    }));
  }

  return false;
}
