import { db } from '../db.js';
import { SPORTS_DATA } from '../../js/data.js';

export function handleSportsRoutes(req, res, url, body) {
  // GET /api/sports
  if (url.pathname === '/api/sports' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      sports: SPORTS_DATA,
      activitiesToday: db.store.sportsActivities
    }));
  }

  // GET /api/sports/:id/analysis
  const matchAnalysis = url.pathname.match(/^\/api\/sports\/([^/]+)\/analysis$/);
  if (matchAnalysis && req.method === 'GET') {
    const sportId = matchAnalysis[1].toLowerCase();
    const sport = SPORTS_DATA.find(s => s.id === sportId) || SPORTS_DATA[0];

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      sportId: sport.id,
      name: sport.name,
      type: sport.type,
      muscleImpact: sport.muscleImpact,
      performanceSuggestions: sport.performanceSuggestions,
      benefits: sport.benefits
    }));
  }

  // POST /api/sports/activity
  if (url.pathname === '/api/sports/activity' && req.method === 'POST') {
    const { sportId, duration, intensity } = body;
    const sport = SPORTS_DATA.find(s => s.id === sportId) || SPORTS_DATA[0];
    const durationMins = parseFloat(duration) || 45;
    const intensityVal = intensity || "Moderate";

    let multiplier = 1.0;
    if (intensityVal === "Low") multiplier = 0.8;
    if (intensityVal === "High") multiplier = 1.35;

    const calories = Math.round(sport.cpmBase * durationMins * multiplier);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const activityEntry = {
      id: `sp_${Date.now()}`,
      sportId: sport.id,
      sportName: sport.name,
      duration: durationMins,
      intensity: intensityVal,
      caloriesBurned: calories,
      completedAt: timeStr
    };

    db.store.sportsActivities.push(activityEntry);

    // Sync to unified history
    db.store.history.unshift({
      id: `h_${Date.now()}`,
      type: "sports",
      title: `Sport: ${sport.name}`,
      subtitle: `${intensityVal} intensity session logged`,
      metric: `${calories} kcal burned`,
      subMetric: `Duration: ${durationMins} min`,
      time: timeStr,
      date: "Today",
      icon: sport.icon
    });

    db.saveStore();

    res.writeHead(201, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      message: "Sport activity saved successfully",
      activity: activityEntry,
      caloriesBurnedToday: db.getCaloriesBurnedToday()
    }));
  }

  return false;
}
