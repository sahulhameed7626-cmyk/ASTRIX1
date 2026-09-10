// FitSport Controlled AI Agent Tools System
import { db } from '../../db.js';
import { getMusclesForWorkout } from '../knowledge/muscleMappings.js';
import { getMusclesForSport, checkWorkoutSportOverlap } from '../knowledge/sportMappings.js';
import { SPORTS_DATA, WORKOUT_CATEGORIES, FOOD_DATABASE } from '../../../js/data.js';

export class FitSportTools {
  constructor(dbInstance = db) {
    this.db = dbInstance;
  }

  // 1. User Profile & Goals
  getUserProfile(userId = "default_user") {
    return this.db.store.user;
  }

  getFitnessGoal(userId = "default_user") {
    const user = this.db.store.user;
    return {
      fitnessGoal: user.fitnessGoal,
      currentWeight: user.currentWeight,
      targetWeight: user.targetWeight,
      startingWeight: user.startingWeight,
      calorieGoal: user.calorieGoal,
      proteinGoal: user.proteinGoal,
      carbsGoal: user.carbsGoal,
      fatGoal: user.fatGoal,
      waterGoal: user.waterGoal,
      dailyBurnTarget: user.dailyBurnTarget
    };
  }

  // 2. Common History
  getTodayHistory(userId = "default_user") {
    return this.db.store.history || [];
  }

  saveCommonHistory({ type, title, subtitle, metric, subMetric, date = "Today", icon = "activity" }) {
    if (!this.db.store.history) this.db.store.history = [];
    const entry = {
      id: `h_ai_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      type: type || "activity",
      title,
      subtitle: subtitle || "Logged via FitSport AI Coach",
      metric: metric || "",
      subMetric: subMetric || "",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date,
      icon
    };
    this.db.store.history.unshift(entry);
    this.db.saveStore();
    return entry;
  }

  // 3. Nutrition & Meals
  getTodayNutrition(userId = "default_user") {
    const totals = this.db.getNutritionTotals();
    const user = this.db.store.user;
    return {
      totals,
      targets: {
        calories: user.calorieGoal,
        protein: user.proteinGoal,
        carbs: user.carbsGoal,
        fat: user.fatGoal,
        water: user.waterGoal
      },
      percentages: {
        calories: Math.round((totals.calories / user.calorieGoal) * 100),
        protein: Math.round((totals.protein / user.proteinGoal) * 100),
        carbs: Math.round((totals.carbs / user.carbsGoal) * 100),
        fat: Math.round((totals.fat / user.fatGoal) * 100)
      }
    };
  }

  getMealHistory(userId = "default_user") {
    return this.db.store.meals || { breakfast: [], lunch: [], dinner: [], snacks: [] };
  }

  searchFood(query) {
    if (!query) return [];
    const q = String(query).toLowerCase().trim();
    const dataset = this.db.nutritionDataset || FOOD_DATABASE;
    return dataset.filter(f =>
      f.name.toLowerCase().includes(q) || q.includes(f.name.toLowerCase())
    );
  }

  getFoodNutrition(foodName, quantity = 100, unit = "g") {
    const matches = this.searchFood(foodName);
    if (!matches || matches.length === 0) return null;
    const base = matches[0];

    // Compute scaled nutrition according to formula: baseNutrition * quantity / baseServingSize
    let grams = quantity;
    const u = String(unit).toLowerCase();
    if (u.includes("kg")) grams = quantity * 1000;
    else if (u.includes("cup")) grams = quantity * 150;
    else if (u.includes("bowl")) grams = quantity * 200;
    else if (u.includes("piece") || u.includes("slice") || u.includes("pc")) {
      grams = quantity * (base.baseGrams || 50);
    }

    const ratio = grams / (base.baseGrams || 100);
    return {
      name: base.name,
      grams: Math.round(grams),
      calories: Math.round((base.calories || 100) * ratio),
      protein: Math.round((base.protein || 5) * ratio * 10) / 10,
      carbs: Math.round((base.carbs || 10) * ratio * 10) / 10,
      fat: Math.round((base.fat || 2) * ratio * 10) / 10,
      iron: Math.round((base.iron || 0.5) * ratio * 10) / 10
    };
  }

  addMeal({ userId = "default_user", category = "lunch", foodName, grams, calories, protein, carbs, fat }) {
    const cat = String(category).toLowerCase();
    const validCat = ["breakfast", "lunch", "dinner", "snacks"].includes(cat) ? cat : "lunch";
    if (!this.db.store.meals) this.db.store.meals = {};
    if (!this.db.store.meals[validCat]) this.db.store.meals[validCat] = [];

    const item = {
      id: `m_ai_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name: foodName,
      category: validCat.charAt(0).toUpperCase() + validCat.slice(1),
      grams: Math.round(parseFloat(grams) || 100),
      calories: Math.round(parseFloat(calories) || 120),
      protein: Math.round((parseFloat(protein) || 5) * 10) / 10,
      carbs: Math.round((parseFloat(carbs) || 15) * 10) / 10,
      fat: Math.round((parseFloat(fat) || 2) * 10) / 10,
      fiber: 2.0,
      iron: 0.8
    };

    this.db.store.meals[validCat].push(item);

    // Save to Common History
    this.saveCommonHistory({
      type: "meals",
      title: `${validCat.charAt(0).toUpperCase() + validCat.slice(1)}: ${item.name}`,
      subtitle: `${item.grams}g • Added via AI Voice Coach`,
      metric: `${item.calories} kcal`,
      subMetric: `${item.protein}g Protein • ${item.carbs}g Carbs`,
      date: "Today",
      icon: "apple"
    });

    this.db.saveStore();
    return item;
  }

