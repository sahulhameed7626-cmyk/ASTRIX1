import { db } from '../db.js';

export function handleSummaryRoutes(req, res, url) {
  // GET /api/summary/daily
  if (url.pathname === '/api/summary/daily' && req.method === 'GET') {
    const nut = db.getNutritionTotals();
    const waterL = (db.getWaterTotal() / 1000).toFixed(1);
    const burned = db.getCaloriesBurnedToday();
    const progress = db.getWeightProgressPercent();

    const summary = {
      athlete: db.store.user.name,
      date: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      metrics: {
        caloriesConsumed: nut.calories,
        caloriesTarget: db.store.user.calorieGoal,
        proteinGrams: nut.protein,
        proteinTarget: db.store.user.proteinGoal,
        waterLiters: parseFloat(waterL),
        waterTarget: (db.store.user.waterGoal / 1000).toFixed(1),
        workoutCaloriesBurned: db.store.workouts.reduce((s, w) => s + w.caloriesBurned, 0),
        sportSession: "Cycling (45 min)",
        sportCaloriesBurned: db.store.sportsActivities.reduce((s, a) => s + a.caloriesBurned, 0),
        totalCaloriesBurned: burned,
        goalProgressPercent: progress,
        targetWeight: `${db.store.user.targetWeight} kg`,
        currentWeight: `${db.store.user.currentWeight} kg`
      }
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(summary));
  }

  // GET /api/summary/whatsapp
  if (url.pathname === '/api/summary/whatsapp' && req.method === 'GET') {
    const nut = db.getNutritionTotals();
    const waterL = (db.getWaterTotal() / 1000).toFixed(1);
    const burned = db.getCaloriesBurnedToday();
    const progress = db.getWeightProgressPercent();
    const user = db.store.user;

    const text = `🔥 *FITSPORT Daily Performance Summary*\n` +
      `👤 *Athlete:* ${user.name}\n` +
      `📅 *Date:* ${new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}\n\n` +
      `🥗 *NUTRITION*\n` +
      `• Calories Consumed: ${nut.calories} / ${user.calorieGoal} kcal\n` +
      `• Protein: ${nut.protein}g / ${user.proteinGoal}g\n` +
      `• Fiber: ${nut.fiber}g / ${user.fiberGoal || 35}g\n` +
      `• Water Intake: ${waterL}L / ${(user.waterGoal / 1000).toFixed(1)}L\n\n` +
      `⚡ *PERFORMANCE & SPORTS*\n` +
      `• Calories Burned: ${burned} kcal\n` +
      `• Primary Sport: Cycling (45 min, 380 kcal)\n` +
      `• Weight Goal Progress: ${progress}% (${user.currentWeight}kg → ${user.targetWeight}kg)\n\n` +
      `💪 *Train Smarter. Eat Better. Play Stronger.*\n` +
      `_Logged via FitSport Platform_`;

    const encoded = encodeURIComponent(text);
    const shareUrl = `https://api.whatsapp.com/send?text=${encoded}`;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ text, shareUrl }));
  }

  return false;
}
