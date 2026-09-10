// FitSport AI Coach Knowledge & Biomechanical Intelligence Engine
import { SPORTS_DATA, FOOD_DATABASE, WORKOUT_CATEGORIES } from '../../js/data.js';

/**
 * Structured Workout -> Muscle Group Mappings
 */
export const WORKOUT_MUSCLE_MAP = {
  // Major anatomical categories
  "legs": {
    name: "Lower Body / Legs",
    primary: ["Quadriceps", "Hamstrings", "Gluteus Maximus", "Calves"],
    secondary: ["Hip Flexors", "Adductors", "Tibialis Anterior"],
    keywords: ["squat", "lunge", "leg", "quad", "hamstring", "calf", "glute", "rdl", "step up"]
  },

  
  "chest": {
    name: "Chest / Pectorals",
    primary: ["Pectoralis Major", "Pectoralis Minor", "Anterior Deltoid", "Triceps Brachii"],
    secondary: ["Serratus Anterior", "Core"],
    keywords: ["pushup", "push-up", "press", "chest", "pec", "dip"]
  },
  "back": {
    name: "Back / Posterior Chain",
    primary: ["Latissimus Dorsi", "Rhomboids", "Trapezius", "Biceps Brachii"],
    secondary: ["Erector Spinae", "Rear Deltoids", "Forearms"],
    keywords: ["pullup", "pull-up", "row", "back", "lat", "deadlift", "hyper"]
  },
  "shoulders": {
    name: "Shoulders / Deltoids",
    primary: ["Anterior Deltoid", "Lateral Deltoid", "Posterior Deltoid", "Rotator Cuff"],
    secondary: ["Triceps", "Upper Trapezius"],
    keywords: ["shoulder", "deltoid", "overhead", "pike", "lateral raise"]
  },
  "core": {
    name: "Core / Abdominals",
    primary: ["Rectus Abdominis", "Transverse Abdominis", "Obliques"],
    secondary: ["Lower Back / Erector Spinae", "Hip Flexors"],
    keywords: ["plank", "crunch", "core", "abs", "situp", "hollow", "russian twist", "leg raise"]
  },
  "arms": {
    name: "Arms (Biceps & Triceps)",
    primary: ["Biceps Brachii", "Triceps Brachii", "Forearms / Brachioradialis"],
    secondary: ["Deltoids", "Grip Stabilizers"],
    keywords: ["curl", "bicep", "tricep", "extension", "arm"]
  },
  "full-body": {
    name: "Full Body / High Intensity Conditioning",
    primary: ["Quadriceps", "Hamstrings", "Pectorals", "Latissimus Dorsi", "Deltoids", "Core"],
    secondary: ["Glutes", "Calves", "Cardiovascular Endurance"],
    keywords: ["burpee", "full body", "hiit", "jumping jack", "circuit", "mountain climber"]
  }
};

/**
 * Resolve workout to active muscle groups
 */
