// FitSport Initial Seed & Static Data
export const INITIAL_USER = {
  name: "Sahul Hameed",
  phone: "+91 99999 88888",
  avatar: "SH",
  height: 178, // cm
  currentWeight: 69.5, // kg
  startingWeight: 72.0, // kg
  targetWeight: 65.0, // kg
  targetDurationMonths: 3,
  interestedSports: ["Cycling", "Football", "Badminton", "Running"],
  fitnessGoal: "Improve Sports Performance",
  calorieGoal: 2063, // Calculated via 1 kg = 7,700 kcal rule: 2,448 maintenance - 385 daily deficit
  maintenanceCalories: 2448,
  dailyCalorieAdjustment: 385,
  dailyBurnTarget: 635,
  proteinGoal: 130, // g (2.0g/kg of setted 65kg target weight)
  carbsGoal: 258, // g
  fatGoal: 57, // g
  waterGoal: 3500, // ml (3 to 4 Liter athletic target)
  ironGoal: 18 // mg
};

export const FOOD_DATABASE = [
  { id: "f1", name: "Egg", serving: "1 large (50g)", baseGrams: 50, calories: 72, protein: 6.3, carbs: 0.4, fat: 4.8, iron: 0.9 },
  { id: "f2", name: "Chicken Breast", serving: "100g cooked", baseGrams: 100, calories: 165, protein: 31.0, carbs: 0.0, fat: 3.6, iron: 1.0 },
  { id: "f3", name: "Rice (White/Brown)", serving: "100g cooked", baseGrams: 100, calories: 130, protein: 2.7, carbs: 28.0, fat: 0.3, iron: 0.8 },
  { id: "f4", name: "Banana", serving: "1 medium (118g)", baseGrams: 118, calories: 105, protein: 1.3, carbs: 27.0, fat: 0.3, iron: 0.3 },
  { id: "f5", name: "Apple", serving: "1 medium (150g)", baseGrams: 150, calories: 78, protein: 0.4, carbs: 21.0, fat: 0.2, iron: 0.2 },
  { id: "f6", name: "Oats", serving: "40g raw", baseGrams: 40, calories: 150, protein: 5.0, carbs: 27.0, fat: 2.5, iron: 1.8 },
  { id: "f7", name: "Milk (Low Fat)", serving: "250 ml", baseGrams: 250, calories: 122, protein: 8.2, carbs: 12.0, fat: 4.8, iron: 0.1 },
  { id: "f8", name: "Almonds", serving: "30g (approx 23 nuts)", baseGrams: 30, calories: 173, protein: 6.0, carbs: 6.1, fat: 15.0, iron: 1.1 },
  { id: "f9", name: "Paneer (Cottage Cheese)", serving: "100g", baseGrams: 100, calories: 265, protein: 18.3, carbs: 3.4, fat: 20.8, iron: 0.4 },
  { id: "f10", name: "Fish (Salmon/Tuna)", serving: "100g grilled", baseGrams: 100, calories: 182, protein: 25.0, carbs: 0.0, fat: 8.1, iron: 1.2 },
  { id: "f11", name: "Dal (Lentils)", serving: "1 cup cooked (198g)", baseGrams: 198, calories: 230, protein: 17.9, carbs: 39.8, fat: 0.8, iron: 6.6 },
  { id: "f12", name: "Spinach", serving: "100g fresh", baseGrams: 100, calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, iron: 2.7 }
];

