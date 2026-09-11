import { db } from '../db.js';
import { 
  getMusclesForWorkout, 
  getMusclesForSport, 
  calculateWorkoutSportOverlap, 
  extractFoodFromText 
} from '../data/aiKnowledge.js';
import { SPORTS_DATA, WORKOUT_CATEGORIES } from '../../js/data.js';
import { handleNewAiCoachRoutes } from '../ai/routes/aiRoutes.js';

/**
 * FitSport AI Coach Tool-Using Agent Implementation
 */
export class AIAgent {
  constructor(dbInstance) {
    this.db = dbInstance;
    this.tools = {
      getUserProfile: () => this.getUserProfile(),
      getFitnessGoal: () => this.getFitnessGoal(),
      getTodayNutrition: () => this.getTodayNutrition(),
      getMealHistory: () => this.getMealHistory(),
      addMeal: (params) => this.addMeal(params),
      updateMeal: (params) => this.updateMeal(params),
      getFoodNutrition: (foodName) => this.getFoodNutrition(foodName),
      getTodayWorkout: () => this.getTodayWorkout(),
      getWorkoutDetails: (workoutId) => this.getWorkoutDetails(workoutId),
      getMusclesForWorkout: (workoutName) => getMusclesForWorkout(workoutName),
      getTodaySports: () => this.getTodaySports(),
      getSportDetails: (sportId) => this.getSportDetails(sportId),
      getMusclesForSport: (sportName) => getMusclesForSport(sportName),
      checkWorkoutSportOverlap: (workout, sport) => calculateWorkoutSportOverlap(workout, sport),
      getWaterIntake: () => this.getWaterIntake(),
      getWeightProgress: () => this.getWeightProgress(),
      getDailyProgress: () => this.getDailyProgress(),
      getWeeklyProgress: () => this.getWeeklyProgress(),
      getReminders: () => this.getReminders(),
      scheduleAICheckIn: (params) => this.scheduleAICheckIn(params),
      generateDailySummary: () => this.generateDailySummary(),
      saveAIConversation: (msg) => this.saveAIConversation(msg)
    };
  }

  getUserProfile() {
    return this.db.store.user;
  }

  getFitnessGoal() {
    const user = this.db.store.user;
    return {
      fitnessGoal: user.fitnessGoal,
      calorieGoal: user.calorieGoal,
      proteinGoal: user.proteinGoal,
      waterGoal: user.waterGoal,
      targetWeight: user.targetWeight,
      currentWeight: user.currentWeight
    };
  }

