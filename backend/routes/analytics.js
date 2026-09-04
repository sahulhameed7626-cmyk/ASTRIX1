import { db } from '../db.js';
import { MOST_PLAYED_SPORTS } from '../../js/data.js';

export function handleAnalyticsRoutes(req, res, url) {
  // GET /api/analytics
  if (url.pathname === '/api/analytics' && req.method === 'GET') {
    const weeklyData = [
      { day: "Mon", consumed: 2100, burned: 650 },
      { day: "Tue", consumed: 1950, burned: 580 },
      { day: "Wed", consumed: 2250, burned: 720 },
      { day: "Thu", consumed: 1880, burned: 490 },
      { day: "Fri", consumed: 2050, burned: 810 },
      { day: "Sat", consumed: 2400, burned: 920 },
      { day: "Sun", consumed: 1850, burned: 600 }
    ];

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      weeklyEnergyBalance: weeklyData,
      mostPlayedSports: MOST_PLAYED_SPORTS,
      totalSportsHours: 19.4,
      totalSportsCalories: 8420,
      mostActiveDay: "Saturday",
      weightHistory: db.store.weightHistory,
      weightProgressPercent: db.getWeightProgressPercent()
    }));
  }

  return false;
}