export const WORKOUT_CATEGORIES = [
  // 1. BASIC WORKOUTS - NO EQUIPMENT (From PDF Guide)
  {
    id: "hw-pushups",
    category: "Home Workouts",
    subCategory: "Basic (No Equipment)",
    title: "Push-Ups Foundation",
    duration: 30,
    calories: 135,
    intensity: "Basic",
    difficulty: "Basic",
    equipmentNeeded: "None",
    exercisesCount: 3,
    description: "Foundational upper-body pushing pattern from the Home Workout Guide. Emphasizes chest, triceps, shoulders, and core stability.",
    variations: "Knee push-ups, wide-grip, diamond push-ups",
    exercises: [
      { name: "Standard Push-Ups", sets: 3, reps: "8-12 reps", target: "Pectorals, Triceps, Anterior Deltoid", restSec: 45, howTo: "Lie face down, hands shoulder-width apart. Push body up until arms are straight, lower back down.", caloriesPer30Min: "120-150 cal" },
      { name: "Wide-Grip Push-Ups", sets: 3, reps: "8-12 reps", target: "Outer Pectorals, Deltoids", restSec: 45, howTo: "Place hands 6-8 inches wider than shoulder width to maximize chest activation and pec stretch.", caloriesPer30Min: "120-150 cal" },
      { name: "Diamond Push-Ups", sets: 3, reps: "8-10 reps", target: "Triceps, Inner Chest, Core", restSec: 60, howTo: "Place hands together directly under center of chest with thumbs and index fingers touching to form a diamond.", caloriesPer30Min: "120-150 cal" }
    ]
  },
  {
    id: "hw-squats",
    category: "Home Workouts",
    subCategory: "Basic (No Equipment)",
    title: "Bodyweight Squats & Mobility",
    duration: 30,
    calories: 155,
    intensity: "Basic",
    difficulty: "Basic",
    equipmentNeeded: "None",
    exercisesCount: 3,
    description: "Fundamental lower body movement pattern. Strengthens quadriceps, glutes, hamstrings, and promotes hip and ankle mobility.",
    variations: "Air squats, tempo squats, jump squats",
    exercises: [
      { name: "Bodyweight Squats", sets: 3, reps: "12-15 reps", target: "Quadriceps, Glutes, Hamstrings", restSec: 45, howTo: "Feet shoulder-width apart, lower hips back and down like sitting in a chair, keep chest up.", caloriesPer30Min: "140-170 cal" },
      { name: "Tempo Squats (3s Descent)", sets: 3, reps: "10-12 reps", target: "Quadriceps, Gluteus Maximus", restSec: 45, howTo: "Take 3 full seconds to descend into bottom of squat, pause 1 second, then explode upward.", caloriesPer30Min: "140-170 cal" },
      { name: "Prisoner Squats", sets: 3, reps: "12-15 reps", target: "Upper Back Posture, Quads", restSec: 45, howTo: "Interlace hands behind head, keeping elbows flared wide to force thoracic extension while squatting.", caloriesPer30Min: "140-170 cal" }
    ]
  },
  {
    id: "hw-plank",
    category: "Home Workouts",
    subCategory: "Basic (No Equipment)",
    title: "Plank Core Isometric Series",
    duration: 30,
    calories: 115,
    intensity: "Basic",
    difficulty: "Basic",
    equipmentNeeded: "None",
    exercisesCount: 3,
    description: "Isometric core strengthening routine from the guide. Develops anti-extension spinal stability and full anterior chain endurance.",
    variations: "Side plank, plank with leg lifts, plank walks",
    exercises: [
      { name: "Forearm Plank Hold", sets: 3, reps: "20-60 sec", target: "Rectus Abdominis, Transverse Core", restSec: 45, howTo: "Hold a straight line from head to heels on forearms and toes. Squeeze glutes and brace abdominal wall.", caloriesPer30Min: "100-130 cal" },
      { name: "Side Plank (Left & Right)", sets: 3, reps: "20-45 sec/side", target: "Obliques, Quadratus Lumborum", restSec: 45, howTo: "Stack feet, rest on one forearm directly under shoulder, lift hips high to form a straight diagonal line.", caloriesPer30Min: "100-130 cal" },
      { name: "Plank with Alternating Leg Lifts", sets: 3, reps: "10 per leg", target: "Glute Activation, Posterior Core", restSec: 45, howTo: "From standard plank, lift one foot 6-8 inches off ground while keeping hips completely level.", caloriesPer30Min: "100-130 cal" }
    ]
  },
  {
    id: "hw-lunges",
    category: "Home Workouts",
    subCategory: "Basic (No Equipment)",
    title: "Unilateral Lunges Matrix",
    duration: 30,
    calories: 165,
    intensity: "Basic",
    difficulty: "Basic",
    equipmentNeeded: "None",
    exercisesCount: 3,
    description: "Single-leg strength and pelvic stabilization routine. Fixes muscular imbalances between legs and strengthens knees.",
    variations: "Walking lunges, reverse lunges, jumping lunges",
    exercises: [
      { name: "Alternating Forward Lunges", sets: 3, reps: "10-12 per leg", target: "Quadriceps, Glutes, Hamstrings", restSec: 45, howTo: "Step forward, lower back knee toward ground, push back to start. Alternate legs.", caloriesPer30Min: "150-180 cal" },
      { name: "Reverse Lunges", sets: 3, reps: "10-12 per leg", target: "Glute Isolation, Hamstrings", restSec: 45, howTo: "Step backward with one foot and lower into lunge. Minimizes shear forces across knee joint.", caloriesPer30Min: "150-180 cal" },
      { name: "Walking Lunges", sets: 3, reps: "10 per leg", target: "Functional Hip Extensors, Calves", restSec: 45, howTo: "Lunge forward continuously without stepping back, driving directly into next forward stride.", caloriesPer30Min: "150-180 cal" }
    ]
  },
  {
    id: "hw-burpees",
    category: "Home Workouts",
    subCategory: "Basic (No Equipment)",
    title: "Burpees Conditioning & Cardio",
    duration: 30,
    calories: 225,
    intensity: "Basic to Moderate",
    difficulty: "Basic",
    equipmentNeeded: "None",
    exercisesCount: 3,
    description: "Full-body cardio and athletic strength conditioning from the guide. Elevates heart rate and burns up to 250 kcal.",
    variations: "Standard burpees, chest-to-floor burpees, step-back burpees",
    exercises: [
      { name: "Standard Burpees", sets: 4, reps: "8-10 reps", target: "Full Body Cardio & Calves", restSec: 60, howTo: "Squat down, jump feet back into push-up position, jump feet forward, jump up.", caloriesPer30Min: "200-250 cal" },
      { name: "Burpees with Push-Up", sets: 3, reps: "8 reps", target: "Pectorals, Core, Legs", restSec: 60, howTo: "Lower completely flat into push-up before snapping hips and jumping upward.", caloriesPer30Min: "200-250 cal" },
      { name: "Low-Impact Step Burpees", sets: 3, reps: "10 reps", target: "Aerobic Capacity, Knee-Friendly", restSec: 45, howTo: "Step feet back one at a time instead of jumping back, ideal for pacing and joints.", caloriesPer30Min: "180-220 cal" }
    ]
  },

  // 2. ADVANCED WORKOUTS - NO EQUIPMENT (From PDF Guide)
  {
    id: "hw-pistol-squats",
    category: "Home Workouts",
    subCategory: "Advanced (No Equipment)",
    title: "Pistol Squats Mastery",
    duration: 30,
    calories: 155,
    intensity: "Advanced",
    difficulty: "Advanced",
    equipmentNeeded: "None",
    exercisesCount: 3,
    description: "Elite single-leg calisthenics from the guide. Very challenging balance, ankle mobility, and quad strength.",
    variations: "Assisted pistol squats, elevated pistol squats, full pistols",
    exercises: [
      { name: "Pistol Squats (Single Leg)", sets: 3, reps: "5-8 per leg", target: "Single-leg Balance, Quads, Glutes", restSec: 60, howTo: "Single-leg deep squat while other leg extends forward.", caloriesPer30Min: "140-170 cal" },
      { name: "Box/Bench Assisted Pistol Squats", sets: 3, reps: "8 per leg", target: "Unilateral Eccentric Control", restSec: 45, howTo: "Lower on one leg down to bench surface, touch lightly, and drive upward through heel.", caloriesPer30Min: "140-170 cal" },
      { name: "Single-Leg Balance Holds", sets: 3, reps: "30 sec/leg", target: "Ankle Stabilizers, Core", restSec: 30, howTo: "Stand on one foot with opposite leg extended forward, maintaining perfect posture.", caloriesPer30Min: "100-130 cal" }
    ]
  },
  {
    id: "hw-handstand",
    category: "Home Workouts",
    subCategory: "Advanced (No Equipment)",
    title: "Handstand Hold & Walk",
    duration: 30,
    calories: 170,
    intensity: "Advanced",
    difficulty: "Advanced",
    equipmentNeeded: "Wall / Open Floor",
    exercisesCount: 3,
    description: "Inverted calisthenics pattern from the guide. Develops supreme shoulder, scapular, and core stabilizer strength.",
    variations: "Wall-assisted handstand, freestanding handstand, handstand shoulder taps",
    exercises: [
      { name: "Handstand Hold (Wall-assisted)", sets: 4, reps: "10-30 sec", target: "Deltoids, Trapezius, Core", restSec: 60, howTo: "Kick up against wall or free-standing, hold inverted position.", caloriesPer30Min: "150-190 cal" },
      { name: "Wall Walk Up", sets: 3, reps: "5 reps", target: "Anterior Deltoids, Core Bracing", restSec: 60, howTo: "Start in pushup position with feet near wall, walk feet up wall while walking hands backward.", caloriesPer30Min: "150-190 cal" },
      { name: "Handstand Shoulder Taps", sets: 3, reps: "6-8 taps/side", target: "Unilateral Shoulder Strength", restSec: 60, howTo: "In handstand against wall, shift weight to one hand and tap opposite shoulder.", caloriesPer30Min: "150-190 cal" }
    ]
  },
  {
    id: "hw-decline-pushups",
    category: "Home Workouts",
    subCategory: "Advanced (No Equipment)",
    title: "Decline Push-Ups & Jump Squats",
    duration: 30,
    calories: 190,
    intensity: "Advanced",
    difficulty: "Advanced",
    equipmentNeeded: "Elevated Platform / Chair",
    exercisesCount: 3,
    description: "Significantly harder upper push incline combined with explosive plyometric jump squats from the guide.",
    variations: "Decline push-ups, explosive jump squats, decline plank",
    exercises: [
      { name: "Decline Push-Ups", sets: 3, reps: "8-10 reps", target: "Upper Pectorals, Front Deltoids", restSec: 45, howTo: "Feet elevated, perform push-ups with increased incline.", caloriesPer30Min: "140-170 cal" },
      { name: "Explosive Jump Squats", sets: 3, reps: "10-12 reps", target: "Plyometric Power, Fast-Twitch Quads", restSec: 45, howTo: "Squat down, explosively jump up, land softly and repeat immediately.", caloriesPer30Min: "200-250 cal" },
      { name: "Decline Plank Hold", sets: 3, reps: "40 sec", target: "Upper Core, Serratus Anterior", restSec: 45, howTo: "Hold forearm plank with feet elevated 12-18 inches on platform.", caloriesPer30Min: "120-150 cal" }
    ]
  },
  {
    id: "hw-circuit-noequip",
    category: "Home Workouts",
    subCategory: "30-Min Circuit",
    title: "30-Min Home Circuit (No Equipment)",
    duration: 30,
    calories: 1000,
    intensity: "Full Athletic Circuit",
    difficulty: "All Levels",
    equipmentNeeded: "None",
    exercisesCount: 5,
    description: "Complete 30-Minute No Equipment Circuit from Page 3 of Guide: 3 rounds of Push-ups, Squats, Burpees, Plank, and Lunges. Rest 60s between rounds. Total burn: 900-1100 calories!",
    circuitRounds: 3,
    restBetweenRounds: "60 seconds",
    exercises: [
      { name: "Push-ups", sets: 3, reps: "12 reps (36 total)", target: "Pectorals, Triceps, Core", restSec: 15, howTo: "12 push-ups per round. Burns 20 cal/round.", caloriesPer30Min: "20 cal/round" },
      { name: "Bodyweight Squats", sets: 3, reps: "15 reps (45 total)", target: "Quadriceps, Glutes", restSec: 15, howTo: "15 deep squats per round. Burns 25 cal/round.", caloriesPer30Min: "25 cal/round" },
      { name: "Burpees", sets: 3, reps: "10 reps (30 total)", target: "Full Body Cardio & Conditioning", restSec: 15, howTo: "10 explosive burpees per round. Burns 35 cal/round.", caloriesPer30Min: "35 cal/round" },
      { name: "Plank Hold", sets: 3, reps: "45 sec (2:15 total)", target: "Core Stability", restSec: 15, howTo: "45 seconds unbroken forearm plank. Burns 15 cal/round.", caloriesPer30Min: "15 cal/round" },
      { name: "Lunges", sets: 3, reps: "10/leg (60 total)", target: "Hamstrings, Glutes, Calves", restSec: 60, howTo: "10 lunges per leg. Burns 30 cal/round. Rest 60 sec after this exercise before starting next round.", caloriesPer30Min: "30 cal/round" }
    ]
  },

  // 3. BASIC WORKOUTS - WITH EQUIPMENT (From PDF Guide)
  {
    id: "eq-dumbbell-bench",
    category: "Equipment Workouts",
    subCategory: "Basic (With Equipment)",
    title: "Dumbbell Bench Press & Pushes",
    duration: 30,
    calories: 145,
    intensity: "Basic",
    difficulty: "Basic",
    equipmentNeeded: "Dumbbells, Bench (optional)",
    exercisesCount: 3,
    description: "Classic resistance pushing pattern from the guide. Increases chest, shoulder, and triceps pressing strength.",
    variations: "Flat bench press, floor press, neutral grip press",
    exercises: [
      { name: "Dumbbell Bench Press", sets: 3, reps: "8-12 reps", target: "Pectorals, Anterior Deltoids, Triceps", restSec: 60, howTo: "Lie on bench, hold dumbbells at chest level, press up until arms extend.", caloriesPer30Min: "130-160 cal" },
      { name: "Dumbbell Floor Press", sets: 3, reps: "10-12 reps", target: "Triceps Lockout, Chest", restSec: 45, howTo: "Lie flat on floor, lower upper arms until triceps touch floor lightly, pause, then press upward.", caloriesPer30Min: "130-160 cal" },
      { name: "Neutral Grip Dumbbell Press", sets: 3, reps: "10 reps", target: "Shoulder Joint Friendly, Triceps", restSec: 45, howTo: "Press dumbbells with palms facing each other throughout range of motion.", caloriesPer30Min: "130-160 cal" }
    ]
  },
  {
    id: "eq-kettlebell-swings",
    category: "Equipment Workouts",
    subCategory: "Basic (With Equipment)",
    title: "Kettlebell Swings & Posterior Chain",
    duration: 30,
    calories: 200,
    intensity: "Moderate",
    difficulty: "Basic",
    equipmentNeeded: "Kettlebell (or Dumbbell)",
    exercisesCount: 3,
    description: "Explosive posterior chain workout from the guide. Cardio plus glute, hamstring, and lumbar endurance.",
    variations: "Russian swing, single-arm swing, goblet squat",
    exercises: [
      { name: "Kettlebell Swings", sets: 3, reps: "12-15 reps", target: "Hamstrings, Glutes, Core, Cardio", restSec: 45, howTo: "Swing kettlebell between legs with hip thrust, control the swing.", caloriesPer30Min: "180-220 cal" },
      { name: "Single-Arm Kettlebell Swings", sets: 3, reps: "10 reps/arm", target: "Anti-Rotational Core, Glutes", restSec: 45, howTo: "Perform swing using single hand, resisting torso rotation with core.", caloriesPer30Min: "180-220 cal" },
      { name: "Kettlebell Goblet Squats", sets: 3, reps: "12 reps", target: "Quads, Upper Back, Core", restSec: 45, howTo: "Hold kettlebell horn at chest, squat deeply between heels.", caloriesPer30Min: "160-190 cal" }
    ]
  },
  {
    id: "eq-band-rows",
    category: "Equipment Workouts",
    subCategory: "Basic (With Equipment)",
    title: "Resistance Band Rows & Pulls",
    duration: 30,
    calories: 125,
    intensity: "Basic",
    difficulty: "Basic",
    equipmentNeeded: "Resistance Band",
    exercisesCount: 3,
    description: "Posture correction and back pulling strength from the guide. Directly activates lats, rhomboids, and biceps.",
    variations: "Seated band row, band pull-aparts, band lat pulldown",
    exercises: [
      { name: "Resistance Band Rows", sets: 3, reps: "10-12 reps", target: "Latissimus Dorsi, Rhomboids, Biceps", restSec: 45, howTo: "Anchor band, row the handles toward your chest, control the return.", caloriesPer30Min: "110-140 cal" },
      { name: "Band Pull-Aparts", sets: 3, reps: "15 reps", target: "Rear Deltoids, Scapular Retractors", restSec: 30, howTo: "Hold band shoulder-width with straight arms in front of chest, pull hands apart sideways.", caloriesPer30Min: "100-120 cal" },
      { name: "Band Lat Pulldown", sets: 3, reps: "12 reps", target: "Lats, Posterior Deltoid", restSec: 45, howTo: "Anchor band overhead, pull handles down toward collarbone squeezing shoulder blades.", caloriesPer30Min: "110-140 cal" }
    ]
  },

  // 4. ADVANCED WORKOUTS - WITH EQUIPMENT (From PDF Guide)
  {
    id: "eq-dumbbell-snatches",
    category: "Equipment Workouts",
    subCategory: "Advanced (With Equipment)",
    title: "Dumbbell Snatches & Kinetic Power",
    duration: 30,
    calories: 245,
    intensity: "High Intensity",
    difficulty: "Advanced",
    equipmentNeeded: "Dumbbell",
    exercisesCount: 3,
    description: "Explosive Olympic-style athletic lift from the guide. Develops power, coordination, and full-body kinetic energy.",
    variations: "Alternating snatches, hang snatches, clean and press",
    exercises: [
      { name: "Dumbbell Snatches", sets: 3, reps: "6-8 per arm", target: "Kinetic Chain Power, Shoulders, Glutes", restSec: 60, howTo: "Explosive movement pulling dumbbell from ground to overhead in one motion.", caloriesPer30Min: "220-270 cal" },
      { name: "Hang Dumbbell Snatches", sets: 3, reps: "6 per arm", target: "Hip Drive, Trap Activation", restSec: 60, howTo: "Start dumbbell at knee level, jump and pull under dumbbell into lockout.", caloriesPer30Min: "220-270 cal" },
      { name: "Dumbbell Clean and Press", sets: 3, reps: "8 reps", target: "Posterior Chain, Overhead Shoulders", restSec: 60, howTo: "Clean dumbbells to shoulders, pause, and drive overhead into locked arms.", caloriesPer30Min: "200-250 cal" }
    ]
  },
  {
    id: "eq-weighted-pullups",
    category: "Equipment Workouts",
    subCategory: "Advanced (With Equipment)",
    title: "Weighted Pull-Ups & Heavy Front Squats",
    duration: 35,
    calories: 200,
    intensity: "Advanced",
    difficulty: "Advanced",
    equipmentNeeded: "Pull-up bar, Weight Belt / Vest, Barbell",
    exercisesCount: 3,
    description: "Supreme strength pairing from the guide. Combines loaded pull-ups with heavy upright front squats.",
    variations: "Weight belt, weighted vest, dumbbell between feet",
    exercises: [
      { name: "Weighted Pull-Ups", sets: 3, reps: "5-8 reps", target: "Latissimus Dorsi, Biceps, Upper Back", restSec: 75, howTo: "Add weight belt or hold dumbbell between feet while performing pull-ups.", caloriesPer30Min: "180-220 cal" },
      { name: "Barbell / Weighted Front Squats", sets: 3, reps: "6-10 reps", target: "Quad-dominant Upright Torso", restSec: 75, howTo: "Hold weight at chest level, perform deep squat maintaining upright torso.", caloriesPer30Min: "170-210 cal" },
      { name: "Chin-Ups (Bodyweight / Weighted)", sets: 3, reps: "8 reps", target: "Biceps, Lower Traps", restSec: 60, howTo: "Supinated grip (palms facing you), pull until chin clears bar.", caloriesPer30Min: "160-200 cal" }
    ]
  },
  {
    id: "eq-circuit-equip",
    category: "Equipment Workouts",
    subCategory: "30-Min Circuit",
    title: "30-Min Home Circuit (With Equipment)",
    duration: 30,
    calories: 1225,
    intensity: "Maximum Burn Circuit",
    difficulty: "Advanced",
    equipmentNeeded: "Dumbbells, Kettlebell, Resistance Band",
    exercisesCount: 5,
    description: "Complete 30-Minute With Equipment Circuit from Page 3 of Guide: 3 rounds of Dumbbell Bench Press, Kettlebell Swings, Resistance Band Rows, Dumbbell Snatches, and Weighted Squats. Rest 90s between rounds. Total burn: 1100-1350 calories!",
    circuitRounds: 3,
    restBetweenRounds: "90 seconds",
    exercises: [
      { name: "Dumbbell Bench Press", sets: 3, reps: "12 reps (36 total)", target: "Chest & Triceps", restSec: 20, howTo: "12 dumbbell bench presses per round. Burns 25 cal/round.", caloriesPer30Min: "25 cal/round" },
      { name: "Kettlebell Swings", sets: 3, reps: "15 reps (45 total)", target: "Cardio + Posterior Chain", restSec: 20, howTo: "15 explosive hip-thrust kettlebell swings. Burns 40 cal/round.", caloriesPer30Min: "40 cal/round" },
      { name: "Resistance Band Rows", sets: 3, reps: "12 reps (36 total)", target: "Back & Bicep Activation", restSec: 20, howTo: "12 strict resistance band rows. Burns 20 cal/round.", caloriesPer30Min: "20 cal/round" },
      { name: "Dumbbell Snatches", sets: 3, reps: "8/arm (48 total)", target: "Kinetic Power & Shoulders", restSec: 20, howTo: "8 snatches per arm. Burns 45 cal/round.", caloriesPer30Min: "45 cal/round" },
      { name: "Weighted Squats", sets: 3, reps: "10 reps (30 total)", target: "Quad & Glute Power", restSec: 90, howTo: "10 deep weighted squats. Burns 30 cal/round. Rest 90 sec after this exercise before starting next round.", caloriesPer30Min: "30 cal/round" }
    ]
  }
];