export function getMusclesForWorkout(workoutTitleOrId) {
  if (!workoutTitleOrId) {
    return WORKOUT_MUSCLE_MAP["legs"];
  }
  const term = String(workoutTitleOrId).toLowerCase();

  // 1. Direct workout category match from WORKOUT_CATEGORIES
  const found = WORKOUT_CATEGORIES.find(w => 
    w.id.toLowerCase() === term || 
    w.title.toLowerCase().includes(term) ||
    (w.subCategory && w.subCategory.toLowerCase().includes(term))
  );

  if (found) {
    const targets = found.exercises.map(e => e.target).join(", ").toLowerCase();
    const primaryMuscles = [];
    const secondaryMuscles = [];

    if (targets.includes("quad") || targets.includes("leg")) primaryMuscles.push("Quadriceps");
    if (targets.includes("hamstring")) primaryMuscles.push("Hamstrings");
    if (targets.includes("glute")) primaryMuscles.push("Gluteus Maximus");
    if (targets.includes("calf") || targets.includes("calves")) primaryMuscles.push("Calves");
    if (targets.includes("pec") || targets.includes("chest")) primaryMuscles.push("Pectorals");
    if (targets.includes("tricep")) primaryMuscles.push("Triceps");
    if (targets.includes("deltoid") || targets.includes("shoulder")) primaryMuscles.push("Deltoids");
    if (targets.includes("abdominis") || targets.includes("core") || targets.includes("oblique")) primaryMuscles.push("Core");
    if (targets.includes("lat") || targets.includes("back")) primaryMuscles.push("Latissimus Dorsi");
    if (targets.includes("bicep")) primaryMuscles.push("Biceps");

    if (primaryMuscles.length > 0) {
      return {
        title: found.title,
        category: found.category,
        primary: [...new Set(primaryMuscles)],
        secondary: secondaryMuscles.length > 0 ? [...new Set(secondaryMuscles)] : ["Core Stabilizers", "Joint Stabilizers"],
        intensity: found.intensity || "Moderate"
      };
    }
  }

  // 2. Keyword fallback across map
  for (const [key, group] of Object.entries(WORKOUT_MUSCLE_MAP)) {
    if (group.keywords.some(k => term.includes(k))) {
      return {
        title: group.name,
        category: key,
        primary: group.primary,
        secondary: group.secondary,
        intensity: "Moderate"
      };
    }
  }

  return {
    title: workoutTitleOrId,
    category: "General Athletic Conditioning",
    primary: ["Quadriceps", "Core", "Deltoids"],
    secondary: ["Hamstrings", "Calves"],
    intensity: "Moderate"
  };
}

/**
 * Resolve sport to active muscle groups & movement patterns
 */
export function getMusclesForSport(sportIdOrName) {
  const term = String(sportIdOrName || 'cycling').toLowerCase();
  const sport = SPORTS_DATA.find(s => 
    s.id.toLowerCase() === term || 
    s.name.toLowerCase() === term ||
    s.name.toLowerCase().includes(term)
  ) || SPORTS_DATA[0];

  return {
    id: sport.id,
    name: sport.name,
    type: sport.type,
    primary: sport.muscleImpact.primary,
    secondary: sport.muscleImpact.secondary,
    percentages: sport.muscleImpact.percentages,
    suggestions: sport.performanceSuggestions
  };
}

/**
 * Standardize muscle names for clean fuzzy overlap comparison
 */
function normalizeMuscleName(name) {
  const n = name.toLowerCase();
  if (n.includes("quad")) return "quadriceps";
  if (n.includes("hamstring")) return "hamstrings";
  if (n.includes("glute")) return "glutes";
  if (n.includes("calf") || n.includes("calves") || n.includes("tibialis") || n.includes("gastrocnemius")) return "calves";
  if (n.includes("core") || n.includes("abdomin") || n.includes("oblique")) return "core";
  if (n.includes("chest") || n.includes("pec")) return "chest";
  if (n.includes("shoulder") || n.includes("deltoid") || n.includes("rotator")) return "shoulders";
  if (n.includes("lat") || n.includes("back") || n.includes("trapezius") || n.includes("rhomboid") || n.includes("erector")) return "back";
  if (n.includes("arm") || n.includes("bicep") || n.includes("tricep") || n.includes("forearm")) return "arms";
  if (n.includes("adductor") || n.includes("groin") || n.includes("hip flexor")) return "hips";
  return n;
}

/**
 * WORKOUT <-> SPORT OVERLAP INTELLIGENCE (CORE FEATURE)
 * Compares any completed/planned workout with any sport activity.
 * Generates safe, non-diagnostic guidance (NEVER says "You will get an injury").
 */
