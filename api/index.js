import { handleNutritionRoutes } from '../backend/routes/nutrition.js';
import { handleMealRoutes } from '../backend/routes/meals.js';
import { handleWaterRoutes } from '../backend/routes/water.js';
import { handleWorkoutRoutes } from '../backend/routes/workouts.js';
import { handleSportsRoutes } from '../backend/routes/sports.js';
import { handleHistoryRoutes } from '../backend/routes/history.js';
import { handleAnalyticsRoutes } from '../backend/routes/analytics.js';
import { handleReminderRoutes } from '../backend/routes/reminders.js';
import { handleSummaryRoutes } from '../backend/routes/summary.js';
import { handleUserRoutes } from '../backend/routes/user.js';
import { handleResetRoutes } from '../backend/routes/reset.js';
import { handleTelegramRoutes } from '../backend/routes/telegram.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const parsedUrl = new URL(req.url, `${proto}://${host}`);

  // Reconstruct full pathname from Vercel catch-all param if needed
  let pathname = parsedUrl.pathname;
  if (req.query) {
    const catchAll = req.query.all || req.query.path || req.query.slug || req.query.match;
    if (catchAll) {
      const segments = Array.isArray(catchAll) ? catchAll.join('/') : catchAll;
      pathname = '/api/' + segments;
    }
  }
  if (!pathname.startsWith('/api')) {
    pathname = '/api' + (pathname.startsWith('/') ? pathname : '/' + pathname);
  }
  const routeUrl = new URL(pathname + parsedUrl.search, `${proto}://${host}`);

  // Parse body if needed
  let body = req.body;
  if (typeof body === 'string' && body.trim().length > 0) {
    try {
      body = JSON.parse(body);
    } catch (e) {}
  } else if (!body && (req.method === 'POST' || req.method === 'PUT')) {
    body = await new Promise((resolve) => {
      let data = '';
      req.on('data', chunk => { data += chunk; });
      req.on('end', () => {
        try {
          resolve(data ? JSON.parse(data) : {});
        } catch {
          resolve({});
        }
      });
      req.on('error', () => resolve({}));
    });
  }

  // Execute Route Handlers and check if response ended
  try {
    handleNutritionRoutes(req, res, routeUrl);
    if (res.writableEnded) return;

    handleMealRoutes(req, res, routeUrl, body);
    if (res.writableEnded) return;

    handleWaterRoutes(req, res, routeUrl, body);
    if (res.writableEnded) return;

    handleWorkoutRoutes(req, res, routeUrl, body);
    if (res.writableEnded) return;

    handleSportsRoutes(req, res, routeUrl, body);
    if (res.writableEnded) return;

    handleHistoryRoutes(req, res, routeUrl);
    if (res.writableEnded) return;

    handleAnalyticsRoutes(req, res, routeUrl);
    if (res.writableEnded) return;

    handleReminderRoutes(req, res, routeUrl, body);
    if (res.writableEnded) return;

    handleSummaryRoutes(req, res, routeUrl);
    if (res.writableEnded) return;

    handleUserRoutes(req, res, routeUrl, body);
    if (res.writableEnded) return;

    handleResetRoutes(req, res, routeUrl, body);
    if (res.writableEnded) return;

    await handleTelegramRoutes(req, res, routeUrl, body);
    if (res.writableEnded) return;

    if (!res.writableEnded) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: `Route not found: ${req.method} ${routeUrl.pathname}` }));
    }
  } catch (err) {
    if (!res.writableEnded) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: err.message }));
    }
  }
}
