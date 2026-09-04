import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STORE_PATH = path.join(__dirname, 'data', 'store.json');
const NUTRITION_DATASET_PATH = path.join(__dirname, 'data', 'nutritionDataset.json');

// Load raw nutrition dataset
let nutritionDataset = [];
try {
  nutritionDataset = JSON.parse(fs.readFileSync(NUTRITION_DATASET_PATH, 'utf-8'));
} catch (err) {
  console.error("Failed to load nutrition dataset:", err);
}

const DEFAULT_STORE = {
  user: {
    id: "user_alex_mercer",
    name: "Alex Mercer",
    phone: "+91 98765 43210",
    avatar: "AM",
    height: 178,
    currentWeight: 69.5,
    startingWeight: 72.0,
    targetWeight: 65.0,
    targetDurationMonths: 3,
    interestedSports: ["Cycling", "Football", "Badminton", "Running"],
    fitnessGoal: "Improve Sports Performance",
    calorieGoal: 2200,
    proteinGoal: 120,
    carbsGoal: 250,
    fatGoal: 65,
    waterGoal: 3500,
    ironGoal: 18,
    fiberGoal: 35
  },
  meals: {
    breakfast: [
      { id: "m_b1", foodId: "fru_apple_1", name: "Apple", grams: 100, calories: 52, protein: 0.3, carbs: 14.0, fat: 0.2, fiber: 2.4, iron: 0.12, keyVitamin: "Vit C 9.2mg" },
      { id: "m_b2", name: "Oats with Water & Chia", grams: 50, calories: 180, protein: 6.0, carbs: 32.0, fat: 3.2, fiber: 5.0, iron: 2.1, keyVitamin: "Vit B1" },
      { id: "m_b3", foodId: "dai_greek_yogurt_174", name: "Greek Yogurt", grams: 150, calories: 88.5, protein: 15.0, carbs: 5.4, fat: 0.4, fiber: 0, iron: 0.06, keyVitamin: "Vit B12" }
    ],
    lunch: [
      { id: "m_l1", foodId: "veg_spinach_69", name: "Spinach (Steamed)", grams: 100, calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, iron: 2.7, keyVitamin: "Vit A 938mcg" },
      { id: "m_l2", name: "Grilled Chicken Breast", grams: 150, calories: 248, protein: 46.5, carbs: 0, fat: 5.4, fiber: 0, iron: 1.5, keyVitamin: "Vit B6" },
      { id: "m_l3", name: "Steamed White Rice", grams: 150, calories: 195, protein: 4.0, carbs: 42.0, fat: 0.5, fiber: 0.6, iron: 1.2, keyVitamin: "Vit B1" }
    ],
    dinner: [
      { id: "m_d1", foodId: "dai_paneer_177", name: "Paneer (Grilled)", grams: 100, calories: 265, protein: 18.3, carbs: 1.2, fat: 20.8, fiber: 0, iron: 0.2, keyVitamin: "Calcium" },
      { id: "m_d2", foodId: "veg_broccoli_70", name: "Broccoli (Steamed)", grams: 150, calories: 51, protein: 4.2, carbs: 9.9, fat: 0.6, fiber: 3.9, iron: 1.1, keyVitamin: "Vit C 267.6mg" },
      { id: "m_d3", name: "Brown Rice", grams: 100, calories: 130, protein: 2.7, carbs: 28.0, fat: 0.3, fiber: 1.8, iron: 0.8, keyVitamin: "Magnesium" }
    ],
    snacks: [
      { id: "m_s1", foodId: "nut_almonds_137", name: "Almonds", grams: 30, calories: 173.7, protein: 6.36, carbs: 6.48, fat: 15.0, fiber: 3.75, iron: 1.11, keyVitamin: "Vit E 15.36mg" },
      { id: "m_s2", foodId: "fru_banana_2", name: "Banana", grams: 100, calories: 89, protein: 1.1, carbs: 23.0, fat: 0.3, fiber: 2.6, iron: 0.26, keyVitamin: "Vit C 17.4mg" }
    ]
  },
  waterLogs: [
    { id: "w_1", time: "08:00 AM", amount: 250 },
    { id: "w_2", time: "10:00 AM", amount: 500 },
    { id: "w_3", time: "12:30 PM", amount: 500 },
    { id: "w_4", time: "03:00 PM", amount: 500 },
    { id: "w_5", time: "05:15 PM", amount: 650 }
  ],
  workouts: [
    {
      id: "wk_1",
      title: "Leg Strength Foundations",
      category: "Equipment Workouts",
      subCategory: "Beginner",
      duration: 30,
      caloriesBurned: 220,
      completedAt: "05:30 PM"
    }
  ],
  sportsActivities: [
    {
      id: "sp_1",
      sportId: "cycling",
      sportName: "Cycling",
      duration: 45,
      intensity: "Moderate",
      caloriesBurned: 380,
      completedAt: "07:00 PM"
    }
  ],
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
      date: "Today",
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
      date: "Today",
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
