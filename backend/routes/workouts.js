import { db } from '../db.js';
import { WORKOUT_CATEGORIES } from '../../js/data.js';

export function handleWorkoutRoutes(req, res, url, body) {
  // GET /api/workouts
  if (url.pathname === '/api/workouts' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      workouts: WORKOUT_CATEGORIES,
      completedToday: db.store.workouts
    }));
  }

  // POST /api/workouts/complete
  if (url.pathname === '/api/workouts/complete' && req.method === 'POST') {
    const { workoutId, durationActual } = body;
    const workout = WORKOUT_CATEGORIES.find(w => w.id === workoutId) || WORKOUT_CATEGORIES[0];
    const duration = parseInt(durationActual, 10) || workout.duration;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const completedEntry = {
      id: `wk_${Date.now()}`,
      workoutId: workout.id,
      title: workout.title,
      category: workout.category,
      subCategory: workout.subCategory,
      duration,
      caloriesBurned: workout.calories,
      completedAt: timeStr
    };

    db.store.workouts.push(completedEntry);

    // Sync to unified history
    db.store.history.unshift({
      id: `h_${Date.now()}`,
      type: "workouts",
      title: `Workout: ${workout.title}`,
      subtitle: `${workout.category} (${workout.subCategory}) completed`,
      metric: `${workout.calories} kcal burned`,
      subMetric: `Duration: ${duration} min • Completed`,
      time: timeStr,
      date: "Today",
      icon: "dumbbell"
    });

    db.saveStore();

    res.writeHead(201, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      message: "Workout completed and saved to history",
      workout: completedEntry,
      caloriesBurnedToday: db.getCaloriesBurnedToday()
    }));
  }

  return false;
}