export const SPORTS_DATA = [
  {
    id: "cycling",
    name: "Cycling",
    icon: "bike",
    type: "Cardiovascular / Lower-Body Endurance",
    cpmBase: 8.4,
    description: "An endurance-focused activity that improves cardiovascular fitness, VO2 max, and lower-body muscular stamina.",
    muscleImpact: {
      primary: ["Quadriceps", "Hamstrings", "Calves", "Glutes"],
      secondary: ["Core", "Lower Back"],
      percentages: {
        legs: 85,
        glutes: 70,
        core: 40,
        arms: 20,
        back: 35
      }
    },
    performanceSuggestions: [
      "Strengthen quadriceps with goblet squats to resist fatigue on steep inclines.",
      "Improve hamstring and hip-flexor flexibility to maintain an aerodynamic posture without lumbar strain.",
      "Train calf endurance with slow eccentric calf raises for sustained cadence efficiency.",
      "Strengthen core stability (planks & bird-dogs) to reduce swaying and power loss through the saddle.",
      "Ensure adequate rest and hydration: cycling elevates fluid loss rapidly through continuous wind evaporation."
    ],
    benefits: {
      cardio: 95,
      strength: 78,
      endurance: 94,
      stamina: 90,
      mobility: 65,
      calorieBurn: 88
    }
  },
  {
    id: "running",
    name: "Running",
    icon: "run",
    type: "Cardio / Aerobic Conditioning",
    cpmBase: 10.2,
    description: "High-impact aerobic sport building supreme cardiovascular capacity, bone density, and stride cadence.",
    muscleImpact: {
      primary: ["Calves", "Quadriceps", "Hamstrings", "Hip Flexors"],
      secondary: ["Core", "Glutes", "Upper Body Posture"],
      percentages: {
        legs: 92,
        glutes: 65,
        core: 55,
        arms: 25,
        back: 30
      }
    },
    performanceSuggestions: [
      "Incorporate single-leg balance drills to strengthen ankle stabilisers and prevent inversion sprains.",
      "Train posterior chain with Romanian deadlifts to prevent hamstring deceleration strains.",
      "Maintain a 170-180 SPM cadence to reduce knee impact stress."
    ],
    benefits: {
      cardio: 98,
      strength: 72,
      endurance: 96,
      stamina: 95,
      mobility: 60,
      calorieBurn: 95
    }
  },
  {
    id: "football",
    name: "Football",
    icon: "football",
    type: "Multi-directional / High Intensity Interval",
    cpmBase: 9.5,
    description: "Demands repeated sprint ability, explosive cutting agility, spatial awareness, and rotational trunk power.",
    muscleImpact: {
      primary: ["Adductors", "Quadriceps", "Hamstrings", "Calves"],
      secondary: ["Core", "Groin", "Lower Back"],
      percentages: {
        legs: 88,
        glutes: 75,
        core: 65,
        arms: 30,
        back: 45
      }
    },
    performanceSuggestions: [
      "Perform Copenhagen planks weekly to bulletproof groin and adductor tendons against kicking strains.",
      "Drill lateral decelerations to protect anterior cruciate ligament (ACL) stability during high-speed cuts.",
      "Target explosive plyometric box jumps for aerial dominance."
    ],
    benefits: {
      cardio: 90,
      strength: 82,
      endurance: 88,
      stamina: 92,
      mobility: 80,
      calorieBurn: 92
    }
  },
  {
    id: "cricket",
    name: "Cricket",
    icon: "cricket",
    type: "Intermittent Sprint / Rotational Power",
    cpmBase: 6.8,
    description: "Requires rotational torso torque for batting/bowling, sudden 20-meter sprint bursts, and reflexive agility.",
    muscleImpact: {
      primary: ["Shoulders", "Rotational Core", "Quadriceps", "Forearms"],
      secondary: ["Latissimus Dorsi", "Hamstrings", "Calves"],
      percentages: {
        legs: 70,
        glutes: 60,
        core: 78,
        arms: 75,
        back: 65
      }
    },
    performanceSuggestions: [
      "Train rotational core speed with med-ball throws to maximize bat swing and bowling velocity.",
      "Prioritize rotator cuff eccentric strength to sustain long spells of overarm bowling.",
      "Work on reactive sprint acceleration from stationary stance."
    ],
    benefits: {
      cardio: 70,
      strength: 78,
      endurance: 75,
      stamina: 80,
      mobility: 72,
      calorieBurn: 70
    }
  },
  {
    id: "badminton",
    name: "Badminton",
    icon: "badminton",
    type: "Fast Twitch Agility / High Deceleration",
    cpmBase: 8.2,
    description: "Fastest racket sport in the world requiring lightning reflexes, lunging deceleration, and wrist snap.",
    muscleImpact: {
      primary: ["Quadriceps", "Calves", "Forearms / Wrist", "Deltoids"],
      secondary: ["Glutes", "Core Obliques", "Thoracic Spine"],
      percentages: {
        legs: 82,
        glutes: 68,
        core: 60,
        arms: 80,
        back: 50
      }
    },
    performanceSuggestions: [
      "Strengthen eccentric knee decelerators with loaded reverse lunges for deep court recovery.",
      "Train wrist and forearm flexors to deliver sharp overhead smashes and deceptive net drops.",
      "Work on multi-directional footwork agility ladders."
    ],
    benefits: {
      cardio: 86,
      strength: 74,
      endurance: 84,
      stamina: 86,
      mobility: 88,
      calorieBurn: 85
    }
  },
  {
    id: "basketball",
    name: "Basketball",
    icon: "basketball",
    type: "Explosive Vertical / Dynamic Agility",
    cpmBase: 9.1,
    description: "High tempo continuous play demanding vertical jump capacity, lateral defensive slides, and cardiovascular stamina.",
    muscleImpact: {
      primary: ["Quadriceps", "Calves", "Deltoids", "Glutes"],
      secondary: ["Triceps", "Core", "Hamstrings"],
      percentages: {
        legs: 85,
        glutes: 80,
        core: 65,
        arms: 60,
        back: 45
      }
    },
    performanceSuggestions: [
      "Perform depth drops and trap bar deadlifts to build vertical jump propulsion and safe landing mechanics.",
      "Lateral band walks to bulletproof hip abductors for lockdown on-ball defensive slides.",
      "Integrate conditioning intervals replicating 24-second shot-clock possessions."
    ],
    benefits: {
      cardio: 91,
      strength: 84,
      endurance: 89,
      stamina: 91,
      mobility: 78,
      calorieBurn: 90
    }
  },
  {
    id: "swimming",
    name: "Swimming",
    icon: "swim",
    type: "Full Body Low Impact / Resistance Cardio",
    cpmBase: 9.8,
    description: "Zero-impact full-body conditioning that develops extensive lung capacity, shoulder breadth, and lat power.",
    muscleImpact: {
      primary: ["Latissimus Dorsi", "Pectorals", "Deltoids", "Core"],
      secondary: ["Hamstrings", "Quadriceps", "Glutes"],
      percentages: {
        legs: 65,
        glutes: 60,
        core: 80,
        arms: 90,
        back: 92
      }
    },
    performanceSuggestions: [
      "Incorporate dry-land pull-ups and band pull-aparts to protect shoulder subacromial space.",
      "Focus on continuous rhythmic core engagement to keep hips elevated and drag minimized.",
      "Practice bilateral breathing drills to maintain stroke symmetry."
    ],
    benefits: {
      cardio: 96,
      strength: 88,
      endurance: 95,
      stamina: 94,
      mobility: 92,
      calorieBurn: 93
    }
  },
  {
    id: "tennis",
    name: "Tennis",
    icon: "tennis",
    type: "Rotational Power / Interval Anaerobic",
    cpmBase: 8.5,
    description: "Combines high-velocity groundstroke torque, rapid recovery footsteps, and intense focus over extended sets.",
    muscleImpact: {
      primary: ["Rotational Core", "Shoulders", "Quadriceps", "Forearms"],
      secondary: ["Glutes", "Calves", "Hamstrings"],
      percentages: {
        legs: 80,
        glutes: 72,
        core: 82,
        arms: 82,
        back: 60
      }
    },
    performanceSuggestions: [
      "Develop rotational kinetic chain linkage from rear hip pivot into thoracic stroke follow-through.",
      "Target internal/external shoulder rotator cuff balance with resistance bands.",
      "Incorporate split-step reaction drills to shave milliseconds off return positioning."
    ],
    benefits: {
      cardio: 88,
      strength: 80,
      endurance: 86,
      stamina: 89,
      mobility: 82,
      calorieBurn: 87
    }
  },
  {
    id: "volleyball",
    name: "Volleyball",
    icon: "volleyball",
    type: "Vertical Plyometric / Overhead Power",
    cpmBase: 7.5,
    description: "Explosive sport focused on spike approaches, vertical block timing, diving digs, and shoulder whip.",
    muscleImpact: {
      primary: ["Deltoids / Rotator Cuff", "Quadriceps", "Calves", "Core"],
      secondary: ["Glutes", "Pectorals", "Hamstrings"],
      percentages: {
        legs: 82,
        glutes: 75,
        core: 70,
        arms: 85,
        back: 55
      }
    },
    performanceSuggestions: [
      "Emphasize patellar tendon health through slow eccentric Spanish squats.",
      "Strengthen scapular upward rotators (serratus anterior) to stabilize overhead spiking arm action.",
      "Refine three-step approach mechanics to convert horizontal forward momentum into maximum vertical lift."
    ],
    benefits: {
      cardio: 80,
      strength: 82,
      endurance: 78,
      stamina: 82,
      mobility: 79,
      calorieBurn: 80
    }
  }
];