  getTodayNutrition() {
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
        carbs: Math.round((totals.carbs / user.carbsGoal) * 100)
      }
    };
  }

  getMealHistory() {
    return this.db.store.meals;
  }

  addMeal({ category, foodName, grams, calories, protein, carbs, fat }) {
    const catKey = (category || 'lunch').toLowerCase();
    if (!this.db.store.meals[catKey]) {
      this.db.store.meals[catKey] = [];
    }

    const mealItem = {
      id: `m_ai_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name: foodName,
      category: category || "Whole Food",
      grams: parseFloat(grams) || 100,
      calories: Math.round(parseFloat(calories) * 10) / 10,
      protein: Math.round(parseFloat(protein) * 10) / 10,
      carbs: Math.round((parseFloat(carbs) || 0) * 10) / 10,
      fat: Math.round((parseFloat(fat) || 0) * 10) / 10,
      fiber: 2.0,
      iron: 0.5,
      keyVitamin: "Nutrient-Dense"
    };

    this.db.store.meals[catKey].push(mealItem);

    // Sync to unified history
    this.db.store.history.unshift({
      id: `h_${Date.now()}`,
      type: "meals",
      title: `${catKey.charAt(0).toUpperCase() + catKey.slice(1)}: ${mealItem.name}`,
      subtitle: `${mealItem.grams}g • Logged via AI Voice Coach`,
      metric: `${mealItem.calories} kcal`,
      subMetric: `${mealItem.protein}g Protein • Voice Verified`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: "Today",
      icon: "apple"
    });

    this.db.saveStore();
    return mealItem;
  }

  updateMeal(params) {
    return this.addMeal(params);
  }

  getFoodNutrition(foodName) {
    const parsed = extractFoodFromText(foodName, this.db.nutritionDataset);
    return parsed.hasFoods ? parsed.foods[0] : null;
  }

  getTodayWorkout() {
    const workouts = this.db.store.workouts || [];
    return workouts.length > 0 ? workouts[workouts.length - 1] : null;
  }

  getWorkoutDetails(workoutId) {
    return WORKOUT_CATEGORIES.find(w => w.id === workoutId) || WORKOUT_CATEGORIES[0];
  }

  getTodaySports() {
    return this.db.store.sportsActivities || [];
  }

  getSportDetails(sportId) {
    return SPORTS_DATA.find(s => s.id === sportId) || SPORTS_DATA[0];
  }

  getWaterIntake() {
    const totalMl = this.db.getWaterTotal();
    const user = this.db.store.user;
    return {
      totalMl,
      targetMl: user.waterGoal,
      percent: Math.min(100, Math.round((totalMl / user.waterGoal) * 100))
    };
  }

  getWeightProgress() {
    const user = this.db.store.user;
    return {
      current: user.currentWeight,
      target: user.targetWeight,
      start: user.startingWeight,
      progressPercent: this.db.getWeightProgressPercent()
    };
  }

  getDailyProgress() {
    const nut = this.getTodayNutrition();
    const water = this.getWaterIntake();
    const workout = this.getTodayWorkout();
    const burned = this.db.getCaloriesBurnedToday();
    const weight = this.getWeightProgress();

    return {
      nutrition: nut,
      water,
      workoutCompleted: !!workout,
      latestWorkout: workout,
      caloriesBurned: burned,
      weight
    };
  }

  getWeeklyProgress() {
    return this.db.store.weightHistory || [];
  }

  getReminders() {
    return this.db.store.reminders || [];
  }

  scheduleAICheckIn(settings) {
    if (!this.db.store.aiCheckInSettings) {
      this.db.store.aiCheckInSettings = {};
    }
    this.db.store.aiCheckInSettings = {
      ...this.db.store.aiCheckInSettings,
      ...settings
    };
    this.db.saveStore();
    return this.db.store.aiCheckInSettings;
  }

  generateDailySummary() {
    const prog = this.getDailyProgress();
    const user = this.db.store.user;

    return `Today's Athletic Progress for ${user.name}: ` +
      `Nutrition: ${prog.nutrition.totals.calories}/${user.calorieGoal} kcal (${prog.nutrition.percentages.calories}%), ` +
      `Protein: ${prog.nutrition.totals.protein}g/${user.proteinGoal}g (${prog.nutrition.percentages.protein}%), ` +
      `Water: ${prog.water.totalMl}ml/${user.waterGoal}ml (${prog.water.percent}%), ` +
      `Calories Burned: ${prog.caloriesBurned} kcal. ` +
      `Workout: ${prog.workoutCompleted ? prog.latestWorkout.title : 'Rest/Active Recovery'}.`;
  }

  saveAIConversation(msg) {
    if (!this.db.store.aiConversations) {
      this.db.store.aiConversations = [];
    }
    this.db.store.aiConversations.push({
      id: `conv_${Date.now()}`,
      ...msg,
      timestamp: new Date().toISOString()
    });
    // Keep max 50 recent messages
    if (this.db.store.aiConversations.length > 50) {
      this.db.store.aiConversations = this.db.store.aiConversations.slice(-50);
    }
    this.db.saveStore();
  }

  /**
   * Main Agent Execution Loop
   */
  async processUserMessage(userMessage, sessionContext = {}) {
    const cleanMsg = String(userMessage || "").trim();
    const lower = cleanMsg.toLowerCase();

    // 1. MEAL LOGGING INTENT (Extract foods & quantities)
    const foodExtraction = extractFoodFromText(cleanMsg, this.db.nutritionDataset);

    // Affirmation / confirmation for pending meal in context
    if (sessionContext.pendingMeal && (lower.includes("yes") || lower.includes("save") || lower.includes("log") || lower.includes("confirm") || lower.includes("ok") || lower.includes("sure"))) {
      const pm = sessionContext.pendingMeal;
      const targetCategory = pm.mealType || pm.category || "lunch";
      const savedItems = [];
      const foodsList = Array.isArray(pm.foods) ? pm.foods : (pm.items || (pm.foodName ? [{ name: pm.foodName, grams: pm.grams || 100, calories: pm.calories || 150, protein: pm.protein || 10, carbs: pm.carbs || 15, fat: pm.fat || 4 }] : []));
      
      for (const item of foodsList) {
        const added = this.addMeal({
          category: targetCategory,
          foodName: item.name,
          grams: item.grams,
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fat: item.fat
        });
        savedItems.push(added);
      }

      const reply = `Done! Successfully confirmed and logged ${savedItems.map(i => i.name).join(' and ')} for your ${targetCategory}.`;
      return {
        intent: "DATA_COLLECTION",
        action: "MEAL_SAVED",
        text: reply,
        spokenText: reply,
        data: {
          category: targetCategory,
          foods: savedItems,
          mealData: { items: savedItems }
        },
        sessionContext: {}
      };
    }

    // Multi-turn context handling: if user previously mentioned a food and is now replying with quantity
    if (sessionContext.pendingMeal && sessionContext.pendingMeal.foodName && !foodExtraction.hasFoods) {
      // Check if user replied with quantity (e.g. "one cup", "150 grams", "2 pieces")
      const qtyMatch = cleanMsg.match(/(\d+(?:\.\d+)?)\s*(grams?|g|ml|cups?|pieces?|pcs?|bowls?|slices?)?/i);
      if (qtyMatch) {
        const qty = parseFloat(qtyMatch[1]) || 1;
        const unit = qtyMatch[2] || 'pieces';
        const foodName = sessionContext.pendingMeal.foodName;
        const baseGrams = unit.toLowerCase().startsWith('g') ? qty : (qty * 50);

        const added = this.addMeal({
          category: sessionContext.pendingMeal.mealType || 'lunch',
          foodName,
          grams: baseGrams,
          calories: Math.round(baseGrams * 1.5),
          protein: Math.round(baseGrams * 0.15),
          carbs: Math.round(baseGrams * 0.2),
          fat: Math.round(baseGrams * 0.05)
        });

        const reply = `Perfect. I've recorded ${qty} ${unit} of ${foodName} (${added.calories} kcal, ${added.protein}g protein) for your ${sessionContext.pendingMeal.mealType || 'lunch'}.`;
        return {
          intent: "DATA_COLLECTION",
          action: "MEAL_SAVED",
          text: reply,
          spokenText: reply,
          data: { mealItem: added, mealData: { items: [added] }, category: sessionContext.pendingMeal.mealType || 'lunch' },
          sessionContext: {} // Clear context
        };
      }
    }

    if (foodExtraction.hasFoods) {
      const targetCategory = sessionContext.targetMealType || foodExtraction.mealType;
      const savedItems = [];

      for (const item of foodExtraction.foods) {
        const added = this.addMeal({
          category: targetCategory,
          foodName: item.name,
          grams: item.grams,
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fat: item.fat
        });
        savedItems.push(added);
      }

      const foodSummary = savedItems.map(i => `${i.grams}g of ${i.name}`).join(' and ');
      const textReply = `Got it! I've recorded ${foodSummary} for your ${targetCategory} (${foodExtraction.totalCalories} kcal, ${foodExtraction.totalProtein}g protein).`;
      const spokenReply = `Got it. I've recorded ${savedItems.map(i => i.name).join(' and ')} for your ${targetCategory}. Added ${foodExtraction.totalCalories} calories and ${foodExtraction.totalProtein} grams of protein.`;

      return {
        intent: "DATA_COLLECTION",
        action: "MEAL_SAVED",
        text: textReply,
        spokenText: spokenReply,
        data: {
          category: targetCategory,
          foods: savedItems,
          mealData: {
            items: savedItems,
            totalCalories: foodExtraction.totalCalories,
            totalProtein: foodExtraction.totalProtein
          },
          totalCalories: foodExtraction.totalCalories,
          totalProtein: foodExtraction.totalProtein
        },
        sessionContext: {}
      };
    }

    // 2. WATER LOGGING INTENT (e.g. "I drank 500ml water", "drank 2 glasses of water", "1 liter water")
    const waterMatch = cleanMsg.match(/(?:drank|drink|had|log|consumed|taken)?\s*(\d+(?:\.\d+)?)\s*(ml|litres?|liters?|l|glasses?|cups?)\s*(?:of\s+)?water/i)
      || cleanMsg.match(/water\s*(\d+(?:\.\d+)?)\s*(ml|litres?|liters?|l|glasses?|cups?)/i);

    if (waterMatch || (lower.includes("water") && (lower.includes("drank") || lower.includes("glass") || lower.includes("bottle") || lower.includes("litre") || lower.includes("liter") || lower.includes("ml")))) {
      let amountMl = 250;
      if (waterMatch) {
        const qty = parseFloat(waterMatch[1]) || 1;
        const unit = (waterMatch[2] || 'ml').toLowerCase();
        if (unit.startsWith('l')) {
          amountMl = Math.round(qty * 1000);
        } else if (unit.startsWith('glass') || unit.startsWith('cup')) {
          amountMl = Math.round(qty * 250);
        } else {
          amountMl = Math.round(qty);
        }
      } else {
        const numMatch = cleanMsg.match(/(\d+)/);
        if (numMatch) amountMl = parseInt(numMatch[1], 10);
      }

      if (!this.db.store.waterLogs) this.db.store.waterLogs = [];
      if (!this.db.store.history) this.db.store.history = [];

      this.db.store.waterLogs.push({
        id: `w_${Date.now()}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        amount: amountMl
      });

      this.db.store.history.unshift({
        id: `h_${Date.now()}`,
        type: "water",
        title: "Hydration Check-in",
        subtitle: `Logged +${amountMl} ml fluid intake via AI Coach`,
        metric: `+${amountMl} ml`,
        subMetric: `Total today: ${(this.db.getWaterTotal() / 1000).toFixed(2)} L`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: "Today",
        icon: "droplet"
      });

      this.db.saveStore();

      const totalL = (this.db.getWaterTotal() / 1000).toFixed(2);
      const text = `Hydration logged! Added ${amountMl}ml of water to your common history. Total intake today: ${totalL}L.`;
      const spoken = `Hydration logged. Added ${amountMl} milliliters of water.`;

      return {
        intent: "DATA_COLLECTION",
        action: "WATER_SAVED",
        text,
        spokenText: spoken,
        data: { amount: amountMl, totalWaterMl: this.db.getWaterTotal() },
        sessionContext: {}
      };
    }

    // 3. WORKOUT <-> SPORT OVERLAP INTENT (e.g. "I did legs and want to play football")
    const sportsKeywords = ["football", "cycling", "running", "badminton", "cricket", "basketball", "swimming", "tennis", "volleyball"];
    const workoutKeywords = ["leg", "legs", "squat", "chest", "pushup", "push-up", "back", "pullup", "shoulder", "arm", "core", "workout"];

    const detectedSport = sportsKeywords.find(s => lower.includes(s));
    const detectedWorkout = workoutKeywords.find(w => lower.includes(w));

    if (detectedSport && (detectedWorkout || lower.includes("workout") || lower.includes("train"))) {
      const workoutTarget = detectedWorkout || (this.getTodayWorkout()?.title || "Leg Workout");
      const overlapAnalysis = calculateWorkoutSportOverlap(workoutTarget, detectedSport);

      return {
        intent: "ANALYSIS_RECOMMENDATION",
        action: "OVERLAP_ANALYSIS",
        text: overlapAnalysis.recommendation,
        spokenText: overlapAnalysis.spokenRecommendation,
        data: overlapAnalysis
      };
    }

    // 3. POST-WORKOUT FOLLOW-UP INTENT (e.g., "I finished my workout", "legs feel tired")
    if (lower.includes("finished workout") || lower.includes("completed workout") || lower.includes("workout done") || lower.includes("tired") || lower.includes("sore")) {
      const todayWk = this.getTodayWorkout();
      const workoutName = todayWk ? todayWk.title : "workout";
      const userPlannedSport = this.db.store.user.interestedSports?.[0] || "Cycling";

      let text = `Great effort completing your ${workoutName}! `;
      let spoken = `Great effort completing your ${workoutName}! `;

      if (lower.includes("tired") || lower.includes("sore") || lower.includes("fatigue")) {
        text += `Since you're experiencing muscular fatigue, prioritize cellular hydration and active lower-body flushing. If you have ${userPlannedSport} scheduled later, keep the intensity light.`;
        spoken += `Since your muscles feel fatigued, focus on hydration and keeping any upcoming sport sessions at lower intensity.`;
      } else {
        text += `Musculoskeletal kinetic load was logged. Drink at least 500ml of water and consume 25-30g of protein within the next 45 minutes for optimal recovery.`;
        spoken += `Your workout load was logged. Remember to hydrate and get some protein for recovery.`;
      }

      return {
        intent: "RECOMMENDATION",
        action: "POST_WORKOUT_CHECK",
        text,
        spokenText: spoken,
        data: { workoutName }
      };
    }

    // 4. DAILY PROGRESS & MOTIVATION INTENT (e.g., "how is my progress", "daily review", "motivation")
    if (lower.includes("progress") || lower.includes("motivation") || lower.includes("review") || lower.includes("summary") || lower.includes("how am i doing")) {
      const prog = this.getDailyProgress();
      const pNut = prog.nutrition.percentages.protein;
      const wPct = prog.water.percent;
      const cPct = prog.nutrition.percentages.calories;
      const wkDone = prog.workoutCompleted;

      let motivation = "";
      let spokenMotivation = "";

      if (pNut >= 80 && wPct >= 70) {
        motivation = `Outstanding discipline today! You're at ${pNut}% of your protein target (${prog.nutrition.totals.protein}g) and ${wPct}% of your hydration goal. ` +
          `${wkDone ? `Your ${prog.latestWorkout.title} was logged with excellence.` : `Stay focused on maintaining this athletic foundation.`} You are well on track toward your target weight of ${prog.weight.target}kg.`;
        spokenMotivation = `Outstanding discipline today! You're at ${pNut} percent of your protein target and ${wPct} percent of your water goal. Keep up the high standard!`;
      } else if (pNut >= 70 && wPct < 60) {
        motivation = `Solid effort! You've achieved ${pNut}% of your daily protein, but your hydration is currently at ${wPct}% (${prog.water.totalMl}ml). ` +
          `Prioritize fluid intake this evening to support muscle recovery and kinetic performance.`;
        spokenMotivation = `Solid effort! Your protein is strong at ${pNut} percent, but water is at ${wPct} percent. Focus on hydration for the rest of the day.`;
      } else {
        motivation = `Keep pushing! You've consumed ${prog.nutrition.totals.calories} kcal (${cPct}%) with ${prog.nutrition.totals.protein}g of protein. ` +
          `Your total calories burned today is ${prog.caloriesBurned} kcal. Every clean meal and structured habit brings you closer to your athletic goals.`;
        spokenMotivation = `Keep pushing! You've logged ${prog.nutrition.totals.protein} grams of protein and burned ${prog.caloriesBurned} calories today. Stay focused on your goals!`;
      }

      return {
        intent: "MOTIVATION",
        action: "DAILY_PROGRESS_MOTIVATION",
        text: motivation,
        spokenText: spokenMotivation,
        data: prog
      };
    }

    // 5. DEFAULT HELPFUL FALLBACK
    const defaultResponse = `I'm your FitSport Voice Coach! You can tell me what you had to eat (like "I had 2 idlis and 2 eggs"), ` +
      `ask for a workout-sport overlap check (like "I did legs and want to play football tonight"), or ask "How is my progress today?".`;

    return {
      intent: "CONVERSATION",
      action: "GENERAL_QUERY",
      text: defaultResponse,
      spokenText: "I'm your FitSport Voice Coach. Tell me what you ate, check your workout and sport recovery, or ask about your daily progress.",
      data: {}
    };
  }
}

/**
 * HTTP Route Handler for AI Coach API
 */
export async function handleAiCoachRoutes(req, res, url, body = {}) {
  if (await handleNewAiCoachRoutes(req, res, url, body)) {
    return true;
  }
  const agent = new AIAgent(db);

  // POST /api/ai/chat
  if (url.pathname === '/api/ai/chat' && req.method === 'POST') {
    const message = body.message || body.text || body.query || '';
    const sessionContext = body.sessionContext || body.context || {};
    try {
      const response = await agent.processUserMessage(message, sessionContext);
      // Save conversation log
      agent.saveAIConversation({
        userMessage: message,
        agentResponse: response.text,
        action: response.action
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(response));
      return true;
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
      return true;
    }
  }

  // GET /api/ai/settings
  if (url.pathname === '/api/ai/settings' && req.method === 'GET') {
    const settings = db.store.aiCheckInSettings || {
      enabled: true,
      voiceEnabled: true,
      checkIns: {
        breakfast: { enabled: true, time: "08:30 AM" },
        lunch: { enabled: true, time: "01:00 PM" },
        snack: { enabled: true, time: "05:00 PM" },
        dinner: { enabled: true, time: "08:30 PM" }
      },
      workoutFollowUp: true,
      sportRecoveryCheck: true,
      dailyProgressReview: { enabled: true, time: "09:00 PM" },
      preferredVoice: "default"
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ settings }));
  }

  // PUT /api/ai/settings
  if (url.pathname === '/api/ai/settings' && (req.method === 'PUT' || req.method === 'POST')) {
    const updated = agent.scheduleAICheckIn(body);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      message: "AI Coach settings updated successfully",
      settings: updated
    }));
  }

  // GET /api/ai/conversations
  if (url.pathname === '/api/ai/conversations' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      conversations: db.store.aiConversations || []
    }));
  }

  // POST /api/ai/overlap (Dynamic comparison of any workout & sport)
  if (url.pathname === '/api/ai/overlap' && req.method === 'POST') {
    const { workout, sport } = body;
    const result = calculateWorkoutSportOverlap(workout, sport);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(result));
  }

  // GET /api/ai/insight (Used for WhatsApp & Daily Review)
  if (url.pathname === '/api/ai/insight' && req.method === 'GET') {
    const prog = agent.getDailyProgress();
    let insight = `Great athletic discipline today. `;
    if (prog.workoutCompleted) {
      insight += `You completed your ${prog.latestWorkout.title}. `;
    }
    insight += `Protein intake is at ${prog.nutrition.percentages.protein}% and hydration at ${prog.water.percent}%. `;
    if (prog.water.percent < 70) {
      insight += `Prioritize evening hydration to support cellular repair.`;
    } else {
      insight += `Optimal recovery conditions achieved. Keep building momentum!`;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ insight, metrics: prog }));
  }

  return false;
}