  updateMeal({ userId = "default_user", mealId, category, foodName, grams, calories, protein, carbs, fat }) {
    const cat = (category || "lunch").toLowerCase();
    if (this.db.store.meals && this.db.store.meals[cat]) {
      const idx = this.db.store.meals[cat].findIndex(m => m.id === mealId);
      if (idx !== -1) {
        this.db.store.meals[cat][idx] = {
          ...this.db.store.meals[cat][idx],
          name: foodName || this.db.store.meals[cat][idx].name,
          grams: grams ? Math.round(grams) : this.db.store.meals[cat][idx].grams,
          calories: calories ? Math.round(calories) : this.db.store.meals[cat][idx].calories,
          protein: protein || this.db.store.meals[cat][idx].protein,
          carbs: carbs || this.db.store.meals[cat][idx].carbs,
          fat: fat || this.db.store.meals[cat][idx].fat
        };
        this.db.saveStore();
        return this.db.store.meals[cat][idx];
      }
    }
    return this.addMeal({ userId, category, foodName, grams, calories, protein, carbs, fat });
  }

  deleteMeal({ userId = "default_user", mealId, category }) {
    const cat = (category || "lunch").toLowerCase();
    if (this.db.store.meals && this.db.store.meals[cat]) {
      const idx = this.db.store.meals[cat].findIndex(m => m.id === mealId);
      if (idx !== -1) {
        const removed = this.db.store.meals[cat].splice(idx, 1)[0];
        this.db.saveStore();
        return { success: true, removed };
      }
    }
    return { success: false, error: "Meal item not found" };
  }

  // 4. Workouts
  getTodayWorkout(userId = "default_user") {
    const list = this.db.store.workouts || [];
    return list.length > 0 ? list[list.length - 1] : null;
  }

  getWorkoutDetails(workoutId) {
    return WORKOUT_CATEGORIES.find(w => w.id === workoutId) || WORKOUT_CATEGORIES[0];
  }

  getMusclesForWorkout(workoutName) {
    return getMusclesForWorkout(workoutName);
  }

  addWorkoutSession({ userId = "default_user", workoutId, title, durationMinutes, caloriesBurned }) {
    const template = this.getWorkoutDetails(workoutId);
    const session = {
      id: `w_ai_${Date.now()}`,
      workoutId: workoutId || template.id,
      title: title || template.title,
      durationMinutes: parseInt(durationMinutes, 10) || template.duration,
      caloriesBurned: parseInt(caloriesBurned, 10) || template.calories,
      completedAt: new Date().toISOString()
    };

    if (!this.db.store.workouts) this.db.store.workouts = [];
    this.db.store.workouts.push(session);

    this.saveCommonHistory({
      type: "workouts",
      title: `Workout Completed: ${session.title}`,
      subtitle: `${session.durationMinutes} min routine • Recorded by AI Coach`,
      metric: `${session.caloriesBurned} kcal`,
      subMetric: "Muscles Stimulated",
      date: "Today",
      icon: "dumbbell"
    });

    this.db.saveStore();
    return session;
  }

  // 5. Sports
  getTodaySports(userId = "default_user") {
    return this.db.store.sportsActivities || [];
  }

  getSportDetails(sportId) {
    return SPORTS_DATA.find(s => s.id === sportId || s.name.toLowerCase() === String(sportId).toLowerCase()) || SPORTS_DATA[0];
  }

  getMusclesForSport(sportName) {
    return getMusclesForSport(sportName);
  }

  checkWorkoutSportOverlap({ userId = "default_user", workoutName, sportName, date = "Today" }) {
    return checkWorkoutSportOverlap({ workoutName, sportName, userId, date });
  }

