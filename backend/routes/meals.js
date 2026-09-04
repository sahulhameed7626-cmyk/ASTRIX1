import { db } from '../db.js';

export function handleMealRoutes(req, res, url, body) {
  // GET /api/meals
  if (url.pathname === '/api/meals' && req.method === 'GET') {
    const totals = db.getNutritionTotals();
    const user = db.store.user;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      totals,
      targets: {
        calories: user.calorieGoal,
        protein: user.proteinGoal,
        carbs: user.carbsGoal,
        fat: user.fatGoal,
        fiber: user.fiberGoal,
        iron: user.ironGoal
      },
      meals: db.store.meals
    }));
  }

  // POST /api/meals
  if (url.pathname === '/api/meals' && req.method === 'POST') {
    const { category, foodId, grams, name, calories, protein, carbs, fat, fiber, iron } = body;
    const catKey = (category || 'lunch').toLowerCase();

    if (!db.store.meals[catKey]) {
      db.store.meals[catKey] = [];
    }

    let mealItem;
    if (foodId) {
      const foodRef = db.nutritionDataset.find(f => f.id === foodId);
      if (foodRef) {
        const portionGrams = parseFloat(grams) || 50;
        const ratio = portionGrams / foodRef.baseGrams;
        mealItem = {
          id: `m_${Date.now()}_${Math.floor(Math.random()*1000)}`,
          foodId: foodRef.id,
          name: foodRef.name,
          category: foodRef.category,
          grams: portionGrams,
          calories: Math.round(foodRef.calories * ratio * 10) / 10,
          protein: Math.round(foodRef.protein * ratio * 10) / 10,
          carbs: Math.round(foodRef.carbs * ratio * 10) / 10,
          fat: Math.round(foodRef.fat * ratio * 10) / 10,
          fiber: Math.round(foodRef.fiber * ratio * 10) / 10,
          iron: Math.round(foodRef.iron * ratio * 100) / 100,
          keyVitamin: foodRef.keyVitamin
        };
      }
    }

    if (!mealItem) {
      mealItem = {
        id: `m_${Date.now()}_${Math.floor(Math.random()*1000)}`,
        foodId: foodId || `custom_${Date.now()}`,
        name: name || "Whole Food",
        category: body.category || "Whole Food",
        grams: parseFloat(grams) || 50,
        calories: Math.round((parseFloat(calories) || 50) * 10) / 10,
        protein: Math.round((parseFloat(protein) || 2) * 10) / 10,
        carbs: Math.round((parseFloat(carbs) || 5) * 10) / 10,
        fat: Math.round((parseFloat(fat) || 1) * 10) / 10,
        fiber: Math.round((parseFloat(fiber) || 0) * 10) / 10,
        iron: Math.round((parseFloat(iron) || 0.1) * 100) / 100,
        keyVitamin: body.keyVitamin || "Nutrient-rich"
      };
    }

    db.store.meals[catKey].push(mealItem);

    // Synchronize to unified common history
    db.store.history.unshift({
      id: `h_${Date.now()}`,
      type: "meals",
      title: `${catKey.charAt(0).toUpperCase() + catKey.slice(1)}: ${mealItem.name}`,
      subtitle: `${mealItem.grams}g • Logged to meal tracker`,
      metric: `${mealItem.calories} kcal`,
      subMetric: `${mealItem.protein}g Protein • ${mealItem.fiber}g Fiber`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: "Today",
      icon: "apple"
    });

    db.saveStore();

    res.writeHead(201, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      message: "Food added successfully",
      addedItem: mealItem,
      updatedTotals: db.getNutritionTotals()
    }));
  }

  // DELETE /api/meals/:category/:id
  const matchDel = url.pathname.match(/^\/api\/meals\/([^/]+)\/([^/]+)$/);
  if (matchDel && req.method === 'DELETE') {
    const cat = matchDel[1].toLowerCase();
    const itemId = matchDel[2];

    if (db.store.meals[cat]) {
      db.store.meals[cat] = db.store.meals[cat].filter(item => item.id !== itemId);
      db.saveStore();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({
        message: "Item removed",
        updatedTotals: db.getNutritionTotals()
      }));
    }
  }

  return false;
}
