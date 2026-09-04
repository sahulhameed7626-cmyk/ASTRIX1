import { db } from '../db.js';

export function handleResetRoutes(req, res, parsedUrl, body) {
  if (parsedUrl.pathname === '/api/reset' && req.method === 'POST') {
    const type = body?.type || body?.tracker || 'all';

    if (type === 'all') {
      db.resetStore();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ success: true, message: "All system data reset to factory defaults" }));
    }

    if (type === 'daily' || type === 'all_today') {
      db.store.meals = { breakfast: [], lunch: [], dinner: [], snacks: [] };
      db.store.waterLogs = [];
      db.store.workouts = [];
      db.store.sportsActivities = [];
      db.store.history = [];
      db.saveStore();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ success: true, message: "All daily activity and history reset to 0" }));
    }

    if (type === 'history') {
      db.store.history = [];
      db.saveStore();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ success: true, message: "Activity history timeline reset" }));
    }

    if (type === 'meals' || type === 'nutrition') {
      db.store.meals = { breakfast: [], lunch: [], dinner: [], snacks: [] };
      db.saveStore();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ success: true, message: "Today's logged meals reset to 0" }));
    }

    if (type === 'water' || type === 'hydration') {
      db.store.waterLogs = [];
      db.saveStore();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ success: true, message: "Today's hydration log reset to 0" }));
    }

    if (type === 'workouts') {
      db.store.workouts = [];
      db.saveStore();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ success: true, message: "Today's workouts reset to 0" }));
    }

    if (type === 'sports') {
      db.store.sportsActivities = [];
      db.saveStore();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ success: true, message: "Today's sports sessions reset to 0" }));
    }

    if (type === 'weight') {
      const current = db.store.user.currentWeight || 69.5;
      const target = db.store.user.targetWeight || 65.0;
      const diff = current - target;
      const step = diff / 5;
      db.store.weightHistory = [
        { date: "W1", weight: Math.round((current + (step * 2.5)) * 10) / 10 },
        { date: "W2", weight: Math.round((current + (step * 2.0)) * 10) / 10 },
        { date: "W3", weight: Math.round((current + (step * 1.5)) * 10) / 10 },
        { date: "W4", weight: Math.round((current + (step * 1.0)) * 10) / 10 },
        { date: "W5", weight: Math.round((current + (step * 0.5)) * 10) / 10 },
        { date: "Today", weight: Number(current) }
      ];
      db.saveStore();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ success: true, message: "Weight trajectory reset to baseline" }));
    }

    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: `Unknown reset type: ${type}` }));
  }

  return false;
}