export const INITIAL_MEALS = {
  breakfast: [],
  lunch: [],
  dinner: [],
  snacks: []
};

export const INITIAL_WATER_LOGS = [];

export const INITIAL_HISTORY = [
  {
    id: "h5",
    type: "workouts",
    title: "Workout: Leg Strength Foundations",
    subtitle: "Goblet Squats, RDLs, Step Ups, Calf Raises",
    metric: "220 kcal burned",
    subMetric: "Duration: 30 min • 4 Exercises",
    time: "05:30 PM",
    date: "Yesterday",
    icon: "dumbbell"
  },
  {
    id: "h6",
    type: "sports",
    title: "Sport: Cycling — Cadence Training",
    subtitle: "Outdoor road route • Moderate intensity",
    metric: "380 kcal burned",
    subMetric: "Duration: 45 min • Avg 24 km/h",
    time: "07:00 PM",
    date: "Yesterday",
    icon: "bike"
  },
  {
    id: "h7",
    type: "weight",
    title: "Weight Check-in",
    subtitle: "Morning fasting weight logged",
    metric: "69.5 kg",
    subMetric: "-2.5 kg from start • 58% to target",
    time: "07:15 AM",
    date: "Today",
    icon: "chart"
  },
  {
    id: "h8",
    type: "sports",
    title: "Sport: Football Match",
    subtitle: "5-a-side competitive match • High intensity",
    metric: "520 kcal burned",
    subMetric: "Duration: 60 min",
    time: "06:30 PM",
    date: "Yesterday",
    icon: "football"
  },
  {
    id: "h9",
    type: "workouts",
    title: "Workout: HIIT Athletic Burn",
    subtitle: "Burpees, Jump Squats, Mountain Climbers",
    metric: "280 kcal burned",
    subMetric: "Duration: 25 min",
    time: "08:00 AM",
    date: "Yesterday",
    icon: "dumbbell"
  }
];

