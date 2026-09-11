// FitSport LLM Service Abstraction (Google Gemini 3.6 Flash + Ollama + Resilient Heuristic Engine)
import http from 'http';
import { AI_COACH_SYSTEM_PROMPT, INTENT_DEFINITIONS } from '../agent/prompts.js';
import { extractFoodFromText } from '../../data/aiKnowledge.js';
import { db } from '../../db.js';

export class LLMService {
  constructor(config = {}) {
    this.geminiApiKey = process.env.GEMINI_API_KEY || config.geminiApiKey || '';
    this.geminiModel = process.env.GEMINI_MODEL || config.geminiModel || 'gemini-3.6-flash';
    this.baseUrl = process.env.OLLAMA_BASE_URL || config.baseUrl || 'http://localhost:11434';
    this.model = process.env.OLLAMA_MODEL || config.model || 'llama3';
    this.timeout = parseInt(process.env.AI_REQUEST_TIMEOUT, 10) || 12000;
  }

  /**
   * Invoke Google Gemini REST API (with automatic fallback models on demand spikes)
   */
  async callGemini(prompt, isJson = true) {
    if (!this.geminiApiKey) return null;
    const modelsToTry = [this.geminiModel, 'gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];

    for (const modelName of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${this.geminiApiKey}`;
        const payload = {
          contents: [{ parts: [{ text: prompt }] }]
        };
        if (isJson) {
          payload.generationConfig = { responseMimeType: "application/json" };
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          const candidate = data.candidates?.[0];
          const part = candidate?.content?.parts?.[0];
          if (part?.text) return part.text.trim();
        } else if (res.status === 503 || res.status === 404 || res.status === 429) {
          console.warn(`[FitSport Gemini] Model ${modelName} returned ${res.status}, trying fallback model...`);
          continue;
        }
      } catch (e) {
        console.warn(`[FitSport Gemini] Model ${modelName} failed:`, e.message);
      }
    }
    return null;
  }

  /**
   * Gemini-Powered Intent Detection & Deep Entity Extraction
   */
  async detectWithGemini(clean, sessionContext = {}) {
    if (!this.geminiApiKey) return null;

    const clientState = sessionContext?.clientState || null;
    const userProfile = clientState?.athlete || db.store?.user || {};
    const nut = clientState?.nutrition || null;
    const activity = clientState?.activity || null;
    const hydration = clientState?.hydration || null;
    const missing = sessionContext?.missingInformation;

    let athleteContext = `Current Athlete Profile:
- Name: ${userProfile.name || 'Athlete'}
- Goal: ${userProfile.fitnessGoal || 'Athletic Performance & Fitness'}
- Calorie Goal: ${userProfile.calorieGoal || 2200} kcal | Protein Goal: ${userProfile.proteinGoal || 130}g | Water Goal: ${userProfile.waterGoal || 3500}ml`;

    if (nut) {
      athleteContext += `\n\nToday's Live Nutrition Status:
- Consumed: ${nut.consumed.calories} kcal, ${nut.consumed.protein}g protein, ${nut.consumed.carbs}g carbs, ${nut.consumed.fat}g fat
- Remaining Budget: ${nut.remaining.calories} kcal, ${nut.remaining.protein}g protein, ${nut.remaining.carbs}g carbs, ${nut.remaining.fat}g fat
- Meals Eaten Today:
${nut.allMealsList && nut.allMealsList.length > 0
  ? nut.allMealsList.map(m => `  * [${m.meal.toUpperCase()}] ${m.name} (${m.grams}g, ${m.calories} kcal, ${m.protein}g protein)`).join('\n')
  : '  * None logged yet today'}`;
    }

    if (activity) {
      athleteContext += `\n\nToday's Live Activity Status:
- Active Calories Burned: ${activity.burnedCalories} kcal
- Completed Workouts Today:
${activity.workouts && activity.workouts.length > 0
  ? activity.workouts.map(w => `  * ${w.title} (${w.durationMinutes} min, ~${w.caloriesBurned} kcal burned, muscles: ${(w.muscles || []).join(', ') || 'General'})`).join('\n')
  : '  * None logged yet today'}
- Sports Played Today:
${activity.sports && activity.sports.length > 0
  ? activity.sports.map(s => `  * ${s.sport} (${s.durationMinutes} min, ~${s.caloriesBurned} kcal burned)`).join('\n')
  : '  * None played yet today'}`;
    }

    if (hydration) {
      athleteContext += `\n\nToday's Live Hydration Status:
- Water Drank: ${hydration.consumedMl} ml / ${hydration.targetMl} ml (${hydration.percent}%)
- Remaining Water to Drink: ${hydration.remainingMl} ml`;
    }

    const prompt = `You are FitSport AI Coach, an expert sports performance and clinical nutrition AI assistant.
${athleteContext}

User utterance: "${clean}"
${missing ? `Pending Context: Athlete was previously asked for the quantity of "${missing.foodName}" in ${missing.mealType}.` : ''}

Classify into exactly ONE of the following intents and return strict JSON:
1. "ADD_MEAL": User is logging food/meal consumed (e.g. "I had 2 boiled eggs and toast").
   Extract:
   - mealType: "breakfast" | "lunch" | "snack" | "dinner"
   - items: array of { "name": string, "quantity": number, "unit": string, "estimatedGrams": number, "calories": number, "protein": number }
   - If user mentioned a food without quantity (e.g. "I had rice") and is NOT answering a pending question, set needsFollowUp: true, followUpQuestion: "How much [food] did you have?".
2. "QUERY_MEALS": User is asking what they ate, what meals they logged today, or their food intake (e.g. "What did I eat today?", "Show my meals").
   Extract:
   - directAnswer: Formulate an exact, conversational reply listing every meal and food eaten today and total calories & protein consumed using the live nutrition data above.
3. "QUERY_WORKOUTS": User is asking what workouts or sports they did today (e.g. "What workouts did I do today?", "Did I exercise today?").
   Extract:
   - directAnswer: Formulate an exact, conversational reply listing every workout and sport completed today with duration and calories burned using the live activity data above.
4. "QUERY_CALORIES_REMAINING": User is asking how many calories or protein they have left for the day (e.g. "How many calories do I have left?", "Remaining protein?").
   Extract:
   - directAnswer: State the exact remaining calories and protein from the live data above, and provide a helpful tip on what to eat to hit their target.
5. "DIETARY_ADVICE": User is asking if they can eat/drink something or asking for meal recommendations (e.g. "Can I eat a chicken burger?", "Can I have pizza tonight?", "What should I eat for dinner?").
   Extract:
   - directAnswer: Compare the estimated calories and protein of the requested food/meal against their remaining calorie and protein budget. If it fits, enthusiastically approve and specify a healthy portion. If it exceeds, suggest a smart portion or healthier alternative.
6. "CHECK_HYDRATION": User is asking about their water intake or hydration (e.g. "How is my hydration?", "Did I drink enough water?").
   Extract:
   - directAnswer: State water drank today vs target and remaining water to drink.
7. "CHECK_NUTRITION": User asks how much calories or protein they consumed today.
   Extract:
   - directAnswer: State consumed calories, protein, carbs, and fat vs daily targets.
8. "ADD_WATER": User drank water (e.g. "drank 750ml water", "2 glasses").
   Extract:
   - amountMl: number (e.g. 750, 500)
9. "COMPLETE_WORKOUT": User completed a gym/workout session (e.g. "finished my leg workout", "completed chest and back").
   Extract:
   - workoutName: string (e.g. "Leg Workout", "Chest Workout", "HIIT Workout")
10. "ADD_SPORT": User played a sport, ran, or cycled (e.g. "played football for 1 hour", "ran for 45 mins").
    Extract:
    - sport: string (e.g. "Football", "Cricket", "Badminton", "Running", "Cycling")
    - durationMinutes: number (e.g. 60)
11. "WORKOUT_SPORT_ANALYSIS": Checking overlap, fatigue, or recovery between a workout and sport (e.g. "Can I play football after leg day?").
    Extract:
    - workoutName: string
    - sportName: string
12. "CHECK_WEIGHT": User logged or asked about weight (e.g. "My weight is 70.5kg").
    Extract:
    - weight: number
13. "DAILY_SUMMARY": User asks for today's summary, review, or "how am I doing today?".
14. "CHECK_PROGRESS": User asks for weekly progress or overall review.
    Extract:
    - scope: "weekly" | "overall"
15. "GENERAL_FITNESS_QUESTION": Question about nutrition, exercise, recovery, biomechanics, or friendly greeting.
    Extract:
    - directAnswer: string (Concise, motivating, scientifically accurate answer, 2-3 sentences max).

Return JSON only conforming to:
{
  "intent": string,
  "action": string,
  "entities": object,
  "needsFollowUp": boolean,
  "followUpQuestion": string or null,
  "directAnswer": string or null
}`;

    try {
      const jsonStr = await this.callGemini(prompt, true);
      if (!jsonStr) return null;
      const parsed = JSON.parse(jsonStr);

      if (!parsed || !parsed.intent) return null;

      // Normalize Meal logging with FitSport database integration
      if (parsed.intent === 'ADD_MEAL') {
        if (parsed.needsFollowUp) {
          const foodName = parsed.entities?.items?.[0]?.name || parsed.entities?.foodName || 'food';
          return {
            intent: 'ADD_MEAL',
            action: 'ASK_MISSING_QUANTITY',
            entities: {
              foodName: foodName.toLowerCase(),
              mealType: parsed.entities?.mealType || 'lunch',
              pendingItems: [{ foodName: foodName.toLowerCase(), mealType: parsed.entities?.mealType || 'lunch' }]
            },
            needsFollowUp: true,
            followUpQuestion: parsed.followUpQuestion || `How much ${foodName} did you have?`
          };
        }

        let totalCalories = 0;
        let totalProtein = 0;
        const foods = (parsed.entities?.items || []).map(item => {
          const itemName = String(item.name || '').toLowerCase();
          const localMatch = (db.nutritionDataset || []).find(n => n.name.toLowerCase() === itemName)
            || (db.nutritionDataset || []).find(n => itemName.split(/\s+/).includes(n.name.toLowerCase()))
            || (db.nutritionDataset || []).find(n => n.name.toLowerCase().split(/\s+/).includes(itemName))
            || (db.nutritionDataset || []).find(n => {
              const nLower = String(n.name || '').toLowerCase();
              return nLower.includes(itemName) || itemName.includes(nLower);
            });

          const grams = item.estimatedGrams || (item.unit === 'g' || item.unit === 'grams' ? item.quantity : (localMatch?.servingGrams || 100));
          const cals = item.calories || (localMatch ? Math.round(localMatch.calories * (grams / 100)) : 160);
          const prot = item.protein !== undefined ? item.protein : (localMatch ? Math.round(localMatch.protein * (grams / 100) * 10) / 10 : 6);
          totalCalories += cals;
          totalProtein += prot;
          return {
            name: localMatch ? localMatch.name : (item.name.charAt(0).toUpperCase() + item.name.slice(1)),
            quantity: `${item.quantity} ${item.unit || 'serving'}`.trim(),
            grams: Math.round(grams),
            calories: Math.round(cals),
            protein: Math.round(prot * 10) / 10
          };
        });

        if (foods.length > 0) {
          return {
            intent: 'ADD_MEAL',
            action: 'LOG_EXTRACTED_MEAL',
            entities: {
              mealType: parsed.entities?.mealType || 'lunch',
              foods,
              totalCalories: Math.round(totalCalories),
              totalProtein: Math.round(totalProtein * 10) / 10
            },
            needsFollowUp: false
          };
        }
      }

      // Normalize Water logging
      if (parsed.intent === 'ADD_WATER') {
        return {
          intent: 'ADD_WATER',
          entities: {
            amountMl: parsed.entities?.amountMl || 250
          },
          needsFollowUp: false
        };
      }

      // Normalize Workout
      if (parsed.intent === 'COMPLETE_WORKOUT') {
        let wkName = parsed.entities?.workoutName || 'Leg Workout';
        if (!wkName.toLowerCase().includes('workout')) wkName += ' Workout';
        return {
          intent: 'COMPLETE_WORKOUT',
          entities: { workoutName: wkName },
          needsFollowUp: false
        };
      }

      // Normalize Sport
      if (parsed.intent === 'ADD_SPORT') {
        return {
          intent: 'ADD_SPORT',
          entities: {
            sport: parsed.entities?.sport || 'Football',
            durationMinutes: parsed.entities?.durationMinutes || 60
          },
          needsFollowUp: false
        };
      }

      // Normalize Overlap
      if (parsed.intent === 'WORKOUT_SPORT_ANALYSIS') {
        return {
          intent: 'WORKOUT_SPORT_ANALYSIS',
          entities: {
            workoutName: parsed.entities?.workoutName || 'Leg Workout',
            sportName: parsed.entities?.sportName || 'Football'
          },
          directAnswer: parsed.directAnswer || null,
          needsFollowUp: false
        };
      }

      return {
        intent: parsed.intent,
        action: parsed.action || 'DEFAULT',
        entities: parsed.entities || {},
        needsFollowUp: parsed.needsFollowUp || false,
        followUpQuestion: parsed.followUpQuestion || null,
        directAnswer: parsed.directAnswer || null
      };

    } catch (e) {
      console.warn("[FitSport Gemini] Detection fallback triggered:", e.message);
      return null;
    }
  }

  /**
   * Determine intent and extract entities (Gemini with Resilient Local Heuristic Fallback)
   */
  async detectIntentAndEntities(userMessage, sessionContext = {}) {
    const clean = String(userMessage || '').trim();
    const lower = clean.toLowerCase();

    // Helper: parse standalone quantity response (e.g. "One cup.", "150 grams.", "2 bowls", "2 pieces")
    const parseQuantity = (text) => {
      const qClean = String(text || '').trim();
      const numWords = { a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, half: 0.5, quarter: 0.25 };
      const qtyMatch = qClean.match(/(\d+(?:\.\d+)?)\s*(grams?|g|ml|cups?|pieces?|pcs?|bowls?|slices?|rotis?|eggs?|bananas?|servings?)?/i)
        || qClean.match(/\b(a|an|one|two|three|four|five|six|seven|eight|nine|ten|half|quarter)\s*(grams?|g|ml|cups?|pieces?|pcs?|bowls?|slices?|rotis?|servings?)?\b/i);

      if (qtyMatch) {
        let qty = 1;
        const wordKey = qtyMatch[1]?.toLowerCase();
        if (numWords[wordKey] !== undefined) {
          qty = numWords[wordKey];
        } else {
          qty = parseFloat(qtyMatch[1]) || 1;
        }
        const unit = (qtyMatch[2] || 'serving').toLowerCase();
        return { quantity: qty, unit };
      }
      return null;
    };

    // Fast Check: If user is answering a pending follow-up question (e.g. "One cup", "150 grams")
    const wordsCount = clean.split(/\s+/).length;
    const isExplicitNewCommand = /^(i\s+(drank|drink|had|ate|completed|played|did)|log|how\s+am\s+i)/i.test(clean);

    if (sessionContext.missingInformation && wordsCount <= 5 && !isExplicitNewCommand) {
      const parsedQty = parseQuantity(clean);
      if (parsedQty) {
        const missing = sessionContext.missingInformation;
        return {
          intent: 'ADD_MEAL',
          action: 'RESOLVE_MISSING_QUANTITY',
          entities: {
            foodName: missing.foodName,
            mealType: missing.mealType || 'lunch',
            quantity: parsedQty.quantity,
            unit: parsedQty.unit
          },
          needsFollowUp: false
        };
      }
    }

    // 1. PRIMARY ENGINE: Google Gemini 3.6 Flash
    if (this.geminiApiKey) {
      try {
        const geminiDetection = await this.detectWithGemini(clean, sessionContext);
        if (geminiDetection && geminiDetection.intent) {
          console.log(`[FitSport LLM] Gemini 3.6 Flash detected intent: ${geminiDetection.intent}`);
          return geminiDetection;
        }
      } catch (err) {
        console.warn("[FitSport LLM] Gemini fallback to heuristic engine:", err.message);
      }
    }

    // 2. RESILIENT LOCAL HEURISTIC FALLBACK ENGINE (Offline / Zero-Downtime Guarantee)
    // Dietary Feasibility & Recommendation Query (e.g. "Can I eat pizza tonight?", "What should I have for dinner?")
    const isDietaryAdvice = /(?:can|should|could|may)\s+i\s+(?:eat|have|drink|consume|take|grab|order)|(?:what|suggest|recommend)\s+(?:should|can|could)?\s*i\s+(?:eat|have|cook)\s+for\s+(?:dinner|lunch|breakfast|snack)|(?:recommend|suggest)\s+(?:a\s+)?(?:meal|snack|dinner|lunch)/i.test(clean);
    if (isDietaryAdvice) {
      return {
        intent: 'DIETARY_ADVICE',
        entities: { query: clean },
        needsFollowUp: false
      };
    }

    // Meal Query Intent (e.g. "What did I eat today?", "Show my meals", "What did I have for breakfast?")
    const isQueryMeals = /(?:what\s+(?:did\s+i|have\s+i|meals?\s+did\s+i)\s+(?:eat|have|log|consume)|what\s+(?:did\s+i\s+have|i\s+ate)|what\s+are\s+my\s+meals|list\s+(?:my\s+)?(?:meals|food)|show\s+(?:my\s+)?(?:meals|food)|my\s+meals|food\s+log|what\s+food\s+did\s+i)/i.test(clean);
    if (isQueryMeals) {
      return {
        intent: 'QUERY_MEALS',
        entities: {},
        needsFollowUp: false
      };
    }

    // Workout Query Intent (e.g. "What workouts did I do today?", "Did I exercise today?", "What sports did I play?")
    const isQueryWorkouts = /(?:what\s+(?:workout|workouts|exercise|exercises|sports?)\s+did\s+i|did\s+i\s+(?:work\s*out|exercise|train|play\s+any\s+sports?)|my\s+workouts?|show\s+(?:my\s+)?workouts?|what\s+sports?\s+did\s+i\s+play|workout\s+log|exercise\s+log)/i.test(clean);
    if (isQueryWorkouts) {
      return {
        intent: 'QUERY_WORKOUTS',
        entities: {},
        needsFollowUp: false
      };
    }

    // Remaining Calories & Macros Query (e.g. "How many calories do I have left?", "Remaining protein?", "Calorie budget left?")
    const isRemainingCals = /(?:how\s+(?:many|much)\s+)?(?:calories|cals|protein|carbs|fat|macros?)\s*(?:do\s+i\s+have\s+)?left\b|(?:remaining|leftover)\s*(?:calories|cals|protein|macros?)|how\s+many\s+(?:more\s+)?calories\s+can\s+i\s+eat|calorie\s+budget\s+left/i.test(clean);
    if (isRemainingCals) {
      return {
        intent: 'QUERY_CALORIES_REMAINING',
        entities: {},
        needsFollowUp: false
      };
    }

    // Hydration Status Query (e.g. "How is my hydration?", "Did I drink enough water?", "How much water did I drink?")
    const isCheckHydration = /(?:how\s+is\s+my|check\s+my|how\s+much\s+water\s+did\s+i|did\s+i\s+drink\s+enough|water\s+status|water\s+intake\s+today)\s*(?:hydration|water)?/i.test(clean);
    if (isCheckHydration && !/(?:drank|drink|consumed|log|add)\s+\d+/i.test(clean)) {
      return {
        intent: 'CHECK_HYDRATION',
        entities: {},
        needsFollowUp: false
      };
    }

    // Water Tracking Intent
    const isWater = /(?:water|hydration)/i.test(clean) || /(?:drank|drink|consumed)\s+\d+/i.test(clean);
    if (isWater) {
      const waterMatch = clean.match(/(\d+(?:\.\d+)?)\s*(ml|litres?|liters?|l|glasses?|cups?)\s*(?:of\s+)?(?:water)?/i)
        || clean.match(/(?:drank|drink|had|log|consumed|taken)?\s*(\d+(?:\.\d+)?)\s*(ml|litres?|liters?|l|glasses?|cups?)/i);

      if (waterMatch) {
        let amountMl = 250;
        const qty = parseFloat(waterMatch[1]) || 1;
        const unit = (waterMatch[2] || 'ml').toLowerCase();
        if (unit.startsWith('l')) amountMl = Math.round(qty * 1000);
        else if (unit.startsWith('glass') || unit.startsWith('cup')) amountMl = Math.round(qty * 250);
        else amountMl = Math.round(qty);

        return {
          intent: 'ADD_WATER',
          entities: { amountMl },
          needsFollowUp: false
        };
      }
    }

    // Workout <-> Sport Overlap Analysis
    const sportsKeywords = ["football", "cycling", "running", "badminton", "cricket", "basketball", "swimming", "tennis", "volleyball"];
    const workoutKeywords = ["leg", "legs", "squat", "chest", "pushup", "push-up", "back", "pullup", "shoulder", "arm", "core", "workout", "hiit"];
    const detectedSport = sportsKeywords.find(s => lower.includes(s));
    const detectedWorkout = workoutKeywords.find(w => lower.includes(w));

    if (detectedSport && (detectedWorkout || lower.includes("workout") || lower.includes("train") || lower.includes("gym") || lower.includes("day"))) {
      return {
        intent: 'WORKOUT_SPORT_ANALYSIS',
        entities: {
          workoutName: detectedWorkout ? `${detectedWorkout.charAt(0).toUpperCase() + detectedWorkout.slice(1)} Workout` : 'Leg Workout',
          sportName: detectedSport.charAt(0).toUpperCase() + detectedSport.slice(1)
        },
        needsFollowUp: false
      };
    }

    // Workout Completion Tracking
    if (lower.includes("workout") || lower.includes("exercise") || lower.includes("squat") || lower.includes("pushup")) {
      if (lower.includes("completed") || lower.includes("finish") || lower.includes("did") || lower.includes("done")) {
        const wkName = detectedWorkout ? `${detectedWorkout.charAt(0).toUpperCase() + detectedWorkout.slice(1)} Workout` : 'Strength Workout';
        return {
          intent: 'COMPLETE_WORKOUT',
          entities: {
            workoutName: wkName
          },
          needsFollowUp: false
        };
      }
    }

    // Sport Voice Tracking
    if (detectedSport && (lower.includes("played") || lower.includes("ran") || lower.includes("cycled") || lower.includes("min") || lower.includes("hour"))) {
      let minutes = 60;
      const numWords = { a: 1, an: 1, one: 1, two: 2, three: 3, four: 4 };
      const durMatch = clean.match(/(\d+|one|two|three|four|half(?:\s+an)?)\s*(minutes?|mins?|hours?|hrs?)/i);
      if (durMatch) {
        const val = numWords[durMatch[1].toLowerCase()] || parseFloat(durMatch[1]) || 1;
        const unit = durMatch[2].toLowerCase();
        if (unit.startsWith('h')) {
          minutes = Math.round(val * 60);
        } else {
          minutes = Math.round(val);
        }
      }
      return {
        intent: 'ADD_SPORT',
        entities: {
          sport: detectedSport.charAt(0).toUpperCase() + detectedSport.slice(1),
          durationMinutes: minutes
        },
        needsFollowUp: false
      };
    }

    // Weight Voice Tracking
    const weightMatch = clean.match(/(?:weight\s*(?:is)?|weigh(?:ed)?)\s*(\d+(?:\.\d+)?)\s*(?:kg|kilos?|pounds?|lbs?)?/i)
      || clean.match(/(\d+(?:\.\d+)?)\s*(?:kg|kilos)\b/i);
    if (weightMatch) {
      return {
        intent: 'CHECK_WEIGHT',
        entities: {
          weight: parseFloat(weightMatch[1])
        },
        needsFollowUp: false
      };
    }

    // Progress & Motivation
    if (lower.includes("how was my week") || lower.includes("weekly summary") || lower.includes("weekly progress")) {
      return { intent: 'CHECK_PROGRESS', entities: { scope: 'weekly' }, needsFollowUp: false };
    }
    if (lower.includes("how am i doing") || lower.includes("progress") || lower.includes("motivation") || lower.includes("daily summary") || lower.includes("review")) {
      return { intent: 'DAILY_SUMMARY', entities: { scope: 'daily' }, needsFollowUp: false };
    }

    // Meal Tracking Intent & Natural Language Food Extraction
    const foodExt = extractFoodFromText(clean, db.nutritionDataset);
    if (foodExt.hasFoods) {
      const hasExplicitQuantity = /\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten|half|quarter|cup|cups|bowl|bowls|gram|grams|piece|pieces|glass|glasses|ml|slice|slices)\b/i.test(clean);

      if (!hasExplicitQuantity) {
        const pendingList = foodExt.foods.map(f => ({
          foodName: f.name.toLowerCase(),
          mealType: foodExt.mealType
        }));
        const firstItem = pendingList[0];

        return {
          intent: 'ADD_MEAL',
          action: 'ASK_MISSING_QUANTITY',
          entities: {
            foodName: firstItem.foodName,
            mealType: foodExt.mealType,
            pendingItems: pendingList
          },
          needsFollowUp: true,
          followUpQuestion: `How much ${firstItem.foodName} did you have?`
        };
      }

      return {
        intent: 'ADD_MEAL',
        action: 'LOG_EXTRACTED_MEAL',
        entities: {
          mealType: foodExt.mealType,
          foods: foodExt.foods,
          totalCalories: foodExt.totalCalories,
          totalProtein: foodExt.totalProtein
        },
        needsFollowUp: false
      };
    }

    // Nutrition queries
    if (lower.includes("how much protein") || lower.includes("calories consumed") || lower.includes("nutrition summary") || lower.includes("total calories") || lower.includes("my nutrition") || lower.includes("macros today")) {
      return { intent: 'CHECK_NUTRITION', entities: {}, needsFollowUp: false };
    }

    return {
      intent: 'GENERAL_FITNESS_QUESTION',
      entities: { query: clean },
      needsFollowUp: false
    };
  }

  /**
   * Generate Conversational Text Response (Gemini -> Ollama -> Template)
   */
  async generateResponse(systemPrompt, userPrompt) {
    // 1. Try Gemini
    if (this.geminiApiKey) {
      try {
        const prompt = `${systemPrompt}\n\nUser Question: ${userPrompt}\n\nRespond as FitSport AI Coach concisely and encouragingly (2-3 sentences max):`;
        const res = await this.callGemini(prompt, false);
        if (res) return res.trim();
      } catch (e) {}
    }

    // 2. Try Ollama if configured
    try {
      const url = new URL('/api/generate', this.baseUrl);
      const postData = JSON.stringify({
        model: this.model,
        prompt: `${systemPrompt}\n\nUser: ${userPrompt}\n\nAssistant:`,
        stream: false
      });

      const res = await new Promise((resolve) => {
        const req = http.request(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          },
          timeout: this.timeout
        }, (resp) => {
          let data = '';
          resp.on('data', chunk => { data += chunk; });
          resp.on('end', () => {
            if (resp.statusCode === 200) {
              try {
                const parsed = JSON.parse(data);
                resolve(parsed.response);
              } catch (e) { resolve(null); }
            } else { resolve(null); }
          });
        });

        req.on('error', () => resolve(null));
        req.on('timeout', () => { req.destroy(); resolve(null); });
        req.write(postData);
        req.end();
      });

      if (res) return res.trim();
    } catch (e) {}

    return null;
  }
}

export const llmService = new LLMService();