export function calculateWorkoutSportOverlap(workoutInput, sportInput) {
  const workoutInfo = typeof workoutInput === 'object' && workoutInput.primary 
    ? workoutInput 
    : getMusclesForWorkout(workoutInput);

  const sportInfo = typeof sportInput === 'object' && sportInput.primary 
    ? sportInput 
    : getMusclesForSport(sportInput);

  const workoutNorm = workoutInfo.primary.map(normalizeMuscleName);
  const sportNorm = sportInfo.primary.map(normalizeMuscleName);

  // Identify direct primary overlaps
  const sharedMuscles = [];
  workoutInfo.primary.forEach(wm => {
    const norm = normalizeMuscleName(wm);
    if (sportNorm.includes(norm)) {
      sharedMuscles.push(wm);
    }
  });

  // Calculate overlap percentage
  const totalUnique = new Set([...workoutNorm, ...sportNorm]).size;
  const sharedCount = new Set(workoutNorm.filter(m => sportNorm.includes(m))).size;
  const ratio = totalUnique > 0 ? (sharedCount / totalUnique) : 0;

  let overlapLevel = "Low";
  let recommendation = "";
  let spokenRecommendation = "";

  if (sharedCount >= 3 || ratio >= 0.45) {
    overlapLevel = "High";
    recommendation = `You completed a ${workoutInfo.title || 'strength'} workout and are planning ${sportInfo.name}. ` +
      `Both activities place substantial concentric and eccentric demands on your ${sharedMuscles.join(', ')}. ` +
      `Fatigue may increase the physical demands on these muscles. Consider reducing the playing intensity, warming up dynamically, and prioritizing hydration and post-session recovery.`;
    spokenRecommendation = `You completed a ${workoutInfo.title || 'strength'} session today and are planning ${sportInfo.name}. ` +
      `Both activities rely heavily on your ${sharedMuscles.slice(0, 2).join(' and ')}. Consider keeping your sport intensity moderate and focusing on recovery.`;
  } else if (sharedCount >= 1 || ratio >= 0.2) {
    overlapLevel = "Moderate";
    recommendation = `Your ${workoutInfo.title || 'workout'} shares kinetic engagement with ${sportInfo.name} across your ${sharedMuscles.join(', ')}. ` +
      `Monitor your fatigue levels during play. Stay well-hydrated, allow adequate warm-up sets, and ease back if muscle tightness arises.`;
    spokenRecommendation = `You trained today and have ${sportInfo.name} scheduled. There is moderate engagement on your ${sharedMuscles[0] || 'stabilizer muscles'}. Listen to your body and pace your effort.`;
  } else {
    overlapLevel = "Low";
    recommendation = `Your ${workoutInfo.title || 'workout'} and ${sportInfo.name} target complementary muscle chains with minimal localized fatigue conflict. ` +
      `Ensure baseline hydration and proper warm-up before kicking off your session.`;
    spokenRecommendation = `Great balance! Your workout and ${sportInfo.name} target different muscle groups. You're set for a strong session with normal hydration.`;
  }

  return {
    workout: workoutInfo.title || "Today's Workout",
    workoutCategory: workoutInfo.category,
    musclesTrained: workoutInfo.primary,
    sport: sportInfo.name,
    sportType: sportInfo.type,
    sportMuscles: sportInfo.primary,
    sharedMuscles: [...new Set(sharedMuscles)],
    overlappingMuscles: [...new Set(sharedMuscles)],
    overlapLevel,
    recommendation,
    guidance: recommendation,
    spokenRecommendation
  };
}

/**
 * Natural Language Food Parser
 * Extracts food items, quantities, and units from natural spoken text
 * e.g., "I had two idlis and two eggs for breakfast"
 * e.g., "I ate two chapatis, 150 grams chicken curry and a banana"
 */
