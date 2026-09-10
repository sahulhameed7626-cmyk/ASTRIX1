// FitSport Biomechanical Intelligence: Workout-to-Muscle Mappings
import { WORKOUT_CATEGORIES } from '../../../js/data.js';

export const WORKOUT_MUSCLE_GROUPS = {
  legs: {
    name: "Lower Body / Legs",
    primary: ["Quadriceps", "Hamstrings", "Gluteus Maximus", "Calves"],
    secondary: ["Core", "Lower Back", "Hip Flexors", "Tibialis Anterior"],
    keywords: ["squat", "lunge", "leg", "quad", "hamstring", "calf", "glute", "rdl", "wall sit"]
  },
  chest: {
    name: "Chest / Pectorals",
    primary: ["Pectoralis Major", "Pectoralis Minor", "Anterior Deltoid", "Triceps Brachii"],
    secondary: ["Serratus Anterior", "Core", "Rotator Cuff"],
    keywords: ["pushup", "push-up", "press", "chest", "pec", "dip", "bench"]
  },
  back: {
    name: "Back / Posterior Chain",
    primary: ["Latissimus Dorsi", "Rhomboids", "Trapezius", "Biceps Brachii"],
    secondary: ["Erector Spinae", "Rear Deltoids", "Forearms", "Grip Stabilizers"],
    keywords: ["pullup", "pull-up", "row", "back", "lat", "deadlift", "renegade"]
  },
  shoulders: {
    name: "Shoulders / Deltoids",
    primary: ["Anterior Deltoid", "Lateral Deltoid", "Posterior Deltoid", "Rotator Cuff"],
    secondary: ["Triceps Brachii", "Upper Trapezius", "Core"],
    keywords: ["shoulder", "deltoid", "overhead", "thruster", "pike"]
  },
  core: {
    name: "Core / Abdominals",
    primary: ["Rectus Abdominis", "Transverse Abdominis", "Obliques"],
    secondary: ["Lower Back / Erector Spinae", "Hip Flexors", "Pelvic Floor"],
    keywords: ["plank", "crunch", "core", "abs", "situp", "twist", "hollow"]
  },
  arms: {
    name: "Arms (Biceps & Triceps)",
    primary: ["Biceps Brachii", "Triceps Brachii", "Brachioradialis / Forearms"],
    secondary: ["Deltoids", "Grip Stabilizers"],
    keywords: ["curl", "bicep", "tricep", "extension", "arm"]
  },
  fullBody: {
    name: "Full Body / Athletic Conditioning",
    primary: ["Quadriceps", "Hamstrings", "Glutes", "Pectorals", "Latissimus Dorsi", "Deltoids", "Core"],
    secondary: ["Calves", "Cardiovascular Endurance", "Joint Stabilizers"],
    keywords: ["full body", "hiit", "burpee", "jumping jack", "circuit", "mountain climber"]
  }
};

export function getMusclesForWorkout(workoutTitleOrId) {
  if (!workoutTitleOrId) return WORKOUT_MUSCLE_GROUPS.legs;
  const term = String(workoutTitleOrId).toLowerCase();

  // Look up in WORKOUT_CATEGORIES catalog
  const found = WORKOUT_CATEGORIES.find(w =>
    w.id.toLowerCase() === term ||
    w.title.toLowerCase().includes(term) ||
    (w.subCategory && w.subCategory.toLowerCase().includes(term))
  );

  if (found) {
    const targets = (found.exercises || []).map(e => e.target).join(", ").toLowerCase();
    const primary = [];
    const secondary = [];

    if (targets.includes("quad") || targets.includes("leg")) primary.push("Quadriceps");
    if (targets.includes("hamstring")) primary.push("Hamstrings");
    if (targets.includes("glute")) primary.push("Glutes");
    if (targets.includes("calf") || targets.includes("calves")) primary.push("Calves");
    if (targets.includes("pec") || targets.includes("chest")) primary.push("Pectorals");
    if (targets.includes("tricep")) primary.push("Triceps");
    if (targets.includes("deltoid") || targets.includes("shoulder")) primary.push("Deltoids");
    if (targets.includes("abdominis") || targets.includes("core") || targets.includes("oblique")) primary.push("Core");
    if (targets.includes("lat") || targets.includes("back")) primary.push("Latissimus Dorsi");
    if (targets.includes("bicep")) primary.push("Biceps");

    if (primary.length > 0) {
      return {
        title: found.title,
        category: found.category,
        primary: [...new Set(primary)],
        secondary: ["Core Stabilizers", "Joint Stabilizers"],
        intensity: found.intensity || "Moderate"
      };
    }
  }

  // Fallback keyword scanning
  for (const group of Object.values(WORKOUT_MUSCLE_GROUPS)) {
    if (group.keywords.some(k => term.includes(k))) {
      return {
        title: group.name,
        category: "Strength Training",
        primary: group.primary,
        secondary: group.secondary,
        intensity: "Moderate"
      };
    }
  }

  return {
    title: workoutTitleOrId,
    category: "General Workout",
    primary: ["Full Body", "Core"],
    secondary: ["Cardiovascular"],
    intensity: "Moderate"
  };
}
