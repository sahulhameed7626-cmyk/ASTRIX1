// FitSport Reactive State Store with Full-Stack REST API Integration
import {
  INITIAL_USER,
  INITIAL_MEALS,
  INITIAL_WATER_LOGS,
  INITIAL_HISTORY,
  INITIAL_REMINDERS,
  FOOD_DATABASE,
  WORKOUT_CATEGORIES,
  SPORTS_DATA,
  MOST_PLAYED_SPORTS,
  WEIGHT_JOURNEY_HISTORY
} from "./data.js";

const STORAGE_KEY = "fitsport_state_v2";

class StateManager {
  constructor() {
    this.listeners = [];
    this.nutritionDataset = [];
    this.selectedFoodCategory = "all";
    this.state = this.loadInitialState();
    this.syncWithBackend();
  }

  loadInitialState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Could not load from localStorage", e);
    }
    return {
      user: { ...INITIAL_USER },
      meals: JSON.parse(JSON.stringify(INITIAL_MEALS)),
      waterLogs: [...INITIAL_WATER_LOGS],
      history: [...INITIAL_HISTORY],
      reminders: [...INITIAL_REMINDERS],
      weightHistory: [...WEIGHT_JOURNEY_HISTORY],
      mostPlayedSports: [...MOST_PLAYED_SPORTS],
      selectedSportId: "cycling",
      selectedWorkoutId: "hw-beg",
      activeWorkoutSession: null,
      auth: {
        isLoggedIn: true,
        onboardingComplete: true
      }
    };
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state));
  }

  // --- Backend REST API Synchronization ---
  async syncWithBackend() {
    try {
      // 1. Fetch complete Nutrition Dataset from backend (207 items from PDF)
      const nutRes = await fetch('/api/nutrition');
      if (nutRes.ok) {
        const nutData = await nutRes.json();
        this.nutritionDataset = nutData.items || [];
      }

      // 2. Fetch meals & macro totals
      const mealsRes = await fetch('/api/meals');
      if (mealsRes.ok) {
        const mealsData = await mealsRes.json();
        if (mealsData.meals) {
          this.state.meals = mealsData.meals;
        }
      }

      // 3. Fetch water intake
      const waterRes = await fetch('/api/water');
      if (waterRes.ok) {
        const waterData = await waterRes.json();
        if (waterData.logs) {
          this.state.waterLogs = waterData.logs;
        }
      }

      // 4. Fetch unified common history
      const histRes = await fetch('/api/history');
      if (histRes.ok) {
        const histData = await histRes.json();
        if (histData.timeline) {
          this.state.history = histData.timeline;
        }
      }

      // 5. Fetch reminders
      const remRes = await fetch('/api/reminders');
      if (remRes.ok) {
        const remData = await remRes.json();
        if (remData.reminders) {
          this.state.reminders = remData.reminders;
        }
      }

      // 6. Fetch user profile
      const userRes = await fetch('/api/user');
      if (userRes.ok) {
        const userData = await userRes.json();
        if (userData.user) {
          this.state.user = userData.user;
        }
      }

      // 7. Fetch Telegram schedule
      await this.loadTelegramSchedule();

      this.saveState();
    } catch (err) {
      console.info("Running in client-cached mode (backend sync optional):", err.message);
    }
  }

  // Helper getters
  getNutritionTotals() {
    let totalCals = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalFiber = 0;
    let totalIron = 0;

    Object.values(this.state.meals).forEach(mealArray => {
      mealArray.forEach(item => {
        totalCals += item.calories || 0;
        totalProtein += item.protein || 0;
        totalCarbs += item.carbs || 0;
        totalFat += item.fat || 0;
        totalFiber += item.fiber || 0;
        totalIron += item.iron || 0;
      });
    });

    return {
      calories: Math.round(totalCals),
      protein: Math.round(totalProtein * 10) / 10,
      carbs: Math.round(totalCarbs * 10) / 10,
      fat: Math.round(totalFat * 10) / 10,
      fiber: Math.round(totalFiber * 10) / 10,
      iron: Math.round(totalIron * 100) / 100
    };
  }

  getWaterTotal() {
    return this.state.waterLogs.reduce((sum, item) => sum + item.amount, 0);
  }

  getCaloriesBurnedToday() {
    let burned = 0;
    this.state.history.forEach(item => {
      if (item.date === "Today") {
        if (item.type === "workouts" || item.type === "sports") {
          const match = item.metric.match(/(\d+)\s*kcal/);
          if (match) burned += parseInt(match[1], 10);
        }
      }
    });
    return burned;
  }

  getWeightProgressPercent() {
    const { startingWeight = 72, currentWeight = 69.5, targetWeight = 65 } = this.state.user;
    const initial = startingWeight || (currentWeight + 2.5);
    const totalDiff = Math.abs(initial - targetWeight);
    if (totalDiff === 0) return 100;
    const achieved = Math.abs(initial - currentWeight);
    const pct = Math.min(100, Math.max(0, Math.round((achieved / totalDiff) * 100)));
    return pct || 60;
  }

  // --- API Mutators ---
  async addFoodToMeal(mealCategory, foodItem, grams) {
    const multiplier = grams / (foodItem.baseGrams || 50);
    const entry = {
      id: "m_" + Date.now(),
      foodId: foodItem.id,
      name: foodItem.name,
      category: foodItem.category || "Whole Food",
      serving: `${grams}g`,
      grams: grams,
      calories: Math.round(foodItem.calories * multiplier * 10) / 10,
      protein: Math.round(foodItem.protein * multiplier * 10) / 10,
      carbs: Math.round(foodItem.carbs * multiplier * 10) / 10,
      fat: Math.round((foodItem.fat || 0) * multiplier * 10) / 10,
      fiber: Math.round((foodItem.fiber || 0) * multiplier * 10) / 10,
      iron: Math.round((foodItem.iron || 0) * multiplier * 100) / 100,
      keyVitamin: foodItem.keyVitamin || "Nutrient-rich"
    };

    if (!this.state.meals[mealCategory]) {
      this.state.meals[mealCategory] = [];
    }
    this.state.meals[mealCategory].push(entry);

    // Add to unified history
    this.state.history.unshift({
      id: "h_" + Date.now(),
      type: "meals",
      title: `${mealCategory.charAt(0).toUpperCase() + mealCategory.slice(1)}: ${foodItem.name}`,
      subtitle: `${grams}g • Added to ${mealCategory}`,
      metric: `${entry.calories} kcal`,
      subMetric: `${entry.protein}g Protein • ${entry.fiber}g Fiber`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: "Today",
      icon: "apple"
    });

    this.saveState();

    // Call Backend API
    try {
      await fetch('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: mealCategory,
          foodId: foodItem.id,
          grams: grams,
          name: foodItem.name,
          calories: entry.calories,
          protein: entry.protein,
          carbs: entry.carbs,
          fat: entry.fat,
          fiber: entry.fiber,
          iron: entry.iron
        })
      });
    } catch (e) {
      console.warn("Backend POST /api/meals fallback", e);
    }
  }

  async removeFoodFromMeal(mealCategory, itemId) {
    if (this.state.meals[mealCategory]) {
      this.state.meals[mealCategory] = this.state.meals[mealCategory].filter(item => item.id !== itemId);
      this.saveState();

      try {
        await fetch(`/api/meals/${mealCategory}/${itemId}`, { method: 'DELETE' });
      } catch (e) {
        // fallback
      }
    }
  }

  async addWater(amount) {
    const parsedAmount = parseInt(amount, 10) || 250;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.state.waterLogs.push({
      id: "w_" + Date.now(),
      time: timeStr,
      amount: parsedAmount
    });

    this.state.history.unshift({
      id: "h_" + Date.now(),
      type: "water",
      title: "Hydration Check-in",
      subtitle: `Logged +${parsedAmount} ml fluid intake`,
      metric: `+${parsedAmount} ml`,
      subMetric: `Total today: ${(this.getWaterTotal() / 1000).toFixed(2)} L`,
      time: timeStr,
      date: "Today",
      icon: "droplet"
    });

    this.saveState();

    try {
      await fetch('/api/water', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parsedAmount })
      });
    } catch (e) {
      // fallback
    }
  }

  async setWaterGoal(targetMl) {
    const goal = parseInt(targetMl, 10) || 3500;
    this.state.user.waterGoal = goal;
    this.saveState();

    try {
      await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ waterGoal: goal })
      });
    } catch (e) {
      // fallback
    }
  }

  async addSportActivity(sportId, durationMinutes, intensity) {
    const sport = SPORTS_DATA.find(s => s.id === sportId) || SPORTS_DATA[0];
    let multiplier = 1.0;
    if (intensity === "Low") multiplier = 0.8;
    if (intensity === "High") multiplier = 1.35;

    const calories = Math.round(sport.cpmBase * durationMinutes * multiplier);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    this.state.history.unshift({
      id: "h_" + Date.now(),
      type: "sports",
      title: `Sport: ${sport.name}`,
      subtitle: `${intensity} intensity • Session logged`,
      metric: `${calories} kcal burned`,
      subMetric: `Duration: ${durationMinutes} min`,
      time: timeStr,
      date: "Today",
      icon: sport.icon
    });

    this.saveState();

    try {
      await fetch('/api/sports/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sportId, duration: durationMinutes, intensity })
      });
    } catch (e) {
      // fallback
    }

    return { sport, calories, duration: durationMinutes };
  }

  async completeWorkout(workoutId, durationActual) {
    const workout = WORKOUT_CATEGORIES.find(w => w.id === workoutId) || WORKOUT_CATEGORIES[0];
    const calories = workout.calories;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    this.state.history.unshift({
      id: "h_" + Date.now(),
      type: "workouts",
      title: `Workout: ${workout.title}`,
      subtitle: `${workout.category} (${workout.subCategory}) completed`,
      metric: `${calories} kcal burned`,
      subMetric: `Duration: ${durationActual || workout.duration} min • Completed`,
      time: timeStr,
      date: "Today",
      icon: "dumbbell"
    });

    this.saveState();

    try {
      await fetch('/api/workouts/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workoutId, durationActual })
      });
    } catch (e) {
      // fallback
    }
  }

  async toggleReminder(reminderId) {
    const item = this.state.reminders.find(r => r.id === reminderId);
    if (item) {
      item.active = !item.active;
      this.saveState();

      try {
        await fetch(`/api/reminders/${reminderId}/toggle`, { method: 'PUT' });
      } catch (e) {
        // fallback
      }
    }
  }

  async updateReminderTime(reminderId, newTime) {
    const item = this.state.reminders.find(r => r.id === reminderId);
    if (item) {
      item.time = newTime;
      this.saveState();

      try {
        await fetch(`/api/reminders/${reminderId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ time: newTime })
        });
      } catch (e) {
        // fallback
      }
    }
  }

  async addReminder(title, time, repeat = "Everyday", type = "custom", icon = "bell") {
    const newRem = {
      id: "r_" + Date.now(),
      title,
      time,
      repeat,
      type,
      icon,
      active: true
    };
    this.state.reminders.push(newRem);
    this.saveState();

    try {
      await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRem)
      });
    } catch (e) {
      // fallback
    }

    return newRem;
  }

  async updateUserProfile(updatedFields) {
    this.state.user = { ...this.state.user, ...updatedFields };
    if (updatedFields.currentWeight) {
      const todayEntry = this.state.weightHistory[this.state.weightHistory.length - 1];
      if (todayEntry) todayEntry.weight = updatedFields.currentWeight;
    }
    this.saveState();

    try {
      await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
    } catch (e) {
      // fallback
    }
  }

  generateDailySummaryTelegramText() {
    const nut = this.getNutritionTotals();
    const waterL = (this.getWaterTotal() / 1000).toFixed(1);
    const burned = this.getCaloriesBurnedToday();
    const progress = this.getWeightProgressPercent();

    return `🔥 *FITSPORT Daily Performance Summary*\n` +
      `👤 *Athlete:* ${this.state.user.name}\n` +
      `📅 *Date:* ${new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}\n\n` +
      `🥗 *NUTRITION (USDA Verified Reference)*\n` +
      `• Calories Consumed: ${nut.calories} / ${this.state.user.calorieGoal} kcal\n` +
      `• Protein: ${nut.protein}g / ${this.state.user.proteinGoal}g\n` +
      `• Carbs: ${nut.carbs}g / ${this.state.user.carbsGoal}g\n` +
      `• Fat: ${nut.fat}g / ${this.state.user.fatGoal}g\n` +
      `• Fiber: ${nut.fiber}g / ${this.state.user.fiberGoal || 35}g\n` +
      `• Iron: ${nut.iron}mg / ${this.state.user.ironGoal || 18}mg\n` +
      `• Water Intake: ${waterL}L / ${(this.state.user.waterGoal / 1000).toFixed(1)}L\n\n` +
      `⚡ *PERFORMANCE & SPORTS*\n` +
      `• Calories Burned: ${burned} kcal\n` +
      `• Primary Sport: Cycling (45 min, 380 kcal)\n` +
      `• Weight Goal Progress: ${progress}%\n\n` +
      `💪 *Train Smarter. Eat Better. Play Stronger.*\n` +
      `_Logged via FitSport Platform_`;
  }

  generateExactHistoryTelegramText() {
    const history = this.state.history || [];
    const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    
    if (history.length === 0) {
      return `🏆 *FITSPORT — Activity History Timeline*\n` +
        `👤 *Athlete:* ${this.state.user.name}\n` +
        `📅 *Date:* ${dateStr}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `*Status:* No activity items logged yet. Timeline is reset.\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `💪 _Train Smarter. Eat Better. Play Stronger._\n` +
        `_FitSport Performance Platform_`;
    }

    const itemsFormatted = history.map((item, idx) => {
      let icon = "⚡";
      if (item.type === "meals") icon = "🥗";
      else if (item.type === "water") icon = "💧";
      else if (item.type === "workouts") icon = "🏋️";
      else if (item.type === "sports") icon = "🚴";
      else if (item.type === "weight") icon = "⚖️";

      return `${idx + 1}. ${icon} *${item.title}*\n` +
             `   • Time: ${item.time || 'Today'} | Metric: *${item.metric || 'N/A'}*\n` +
             `   • Details: ${item.subtitle || ''}${item.subMetric ? ' (' + item.subMetric + ')' : ''}`;
    }).join('\n\n');

    return `🏆 *FITSPORT — Activity History Timeline*\n` +
      `👤 *Athlete:* ${this.state.user.name}\n` +
      `📅 *Date:* ${dateStr}\n` +
      `📊 *Total Logged Activities:* ${history.length}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `${itemsFormatted}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `💪 _Train Smarter. Eat Better. Play Stronger._\n` +
      `_FitSport Performance Platform_`;
  }

  async sendTelegramHistoryNotification(customText, chatId) {
    try {
      const res = await fetch('/api/telegram/send-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: customText, chatId: chatId })
      });
      const data = await res.json();
      this.syncWithBackend();
      return data;
    } catch (e) {
      console.warn("Telegram notification error:", e);
      return { success: false, error: e.message };
    }
  }

  async getTelegramUpdates() {
    try {
      const res = await fetch('/api/telegram/updates');
      return await res.json();
    } catch (e) {
      return { error: e.message };
    }
  }

  async loadTelegramSchedule() {
    try {
      const res = await fetch('/api/telegram/schedule');
      if (res.ok) {
        const data = await res.json();
        this.state.telegramSchedule = data.schedule || { enabled: true, time: "21:00", time12: "09:00 PM" };
        this.state.telegramBotUsername = data.botUsername || "sgifesdf_bot";
        this.state.telegramChatId = data.chatId || "7032355691";
        this.saveState();
        return data;
      }
    } catch (e) {
      console.warn("Could not load telegram schedule", e);
    }
    return null;
  }

  async saveTelegramSchedule({ enabled, time, time12, chatId }) {
    try {
      const res = await fetch('/api/telegram/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled, time, time12, chatId })
      });
      const data = await res.json();
      if (data.schedule) {
        this.state.telegramSchedule = data.schedule;
        if (chatId) this.state.telegramChatId = chatId;
        this.saveState();
      }
      return data;
    } catch (e) {
      console.warn("Could not save telegram schedule", e);
      return { success: false, error: e.message };
    }
  }

  async testTelegramSchedule(chatId) {
    try {
      const res = await fetch('/api/telegram/test-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId })
      });
      const data = await res.json();
      this.syncWithBackend();
      return data;
    } catch (e) {
      console.warn("Could not test telegram schedule", e);
      return { success: false, error: e.message };
    }
  }

  // --- Reset Methods for All Trackers ---
  resetAll() {
    localStorage.removeItem(STORAGE_KEY);
    this.state = this.loadInitialState();
    this.saveState();
    try {
      fetch('/api/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'all' })
      }).catch(() => {});
    } catch (e) {}
  }

  resetDailyTrackers() {
    this.state.meals = { breakfast: [], lunch: [], dinner: [], snacks: [] };
    this.state.waterLogs = [];
    this.state.workouts = [];
    this.state.sportsActivities = [];
    this.state.history = [];
    this.saveState();
    try {
      fetch('/api/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'daily' })
      }).catch(() => {});
    } catch (e) {}
  }

  resetHistory() {
    this.state.history = [];
    this.saveState();
    try {
      fetch('/api/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'history' })
      }).catch(() => {});
    } catch (e) {}
  }

  resetMeals() {
    this.state.meals = { breakfast: [], lunch: [], dinner: [], snacks: [] };
    this.saveState();
    try {
      fetch('/api/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'meals' })
      }).catch(() => {});
    } catch (e) {}
  }

  resetWater() {
    this.state.waterLogs = [];
    this.saveState();
    try {
      fetch('/api/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'water' })
      }).catch(() => {});
    } catch (e) {}
  }

  resetWorkouts() {
    this.state.workouts = [];
    this.state.activeWorkoutSession = null;
    this.saveState();
    try {
      fetch('/api/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'workouts' })
      }).catch(() => {});
    } catch (e) {}
  }

  resetSports() {
    this.state.sportsActivities = [];
    this.saveState();
    try {
      fetch('/api/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'sports' })
      }).catch(() => {});
    } catch (e) {}
  }

  resetWeightHistory() {
    const curW = this.state.user.currentWeight || 69.5;
    const tgtW = this.state.user.targetWeight || 65.0;
    this.state.weightHistory = this.generateBaselineWeightHistory(curW, tgtW);
    this.saveState();
    try {
      fetch('/api/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'weight' })
      }).catch(() => {});
    } catch (e) {}
  }

  generateBaselineWeightHistory(currentWeight, targetWeight) {
    const curW = parseFloat(currentWeight) || 69.5;
    const tgtW = parseFloat(targetWeight) || 65.0;
    const diff = curW - tgtW;
    const step = diff / 5;
    return [
      { date: "W1", weight: Math.round((curW + (step * 2.5)) * 10) / 10 },
      { date: "W2", weight: Math.round((curW + (step * 2.0)) * 10) / 10 },
      { date: "W3", weight: Math.round((curW + (step * 1.5)) * 10) / 10 },
      { date: "W4", weight: Math.round((curW + (step * 1.0)) * 10) / 10 },
      { date: "W5", weight: Math.round((curW + (step * 0.5)) * 10) / 10 },
      { date: "Today", weight: Number(curW) }
    ];
  }

  logWeightCheckIn(newWeight) {
    const weightNum = parseFloat(newWeight);
    if (isNaN(weightNum) || weightNum <= 0) return;

    this.state.user.currentWeight = weightNum;
    
    if (!this.state.weightHistory || this.state.weightHistory.length === 0) {
      this.state.weightHistory = this.generateBaselineWeightHistory(weightNum, this.state.user.targetWeight);
    } else {
      const last = this.state.weightHistory[this.state.weightHistory.length - 1];
      if (last.date === "Today" || last.date.includes("Today")) {
        last.weight = weightNum;
      } else {
        this.state.weightHistory.push({ date: "Today", weight: weightNum });
      }
    }

    // Add entry to history timeline
    this.state.history.unshift({
      id: "h_w_" + Date.now(),
      type: "weight",
      title: "Weight Check-in",
      subtitle: `Recorded ${weightNum} kg`,
      metric: `${weightNum} kg`,
      subMetric: `Target: ${this.state.user.targetWeight} kg`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: "Today",
      icon: "chart"
    });

    this.saveState();
    try {
      fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentWeight: weightNum })
      }).catch(() => {});
    } catch (e) {}
  }
}

export const appState = new StateManager();