export function extractFoodFromText(text, nutritionDataset = []) {
  const clean = text.toLowerCase().trim();

  // Detect meal category
  let mealType = "lunch"; // sensible default
  const hour = new Date().getHours();
  if (clean.includes("breakfast") || clean.includes("morning")) {
    mealType = "breakfast";
  } else if (clean.includes("dinner") || clean.includes("night") || clean.includes("evening")) {
    mealType = "dinner";
  } else if (clean.includes("snack") || clean.includes("tea time")) {
    mealType = "snacks";
  } else if (clean.includes("lunch") || clean.includes("afternoon")) {
    mealType = "lunch";
  } else {
    // Infer based on current hour
    if (hour < 11) mealType = "breakfast";
    else if (hour < 16) mealType = "lunch";
    else if (hour < 19) mealType = "snacks";
    else mealType = "dinner";
  }

  // Word-to-number dictionary for spoken quantities
  const wordNumbers = {
    "a": 1, "an": 1, "one": 1, "two": 2, "three": 3, "four": 4, "five": 5,
    "six": 6, "seven": 7, "eight": 8, "nine": 9, "ten": 10,
    "half": 0.5, "quarter": 0.25, "couple": 2, "single": 1
  };

  // Build searchable food list combining food dataset & common Indian/athletic staples
  const foodsToMatch = [
    { name: "idli", aliases: ["idlis", "idly", "idlies"], baseGrams: 50, calories: 65, protein: 2.0, carbs: 13.0, fat: 0.2, category: "Grains", defaultGramsPerUnit: 50 },
    { name: "dosa", aliases: ["dosas", "dosai"], baseGrams: 80, calories: 168, protein: 3.5, carbs: 29.0, fat: 3.7, category: "Grains", defaultGramsPerUnit: 80 },
    { name: "chapati", aliases: ["chapatis", "roti", "rotis", "phulka", "phulkas"], baseGrams: 40, calories: 104, protein: 3.1, carbs: 20.0, fat: 1.2, category: "Grains", defaultGramsPerUnit: 40 },
    { name: "egg", aliases: ["eggs", "boiled egg", "boiled eggs", "omelette", "omelettes"], baseGrams: 50, calories: 72, protein: 6.3, carbs: 0.4, fat: 4.8, category: "Poultry & Dairy", defaultGramsPerUnit: 50 },
    { name: "chicken curry", aliases: ["chicken"], baseGrams: 100, calories: 180, protein: 25.0, carbs: 3.0, fat: 7.5, category: "Meat", defaultGramsPerUnit: 100 },
    { name: "chicken breast", baseGrams: 100, calories: 165, protein: 31.0, carbs: 0.0, fat: 3.6, category: "Meat", defaultGramsPerUnit: 100 },
    { name: "rice", aliases: ["cooked rice", "white rice", "brown rice", "steamed rice"], baseGrams: 100, calories: 130, protein: 2.7, carbs: 28.0, fat: 0.3, category: "Grains", defaultGramsPerUnit: 150 },
    { name: "banana", aliases: ["bananas"], baseGrams: 118, calories: 105, protein: 1.3, carbs: 27.0, fat: 0.3, category: "Fruits", defaultGramsPerUnit: 118 },
    { name: "apple", aliases: ["apples"], baseGrams: 150, calories: 78, protein: 0.4, carbs: 21.0, fat: 0.2, category: "Fruits", defaultGramsPerUnit: 150 },
    { name: "oats", aliases: ["oatmeal"], baseGrams: 40, calories: 150, protein: 5.0, carbs: 27.0, fat: 2.5, category: "Grains", defaultGramsPerUnit: 50 },
    { name: "milk", aliases: ["cup of milk", "glass of milk"], baseGrams: 250, calories: 122, protein: 8.2, carbs: 12.0, fat: 4.8, category: "Poultry & Dairy", defaultGramsPerUnit: 250 },
    { name: "paneer", aliases: ["cottage cheese"], baseGrams: 100, calories: 265, protein: 18.3, carbs: 3.4, fat: 20.8, category: "Poultry & Dairy", defaultGramsPerUnit: 100 },
    { name: "dal", aliases: ["lentils", "sambar", "daal"], baseGrams: 198, calories: 230, protein: 17.9, carbs: 39.8, fat: 0.8, category: "Legumes", defaultGramsPerUnit: 198 },
    { name: "fish", aliases: ["salmon", "tuna", "fish fry"], baseGrams: 100, calories: 182, protein: 25.0, carbs: 0.0, fat: 8.1, category: "Seafood", defaultGramsPerUnit: 100 },
    { name: "almonds", aliases: ["nuts"], baseGrams: 30, calories: 173, protein: 6.0, carbs: 6.1, fat: 15.0, category: "Nuts", defaultGramsPerUnit: 30 },
    { name: "spinach", aliases: ["palak", "greens"], baseGrams: 100, calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, category: "Vegetables", defaultGramsPerUnit: 100 }
  ];

  // Also index items from external dataset if passed
  if (Array.isArray(nutritionDataset) && nutritionDataset.length > 0) {
    nutritionDataset.slice(0, 50).forEach(item => {
      if (!foodsToMatch.some(f => f.name.toLowerCase() === item.name.toLowerCase())) {
        foodsToMatch.push({
          name: item.name.toLowerCase(),
          baseGrams: item.baseGrams || 100,
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fat: item.fat,
          category: item.category || "Whole Food",
          defaultGramsPerUnit: item.baseGrams || 100
        });
      }
    });
  }

  const extractedItems = [];

  // Match items in text
  foodsToMatch.forEach(foodDef => {
    const patterns = [foodDef.name, ...(foodDef.aliases || [])];
    for (const pat of patterns) {
      // Regex to find quantity before or after food name
      // Examples: "two idlis", "2 idlis", "150 grams chicken", "chicken 150g", "one cup rice"
      const escaped = pat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regexBefore = new RegExp(`(?:(\\d+(?:\\.\\d+)?)|(${Object.keys(wordNumbers).join('|')}))\\s*(?:(grams?|g|ml|cups?|pieces?|pcs?|bowls?|slices?|scoops?))?\\s*(?:of\\s+)?(?:${escaped})(?:s|es)?\\b`, 'i');
      const regexAfter = new RegExp(`(?:${escaped})(?:s|es)?\\b\\s*(?:(\\d+(?:\\.\\d+)?)|(${Object.keys(wordNumbers).join('|')}))\\s*(grams?|g|ml|cups?|pieces?|pcs?|bowls?|slices?|scoops?)?`, 'i');
      const regexSimple = new RegExp(`\\b(?:${escaped})(?:s|es)?\\b`, 'i');

      let match = clean.match(regexBefore) || clean.match(regexAfter);

      if (match) {
        let rawQty = match[1] ? parseFloat(match[1]) : (wordNumbers[match[2]?.toLowerCase()] || 1);
        let unit = (match[3] || 'pieces').toLowerCase();
        let totalGrams = 0;

        if (unit.startsWith('g')) {
          totalGrams = rawQty;
        } else if (unit.startsWith('cup') || unit.startsWith('bowl')) {
          totalGrams = rawQty * (foodDef.name === 'rice' ? 160 : (foodDef.name === 'dal' ? 200 : 150));
        } else if (unit.startsWith('ml')) {
          totalGrams = rawQty;
        } else {
          // Pieces / units
          totalGrams = rawQty * foodDef.defaultGramsPerUnit;
        }

        const ratio = totalGrams / foodDef.baseGrams;
        extractedItems.push({
          name: foodDef.name.charAt(0).toUpperCase() + foodDef.name.slice(1),
          quantity: rawQty,
          unit: unit,
          grams: Math.round(totalGrams),
          calories: Math.round(foodDef.calories * ratio * 10) / 10,
          protein: Math.round(foodDef.protein * ratio * 10) / 10,
          carbs: Math.round(foodDef.carbs * ratio * 10) / 10,
          fat: Math.round(foodDef.fat * ratio * 10) / 10,
          category: foodDef.category
        });
        break; // Match found for this food
      } else if (clean.match(regexSimple)) {
        // Mentioned without explicit number (e.g. "I had rice and chicken")
        const defaultQty = 1;
        const totalGrams = foodDef.defaultGramsPerUnit;
        const ratio = totalGrams / foodDef.baseGrams;
        extractedItems.push({
          name: foodDef.name.charAt(0).toUpperCase() + foodDef.name.slice(1),
          quantity: defaultQty,
          unit: foodDef.name === 'rice' ? 'serving' : 'piece',
          grams: Math.round(totalGrams),
          calories: Math.round(foodDef.calories * ratio * 10) / 10,
          protein: Math.round(foodDef.protein * ratio * 10) / 10,
          carbs: Math.round(foodDef.carbs * ratio * 10) / 10,
          fat: Math.round(foodDef.fat * ratio * 10) / 10,
          category: foodDef.category,
          needsClarification: false
        });
        break;
      }
    }
  });

  return {
    mealType,
    foods: extractedItems,
    hasFoods: extractedItems.length > 0,
    totalCalories: Math.round(extractedItems.reduce((acc, f) => acc + f.calories, 0)),
    totalProtein: Math.round(extractedItems.reduce((acc, f) => acc + f.protein, 0) * 10) / 10
  };
}
