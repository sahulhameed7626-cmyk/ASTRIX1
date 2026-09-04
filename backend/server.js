import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { handleNutritionRoutes } from './routes/nutrition.js';
import { handleMealRoutes } from './routes/meals.js';
import { handleWaterRoutes } from './routes/water.js';
import { handleWorkoutRoutes } from './routes/workouts.js';
import { handleSportsRoutes } from './routes/sports.js';
import { handleHistoryRoutes } from './routes/history.js';
import { handleAnalyticsRoutes } from './routes/analytics.js';
import { handleReminderRoutes } from './routes/reminders.js';
import { handleSummaryRoutes } from './routes/summary.js';
import { handleUserRoutes } from './routes/user.js';
import { handleResetRoutes } from './routes/reset.js';
import { handleTelegramRoutes } from './routes/telegram.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

const server = http.createServer((req, res) => {
  setCorsHeaders(res);

  // Handle pre-flight CORS
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  // Collect request body if method is POST/PUT
  let bodyData = '';
  req.on('data', chunk => {
    bodyData += chunk;
  });

  req.on('end', async () => {
    let body = {};
    if (bodyData) {
      try {
        body = JSON.parse(bodyData);
      } catch (e) {
        // fallback to query or raw string
      }
    }

    // --- API ROUTES ---
    if (parsedUrl.pathname.startsWith('/api/')) {
      if (handleNutritionRoutes(req, res, parsedUrl)) return;
      if (handleMealRoutes(req, res, parsedUrl, body)) return;
      if (handleWaterRoutes(req, res, parsedUrl, body)) return;
      if (handleWorkoutRoutes(req, res, parsedUrl, body)) return;
      if (handleSportsRoutes(req, res, parsedUrl, body)) return;
      if (handleHistoryRoutes(req, res, parsedUrl)) return;
      if (handleAnalyticsRoutes(req, res, parsedUrl)) return;
      if (handleReminderRoutes(req, res, parsedUrl, body)) return;
      if (handleSummaryRoutes(req, res, parsedUrl)) return;
      if (handleUserRoutes(req, res, parsedUrl, body)) return;
      if (handleResetRoutes(req, res, parsedUrl, body)) return;
      if (await handleTelegramRoutes(req, res, parsedUrl, body)) return;

      // API 404
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: `API route not found: ${req.method} ${parsedUrl.pathname}` }));
    }

    // --- STATIC ASSETS SERVING ---
    let reqPath = parsedUrl.pathname === '/' ? '/index.html' : parsedUrl.pathname;
    let safePath = path.normalize(reqPath).replace(/^(\.\.[/\\])+/, '');
    let filePath = path.join(ROOT_DIR, safePath);

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        if (err.code === 'ENOENT') {
          // Serve index.html for SPA client-side routing fallback if no extension
          if (!ext) {
            return fs.readFile(path.join(ROOT_DIR, 'index.html'), (e2, c2) => {
              if (e2) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                return res.end('404 Not Found');
              }
              res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
              return res.end(c2);
            });
          }
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          return res.end(`404 Not Found: ${reqPath}`);
        }
        res.writeHead(500);
        return res.end(`Server Error: ${err.code}`);
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🔥 FitSport Full-Stack Platform Active`);
  console.log(`🌐 Application UI : http://localhost:${PORT}`);
  console.log(`🥗 Nutrition API  : http://localhost:${PORT}/api/nutrition`);
  console.log(`📊 History API    : http://localhost:${PORT}/api/history`);
  console.log(`====================================================`);
});
