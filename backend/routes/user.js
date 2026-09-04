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

    db.saveStore();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      message: "Profile updated successfully",
      user: db.store.user
    }));
  }

  return false;
}
