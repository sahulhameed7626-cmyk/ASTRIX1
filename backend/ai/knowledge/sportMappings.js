// FitSport Biomechanical Intelligence: Sport-to-Muscle Mappings & Overlap Analysis
import { SPORTS_DATA } from '../../../js/data.js';
import { getMusclesForWorkout } from './muscleMappings.js';

export const SPORT_MUSCLE_GROUPS = {
  football: {
    name: "Football (Soccer)",
    primary: ["Quadriceps", "Hamstrings", "Glutes", "Calves"],
    secondary: ["Core", "Hip Flexors", "Ankle Stabilizers"],
    intensityMultiplier: 1.25,
    impactLevel: "High Impact"
  },
  cycling: {
    name: "Cycling",
    primary: ["Quadriceps", "Hamstrings", "Glutes", "Calves"],
    secondary: ["Core", "Lower Back", "Hip Flexors"],
    intensityMultiplier: 1.0,
    impactLevel: "Low Impact / High Muscular Endurance"
  },
  running: {
    name: "Running",
    primary: ["Quadriceps", "Hamstrings", "Calves", "Glutes"],
    secondary: ["Core", "Hip Abductors", "Tibialis Anterior"],
    intensityMultiplier: 1.2,
    impactLevel: "High Impact"
  },
  badminton: {
    name: "Badminton",
    primary: ["Quadriceps", "Calves", "Shoulders", "Forearms / Wrist"],
    secondary: ["Core", "Glutes", "Latissimus Dorsi"],
    intensityMultiplier: 1.15,
    impactLevel: "High Agility & Rotational Impact"
  },
  basketball: {
    name: "Basketball",
    primary: ["Quadriceps", "Calves", "Glutes", "Deltoids"],
    secondary: ["Core", "Hamstrings", "Triceps"],
    intensityMultiplier: 1.2,
    impactLevel: "High Vertical Jump Impact"
  },
  cricket: {
    name: "Cricket",
    primary: ["Shoulders", "Core", "Quadriceps", "Hamstrings"],
    secondary: ["Forearms", "Lower Back", "Calves"],
    intensityMultiplier: 1.05,
    impactLevel: "Rotational & Sprint Conditioning"
  },
  swimming: {
    name: "Swimming",
    primary: ["Latissimus Dorsi", "Deltoids", "Pectorals", "Core"],
    secondary: ["Glutes", "Hamstrings", "Triceps"],
    intensityMultiplier: 1.1,
    impactLevel: "Zero Impact / High Muscular Endurance"
  },
  tennis: {
    name: "Tennis",
    primary: ["Deltoids", "Forearms", "Core / Obliques", "Quadriceps"],
    secondary: ["Calves", "Pectorals", "Latissimus Dorsi"],
    intensityMultiplier: 1.2,
    impactLevel: "Unilateral Agility & Rotational Impact"
  },
  volleyball: {
    name: "Volleyball",
    primary: ["Quadriceps", "Deltoids", "Calves", "Glutes"],
    secondary: ["Core", "Triceps", "Rotator Cuff"],
    intensityMultiplier: 1.15,
    impactLevel: "High Plyometric Impact"
  }
};

export function getMusclesForSport(sportNameOrId) {
  if (!sportNameOrId) return SPORT_MUSCLE_GROUPS.football;
  const term = String(sportNameOrId).toLowerCase();

  for (const [key, group] of Object.entries(SPORT_MUSCLE_GROUPS)) {
    if (term.includes(key) || key.includes(term)) {
      return group;
    }
  }

  // Fallback to SPORTS_DATA if custom
  const found = SPORTS_DATA.find(s => s.name.toLowerCase().includes(term) || s.id.toLowerCase().includes(term));
  if (found) {
    return {
      name: found.name,
      primary: ["Legs", "Core"],
      secondary: ["Cardiovascular"],
      intensityMultiplier: 1.0,
      impactLevel: "Moderate"
    };
  }

  return SPORT_MUSCLE_GROUPS.football;
}

/**
 * Universal Workout -> Muscle -> Sport -> Muscle Overlap Analysis
 * Follows AI Safety rules: Cautious guidance, no injury guarantees, no medical diagnosis.
 */
export function checkWorkoutSportOverlap({ workoutName, sportName, userId, date }) {
  const workoutProfile = getMusclesForWorkout(workoutName);
  const sportProfile = getMusclesForSport(sportName);

  const workoutMuscles = (workoutProfile.primary || []).map(m => m.toLowerCase());
  const sportMuscles = (sportProfile.primary || []).map(m => m.toLowerCase());

  // Find intersecting muscle groups
  const overlappingMuscles = workoutProfile.primary.filter(m =>
    sportMuscles.includes(m.toLowerCase())
  );

  const overlapPercentage = Math.round(
    (overlappingMuscles.length / Math.max(1, workoutProfile.primary.length)) * 100
  );

  let overlapLevel = "LOW";
  if (overlapPercentage >= 60 || overlappingMuscles.length >= 3) {
    overlapLevel = "HIGH";
  } else if (overlapPercentage >= 30 || overlappingMuscles.length >= 2) {
    overlapLevel = "MODERATE";
  }

  const muscleListStr = overlappingMuscles.length > 0
    ? overlappingMuscles.join(", ")
    : "overall cardiovascular capacity";

  let recommendation = "";
  let spokenRecommendation = "";

  if (overlapLevel === "HIGH") {
    recommendation = `You completed a ${workoutProfile.title || workoutName || 'session'} today, and ${sportProfile.name} heavily engages the same muscle groups (${muscleListStr}). ` +
      `Since there is significant muscular overlap, consider moderating tonight's intensity, performing a thorough warm-up, staying hydrated, and allowing adequate recovery between sprints.`;
    spokenRecommendation = `You completed a ${workoutProfile.title || workoutName || 'session'}, and ${sportProfile.name} uses the same muscles, including your ${muscleListStr}. Consider keeping your intensity moderate and focus on good recovery.`;
  } else if (overlapLevel === "MODERATE") {
    recommendation = `Moderate kinetic overlap detected in your ${muscleListStr}. Ensure dynamic activation before playing ${sportProfile.name} and monitor any localized muscular fatigue.`;
    spokenRecommendation = `Moderate overlap detected in your ${muscleListStr}. Do a dynamic warm-up before playing ${sportProfile.name} and monitor fatigue.`;
  } else {
    recommendation = `Low muscular overlap detected between your ${workoutProfile.title || workoutName} and ${sportProfile.name}. The primary fatigue zones differ, allowing for solid sport performance with proper warm-up.`;
    spokenRecommendation = `Low muscle overlap between your workout and ${sportProfile.name}. Have a great session and stay hydrated!`;
  }

  return {
    overlapLevel,
    overlapPercentage,
    workout: workoutProfile.title || workoutName,
    sport: sportProfile.name,
    workoutMuscles: workoutProfile.primary,
    sportMuscles: sportProfile.primary,
    overlappingMuscles,
    recommendation,
    spokenRecommendation,
    cautiousRecoveryGuidance: "Prioritize cellular hydration, light mobility, and 20-30g of protein for muscle synthesis."
  };
}
