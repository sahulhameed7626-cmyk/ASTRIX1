// FitSport AI Agent: Stateful LangGraph Orchestration & Tool Execution Engine
import { fitSportTools } from './tools.js';
import { llmService } from '../services/LLMService.js';
import { aiContextService } from '../services/AIContextService.js';
import { voiceService } from '../services/VoiceService.js';
import { recommendationService } from '../services/RecommendationService.js';
import { extractFoodFromText } from '../../data/aiKnowledge.js';
import { MAX_AGENT_STEPS } from './state.js';

export class FitSportAgentGraph {
  constructor(tools = fitSportTools, llm = llmService, context = aiContextService) {
    this.tools = tools;
    this.llm = llm;
    this.context = context;
  }

  /**
   * Run the stateful agent workflow
   */
  async execute({ userId = "user_sahul_hameed", conversationId = null, inputMessage = "", audioBuffer = null, sessionContext = {} }) {
    const session = this.context.getSession(userId, conversationId);
    session.resetStep();
    session.incrementStep(); // Step 1: START

    if (sessionContext && sessionContext.missingInformation) {
      session.missingInformation = sessionContext.missingInformation;
    }
    if (sessionContext && sessionContext.clientState) {
      session.clientState = sessionContext.clientState;
    }
    session.actionStatus = "PROCESSING";

    // 1. STT Phase if audio supplied
    let userText = String(inputMessage || '').trim();
    if (audioBuffer) {
      session.actionStatus = "LISTENING";
      const sttResult = await voiceService.processAudioInput(audioBuffer);
      if (sttResult && sttResult.text) {
        userText = sttResult.text;
      }
    }

    if (!userText) {
      session.actionStatus = "IDLE";
      return {
        success: true,
        conversationId: session.conversationId,
        transcript: "",
        intent: "UNKNOWN",
        response: "I didn't catch that. Tap the microphone or type to log what you ate, drank, or ask about your progress.",
        text: "I didn't catch that. Tap the microphone or type to log what you ate, drank, or ask about your progress.",
        spokenText: "I didn't catch that. Please speak or type your message.",
        audioUrl: null,
        actions: [],
        missingInformation: null,
        error: null
      };
    }

    session.addMessage('user', userText);

    // 2. Intent Detection & Entity Extraction Phase
    session.incrementStep(); // Step 2: understandIntent
    session.actionStatus = "ANALYZING";
    const detection = await this.llm.detectIntentAndEntities(userText, session);
    session.updateIntent(detection.intent);

    const actions = [];
    let replyText = "";
    let spokenText = "";

    // 3. LangGraph Branching & Execution Logic

    // --- Branch A: Follow-up required for missing quantity (Section 10 & 11) ---
    if (detection.action === 'ASK_MISSING_QUANTITY' || detection.needsFollowUp) {
      session.incrementStep();
      const pendingItems = detection.entities?.pendingItems || [
        { foodName: detection.entities?.foodName || 'food', mealType: detection.entities?.mealType || 'lunch' }
      ];
      session.setPendingItems(pendingItems, detection.entities?.mealType || 'lunch');

      replyText = detection.followUpQuestion || `How much ${session.missingInformation.foodName} did you have?`;
      spokenText = replyText;
      session.actionStatus = "WAITING_USER_INPUT";

      session.addMessage('assistant', replyText, { intent: detection.intent, followUp: true });
      return {
        success: true,
        conversationId: session.conversationId,
        transcript: userText,
        intent: detection.intent,
        response: replyText,
        text: replyText,
        spokenText,
        audioUrl: null,
        actions: [],
        missingInformation: session.missingInformation,
        error: null
      };
    }

    // --- Branch B: Resolve previously missing quantity (Section 10 & 11) ---
    if (detection.action === 'RESOLVE_MISSING_QUANTITY') {
      session.incrementStep();
      session.actionStatus = "SEARCHING";
      const ent = detection.entities;
      const nutrition = this.tools.getFoodNutrition(ent.foodName, ent.quantity, ent.unit);

      const grams = nutrition ? nutrition.grams : (ent.unit === 'g' ? ent.quantity : (ent.quantity * 100));
      const calories = nutrition ? nutrition.calories : Math.round(grams * 1.5);
      const protein = nutrition ? nutrition.protein : Math.round(grams * 0.15);
      const carbs = nutrition ? nutrition.carbs : Math.round(grams * 0.2);
      const fat = nutrition ? nutrition.fat : Math.round(grams * 0.05);

      const resolvedItem = {
        foodName: ent.foodName,
        mealType: ent.mealType || 'lunch',
        quantity: ent.quantity,
        unit: ent.unit,
        grams,
        calories,
        protein,
        carbs,
        fat
      };

      const progress = session.resolveCurrentPendingItem(resolvedItem);

      if (progress.hasMore) {
        // More items remaining to clarify (e.g. asked about rice, now ask about chicken)
        replyText = `How much ${progress.nextFood}?`;
        spokenText = `How much ${progress.nextFood}?`;
        session.actionStatus = "WAITING_USER_INPUT";
        session.addMessage('assistant', replyText, { intent: 'ADD_MEAL', followUp: true });

        return {
          success: true,
          conversationId: session.conversationId,
          transcript: userText,
          intent: 'ADD_MEAL',
          response: replyText,
          text: replyText,
          spokenText,
          audioUrl: null,
          actions: [],
          missingInformation: session.missingInformation,
          error: null
        };
      } else {
        // All items clarified! Execute tool and commit all items to database & Common History
        session.actionStatus = "SAVED";
        const allItems = progress.allRecorded;
        const savedItems = [];
        let totalCals = 0;
        let totalProt = 0;

        for (const item of allItems) {
          const added = this.tools.addMeal({
            userId,
            category: item.mealType,
            foodName: item.foodName,
            grams: item.grams,
            calories: item.calories,
            protein: item.protein,
            carbs: item.carbs,
            fat: item.fat
          });
          savedItems.push(added);
          actions.push({ type: "MEAL_CREATED", item: added });
          totalCals += item.calories;
          totalProt += item.protein;
        }

        const mealTypeTitle = (allItems[0]?.mealType || 'lunch');
        const summary = savedItems.map(i => `${i.grams}g of ${i.name}`).join(' and ');
        replyText = `Got it! Recorded ${summary} for your ${mealTypeTitle} (${totalCals} kcal, ${Math.round(totalProt * 10) / 10}g protein). Added to your Common History.`;
        spokenText = `Got it. I've recorded your ${mealTypeTitle}. Added ${totalCals} calories and ${Math.round(totalProt)} grams of protein.`;

        session.clearMissingInfo();
      }
    }

    // --- Branch C: Log Explicit Extracted Meal (Section 9) ---
    else if (detection.intent === 'ADD_MEAL') {
      session.incrementStep();
      session.clearMissingInfo(); // Explicit new meal clears any stale pending queries
      session.actionStatus = "SAVED";
      const ent = detection.entities;
      const targetCat = ent.mealType || 'lunch';
      const savedItems = [];

      for (const item of (ent.foods || [])) {
        const added = this.tools.addMeal({
          userId,
          category: targetCat,
          foodName: item.name,
          grams: item.grams,
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fat: item.fat
        });
        savedItems.push(added);
        actions.push({ type: "MEAL_CREATED", item: added });
      }

      const foodSummary = savedItems.map(i => `${i.grams}g of ${i.name}`).join(' and ');
      replyText = `Got it! Recorded ${foodSummary} for your ${targetCat} (${ent.totalCalories} kcal, ${ent.totalProtein}g protein). Added to your Common History.`;
      spokenText = `Got it. I've recorded ${savedItems.map(i => i.name).join(' and ')} for your ${targetCat}. Added ${ent.totalCalories} calories and ${ent.totalProtein} grams of protein.`;
    }

    // --- Branch D: Water Tracking (Section 4 & 8) ---
    else if (detection.intent === 'ADD_WATER') {
      session.incrementStep();
      session.clearMissingInfo();
      session.actionStatus = "SAVED";
      const amount = detection.entities.amountMl || 250;
      const res = this.tools.addWater({ userId, amountMl: amount });
      actions.push({ type: "WATER_LOGGED", amount, totalMl: res.totalMl });

      const totalL = (res.totalMl / 1000).toFixed(2);
      // Tool result returned directly to agent (Section 8)
      replyText = `Added ${amount} ml of water. You're now at ${totalL} liters today.`;
      spokenText = `Added ${amount} milliliters of water. You're now at ${totalL} liters today.`;
    }

    // --- Branch E: Workout <-> Sport Overlap Analysis (Section 14 & 15) ---
    else if (detection.intent === 'WORKOUT_SPORT_ANALYSIS') {
      session.incrementStep();
      session.actionStatus = "ANALYZING";
      const overlap = this.tools.checkWorkoutSportOverlap({
        userId,
        workoutName: detection.entities.workoutName,
        sportName: detection.entities.sportName
      });
      actions.push({ type: "OVERLAP_CHECKED", data: overlap });

      replyText = overlap.recommendation;
      spokenText = overlap.spokenRecommendation;
    }

    // --- Branch F: Workout Completion (Section 32 TEST C) ---
    else if (detection.intent === 'COMPLETE_WORKOUT') {
      session.incrementStep();
      session.clearMissingInfo();
      session.actionStatus = "SAVED";
      const wkName = detection.entities.workoutName || 'Strength Workout';
      const musclesInfo = this.tools.getMusclesForWorkout(wkName);
      const sessionLog = this.tools.addWorkoutSession({
        userId,
        title: wkName,
        durationMinutes: 45,
        caloriesBurned: 280
      });
      actions.push({
        type: "WORKOUT_COMPLETED",
        data: sessionLog,
        muscles: musclesInfo.primary
      });

      const primaryList = (musclesInfo.primary || []).slice(0, 4).join(', ');
      replyText = `Awesome job! Recorded completion of your ${sessionLog.title}. Muscles stimulated: ${primaryList}. Added to Common History.`;
      spokenText = `Awesome job! Recorded completion of your ${sessionLog.title}. Keep hydrated and recover well!`;
    }

    // --- Branch G: Sport Activity (Section 32 TEST D) ---
    else if (detection.intent === 'ADD_SPORT') {
      session.incrementStep();
      session.clearMissingInfo();
      session.actionStatus = "SAVED";
      const sportLog = this.tools.addSportActivity({
        userId,
        sport: detection.entities.sport,
        durationMinutes: detection.entities.durationMinutes || 60
      });
      actions.push({ type: "SPORT_RECORDED", data: sportLog });

      replyText = `Logged ${sportLog.durationMinutes} minutes of ${sportLog.sport} (~${sportLog.caloriesBurned} kcal burned). Activity recorded in your Common History.`;
      spokenText = `Logged ${sportLog.durationMinutes} minutes of ${sportLog.sport}. Great athletic session!`;
    }

    // --- Branch H: Weight Logging ---
    else if (detection.intent === 'CHECK_WEIGHT') {
      session.incrementStep();
      session.clearMissingInfo();
      const user = this.tools.getUserProfile(userId);
      user.currentWeight = detection.entities.weight;
      this.tools.db.saveStore();

      this.tools.saveCommonHistory({
        type: "weight",
        title: "Weight Updated",
        subtitle: `Current weight recorded as ${user.currentWeight} kg`,
        metric: `${user.currentWeight} kg`,
        subMetric: `Target: ${user.targetWeight} kg`,
        date: "Today",
        icon: "trend"
      });
      actions.push({ type: "WEIGHT_UPDATED", weight: user.currentWeight });

      replyText = `Weight updated to ${user.currentWeight} kg. Your target is ${user.targetWeight} kg (${this.tools.db.getWeightProgressPercent()}% achieved).`;
      spokenText = `Your weight is updated to ${user.currentWeight} kilograms. Keep staying consistent!`;
    }

    // --- Branch I: Daily & Weekly Progress (Section 4 & 13) ---
    else if (detection.intent === 'DAILY_SUMMARY') {
      session.incrementStep();
      session.actionStatus = "ANALYZING";

      const cs = session.clientState;
      const nut = cs?.nutrition?.consumed
        ? {
            totals: cs.nutrition.consumed,
            targets: cs.nutrition.targets,
            percentages: {
              calories: Math.round((cs.nutrition.consumed.calories / (cs.nutrition.targets.calories || 1)) * 100),
              protein: Math.round((cs.nutrition.consumed.protein / (cs.nutrition.targets.protein || 1)) * 100)
            }
          }
        : this.tools.getTodayNutrition(userId);

      const water = cs?.hydration
        ? { totalMl: cs.hydration.consumedMl, targetMl: cs.hydration.targetMl, percent: cs.hydration.percent }
        : this.tools.getWaterIntake(userId);

      const workouts = cs?.activity?.workouts || (this.tools.getTodayWorkout(userId) ? [this.tools.getTodayWorkout(userId)] : []);
      const sports = cs?.activity?.sports || this.tools.getTodaySports(userId) || [];
      const burned = cs?.activity?.burnedCalories ?? this.tools.db.getCaloriesBurnedToday();
      const weight = this.tools.getWeightProgress(userId);
      const user = cs?.athlete || this.tools.getUserProfile(userId);

      const workoutText = workouts.length > 0 ? workouts.map(w => w.title).join(', ') : 'No workouts logged yet';
      const sportText = sports.length > 0 ? sports.map(s => `${s.sport} (${s.durationMinutes} min)`).join(', ') : 'None logged yet';

      replyText = `Here is your Daily Progress Summary, ${user.name.split(' ')[0]}:\n` +
        `• Nutrition: ${nut.totals.calories}/${nut.targets.calories} kcal (${nut.percentages.calories}%) | Protein: ${nut.totals.protein}g/${nut.targets.protein}g (${nut.percentages.protein}%)\n` +
        `• Hydration: ${(water.totalMl / 1000).toFixed(2)}L / ${(water.targetMl / 1000).toFixed(1)}L (${water.percent}%)\n` +
        `• Workout: ${workoutText}\n` +
        `• Sports: ${sportText}\n` +
        `• Caloric Burn: ${burned} kcal\n` +
        `• Weight: Current ${user.currentWeight || weight.current} kg towards target ${user.targetWeight || weight.target} kg.`;

      spokenText = `Here's your summary: You have consumed ${nut.totals.calories} calories and ${nut.totals.protein} grams of protein today. ` +
        `Hydration is at ${(water.totalMl / 1000).toFixed(2)} liters. ` +
        `${workouts.length > 0 ? `Completed ${workouts[0].title}. ` : ''}` +
        `Keep staying consistent!`;

      actions.push({
        type: "DAILY_PROGRESS_RETRIEVED",
        data: { nut, water, workouts, sports, weight, burned }
      });
    } else if (detection.intent === 'CHECK_PROGRESS' && detection.entities?.scope === 'weekly') {
      session.incrementStep();
      session.actionStatus = "ANALYZING";
      const week = recommendationService.generateWeeklyAnalysis(userId);
      replyText = `${week.summary}\n\n• What went well: ${week.whatWentWell}\n• Improvement focus: ${week.whatNeedsImprovement}\n• Recommendation: ${week.suggestedFocus}`;
      spokenText = `In your weekly summary: You completed ${week.workoutsCount} workouts and ${week.sportsCount} sports sessions. Good overall consistency!`;
      actions.push({ type: "WEEKLY_ANALYSIS", data: week });
    }

    // --- Branch J: Query Meals Eaten Today ---
    else if (detection.intent === 'QUERY_MEALS') {
      session.incrementStep();
      session.actionStatus = "ANALYZING";

      if (detection.directAnswer) {
        replyText = detection.directAnswer;
        spokenText = detection.directAnswer;
      } else {
        const cs = session.clientState;
        if (cs && cs.nutrition) {
          const nut = cs.nutrition;
          const meals = nut.allMealsList || [];
          if (meals.length === 0) {
            replyText = `You haven't logged any meals yet today! You have ${nut.remaining.calories} kcal and ${nut.remaining.protein}g protein remaining in your daily budget. Tell me what you eat anytime!`;
            spokenText = `You haven't logged any meals yet today. You have ${nut.remaining.calories} calories remaining.`;
          } else {
            const breakdown = Object.entries(nut.mealsByCategory || {})
              .filter(([_, items]) => items && items.length > 0)
              .map(([cat, items]) => {
                const catCals = items.reduce((s, i) => s + (i.calories || 0), 0);
                const catProt = items.reduce((s, i) => s + (i.protein || 0), 0);
                const itemList = items.map(i => `${i.name} (${i.grams}g, ${i.calories} kcal, ${i.protein}g protein)`).join(', ');
                return `• ${cat.toUpperCase()} (${catCals} kcal, ${Math.round(catProt * 10) / 10}g protein): ${itemList}`;
              }).join('\n');

            replyText = `Here are the meals you've logged today:\n${breakdown}\n\n` +
              `Total Consumed: ${nut.consumed.calories}/${nut.targets.calories} kcal | Protein: ${nut.consumed.protein}g/${nut.targets.protein}g\n` +
              `Remaining Budget: ${nut.remaining.calories} kcal, ${nut.remaining.protein}g protein.`;
            spokenText = `Today you logged ${meals.length} items totaling ${nut.consumed.calories} calories and ${nut.consumed.protein} grams of protein. You have ${nut.remaining.calories} calories left.`;
          }
        } else {
          const mealsStore = this.tools.getMealHistory(userId);
          const nutTotals = this.tools.getTodayNutrition(userId);
          const allItems = [];
          for (const [cat, list] of Object.entries(mealsStore || {})) {
            if (Array.isArray(list)) list.forEach(i => allItems.push({ cat, ...i }));
          }
          if (allItems.length === 0) {
            replyText = `No meals logged yet today! Tell me what you ate (e.g. "I had 2 eggs and toast for breakfast").`;
            spokenText = `No meals logged yet today. Tell me what you ate anytime!`;
          } else {
            const itemsText = allItems.map(i => `${i.name} (${i.grams}g, ${i.calories} kcal)`).join(', ');
            replyText = `Today you logged: ${itemsText}. Total: ${nutTotals.totals.calories} kcal and ${nutTotals.totals.protein}g protein.`;
            spokenText = `You have logged ${allItems.length} items totaling ${nutTotals.totals.calories} calories.`;
          }
        }
      }
      actions.push({ type: "MEALS_QUERIED" });
    }

    // --- Branch K: Query Workouts & Exercise Done Today ---
    else if (detection.intent === 'QUERY_WORKOUTS') {
      session.incrementStep();
      session.actionStatus = "ANALYZING";

      if (detection.directAnswer) {
        replyText = detection.directAnswer;
        spokenText = detection.directAnswer;
      } else {
        const cs = session.clientState;
        const workouts = cs?.activity?.workouts || (this.tools.getTodayWorkout(userId) ? [this.tools.getTodayWorkout(userId)] : []);
        const sports = cs?.activity?.sports || this.tools.getTodaySports(userId) || [];
        const burned = cs?.activity?.burnedCalories ?? this.tools.db.getCaloriesBurnedToday();

        if (workouts.length === 0 && sports.length === 0) {
          replyText = `You haven't logged any workouts or sports yet today. Total active calories burned: ${burned} kcal. Ready to complete a workout session or play a sport?`;
          spokenText = `No workouts or sports logged yet today. Tell me when you finish a workout or play a sport!`;
        } else {
          let details = `Here is your athletic activity for today (Burned: ~${burned} kcal):\n`;
          if (workouts.length > 0) {
            details += `• Workouts:\n` + workouts.map(w => `  - ${w.title} (${w.durationMinutes} min, ~${w.caloriesBurned} kcal burned, muscles: ${(w.muscles || []).join(', ') || 'General'})`).join('\n') + `\n`;
          }
          if (sports.length > 0) {
            details += `• Sports:\n` + sports.map(s => `  - ${s.sport} (${s.durationMinutes} min, ~${s.caloriesBurned} kcal burned)`).join('\n');
          }
          replyText = details.trim();
          spokenText = `Today you logged ${workouts.length} workout and ${sports.length} sport session, burning approximately ${burned} calories. Great work!`;
        }
      }
      actions.push({ type: "WORKOUTS_QUERIED" });
    }

    // --- Branch L: Query Remaining Calories & Macros ---
    else if (detection.intent === 'QUERY_CALORIES_REMAINING') {
      session.incrementStep();
      session.actionStatus = "ANALYZING";

      if (detection.directAnswer) {
        replyText = detection.directAnswer;
        spokenText = detection.directAnswer;
      } else {
        const cs = session.clientState;
        let remainingCals, remainingProt, remainingCarbs, remainingFat, targetCals, consumedCals;

        if (cs && cs.nutrition) {
          remainingCals = cs.nutrition.remaining.calories;
          remainingProt = cs.nutrition.remaining.protein;
          remainingCarbs = cs.nutrition.remaining.carbs;
          remainingFat = cs.nutrition.remaining.fat;
          targetCals = cs.nutrition.targets.calories;
          consumedCals = cs.nutrition.consumed.calories;
        } else {
          const nut = this.tools.getTodayNutrition(userId);
          targetCals = nut.targets.calories;
          consumedCals = nut.totals.calories;
          remainingCals = Math.max(0, targetCals - consumedCals);
          remainingProt = Math.max(0, Math.round((nut.targets.protein - nut.totals.protein) * 10) / 10);
          remainingCarbs = Math.max(0, Math.round((nut.targets.carbs - nut.totals.carbs) * 10) / 10);
          remainingFat = Math.max(0, Math.round((nut.targets.fat - nut.totals.fat) * 10) / 10);
        }

        if (remainingCals > 0) {
          replyText = `Remaining Daily Budget:\n` +
            `• Calories: ${remainingCals} kcal remaining (Consumed: ${consumedCals}/${targetCals} kcal)\n` +
            `• Protein: ${remainingProt}g remaining\n` +
            `• Carbs: ${remainingCarbs || 0}g | Fat: ${remainingFat || 0}g\n\n` +
            `You have plenty of room for a nutritious, high-protein meal to hit your target!`;
          spokenText = `You have ${remainingCals} calories and ${remainingProt} grams of protein remaining today.`;
        } else {
          replyText = `You've achieved your daily calorie goal (${consumedCals}/${targetCals} kcal). ` +
            `If you feel hungry later, prioritize hydration, green salads, or a light zero-calorie beverage.`;
          spokenText = `You have reached your daily calorie target for today. Focus on hydration and recovery!`;
        }
      }
      actions.push({ type: "CALORIES_REMAINING_QUERIED" });
    }

    // --- Branch M: Dietary Advice & Meal Feasibility ---
    else if (detection.intent === 'DIETARY_ADVICE') {
      session.incrementStep();
      session.actionStatus = "ANALYZING";

      if (detection.directAnswer) {
        replyText = detection.directAnswer;
        spokenText = detection.directAnswer;
      } else {
        const cs = session.clientState;
        const remainingCals = cs?.nutrition?.remaining?.calories ?? 650;
        const remainingProt = cs?.nutrition?.remaining?.protein ?? 35;

        // Extract food mentioned
        const foodExt = extractFoodFromText(userText, this.tools.db.nutritionDataset);
        if (foodExt.hasFoods && foodExt.foods.length > 0) {
          const item = foodExt.foods[0];
          const itemCals = foodExt.totalCalories || 350;
          const itemProt = foodExt.totalProtein || 12;

          if (itemCals <= remainingCals) {
            replyText = `Yes, you can have ${item.name}! A standard serving provides ~${itemCals} kcal and ${itemProt}g protein, which fits comfortably within your remaining budget of ${remainingCals} kcal and ${remainingProt}g protein. Enjoy it mindfully!`;
            spokenText = `Yes, you can have ${item.name}. It fits within your remaining ${remainingCals} calories.`;
          } else {
            const excess = itemCals - remainingCals;
            replyText = `A standard serving of ${item.name} (~${itemCals} kcal) exceeds your remaining calorie budget of ${remainingCals} kcal by about ${excess} kcal. Consider having a half portion (~${Math.round(itemCals / 2)} kcal) or pairing it with lean protein to stay on track.`;
            spokenText = `A full serving of ${item.name} exceeds your remaining calories. Consider having a half portion instead.`;
          }
        } else {
          replyText = `You have ${remainingCals} kcal and ${remainingProt}g protein remaining today. ` +
            `For your next meal, I recommend high-protein options like grilled chicken breast, paneer, eggs, or Greek yogurt paired with fibrous vegetables and complex carbs.`;
          spokenText = `You have ${remainingCals} calories and ${remainingProt} grams of protein left. I recommend lean protein with vegetables.`;
        }
      }
      actions.push({ type: "DIETARY_ADVICE_PROVIDED" });
    }

    // --- Branch N: Check Hydration ---
    else if (detection.intent === 'CHECK_HYDRATION') {
      session.incrementStep();
      session.actionStatus = "ANALYZING";

      if (detection.directAnswer) {
        replyText = detection.directAnswer;
        spokenText = detection.directAnswer;
      } else {
        const cs = session.clientState;
        const consumedMl = cs?.hydration?.consumedMl ?? this.tools.getWaterIntake(userId).totalMl;
        const targetMl = cs?.hydration?.targetMl ?? this.tools.getUserProfile(userId).waterGoal ?? 3500;
        const remainingMl = Math.max(0, targetMl - consumedMl);
        const percent = Math.min(100, Math.round((consumedMl / targetMl) * 100));

        replyText = `Hydration Status:\n` +
          `• Total Drank: ${(consumedMl / 1000).toFixed(2)}L / ${(targetMl / 1000).toFixed(1)}L (${percent}% of daily goal)\n` +
          (remainingMl > 0 ? `• Remaining: ${(remainingMl / 1000).toFixed(2)}L left to drink today. Keep sipping water regularly!` : `• Goal achieved! Excellent cellular hydration today!`);
        spokenText = `You have consumed ${(consumedMl / 1000).toFixed(2)} liters of water today, which is ${percent} percent of your daily target.`;
      }
      actions.push({ type: "HYDRATION_CHECKED" });
    }

    // --- Branch O: Nutrition Check ---
    else if (detection.intent === 'CHECK_NUTRITION') {
      session.incrementStep();
      session.actionStatus = "ANALYZING";

      if (detection.directAnswer) {
        replyText = detection.directAnswer;
        spokenText = detection.directAnswer;
      } else {
        const cs = session.clientState;
        if (cs && cs.nutrition) {
          const nut = cs.nutrition;
          const pctCal = Math.round((nut.consumed.calories / (nut.targets.calories || 1)) * 100);
          const pctProt = Math.round((nut.consumed.protein / (nut.targets.protein || 1)) * 100);
          replyText = `Today's Nutrition Breakdown:\n` +
            `• Calories: ${nut.consumed.calories}/${nut.targets.calories} kcal (${pctCal}%)\n` +
            `• Protein: ${nut.consumed.protein}g/${nut.targets.protein}g (${pctProt}%)\n` +
            `• Carbs: ${nut.consumed.carbs}g/${nut.targets.carbs}g\n` +
            `• Fat: ${nut.consumed.fat}g/${nut.targets.fat}g\n` +
            `• Remaining: ${nut.remaining.calories} kcal, ${nut.remaining.protein}g protein`;
          spokenText = `You have consumed ${nut.consumed.calories} calories and ${nut.consumed.protein} grams of protein today.`;
        } else {
          const nut = this.tools.getTodayNutrition(userId);
          replyText = `Today's Nutrition: ${nut.totals.calories}/${nut.targets.calories} kcal (${nut.percentages.calories}%), ` +
            `Protein: ${nut.totals.protein}g/${nut.targets.protein}g (${nut.percentages.protein}%), ` +
            `Carbs: ${nut.totals.carbs}g (${nut.percentages.carbs}%), ` +
            `Fat: ${nut.totals.fat}g (${nut.percentages.fat}%).`;
          spokenText = `You have consumed ${nut.totals.calories} calories and ${nut.totals.protein} grams of protein today.`;
        }
      }
    }

    // --- Branch K: General Fitness Query & Advice (Gemini-Powered) ---
    else {
      session.incrementStep();
      session.actionStatus = "SPEAKING";
      replyText = detection.directAnswer || `I'm your FitSport AI Voice Coach! You can speak naturally to log meals ("I had two idlis and three eggs for breakfast"), track water ("I drank 750ml of water"), log workouts ("I completed my leg workout"), log sports ("I played football for one hour"), check recovery ("Can I play football after leg day?"), or ask "How am I doing today?".`;
      spokenText = detection.directAnswer || `I'm your FitSport Voice Coach. Tell me what you ate, drank, your workouts, or ask how your daily progress is going.`;
    }

    session.addMessage('assistant', replyText, { intent: detection.intent, actions });

    // 4. TTS Phase
    session.actionStatus = "SPEAKING";
    const ttsResult = await voiceService.synthesizeResponse(spokenText);

    return {
      success: true,
      conversationId: session.conversationId,
      transcript: userText,
      intent: detection.intent,
      response: replyText,
      text: replyText,
      spokenText,
      audioUrl: ttsResult.audioUrl || null,
      actions,
      missingInformation: session.missingInformation,
      error: null
    };
  }
}

export const fitSportAgentGraph = new FitSportAgentGraph();
