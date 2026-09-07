import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicit URL references for @vercel/nft automatic bundling
const STORE_URL = new URL('./data/store.json', import.meta.url);
const NUTRITION_DATASET_URL = new URL('./data/nutritionDataset.json', import.meta.url);

function resolveDataFilePath(filename, fallbackUrl) {
  const candidates = [
    fallbackUrl,
    path.join(__dirname, 'data', filename),
    path.join(process.cwd(), 'backend', 'data', filename),
    path.join(process.cwd(), 'data', filename),
    path.resolve(__dirname, '..', 'backend', 'data', filename),
    path.resolve(__dirname, '..', 'data', filename)
  ];
  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) return candidate;
    } catch {}
  }
  return fallbackUrl;
}

const STORE_PATH = resolveDataFilePath('store.json', STORE_URL);
const NUTRITION_DATASET_PATH = resolveDataFilePath('nutritionDataset.json', NUTRITION_DATASET_URL);

// Load raw nutrition dataset
let nutritionDataset = [];
try {
  nutritionDataset = JSON.parse(fs.readFileSync(NUTRITION_DATASET_PATH, 'utf-8'));
} catch (err) {
  console.warn("Could not load nutrition dataset from file, fallback to empty array:", err.message);
}

const DEFAULT_STORE = {
  user: {
    id: "user_sahul_hameed",
    name: "Sahul Hameed",
    phone: "+91 99999 88888",
    avatar: "SH",
    height: 178,
    currentWeight: 69.5,
    startingWeight: 72.0,
    targetWeight: 65.0,
    targetDurationMonths: 3,
    interestedSports: ["Cycling", "Football", "Badminton", "Running"],
    fitnessGoal: "Improve Sports Performance",
    calorieGoal: 2063,
    proteinGoal: 130,
    carbsGoal: 258,
    fatGoal: 57,
    waterGoal: 3500,
    ironGoal: 18,
    fiberGoal: 35
  },
  meals: {
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: []
  },
  waterLogs: [],
  workouts: [],
  sportsActivities: [],
  reminders: [
    { id: "r1", title: "Breakfast", time: "08:00 AM", repeat: "Everyday", type: "meal", icon: "apple", active: true },
    { id: "r2", title: "Lunch", time: "01:00 PM", repeat: "Everyday", type: "meal", icon: "apple", active: true },
    { id: "r3", title: "Water Hydration", time: "10:00 AM", repeat: "Every 2 Hours", type: "water", icon: "droplet", active: true },
    { id: "r4", title: "Workout", time: "06:00 PM", repeat: "Mon, Wed, Fri, Sat", type: "workout", icon: "dumbbell", active: true },
    { id: "r5", title: "Sports Session", time: "07:00 PM", repeat: "Tue, Thu, Sun", type: "sport", icon: "activity", active: true }
  ],
  history: [
    {
      id: "h_1",
      type: "meals",
      title: "Breakfast: Apple, Oats, Greek Yogurt",
      subtitle: "Morning nutritional fueling",
      metric: "320.5 kcal",
      subMetric: "21.3g Protein • 7.4g Fiber",
      time: "08:00 AM",
      date: "Today",
      icon: "apple"
    },
    {
      id: "h_2",
      type: "water",
      title: "Hydration Check-in",
      subtitle: "Pure filtered spring water",
      metric: "750 ml",
      subMetric: "Goal: 3,000 ml",
      time: "10:00 AM",
      date: "Today",
      icon: "droplet"
    },
    {
      id: "h_3",
      type: "meals",
      title: "Lunch: Grilled Chicken & Spinach",
      subtitle: "High-protein recovery meal",
      metric: "466 kcal",
      subMetric: "53.4g Protein • 2.8g Fiber",
      time: "01:15 PM",
      date: "Today",
      icon: "apple"
    },
    {
      id: "h_4",
      type: "water",
      title: "Afternoon Hydration",
      subtitle: "Continuous fluid intake",
      metric: "1,000 ml",
      subMetric: "Progress: 1,750 ml",
      time: "03:00 PM",
      date: "Today",
      icon: "droplet"
    },
    {
      id: "h_5",
      type: "workouts",
      title: "Workout: Leg Strength Foundations",
      subtitle: "Equipment Workouts (Beginner) completed",
      metric: "220 kcal burned",
      subMetric: "Duration: 30 min • 4 Exercises",
      time: "05:30 PM",
      date: "Yesterday",
      icon: "dumbbell"
    },
    {
      id: "h_6",
      type: "sports",
      title: "Sport: Cycling — Cadence Session",
      subtitle: "Moderate intensity • 45 min route",
      metric: "380 kcal burned",
      subMetric: "Duration: 45 min • 85% Quad Load",
      time: "07:00 PM",
      date: "Yesterday",
      icon: "bike"
    },
    {
      id: "h_7",
      type: "weight",
      title: "Weight Check-in",
      subtitle: "Fasting morning weight logged",
      metric: "69.5 kg",
      subMetric: "-2.5 kg from start • 58% to target",
      time: "07:15 AM",
      date: "Today",
      icon: "chart"
    }
  ],
  weightHistory: [
    { date: "Week 1", weight: 72.0 },
    { date: "Week 2", weight: 71.4 },
    { date: "Week 3", weight: 70.8 },
    { date: "Week 4", weight: 70.2 },
    { date: "Week 5", weight: 69.8 },
    { date: "Week 6 (Today)", weight: 69.5 }
  ]
};

