import { db } from '../db.js';

export function handleHistoryRoutes(req, res, url, body = {}) {
  // GET /api/history
  if (url.pathname === '/api/history' && req.method === 'GET') {
    const type = url.searchParams.get('type');
    let items = db.store.history || [];

    if (type && type !== 'all') {
      items = items.filter(h => h.type.toLowerCase() === type.toLowerCase());
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      total: items.length,
      filter: type || 'all',
      timeline: items
    }));
  }

  // POST /api/history
  if (url.pathname === '/api/history' && req.method === 'POST') {
    if (!db.store.history) db.store.history = [];
    const entry = {
      id: body.id || ("h_" + Date.now() + "_" + Math.floor(Math.random() * 1000)),
      type: body.type || "activity",
      title: body.title || "Activity",
      subtitle: body.subtitle || "",
      metric: body.metric || "",
      subMetric: body.subMetric || "",
      time: body.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: body.date || "Today",
      icon: body.icon || "activity"
    };
    db.store.history.unshift(entry);
    db.saveStore();
    res.writeHead(201, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ success: true, entry }));
  }

  return false;
}
