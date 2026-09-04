import { db } from '../db.js';

export function handleWaterRoutes(req, res, url, body) {
  // GET /api/water
  if (url.pathname === '/api/water' && req.method === 'GET') {
    const total = db.getWaterTotal();
    const target = db.store.user.waterGoal;
    const percent = Math.min(100, Math.round((total / target) * 100));

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      currentMl: total,
      targetMl: target,
      percent,
      logs: db.store.waterLogs
    }));
  }

  // POST /api/water
  if (url.pathname === '/api/water' && req.method === 'POST') {
    const amount = parseInt(body.amount, 10) || 250;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newLog = {
      id: `w_${Date.now()}`,
      time: timeStr,
      amount
    };

    db.store.waterLogs.push(newLog);

    // Sync to unified history
    db.store.history.unshift({
      id: `h_${Date.now()}`,
      type: "water",
      title: "Hydration Check-in",
      subtitle: `Logged +${amount} ml fluid intake`,
      metric: `+${amount} ml`,
      subMetric: `Total today: ${(db.getWaterTotal() / 1000).toFixed(2)} L`,
      time: timeStr,
      date: "Today",
      icon: "droplet"
    });

    db.saveStore();

    res.writeHead(201, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      message: "Water logged successfully",
      newLog,
      totalWaterMl: db.getWaterTotal()
    }));
  }

  return false;
}