class Database {
  constructor() {
    this.nutritionDataset = nutritionDataset;
    this.store = this.loadStore();
  }

  loadStore() {
    try {
      if (fs.existsSync(STORE_PATH)) {
        return JSON.parse(fs.readFileSync(STORE_PATH, 'utf-8'));
      }
    } catch (e) {
      console.warn("Could not read store.json, resetting to default", e);
    }
    this.saveStore(DEFAULT_STORE);
    return JSON.parse(JSON.stringify(DEFAULT_STORE));
  }

  resetStore() {
    this.store = JSON.parse(JSON.stringify(DEFAULT_STORE));
    this.saveStore(this.store);
    return this.store;
  }


  saveStore(dataToSave) {
    try {
      fs.writeFileSync(STORE_PATH, JSON.stringify(dataToSave || this.store, null, 2), 'utf-8');
    } catch (e) {
      console.error("Could not write store.json", e);
    }
  }

  // Aggregated totals
  getNutritionTotals() {
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;
    let fiber = 0;
    let iron = 0;

    Object.values(this.store.meals).forEach(mealList => {
      mealList.forEach(item => {
        calories += item.calories || 0;
        protein += item.protein || 0;
        carbs += item.carbs || 0;
        fat += item.fat || 0;
        fiber += item.fiber || 0;
        iron += item.iron || 0;
      });
    });

    return {
      calories: Math.round(calories),
      protein: Math.round(protein * 10) / 10,
      carbs: Math.round(carbs * 10) / 10,
      fat: Math.round(fat * 10) / 10,
      fiber: Math.round(fiber * 10) / 10,
      iron: Math.round(iron * 100) / 100
    };
  }

  getWaterTotal() {
    return this.store.waterLogs.reduce((acc, curr) => acc + curr.amount, 0);
  }

  getCaloriesBurnedToday() {
    let burned = 0;
    this.store.workouts.forEach(w => burned += (w.caloriesBurned || 0));
    this.store.sportsActivities.forEach(s => burned += (s.caloriesBurned || 0));
    return burned;
  }

  getWeightProgressPercent() {
    const { startingWeight, currentWeight, targetWeight } = this.store.user;
    const totalDiff = Math.abs(startingWeight - targetWeight);
    if (totalDiff === 0) return 100;
    const achieved = Math.abs(startingWeight - currentWeight);
    return Math.min(100, Math.max(0, Math.round((achieved / totalDiff) * 100))) || 58;
  }
}

export const db = new Database();
