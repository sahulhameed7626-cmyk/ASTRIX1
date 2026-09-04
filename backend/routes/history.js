import { db } from '../db.js';

export function handleHistoryRoutes(req, res, url) {
  // GET /api/history
  if (url.pathname === '/api/history' && req.method === 'GET') {
    const type = url.searchParams.get('type');
    let items = db.store.history;

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

  return false;
}
