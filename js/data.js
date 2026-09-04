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
  calorieGoal: 2200,
  proteinGoal: 120, // g
  carbsGoal: 250, // g
  fatGoal: 65, // g
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
  {
    id: "hw-beg",
    category: "Home Workouts",
    subCategory: "Beginner",
    title: "Full Body Beginner",
    duration: 20,
    calories: 120,
    intensity: "Low-Moderate",
    exercisesCount: 4,
    description: "Foundational bodyweight movements designed to build functional mobility and strength at home without equipment.",
    exercises: [
      { name: "Bodyweight Squats", sets: 3, reps: 12, target: "Quadriceps, Glutes", restSec: 45 },
      { name: "Knee Push Ups", sets: 3, reps: 10, target: "Chest, Triceps, Core", restSec: 45 },
      { name: "Walking Lunges", sets: 3, reps: 10, target: "Hamstrings, Glutes", restSec: 45 },
      { name: "Plank Hold", sets: 3, reps: "30 sec", target: "Core Stability", restSec: 60 }
    ]
  },
  {
    id: "hw-adv",
    category: "Home Workouts",
    subCategory: "Advanced",
    title: "HIIT Athletic Burn",
    duration: 25,
    calories: 280,
    intensity: "High",
    exercisesCount: 5,
    description: "High-intensity intervals targeted at explosive power, cardiovascular endurance, and rapid athletic conditioning.",
    exercises: [
      { name: "Burpees", sets: 4, reps: 15, target: "Full Body, Cardio", restSec: 30 },
      { name: "Jump Squats", sets: 4, reps: 16, target: "Fast-twitch Quads, Calves", restSec: 40 },
      { name: "Diamond Push Ups", sets: 3, reps: 12, target: "Triceps, Chest", restSec: 45 },
      { name: "Mountain Climbers", sets: 4, reps: "45 sec", target: "Core, Shoulders", restSec: 30 },
      { name: "Bicycle Crunches", sets: 3, reps: 20, target: "Obliques, Lower Abs", restSec: 30 }
    ]
  },
  {
    id: "eq-beg",
    category: "Equipment Workouts",
    subCategory: "Beginner",
    title: "Leg Strength Foundations",
    duration: 30,
    calories: 220,
    intensity: "Moderate",
    exercisesCount: 4,
    description: "Dumbbell & barbell routine to establish knee stability, hip hinge mechanics, and lower body athletic power.",
    exercises: [
      { name: "Goblet Squats (Dumbbell)", sets: 3, reps: 12, target: "Quadriceps, Glutes", restSec: 60 },
      { name: "Romanian Deadlifts", sets: 3, reps: 10, target: "Hamstrings, Lower Back", restSec: 60 },
      { name: "Dumbbell Step Ups", sets: 3, reps: 10, target: "Glutes, Balance", restSec: 45 },
      { name: "Standing Calf Raises", sets: 4, reps: 15, target: "Gastrocnemius, Soleus", restSec: 45 }
    ]
  },
  {
    id: "eq-adv",
    category: "Equipment Workouts",
    subCategory: "Advanced",
    title: "Upper Body Athletic Power",
    duration: 35,
    calories: 310,
    intensity: "High",
    exercisesCount: 5,
    description: "Compound lifts and rotational accessory work to optimize sports pushing, pulling, and overhead strength.",
    exercises: [
      { name: "Barbell Bench Press", sets: 4, reps: 8, target: "Pectorals, Anterior Deltoid", restSec: 75 },
      { name: "Bent Over Barbell Rows", sets: 4, reps: 10, target: "Latissimus Dorsi, Rhomboids", restSec: 60 },
      { name: "Overhead Dumbbell Press", sets: 3, reps: 10, target: "Deltoids, Upper Traps", restSec: 60 },
      { name: "Pull-Ups / Lat Pulldown", sets: 3, reps: 10, target: "Lats, Biceps", restSec: 60 },
      { name: "Cable Woodchoppers", sets: 3, reps: 12, target: "Rotational Core Power", restSec: 45 }
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
  breakfast: [
    { id: "b1", name: "Eggs (Scrambled)", serving: "2 large", calories: 140, protein: 12, carbs: 1, fat: 9 },
    { id: "b2", name: "Oats with Water & Chia", serving: "40g raw", calories: 150, protein: 5, carbs: 27, fat: 3 },
    { id: "b3", name: "Apple", serving: "1 medium", calories: 78, protein: 0.4, carbs: 21, fat: 0.2 }
  ],
  lunch: [
    { id: "l1", name: "Grilled Chicken Breast", serving: "150g", calories: 248, protein: 46.5, carbs: 0, fat: 5.4 },
    { id: "l2", name: "Steamed White Rice", serving: "150g", calories: 195, protein: 4, carbs: 42, fat: 0.5 },
    { id: "l3", name: "Steamed Spinach & Dal", serving: "1 cup", calories: 253, protein: 20.8, carbs: 43.4, fat: 1.2 }
  ],
  dinner: [
    { id: "d1", name: "Grilled Salmon Fish", serving: "120g", calories: 218, protein: 30, carbs: 0, fat: 9.7 },
    { id: "d2", name: "Roasted Vegetables & Dal", serving: "1 bowl", calories: 220, protein: 14, carbs: 32, fat: 2.5 },
    { id: "d3", name: "Brown Rice", serving: "100g", calories: 130, protein: 2.7, carbs: 28, fat: 0.3 }
  ],
  snacks: [
    { id: "s1", name: "Roasted Almonds", serving: "30g", calories: 173, protein: 6, carbs: 6.1, fat: 15 },
    { id: "s2", name: "Banana", serving: "1 medium", calories: 105, protein: 1.3, carbs: 27, fat: 0.3 }
  ]
};

export const INITIAL_WATER_LOGS = [
  { id: "w1", time: "08:00 AM", amount: 250 },
  { id: "w2", time: "10:00 AM", amount: 500 },
  { id: "w3", time: "12:30 PM", amount: 500 },
  { id: "w4", time: "03:00 PM", amount: 500 },
  { id: "w5", time: "05:15 PM", amount: 650 }
];

export const INITIAL_HISTORY = [
  {
    id: "h1",
    type: "meals",
    title: "Breakfast",
    subtitle: "2 Eggs, Oats, Apple",
    metric: "368 kcal",
    subMetric: "17.4g Protein",
    time: "08:00 AM",
    date: "Today",
    icon: "apple"
  },
  {
    id: "h2",
    type: "water",
    title: "Morning Hydration",
    subtitle: "Electrolyte infused water",
    metric: "750 ml",
    subMetric: "Goal: 3,000 ml",
    time: "10:00 AM",
    date: "Today",
    icon: "droplet"
  },
  {
    id: "h3",
    type: "meals",
    title: "Lunch",
    subtitle: "Grilled Chicken, Rice, Spinach & Dal",
    metric: "696 kcal",
    subMetric: "71.3g Protein",
    time: "01:15 PM",
    date: "Today",
    icon: "apple"
  },
  {
    id: "h4",
    type: "water",
    title: "Afternoon Hydration",
    subtitle: "Pure spring water",
    metric: "1,000 ml",
    subMetric: "Progress: 1,750 ml",
    time: "03:00 PM",
    date: "Today",
    icon: "droplet"
  },
  {
    id: "h5",
    type: "workouts",
    title: "Workout: Leg Strength Foundations",
    subtitle: "Goblet Squats, RDLs, Step Ups, Calf Raises",
    metric: "220 kcal burned",
    subMetric: "Duration: 30 min • 4 Exercises",
    time: "05:30 PM",
    date: "Today",
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
    date: "Today",
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