  addSportActivity({ userId = "default_user", sport, durationMinutes, caloriesBurned }) {
    const sportProfile = this.getSportDetails(sport);
    const duration = parseInt(durationMinutes, 10) || 45;
    const burned = parseInt(caloriesBurned, 10) || Math.round(duration * (sportProfile.calPerHour / 60 || 8));

    const activity = {
      id: `sp_ai_${Date.now()}`,
      sport: sportProfile.name,
      durationMinutes: duration,
      caloriesBurned: burned,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: "Today"
    };

    if (!this.db.store.sportsActivities) this.db.store.sportsActivities = [];
    this.db.store.sportsActivities.push(activity);

    this.saveCommonHistory({
      type: "sports",
      title: `Sport Session: ${activity.sport}`,
      subtitle: `${activity.durationMinutes} min • Recorded via AI Coach`,
      metric: `${activity.caloriesBurned} kcal burned`,
      subMetric: sportProfile.intensity || "Athletic Output",
      date: "Today",
      icon: "activity"
    });

    this.db.saveStore();
    return activity;
  }

  // 6. Water Intake
  getWaterIntake(userId = "default_user") {
    const totalMl = this.db.getWaterTotal();
    const user = this.db.store.user;
    return {
      totalMl,
      targetMl: user.waterGoal,
      percent: Math.min(100, Math.round((totalMl / user.waterGoal) * 100))
    };
  }

  addWater({ userId = "default_user", amountMl = 250 }) {
    const ml = parseInt(amountMl, 10) || 250;
    if (!this.db.store.waterLogs) this.db.store.waterLogs = [];

    const log = {
      id: `w_${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      amount: ml
    };
    this.db.store.waterLogs.push(log);

    this.saveCommonHistory({
      type: "water",
      title: "Hydration Check-in",
      subtitle: `Logged +${ml} ml fluid intake via AI Coach`,
      metric: `+${ml} ml`,
      subMetric: `Total today: ${(this.db.getWaterTotal() / 1000).toFixed(2)} L`,
      date: "Today",
      icon: "droplet"
    });

    this.db.saveStore();
    return { loggedMl: ml, totalMl: this.db.getWaterTotal() };
  }

  // 7. Weight Progress
  getWeightProgress(userId = "default_user") {
    const user = this.db.store.user;
    return {
      current: user.currentWeight,
      target: user.targetWeight,
      start: user.startingWeight,
      progressPercent: this.db.getWeightProgressPercent()
    };
  }

  // 8. Progress Summaries
  getDailyProgress(userId = "default_user") {
    const nut = this.getTodayNutrition(userId);
    const water = this.getWaterIntake(userId);
    const workout = this.getTodayWorkout(userId);
    const sports = this.getTodaySports(userId);
    const burned = this.db.getCaloriesBurnedToday();
    const weight = this.getWeightProgress(userId);

    return {
      nutrition: nut,
      water,
      workoutCompleted: !!workout,
      latestWorkout: workout,
      sports,
      caloriesBurned: burned,
      weight
    };
  }

  getWeeklyProgress(userId = "default_user") {
    return this.db.store.weightHistory || [];
  }

  // 9. Reminders & AI Check-ins
  getReminders(userId = "default_user") {
    return this.db.store.reminders || [];
  }

  scheduleAICheckIn(settings) {
    if (!this.db.store.aiCheckInSettings) {
      this.db.store.aiCheckInSettings = {};
    }
    this.db.store.aiCheckInSettings = {
      ...this.db.store.aiCheckInSettings,
      ...settings,
      updatedAt: new Date().toISOString()
    };
    this.db.saveStore();
    return this.db.store.aiCheckInSettings;
  }

  generateDailySummary(userId = "default_user") {
    const prog = this.getDailyProgress(userId);
    const user = this.db.store.user;

    return `FitSport Daily Athletic Summary for ${user.name}:\n` +
      `• Nutrition: ${prog.nutrition.totals.calories}/${user.calorieGoal} kcal (${prog.nutrition.percentages.calories}%)\n` +
      `• Protein: ${prog.nutrition.totals.protein}g/${user.proteinGoal}g (${prog.nutrition.percentages.protein}%)\n` +
      `• Hydration: ${(prog.water.totalMl / 1000).toFixed(2)}L/${(user.waterGoal / 1000).toFixed(1)}L (${prog.water.percent}%)\n` +
      `• Calories Burned: ${prog.caloriesBurned} kcal\n` +
      `• Workout: ${prog.workoutCompleted ? prog.latestWorkout.title : 'Rest Day'}\n` +
      `• Sports: ${prog.sports.length > 0 ? prog.sports.map(s => `${s.sport} (${s.durationMinutes}m)`).join(', ') : 'None logged'}\n` +
      `• Weight Goal: ${user.currentWeight}kg -> Target: ${user.targetWeight}kg (${prog.weight.progressPercent}% to goal)`;
  }

  saveAIConversation(msg) {
    if (!this.db.store.aiConversations) {
      this.db.store.aiConversations = [];
    }
    const entry = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      ...msg,
      timestamp: new Date().toISOString()
    };
    this.db.store.aiConversations.push(entry);
    if (this.db.store.aiConversations.length > 100) {
      this.db.store.aiConversations.shift();
    }
    this.db.saveStore();
    return entry;
  }

  saveAIMessage(msg) {
    return this.saveAIConversation(msg);
  }
}

export const fitSportTools = new FitSportTools();
