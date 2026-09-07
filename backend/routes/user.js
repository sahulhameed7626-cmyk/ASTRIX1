import { db } from '../db.js';

export function handleUserRoutes(req, res, url, body) {
  // GET /api/user
  if (url.pathname === '/api/user' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ user: db.store.user }));
  }

  // PUT /api/user
  if (url.pathname === '/api/user' && (req.method === 'PUT' || req.method === 'POST')) {
    db.store.user = {
      ...db.store.user,
      ...body
    };

    if (body.name && !body.avatar) {
      const parts = body.name.trim().split(/\s+/).filter(Boolean);
      const initials = parts.length === 1 
        ? parts[0].slice(0, 2).toUpperCase() 
        : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      db.store.user.avatar = initials || "AM";
    }

    if (body.currentWeight) {
      db.store.user.currentWeight = parseFloat(body.currentWeight);
      const todayEntry = db.store.weightHistory[db.store.weightHistory.length - 1];
      if (todayEntry) todayEntry.weight = parseFloat(body.currentWeight);
    }
    if (body.targetWeight) {
      db.store.user.targetWeight = parseFloat(body.targetWeight);
    }
    if (body.targetDurationMonths) {
      db.store.user.targetDurationMonths = parseInt(body.targetDurationMonths, 10);
    }

    // Dynamic 1 kg = 7,700 kcal & macro grams based on setted weight
    const curW = db.store.user.currentWeight || 69.5;
    const tgtW = db.store.user.targetWeight || 65.0;
    const setW = db.store.user.targetWeight || curW;
    const months = db.store.user.targetDurationMonths || 3;
    const height = db.store.user.height || 178;
    const bmr = Math.round(10 * curW + 6.25 * height - 5 * 24 + 5);
    const maintenance = Math.round(bmr * 1.45);
    const diff = Math.round((tgtW - curW) * 10) / 10;
    const totalDays = Math.max(15, months * 30);
    const dailyAdj = Math.round((Math.abs(diff) * 7700) / totalDays);
    const dailyGoal = diff < -0.1 ? Math.max(1200, maintenance - dailyAdj) : diff > 0.1 ? (maintenance + dailyAdj) : maintenance;
    const proteinGoal = Math.round(setW * 2.0);
    const fatGoal = Math.round((dailyGoal * 0.25) / 9);
    const carbsGoal = Math.max(50, Math.round((dailyGoal - (proteinGoal * 4) - (fatGoal * 9)) / 4));

    db.store.user.calorieGoal = dailyGoal;
    db.store.user.proteinGoal = proteinGoal;
    db.store.user.fatGoal = fatGoal;
    db.store.user.carbsGoal = carbsGoal;

    db.saveStore();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      message: "Profile updated successfully",
      user: db.store.user
    }));
  }

  return false;
}