export const INITIAL_REMINDERS = [
  { id: "r1", title: "Breakfast", time: "08:00 AM", repeat: "Everyday", type: "meal", icon: "apple", active: true },
  { id: "r2", title: "Lunch", time: "01:00 PM", repeat: "Everyday", type: "meal", icon: "apple", active: true },
  { id: "r3", title: "Water Hydration", time: "10:00 AM", repeat: "Every 2 Hours (08:00 AM - 09:00 PM)", type: "water", icon: "droplet", active: true },
  { id: "r4", title: "Workout", time: "06:00 PM", repeat: "Mon, Wed, Fri, Sat", type: "workout", icon: "dumbbell", active: true },
  { id: "r5", title: "Sports Session", time: "07:00 PM", repeat: "Tue, Thu, Sun", type: "sport", icon: "activity", active: true }
];

export const MOST_PLAYED_SPORTS = [
  { name: "Cycling", percentage: 42, hours: 8.2, calories: 3450, primary: true },
  { name: "Football", percentage: 25, hours: 4.8, calories: 2320, primary: false },
  { name: "Badminton", percentage: 18, hours: 3.5, calories: 1650, primary: false },
  { name: "Running", percentage: 15, hours: 2.9, calories: 1000, primary: false }
];

export const WEIGHT_JOURNEY_HISTORY = [
  { date: "Week 1", weight: 72.0 },
  { date: "Week 2", weight: 71.4 },
  { date: "Week 3", weight: 70.8 },
  { date: "Week 4", weight: 70.2 },
  { date: "Week 5", weight: 69.8 },
  { date: "Week 6 (Today)", weight: 69.5 }
];
