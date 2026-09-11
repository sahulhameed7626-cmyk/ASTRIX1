// FitSport Initial Seed & Static Data
export const INITIAL_USER = {
  name: "Sahul Hameed",
  phone: "+91 99999 88888",
  avatar: "SH",
  gender: "Male",
  age: 24,
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
  {
    "id": "basic-no-equip-bodyweight-squat",
    "code": "basic-no-equip-1",
    "title": "Bodyweight Squat",
    "name": "Bodyweight Squat",
    "category": "Without Equipment",
    "subCategory": "Basic (No Equipment)",
    "sectionKey": "basic-no-equip",
    "level": "Basic",
    "equipmentType": "No Equipment",
    "equipmentNeeded": "None",
    "duration": 30,
    "calories": 90,
    "calories30Min": 90,
    "defaultMET": 2.6,
    "targetMuscles": [
      "quads",
      "glutes",
      "core"
    ],
    "targetMusclesStr": "Quads, glutes, core",
    "target": "Quads, glutes, core",
    "setsReps": "3×10–15",
    "sets": 3,
    "reps": "10–15",
    "intensity": "Basic",
    "difficulty": "Basic",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_quads_hd.jpg",
    "description": "Stand with feet shoulder-width apart. Hinge hips back and bend knees until thighs are parallel to the floor, keeping chest proud. Drive through heels to return to standing.",
    "howTo": "Stand with feet shoulder-width apart. Hinge hips back and bend knees until thighs are parallel to the floor, keeping chest proud. Drive through heels to return to standing.",
    "exercises": [
      {
        "name": "Bodyweight Squat",
        "sets": 3,
        "reps": "3×10–15",
        "target": "Quads, glutes, core",
        "restSec": 45,
        "howTo": "Stand with feet shoulder-width apart. Hinge hips back and bend knees until thighs are parallel to the floor, keeping chest proud. Drive through heels to return to standing.",
        "caloriesPer30Min": "90 kcal"
      }
    ]
  },
  {
    "id": "basic-no-equip-wall-sit",
    "code": "basic-no-equip-2",
    "title": "Wall Sit",
    "name": "Wall Sit",
    "category": "Without Equipment",
    "subCategory": "Basic (No Equipment)",
    "sectionKey": "basic-no-equip",
    "level": "Basic",
    "equipmentType": "No Equipment",
    "equipmentNeeded": "None",
    "duration": 30,
    "calories": 105,
    "calories30Min": 105,
    "defaultMET": 3,
    "targetMuscles": [
      "quads",
      "glutes"
    ],
    "targetMusclesStr": "Quads, glutes",
    "target": "Quads, glutes",
    "setsReps": "3×20–45s",
    "sets": 3,
    "reps": "20–45s",
    "intensity": "Basic",
    "difficulty": "Basic",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_quads_hd.jpg",
    "description": "Press back flat against a wall and slide down until thighs are parallel to the ground at a 90-degree angle. Hold position while breathing steadily.",
    "howTo": "Press back flat against a wall and slide down until thighs are parallel to the ground at a 90-degree angle. Hold position while breathing steadily.",
    "exercises": [
      {
        "name": "Wall Sit",
        "sets": 3,
        "reps": "3×20–45s",
        "target": "Quads, glutes",
        "restSec": 45,
        "howTo": "Press back flat against a wall and slide down until thighs are parallel to the ground at a 90-degree angle. Hold position while breathing steadily.",
        "caloriesPer30Min": "105 kcal"
      }
    ]
  },
  {
    "id": "basic-no-equip-reverse-lunge",
    "code": "basic-no-equip-3",
    "title": "Reverse Lunge",
    "name": "Reverse Lunge",
    "category": "Without Equipment",
    "subCategory": "Basic (No Equipment)",
    "sectionKey": "basic-no-equip",
    "level": "Basic",
    "equipmentType": "No Equipment",
    "equipmentNeeded": "None",
    "duration": 30,
    "calories": 105,
    "calories30Min": 105,
    "defaultMET": 3,
    "targetMuscles": [
      "quads",
      "glutes",
      "hamstrings"
    ],
    "targetMusclesStr": "Quads, glutes, hamstrings",
    "target": "Quads, glutes, hamstrings",
    "setsReps": "3×8–12/leg",
    "sets": 3,
    "reps": "8–12/leg",
    "intensity": "Basic",
    "difficulty": "Basic",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_quads_hd.jpg",
    "description": "Step one foot backward and lower back knee toward the floor until both knees form 90-degree angles. Press through front heel to return to starting position.",
    "howTo": "Step one foot backward and lower back knee toward the floor until both knees form 90-degree angles. Press through front heel to return to starting position.",
    "exercises": [
      {
        "name": "Reverse Lunge",
        "sets": 3,
        "reps": "3×8–12/leg",
        "target": "Quads, glutes, hamstrings",
        "restSec": 45,
        "howTo": "Step one foot backward and lower back knee toward the floor until both knees form 90-degree angles. Press through front heel to return to starting position.",
        "caloriesPer30Min": "105 kcal"
      }
    ]
  },
  {
    "id": "basic-no-equip-glute-bridge",
    "code": "basic-no-equip-4",
    "title": "Glute Bridge",
    "name": "Glute Bridge",
    "category": "Without Equipment",
    "subCategory": "Basic (No Equipment)",
    "sectionKey": "basic-no-equip",
    "level": "Basic",
    "equipmentType": "No Equipment",
    "equipmentNeeded": "None",
    "duration": 30,
    "calories": 80,
    "calories30Min": 80,
    "defaultMET": 2.3,
    "targetMuscles": [
      "glutes",
      "hamstrings"
    ],
    "targetMusclesStr": "Glutes, hamstrings",
    "target": "Glutes, hamstrings",
    "setsReps": "3×12–15",
    "sets": 3,
    "reps": "12–15",
    "intensity": "Basic",
    "difficulty": "Basic",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_glutes_hd.jpg",
    "description": "Lie on back with knees bent and feet flat on floor hip-width apart. Drive through heels to lift hips toward ceiling, squeezing glutes hard at the top.",
    "howTo": "Lie on back with knees bent and feet flat on floor hip-width apart. Drive through heels to lift hips toward ceiling, squeezing glutes hard at the top.",
    "exercises": [
      {
        "name": "Glute Bridge",
        "sets": 3,
        "reps": "3×12–15",
        "target": "Glutes, hamstrings",
        "restSec": 45,
        "howTo": "Lie on back with knees bent and feet flat on floor hip-width apart. Drive through heels to lift hips toward ceiling, squeezing glutes hard at the top.",
        "caloriesPer30Min": "80 kcal"
      }
    ]
  },
  {
    "id": "basic-no-equip-calf-raise",
    "code": "basic-no-equip-5",
    "title": "Calf Raise",
    "name": "Calf Raise",
    "category": "Without Equipment",
    "subCategory": "Basic (No Equipment)",
    "sectionKey": "basic-no-equip",
    "level": "Basic",
    "equipmentType": "No Equipment",
    "equipmentNeeded": "None",
    "duration": 30,
    "calories": 75,
    "calories30Min": 75,
    "defaultMET": 2.1,
    "targetMuscles": [
      "calves"
    ],
    "targetMusclesStr": "Calves",
    "target": "Calves",
    "setsReps": "3×12–20",
    "sets": 3,
    "reps": "12–20",
    "intensity": "Basic",
    "difficulty": "Basic",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_calves_hd.jpg",
    "description": "Stand tall with feet hip-width apart. Elevate heels as high as possible by pressing through the balls of your feet, pause at top, and lower slowly under control.",
    "howTo": "Stand tall with feet hip-width apart. Elevate heels as high as possible by pressing through the balls of your feet, pause at top, and lower slowly under control.",
    "exercises": [
      {
        "name": "Calf Raise",
        "sets": 3,
        "reps": "3×12–20",
        "target": "Calves",
        "restSec": 45,
        "howTo": "Stand tall with feet hip-width apart. Elevate heels as high as possible by pressing through the balls of your feet, pause at top, and lower slowly under control.",
        "caloriesPer30Min": "75 kcal"
      }
    ]
  },
  {
    "id": "basic-no-equip-knee-push-up",
    "code": "basic-no-equip-6",
    "title": "Knee Push-Up",
    "name": "Knee Push-Up",
    "category": "Without Equipment",
    "subCategory": "Basic (No Equipment)",
    "sectionKey": "basic-no-equip",
    "level": "Basic",
    "equipmentType": "No Equipment",
    "equipmentNeeded": "None",
    "duration": 30,
    "calories": 95,
    "calories30Min": 95,
    "defaultMET": 2.7,
    "targetMuscles": [
      "chest",
      "triceps",
      "shoulders"
    ],
    "targetMusclesStr": "Chest, triceps, shoulders",
    "target": "Chest, triceps, shoulders",
    "setsReps": "3×6–12",
    "sets": 3,
    "reps": "6–12",
    "intensity": "Basic",
    "difficulty": "Basic",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_chest_hd.jpg",
    "description": "Support body on hands and knees with a straight line from knees to crown. Lower chest to floor with elbows at a 45-degree angle, then press back up.",
    "howTo": "Support body on hands and knees with a straight line from knees to crown. Lower chest to floor with elbows at a 45-degree angle, then press back up.",
    "exercises": [
      {
        "name": "Knee Push-Up",
        "sets": 3,
        "reps": "3×6–12",
        "target": "Chest, triceps, shoulders",
        "restSec": 45,
        "howTo": "Support body on hands and knees with a straight line from knees to crown. Lower chest to floor with elbows at a 45-degree angle, then press back up.",
        "caloriesPer30Min": "95 kcal"
      }
    ]
  },
  {
    "id": "basic-no-equip-incline-push-up",
    "code": "basic-no-equip-7",
    "title": "Incline Push-Up",
    "name": "Incline Push-Up",
    "category": "Without Equipment",
    "subCategory": "Basic (No Equipment)",
    "sectionKey": "basic-no-equip",
    "level": "Basic",
    "equipmentType": "No Equipment",
    "equipmentNeeded": "None",
    "duration": 30,
    "calories": 100,
    "calories30Min": 100,
    "defaultMET": 2.9,
    "targetMuscles": [
      "chest",
      "triceps"
    ],
    "targetMusclesStr": "Chest, triceps",
    "target": "Chest, triceps",
    "setsReps": "3×8–15",
    "sets": 3,
    "reps": "8–15",
    "intensity": "Basic",
    "difficulty": "Basic",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_chest_hd.jpg",
    "description": "Place hands on an elevated surface like a bench or sturdy counter. Keep core rigid, lower chest to edge, and press firmly through palms.",
    "howTo": "Place hands on an elevated surface like a bench or sturdy counter. Keep core rigid, lower chest to edge, and press firmly through palms.",
    "exercises": [
      {
        "name": "Incline Push-Up",
        "sets": 3,
        "reps": "3×8–15",
        "target": "Chest, triceps",
        "restSec": 45,
        "howTo": "Place hands on an elevated surface like a bench or sturdy counter. Keep core rigid, lower chest to edge, and press firmly through palms.",
        "caloriesPer30Min": "100 kcal"
      }
    ]
  },
  {
    "id": "basic-no-equip-bird-dog",
    "code": "basic-no-equip-8",
    "title": "Bird Dog",
    "name": "Bird Dog",
    "category": "Without Equipment",
    "subCategory": "Basic (No Equipment)",
    "sectionKey": "basic-no-equip",
    "level": "Basic",
    "equipmentType": "No Equipment",
    "equipmentNeeded": "None",
    "duration": 30,
    "calories": 75,
    "calories30Min": 75,
    "defaultMET": 2.1,
    "targetMuscles": [
      "core",
      "back",
      "glutes"
    ],
    "targetMusclesStr": "Core, back, glutes",
    "target": "Core, back, glutes",
    "setsReps": "3×8–12/side",
    "sets": 3,
    "reps": "8–12/side",
    "intensity": "Basic",
    "difficulty": "Basic",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_core_hd.jpg",
    "description": "Start on all fours. Simultaneously extend right arm forward and left leg straight backward until parallel to floor. Hold briefly, return, and alternate sides.",
    "howTo": "Start on all fours. Simultaneously extend right arm forward and left leg straight backward until parallel to floor. Hold briefly, return, and alternate sides.",
    "exercises": [
      {
        "name": "Bird Dog",
        "sets": 3,
        "reps": "3×8–12/side",
        "target": "Core, back, glutes",
        "restSec": 45,
        "howTo": "Start on all fours. Simultaneously extend right arm forward and left leg straight backward until parallel to floor. Hold briefly, return, and alternate sides.",
        "caloriesPer30Min": "75 kcal"
      }
    ]
  },
  {
    "id": "basic-no-equip-dead-bug",
    "code": "basic-no-equip-9",
    "title": "Dead Bug",
    "name": "Dead Bug",
    "category": "Without Equipment",
    "subCategory": "Basic (No Equipment)",
    "sectionKey": "basic-no-equip",
    "level": "Basic",
    "equipmentType": "No Equipment",
    "equipmentNeeded": "None",
    "duration": 30,
    "calories": 75,
    "calories30Min": 75,
    "defaultMET": 2.1,
    "targetMuscles": [
      "core"
    ],
    "targetMusclesStr": "Core",
    "target": "Core",
    "setsReps": "3×6–10/side",
    "sets": 3,
    "reps": "6–10/side",
    "intensity": "Basic",
    "difficulty": "Basic",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_core_hd.jpg",
    "description": "Lie on back with arms extended toward ceiling and knees at 90 degrees. Lower opposite arm and leg toward floor while keeping lower back glued to the ground.",
    "howTo": "Lie on back with arms extended toward ceiling and knees at 90 degrees. Lower opposite arm and leg toward floor while keeping lower back glued to the ground.",
    "exercises": [
      {
        "name": "Dead Bug",
        "sets": 3,
        "reps": "3×6–10/side",
        "target": "Core",
        "restSec": 45,
        "howTo": "Lie on back with arms extended toward ceiling and knees at 90 degrees. Lower opposite arm and leg toward floor while keeping lower back glued to the ground.",
        "caloriesPer30Min": "75 kcal"
      }
    ]
  },
  {
    "id": "basic-no-equip-plank",
    "code": "basic-no-equip-10",
    "title": "Plank",
    "name": "Plank",
    "category": "Without Equipment",
    "subCategory": "Basic (No Equipment)",
    "sectionKey": "basic-no-equip",
    "level": "Basic",
    "equipmentType": "No Equipment",
    "equipmentNeeded": "None",
    "duration": 30,
    "calories": 105,
    "calories30Min": 105,
    "defaultMET": 3,
    "targetMuscles": [
      "core",
      "shoulders"
    ],
    "targetMusclesStr": "Core, shoulders",
    "target": "Core, shoulders",
    "setsReps": "3×20–45s",
    "sets": 3,
    "reps": "20–45s",
    "intensity": "Basic",
    "difficulty": "Basic",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_core_hd.jpg",
    "description": "Rest on forearms and toes, keeping body in a perfectly straight line. Brace abdominals, squeeze glutes, and avoid sagging or elevating hips.",
    "howTo": "Rest on forearms and toes, keeping body in a perfectly straight line. Brace abdominals, squeeze glutes, and avoid sagging or elevating hips.",
    "exercises": [
      {
        "name": "Plank",
        "sets": 3,
        "reps": "3×20–45s",
        "target": "Core, shoulders",
        "restSec": 45,
        "howTo": "Rest on forearms and toes, keeping body in a perfectly straight line. Brace abdominals, squeeze glutes, and avoid sagging or elevating hips.",
        "caloriesPer30Min": "105 kcal"
      }
    ]
  },
  {
    "id": "basic-no-equip-side-plank-knees",
    "code": "basic-no-equip-11",
    "title": "Side Plank — Knees",
    "name": "Side Plank — Knees",
    "category": "Without Equipment",
    "subCategory": "Basic (No Equipment)",
    "sectionKey": "basic-no-equip",
    "level": "Basic",
    "equipmentType": "No Equipment",
    "equipmentNeeded": "None",
    "duration": 30,
    "calories": 90,
    "calories30Min": 90,
    "defaultMET": 2.6,
    "targetMuscles": [
      "obliques",
      "core"
    ],
    "targetMusclesStr": "Obliques, core",
    "target": "Obliques, core",
    "setsReps": "2–3×15–30s/side",
    "sets": 2,
    "reps": "2–3×15–30s/side",
    "intensity": "Basic",
    "difficulty": "Basic",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_obliques_hd.jpg",
    "description": "Lie on side with knees bent at 90 degrees. Prop up on forearm and lift hips until body forms a straight line from shoulders to knees.",
    "howTo": "Lie on side with knees bent at 90 degrees. Prop up on forearm and lift hips until body forms a straight line from shoulders to knees.",
    "exercises": [
      {
        "name": "Side Plank — Knees",
        "sets": 2,
        "reps": "2–3×15–30s/side",
        "target": "Obliques, core",
        "restSec": 45,
        "howTo": "Lie on side with knees bent at 90 degrees. Prop up on forearm and lift hips until body forms a straight line from shoulders to knees.",
        "caloriesPer30Min": "90 kcal"
      }
    ]
  },
  {
    "id": "basic-no-equip-march-in-place",
    "code": "basic-no-equip-12",
    "title": "March in Place",
    "name": "March in Place",
    "category": "Without Equipment",
    "subCategory": "Basic (No Equipment)",
    "sectionKey": "basic-no-equip",
    "level": "Basic",
    "equipmentType": "No Equipment",
    "equipmentNeeded": "None",
    "duration": 30,
    "calories": 125,
    "calories30Min": 125,
    "defaultMET": 3.6,
    "targetMuscles": [
      "cardio",
      "legs"
    ],
    "targetMusclesStr": "Cardio, legs",
    "target": "Cardio, legs",
    "setsReps": "3×30–60s",
    "sets": 3,
    "reps": "30–60s",
    "intensity": "Basic",
    "difficulty": "Basic",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_cardio_hd.jpg",
    "description": "Stand tall and march in rhythm, driving knees up to hip height while pumping opposite arms dynamically to elevate heart rate.",
    "howTo": "Stand tall and march in rhythm, driving knees up to hip height while pumping opposite arms dynamically to elevate heart rate.",
    "exercises": [
      {
        "name": "March in Place",
        "sets": 3,
        "reps": "3×30–60s",
        "target": "Cardio, legs",
        "restSec": 45,
        "howTo": "Stand tall and march in rhythm, driving knees up to hip height while pumping opposite arms dynamically to elevate heart rate.",
        "caloriesPer30Min": "125 kcal"
      }
    ]
  },
  {
    "id": "basic-no-equip-low-step-up",
    "code": "basic-no-equip-13",
    "title": "Low Step-Up",
    "name": "Low Step-Up",
    "category": "Without Equipment",
    "subCategory": "Basic (No Equipment)",
    "sectionKey": "basic-no-equip",
    "level": "Basic",
    "equipmentType": "No Equipment",
    "equipmentNeeded": "None",
    "duration": 30,
    "calories": 155,
    "calories30Min": 155,
    "defaultMET": 4.4,
    "targetMuscles": [
      "quads",
      "glutes"
    ],
    "targetMusclesStr": "Quads, glutes",
    "target": "Quads, glutes",
    "setsReps": "3×8–12/leg",
    "sets": 3,
    "reps": "8–12/leg",
    "intensity": "Basic",
    "difficulty": "Basic",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_quads_hd.jpg",
    "description": "Step leading foot firmly onto a low platform or bottom stair. Drive through full foot to stand up, then step down with control.",
    "howTo": "Step leading foot firmly onto a low platform or bottom stair. Drive through full foot to stand up, then step down with control.",
    "exercises": [
      {
        "name": "Low Step-Up",
        "sets": 3,
        "reps": "3×8–12/leg",
        "target": "Quads, glutes",
        "restSec": 45,
        "howTo": "Step leading foot firmly onto a low platform or bottom stair. Drive through full foot to stand up, then step down with control.",
        "caloriesPer30Min": "155 kcal"
      }
    ]
  },
  {
    "id": "basic-no-equip-standing-knee-raise",
    "code": "basic-no-equip-14",
    "title": "Standing Knee Raise",
    "name": "Standing Knee Raise",
    "category": "Without Equipment",
    "subCategory": "Basic (No Equipment)",
    "sectionKey": "basic-no-equip",
    "level": "Basic",
    "equipmentType": "No Equipment",
    "equipmentNeeded": "None",
    "duration": 30,
    "calories": 115,
    "calories30Min": 115,
    "defaultMET": 3.3,
    "targetMuscles": [
      "core",
      "hip flexors"
    ],
    "targetMusclesStr": "Core, hip flexors",
    "target": "Core, hip flexors",
    "setsReps": "3×10–15/side",
    "sets": 3,
    "reps": "10–15/side",
    "intensity": "Basic",
    "difficulty": "Basic",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_core_hd.jpg",
    "description": "Stand balanced on one leg and pull opposite knee up toward chest, crunching abdominals. Lower with control and switch legs.",
    "howTo": "Stand balanced on one leg and pull opposite knee up toward chest, crunching abdominals. Lower with control and switch legs.",
    "exercises": [
      {
        "name": "Standing Knee Raise",
        "sets": 3,
        "reps": "3×10–15/side",
        "target": "Core, hip flexors",
        "restSec": 45,
        "howTo": "Stand balanced on one leg and pull opposite knee up toward chest, crunching abdominals. Lower with control and switch legs.",
        "caloriesPer30Min": "115 kcal"
      }
    ]
  },
  {
    "id": "basic-no-equip-bird-dog-crunch",
    "code": "basic-no-equip-15",
    "title": "Bird Dog Crunch",
    "name": "Bird Dog Crunch",
    "category": "Without Equipment",
    "subCategory": "Basic (No Equipment)",
    "sectionKey": "basic-no-equip",
    "level": "Basic",
    "equipmentType": "No Equipment",
    "equipmentNeeded": "None",
    "duration": 30,
    "calories": 85,
    "calories30Min": 85,
    "defaultMET": 2.4,
    "targetMuscles": [
      "core",
      "glutes"
    ],
    "targetMusclesStr": "Core, glutes",
    "target": "Core, glutes",
    "setsReps": "2–3×8–12/side",
    "sets": 2,
    "reps": "2–3×8–12/side",
    "intensity": "Basic",
    "difficulty": "Basic",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_core_hd.jpg",
    "description": "Extend opposite arm and leg as in bird dog, then draw elbow and knee together beneath torso, contracting abdominals before extending again.",
    "howTo": "Extend opposite arm and leg as in bird dog, then draw elbow and knee together beneath torso, contracting abdominals before extending again.",
    "exercises": [
      {
        "name": "Bird Dog Crunch",
        "sets": 2,
        "reps": "2–3×8–12/side",
        "target": "Core, glutes",
        "restSec": 45,
        "howTo": "Extend opposite arm and leg as in bird dog, then draw elbow and knee together beneath torso, contracting abdominals before extending again.",
        "caloriesPer30Min": "85 kcal"
      }
    ]
  },
  {
    "id": "adv-no-equip-push-up",
    "code": "adv-no-equip-1",
    "title": "Push-Up",
    "name": "Push-Up",
    "category": "Without Equipment",
    "subCategory": "Advanced (No Equipment)",
    "sectionKey": "adv-no-equip",
    "level": "Advanced",
    "equipmentType": "No Equipment",
    "equipmentNeeded": "None",
    "duration": 30,
    "calories": 140,
    "calories30Min": 140,
    "defaultMET": 4,
    "targetMuscles": [
      "chest",
      "triceps",
      "shoulders",
      "core"
    ],
    "targetMusclesStr": "Chest, triceps, shoulders, core",
    "target": "Chest, triceps, shoulders, core",
    "setsReps": "4×8–20",
    "sets": 4,
    "reps": "8–20",
    "intensity": "Advanced",
    "difficulty": "Advanced",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_chest_hd.jpg",
    "description": "Standard floor push-up. Maintain a rigid plank line, lower chest within an inch of floor, and press up with full arm extension.",
    "howTo": "Standard floor push-up. Maintain a rigid plank line, lower chest within an inch of floor, and press up with full arm extension.",
    "exercises": [
      {
        "name": "Push-Up",
        "sets": 4,
        "reps": "4×8–20",
        "target": "Chest, triceps, shoulders, core",
        "restSec": 45,
        "howTo": "Standard floor push-up. Maintain a rigid plank line, lower chest within an inch of floor, and press up with full arm extension.",
        "caloriesPer30Min": "140 kcal"
      }
    ]
  },
  {
    "id": "adv-no-equip-diamond-push-up",
    "code": "adv-no-equip-2",
    "title": "Diamond Push-Up",
    "name": "Diamond Push-Up",
    "category": "Without Equipment",
    "subCategory": "Advanced (No Equipment)",
    "sectionKey": "adv-no-equip",
    "level": "Advanced",
    "equipmentType": "No Equipment",
    "equipmentNeeded": "None",
    "duration": 30,
    "calories": 145,
    "calories30Min": 145,
    "defaultMET": 4.1,
    "targetMuscles": [
      "triceps",
      "chest"
    ],
    "targetMusclesStr": "Triceps, chest",
    "target": "Triceps, chest",
    "setsReps": "3×6–15",
    "sets": 3,
    "reps": "6–15",
    "intensity": "Advanced",
    "difficulty": "Advanced",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_triceps_hd.jpg",
    "description": "Place hands together directly under center of chest with index fingers and thumbs forming a diamond. Lower chest to hands and press up focusing on triceps.",
    "howTo": "Place hands together directly under center of chest with index fingers and thumbs forming a diamond. Lower chest to hands and press up focusing on triceps.",
    "exercises": [
      {
        "name": "Diamond Push-Up",
        "sets": 3,
        "reps": "3×6–15",
        "target": "Triceps, chest",
        "restSec": 45,
        "howTo": "Place hands together directly under center of chest with index fingers and thumbs forming a diamond. Lower chest to hands and press up focusing on triceps.",
        "caloriesPer30Min": "145 kcal"
      }
    ]
  },
  {
    "id": "adv-no-equip-decline-push-up",
    "code": "adv-no-equip-3",
    "title": "Decline Push-Up",
    "name": "Decline Push-Up",
    "category": "Without Equipment",
    "subCategory": "Advanced (No Equipment)",
    "sectionKey": "adv-no-equip",
    "level": "Advanced",
    "equipmentType": "No Equipment",
    "equipmentNeeded": "None",
    "duration": 30,
    "calories": 150,
    "calories30Min": 150,
    "defaultMET": 4.3,
    "targetMuscles": [
      "upper chest",
      "shoulders"
    ],
    "targetMusclesStr": "Upper chest, shoulders",
    "target": "Upper chest, shoulders",
    "setsReps": "3×6–15",
    "sets": 3,
    "reps": "6–15",
    "intensity": "Advanced",
    "difficulty": "Advanced",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_upper chest_hd.jpg",
    "description": "Place toes on an elevated chair or bench with hands on floor. Lower chest with control to focus mechanical load on clavicular pectorals and shoulders.",
    "howTo": "Place toes on an elevated chair or bench with hands on floor. Lower chest with control to focus mechanical load on clavicular pectorals and shoulders.",
    "exercises": [
      {
        "name": "Decline Push-Up",
        "sets": 3,
        "reps": "3×6–15",
        "target": "Upper chest, shoulders",
        "restSec": 45,
        "howTo": "Place toes on an elevated chair or bench with hands on floor. Lower chest with control to focus mechanical load on clavicular pectorals and shoulders.",
        "caloriesPer30Min": "150 kcal"
      }
    ]
  },
  {
    "id": "adv-no-equip-pike-push-up",
    "code": "adv-no-equip-4",
    "title": "Pike Push-Up",
    "name": "Pike Push-Up",
    "category": "Without Equipment",
    "subCategory": "Advanced (No Equipment)",
    "sectionKey": "adv-no-equip",
    "level": "Advanced",
    "equipmentType": "No Equipment",
    "equipmentNeeded": "None",
    "duration": 30,
    "calories": 135,
    "calories30Min": 135,
    "defaultMET": 3.9,
    "targetMuscles": [
      "shoulders",
      "triceps"
    ],
    "targetMusclesStr": "Shoulders, triceps",
    "target": "Shoulders, triceps",
    "setsReps": "3×6–12",
    "sets": 3,
    "reps": "6–12",
    "intensity": "Advanced",
    "difficulty": "Advanced",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_shoulders_hd.jpg",
    "description": "Start in downward dog with hips high in an inverted V. Bend elbows to lower crown of head toward floor between hands, then press back up.",
    "howTo": "Start in downward dog with hips high in an inverted V. Bend elbows to lower crown of head toward floor between hands, then press back up.",
    "exercises": [
      {
        "name": "Pike Push-Up",
        "sets": 3,
        "reps": "3×6–12",
        "target": "Shoulders, triceps",
        "restSec": 45,
        "howTo": "Start in downward dog with hips high in an inverted V. Bend elbows to lower crown of head toward floor between hands, then press back up.",
        "caloriesPer30Min": "135 kcal"
      }
    ]
  },
  {
    "id": "adv-no-equip-bulgarian-split-squat",
    "code": "adv-no-equip-5",
    "title": "Bulgarian Split Squat",
    "name": "Bulgarian Split Squat",
    "category": "Without Equipment",
    "subCategory": "Advanced (No Equipment)",
    "sectionKey": "adv-no-equip",
    "level": "Advanced",
    "equipmentType": "No Equipment",
    "equipmentNeeded": "None",
    "duration": 30,
    "calories": 175,
    "calories30Min": 175,
    "defaultMET": 5,
    "targetMuscles": [
      "quads",
      "glutes",
      "hamstrings"
    ],
    "targetMusclesStr": "Quads, glutes, hamstrings",
    "target": "Quads, glutes, hamstrings",
    "setsReps": "3×8–12/leg",
    "sets": 3,
    "reps": "8–12/leg",
    "intensity": "Advanced",
    "difficulty": "Advanced",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_quads_hd.jpg",
    "description": "Place rear foot laces-down on a couch or chair behind you. Descend with front leg until front thigh is parallel to floor, then drive up through front heel.",
    "howTo": "Place rear foot laces-down on a couch or chair behind you. Descend with front leg until front thigh is parallel to floor, then drive up through front heel.",
    "exercises": [
      {
        "name": "Bulgarian Split Squat",
        "sets": 3,
        "reps": "3×8–12/leg",
        "target": "Quads, glutes, hamstrings",
        "restSec": 45,
        "howTo": "Place rear foot laces-down on a couch or chair behind you. Descend with front leg until front thigh is parallel to floor, then drive up through front heel.",
        "caloriesPer30Min": "175 kcal"
      }
    ]
  },
  {
    "id": "adv-no-equip-single-leg-glute-bridge",
    "code": "adv-no-equip-6",
    "title": "Single-Leg Glute Bridge",
    "name": "Single-Leg Glute Bridge",
    "category": "Without Equipment",
    "subCategory": "Advanced (No Equipment)",
    "sectionKey": "adv-no-equip",
    "level": "Advanced",
    "equipmentType": "No Equipment",
    "equipmentNeeded": "None",
    "duration": 30,
    "calories": 105,
    "calories30Min": 105,
    "defaultMET": 3,
    "targetMuscles": [
      "glutes",
      "hamstrings"
    ],
    "targetMusclesStr": "Glutes, hamstrings",
    "target": "Glutes, hamstrings",
    "setsReps": "3×8–15/leg",
    "sets": 3,
    "reps": "8–15/leg",
    "intensity": "Advanced",
    "difficulty": "Advanced",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_glutes_hd.jpg",
    "description": "Lie on back with one knee bent and other leg extended straight. Drive through planted heel to raise hips while keeping pelvis square.",
    "howTo": "Lie on back with one knee bent and other leg extended straight. Drive through planted heel to raise hips while keeping pelvis square.",
    "exercises": [
      {
        "name": "Single-Leg Glute Bridge",
        "sets": 3,
        "reps": "3×8–15/leg",
        "target": "Glutes, hamstrings",
        "restSec": 45,
        "howTo": "Lie on back with one knee bent and other leg extended straight. Drive through planted heel to raise hips while keeping pelvis square.",
        "caloriesPer30Min": "105 kcal"
      }
    ]
  },
  {
    "id": "adv-no-equip-single-leg-calf-raise",
    "code": "adv-no-equip-7",
    "title": "Single-Leg Calf Raise",
    "name": "Single-Leg Calf Raise",
    "category": "Without Equipment",
    "subCategory": "Advanced (No Equipment)",
    "sectionKey": "adv-no-equip",
    "level": "Advanced",
    "equipmentType": "No Equipment",
    "equipmentNeeded": "None",
    "duration": 30,
    "calories": 90,
    "calories30Min": 90,
    "defaultMET": 2.6,
    "targetMuscles": [
      "calves"
    ],
    "targetMusclesStr": "Calves",
    "target": "Calves",
    "setsReps": "3×12–20/leg",
    "sets": 3,
    "reps": "12–20/leg",
    "intensity": "Advanced",
    "difficulty": "Advanced",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_calves_hd.jpg",
    "description": "Stand on one foot (lightly touch wall for balance). Rise up onto the ball of your foot as high as possible, hold for 1 second, and lower slowly.",
    "howTo": "Stand on one foot (lightly touch wall for balance). Rise up onto the ball of your foot as high as possible, hold for 1 second, and lower slowly.",
    "exercises": [
      {
        "name": "Single-Leg Calf Raise",
        "sets": 3,
        "reps": "3×12–20/leg",
        "target": "Calves",
        "restSec": 45,
        "howTo": "Stand on one foot (lightly touch wall for balance). Rise up onto the ball of your foot as high as possible, hold for 1 second, and lower slowly.",
        "caloriesPer30Min": "90 kcal"
      }
    ]
  },
  {
    "id": "adv-no-equip-jump-squat",
    "code": "adv-no-equip-8",
    "title": "Jump Squat",
    "name": "Jump Squat",
    "category": "Without Equipment",
    "subCategory": "Advanced (No Equipment)",
    "sectionKey": "adv-no-equip",
    "level": "Advanced",
    "equipmentType": "No Equipment",
    "equipmentNeeded": "None",
    "duration": 30,
    "calories": 220,
    "calories30Min": 220,
    "defaultMET": 6.3,
    "targetMuscles": [
      "legs",
      "glutes",
      "calves"
    ],
    "targetMusclesStr": "Legs, glutes, calves",
    "target": "Legs, glutes, calves",
    "setsReps": "3×6–12",
    "sets": 3,
    "reps": "6–12",
    "intensity": "Advanced",
    "difficulty": "Advanced",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_legs_hd.jpg",
    "description": "Descend into a quarter squat, then explode vertically into the air reaching upward. Land softly on balls of feet and immediately absorb into next repetition.",
    "howTo": "Descend into a quarter squat, then explode vertically into the air reaching upward. Land softly on balls of feet and immediately absorb into next repetition.",
    "exercises": [
      {
        "name": "Jump Squat",
        "sets": 3,
        "reps": "3×6–12",
        "target": "Legs, glutes, calves",
        "restSec": 45,
        "howTo": "Descend into a quarter squat, then explode vertically into the air reaching upward. Land softly on balls of feet and immediately absorb into next repetition.",
        "caloriesPer30Min": "220 kcal"
      }
    ]
  },
  {
    "id": "adv-no-equip-reverse-lunge-knee-drive",
    "code": "adv-no-equip-9",
    "title": "Reverse Lunge + Knee Drive",
    "name": "Reverse Lunge + Knee Drive",
    "category": "Without Equipment",
    "subCategory": "Advanced (No Equipment)",
    "sectionKey": "adv-no-equip",
    "level": "Advanced",
    "equipmentType": "No Equipment",
    "equipmentNeeded": "None",
    "duration": 30,
    "calories": 175,
    "calories30Min": 175,
    "defaultMET": 5,
    "targetMuscles": [
      "legs",
      "glutes",
      "core"
    ],
    "targetMusclesStr": "Legs, glutes, core",
    "target": "Legs, glutes, core",
    "setsReps": "3×8–12/leg",
    "sets": 3,
    "reps": "8–12/leg",
    "intensity": "Advanced",
    "difficulty": "Advanced",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_legs_hd.jpg",
    "description": "Step back into a reverse lunge, then explosively drive that back knee up toward chest in a single fluid athletic movement.",
    "howTo": "Step back into a reverse lunge, then explosively drive that back knee up toward chest in a single fluid athletic movement.",
    "exercises": [
      {
        "name": "Reverse Lunge + Knee Drive",
        "sets": 3,
        "reps": "3×8–12/leg",
        "target": "Legs, glutes, core",
        "restSec": 45,
        "howTo": "Step back into a reverse lunge, then explosively drive that back knee up toward chest in a single fluid athletic movement.",
        "caloriesPer30Min": "175 kcal"
      }
    ]
  },
  {
    "id": "adv-no-equip-bear-crawl",
    "code": "adv-no-equip-10",
    "title": "Bear Crawl",
    "name": "Bear Crawl",
    "category": "Without Equipment",
    "subCategory": "Advanced (No Equipment)",
    "sectionKey": "adv-no-equip",
    "level": "Advanced",
    "equipmentType": "No Equipment",
    "equipmentNeeded": "None",
    "duration": 30,
    "calories": 220,
    "calories30Min": 220,
    "defaultMET": 6.3,
    "targetMuscles": [
      "core",
      "shoulders",
      "legs"
    ],
    "targetMusclesStr": "Core, shoulders, legs",
    "target": "Core, shoulders, legs",
    "setsReps": "3×20–40s",
    "sets": 3,
    "reps": "20–40s",
    "intensity": "Advanced",
    "difficulty": "Advanced",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_core_hd.jpg",
    "description": "Hover on hands and toes with knees bent 90 degrees hovering 2 inches off floor. Crawl forward and backward taking short contralateral steps while keeping back flat.",
    "howTo": "Hover on hands and toes with knees bent 90 degrees hovering 2 inches off floor. Crawl forward and backward taking short contralateral steps while keeping back flat.",
    "exercises": [
      {
        "name": "Bear Crawl",
        "sets": 3,
        "reps": "3×20–40s",
        "target": "Core, shoulders, legs",
        "restSec": 45,
        "howTo": "Hover on hands and toes with knees bent 90 degrees hovering 2 inches off floor. Crawl forward and backward taking short contralateral steps while keeping back flat.",
        "caloriesPer30Min": "220 kcal"
      }
    ]
  },
  {
    "id": "adv-no-equip-mountain-climber",
    "code": "adv-no-equip-11",
    "title": "Mountain Climber",
    "name": "Mountain Climber",
    "category": "Without Equipment",
    "subCategory": "Advanced (No Equipment)",
    "sectionKey": "adv-no-equip",
    "level": "Advanced",
    "equipmentType": "No Equipment",
    "equipmentNeeded": "None",
    "duration": 30,
    "calories": 270,
    "calories30Min": 270,
    "defaultMET": 7.7,
    "targetMuscles": [
      "core",
      "shoulders",
      "cardio"
    ],
    "targetMusclesStr": "Core, shoulders, cardio",
    "target": "Core, shoulders, cardio",
    "setsReps": "3×20–40s",
    "sets": 3,
    "reps": "20–40s",
    "intensity": "Advanced",
    "difficulty": "Advanced",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_core_hd.jpg",
    "description": "Hold top of push-up position. Alternately drive knees rapidly toward chest in an explosive running motion while keeping hips low.",
    "howTo": "Hold top of push-up position. Alternately drive knees rapidly toward chest in an explosive running motion while keeping hips low.",
    "exercises": [
      {
        "name": "Mountain Climber",
        "sets": 3,
        "reps": "3×20–40s",
        "target": "Core, shoulders, cardio",
        "restSec": 45,
        "howTo": "Hold top of push-up position. Alternately drive knees rapidly toward chest in an explosive running motion while keeping hips low.",
        "caloriesPer30Min": "270 kcal"
      }
    ]
  },
  {
    "id": "adv-no-equip-hollow-body-hold",
    "code": "adv-no-equip-12",
    "title": "Hollow Body Hold",
    "name": "Hollow Body Hold",
    "category": "Without Equipment",
    "subCategory": "Advanced (No Equipment)",
    "sectionKey": "adv-no-equip",
    "level": "Advanced",
    "equipmentType": "No Equipment",
    "equipmentNeeded": "None",
    "duration": 30,
    "calories": 120,
    "calories30Min": 120,
    "defaultMET": 3.4,
    "targetMuscles": [
      "core"
    ],
    "targetMusclesStr": "Core",
    "target": "Core",
    "setsReps": "3×15–40s",
    "sets": 3,
    "reps": "15–40s",
    "intensity": "Advanced",
    "difficulty": "Advanced",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_core_hd.jpg",
    "description": "Lie flat, press lower back firmly into floor, and simultaneously lift legs and shoulders a few inches off ground with arms overhead in a banana shape.",
    "howTo": "Lie flat, press lower back firmly into floor, and simultaneously lift legs and shoulders a few inches off ground with arms overhead in a banana shape.",
    "exercises": [
      {
        "name": "Hollow Body Hold",
        "sets": 3,
        "reps": "3×15–40s",
        "target": "Core",
        "restSec": 45,
        "howTo": "Lie flat, press lower back firmly into floor, and simultaneously lift legs and shoulders a few inches off ground with arms overhead in a banana shape.",
        "caloriesPer30Min": "120 kcal"
      }
    ]
  },
  {
    "id": "adv-no-equip-side-plank",
    "code": "adv-no-equip-13",
    "title": "Side Plank",
    "name": "Side Plank",
    "category": "Without Equipment",
    "subCategory": "Advanced (No Equipment)",
    "sectionKey": "adv-no-equip",
    "level": "Advanced",
    "equipmentType": "No Equipment",
    "equipmentNeeded": "None",
    "duration": 30,
    "calories": 125,
    "calories30Min": 125,
    "defaultMET": 3.6,
    "targetMuscles": [
      "obliques",
      "core",
      "shoulders"
    ],
    "targetMusclesStr": "Obliques, core, shoulders",
    "target": "Obliques, core, shoulders",
    "setsReps": "3×20–45s/side",
    "sets": 3,
    "reps": "20–45s/side",
    "intensity": "Advanced",
    "difficulty": "Advanced",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_obliques_hd.jpg",
    "description": "Stack feet and rest on one forearm with body in a straight diagonal line. Lift hips high and engage obliques and lateral stabilizers.",
    "howTo": "Stack feet and rest on one forearm with body in a straight diagonal line. Lift hips high and engage obliques and lateral stabilizers.",
    "exercises": [
      {
        "name": "Side Plank",
        "sets": 3,
        "reps": "3×20–45s/side",
        "target": "Obliques, core, shoulders",
        "restSec": 45,
        "howTo": "Stack feet and rest on one forearm with body in a straight diagonal line. Lift hips high and engage obliques and lateral stabilizers.",
        "caloriesPer30Min": "125 kcal"
      }
    ]
  },
  {
    "id": "adv-no-equip-burpee",
    "code": "adv-no-equip-14",
    "title": "Burpee",
    "name": "Burpee",
    "category": "Without Equipment",
    "subCategory": "Advanced (No Equipment)",
    "sectionKey": "adv-no-equip",
    "level": "Advanced",
    "equipmentType": "No Equipment",
    "equipmentNeeded": "None",
    "duration": 30,
    "calories": 300,
    "calories30Min": 300,
    "defaultMET": 8.6,
    "targetMuscles": [
      "full body",
      "cardio"
    ],
    "targetMusclesStr": "Full body, cardio",
    "target": "Full body, cardio",
    "setsReps": "3×6–12",
    "sets": 3,
    "reps": "6–12",
    "intensity": "Advanced",
    "difficulty": "Advanced",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_full body_hd.jpg",
    "description": "From standing, drop hands to floor, kick feet back into plank, perform a push-up, jump feet back to hands, and explode vertically with a jump.",
    "howTo": "From standing, drop hands to floor, kick feet back into plank, perform a push-up, jump feet back to hands, and explode vertically with a jump.",
    "exercises": [
      {
        "name": "Burpee",
        "sets": 3,
        "reps": "3×6–12",
        "target": "Full body, cardio",
        "restSec": 45,
        "howTo": "From standing, drop hands to floor, kick feet back into plank, perform a push-up, jump feet back to hands, and explode vertically with a jump.",
        "caloriesPer30Min": "300 kcal"
      }
    ]
  },
  {
    "id": "adv-no-equip-single-leg-squat-to-support",
    "code": "adv-no-equip-15",
    "title": "Single-Leg Squat to Support",
    "name": "Single-Leg Squat to Support",
    "category": "Without Equipment",
    "subCategory": "Advanced (No Equipment)",
    "sectionKey": "adv-no-equip",
    "level": "Advanced",
    "equipmentType": "No Equipment",
    "equipmentNeeded": "None",
    "duration": 30,
    "calories": 160,
    "calories30Min": 160,
    "defaultMET": 4.6,
    "targetMuscles": [
      "quads",
      "glutes",
      "core"
    ],
    "targetMusclesStr": "Quads, glutes, core",
    "target": "Quads, glutes, core",
    "setsReps": "3×5–10/leg",
    "sets": 3,
    "reps": "5–10/leg",
    "intensity": "Advanced",
    "difficulty": "Advanced",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_quads_hd.jpg",
    "description": "Balance on one leg with opposite leg extended forward. Lower hips down with control onto a chair or bench, then drive through heel to stand without momentum.",
    "howTo": "Balance on one leg with opposite leg extended forward. Lower hips down with control onto a chair or bench, then drive through heel to stand without momentum.",
    "exercises": [
      {
        "name": "Single-Leg Squat to Support",
        "sets": 3,
        "reps": "3×5–10/leg",
        "target": "Quads, glutes, core",
        "restSec": 45,
        "howTo": "Balance on one leg with opposite leg extended forward. Lower hips down with control onto a chair or bench, then drive through heel to stand without momentum.",
        "caloriesPer30Min": "160 kcal"
      }
    ]
  },
  {
    "id": "basic-equip-dumbbell-goblet-squat",
    "code": "basic-equip-1",
    "title": "Dumbbell Goblet Squat",
    "name": "Dumbbell Goblet Squat",
    "category": "With Equipment",
    "subCategory": "Basic (With Equipment)",
    "sectionKey": "basic-equip",
    "level": "Basic",
    "equipmentType": "With Equipment",
    "equipmentNeeded": "Dumbbell",
    "duration": 30,
    "calories": 125,
    "calories30Min": 125,
    "defaultMET": 3.6,
    "targetMuscles": [
      "quads",
      "glutes",
      "core"
    ],
    "targetMusclesStr": "Quads, glutes, core",
    "target": "Quads, glutes, core",
    "setsReps": "3×8–15",
    "sets": 3,
    "reps": "8–15",
    "intensity": "Basic",
    "difficulty": "Basic",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_quads_hd.jpg",
    "description": "Hold a dumbbell vertically against chest with elbows tucked. Squat deeply between knees, keeping torso upright, then drive up through heels.",
    "howTo": "Hold a dumbbell vertically against chest with elbows tucked. Squat deeply between knees, keeping torso upright, then drive up through heels.",
    "exercises": [
      {
        "name": "Dumbbell Goblet Squat",
        "sets": 3,
        "reps": "3×8–15",
        "target": "Quads, glutes, core",
        "restSec": 45,
        "howTo": "Hold a dumbbell vertically against chest with elbows tucked. Squat deeply between knees, keeping torso upright, then drive up through heels.",
        "caloriesPer30Min": "125 kcal"
      }
    ]
  },
  {
    "id": "basic-equip-dumbbell-romanian-deadlift",
    "code": "basic-equip-2",
    "title": "Dumbbell Romanian Deadlift",
    "name": "Dumbbell Romanian Deadlift",
    "category": "With Equipment",
    "subCategory": "Basic (With Equipment)",
    "sectionKey": "basic-equip",
    "level": "Basic",
    "equipmentType": "With Equipment",
    "equipmentNeeded": "Dumbbells",
    "duration": 30,
    "calories": 120,
    "calories30Min": 120,
    "defaultMET": 3.4,
    "targetMuscles": [
      "hamstrings",
      "glutes"
    ],
    "targetMusclesStr": "Hamstrings, glutes",
    "target": "Hamstrings, glutes",
    "setsReps": "3×8–12",
    "sets": 3,
    "reps": "8–12",
    "intensity": "Basic",
    "difficulty": "Basic",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_hamstrings_hd.jpg",
    "description": "Hold dumbbells in front of thighs. Hinge backward at hips with soft knees, lowering weights along shins until hamstrings stretch, then squeeze glutes to stand.",
    "howTo": "Hold dumbbells in front of thighs. Hinge backward at hips with soft knees, lowering weights along shins until hamstrings stretch, then squeeze glutes to stand.",
    "exercises": [
      {
        "name": "Dumbbell Romanian Deadlift",
        "sets": 3,
        "reps": "3×8–12",
        "target": "Hamstrings, glutes",
        "restSec": 45,
        "howTo": "Hold dumbbells in front of thighs. Hinge backward at hips with soft knees, lowering weights along shins until hamstrings stretch, then squeeze glutes to stand.",
        "caloriesPer30Min": "120 kcal"
      }
    ]
  },
  {
    "id": "basic-equip-dumbbell-floor-press",
    "code": "basic-equip-3",
    "title": "Dumbbell Floor Press",
    "name": "Dumbbell Floor Press",
    "category": "With Equipment",
    "subCategory": "Basic (With Equipment)",
    "sectionKey": "basic-equip",
    "level": "Basic",
    "equipmentType": "With Equipment",
    "equipmentNeeded": "Dumbbells",
    "duration": 30,
    "calories": 110,
    "calories30Min": 110,
    "defaultMET": 3.1,
    "targetMuscles": [
      "chest",
      "triceps"
    ],
    "targetMusclesStr": "Chest, triceps",
    "target": "Chest, triceps",
    "setsReps": "3×8–15",
    "sets": 3,
    "reps": "8–15",
    "intensity": "Basic",
    "difficulty": "Basic",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_chest_hd.jpg",
    "description": "Lie on floor with knees bent. Press dumbbells upward from chest until arms extend, lowering until triceps lightly touch floor to protect shoulders.",
    "howTo": "Lie on floor with knees bent. Press dumbbells upward from chest until arms extend, lowering until triceps lightly touch floor to protect shoulders.",
    "exercises": [
      {
        "name": "Dumbbell Floor Press",
        "sets": 3,
        "reps": "3×8–15",
        "target": "Chest, triceps",
        "restSec": 45,
        "howTo": "Lie on floor with knees bent. Press dumbbells upward from chest until arms extend, lowering until triceps lightly touch floor to protect shoulders.",
        "caloriesPer30Min": "110 kcal"
      }
    ]
  },
  {
    "id": "basic-equip-one-arm-dumbbell-row",
    "code": "basic-equip-4",
    "title": "One-Arm Dumbbell Row",
    "name": "One-Arm Dumbbell Row",
    "category": "With Equipment",
    "subCategory": "Basic (With Equipment)",
    "sectionKey": "basic-equip",
    "level": "Basic",
    "equipmentType": "With Equipment",
    "equipmentNeeded": "Dumbbell",
    "duration": 30,
    "calories": 115,
    "calories30Min": 115,
    "defaultMET": 3.3,
    "targetMuscles": [
      "back",
      "biceps"
    ],
    "targetMusclesStr": "Back, biceps",
    "target": "Back, biceps",
    "setsReps": "3×8–15/side",
    "sets": 3,
    "reps": "8–15/side",
    "intensity": "Basic",
    "difficulty": "Basic",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_back_hd.jpg",
    "description": "Support one knee and hand on a bench or couch. Pull dumbbell toward hip with elbow grazing ribcage, squeezing shoulder blade at peak.",
    "howTo": "Support one knee and hand on a bench or couch. Pull dumbbell toward hip with elbow grazing ribcage, squeezing shoulder blade at peak.",
    "exercises": [
      {
        "name": "One-Arm Dumbbell Row",
        "sets": 3,
        "reps": "3×8–15/side",
        "target": "Back, biceps",
        "restSec": 45,
        "howTo": "Support one knee and hand on a bench or couch. Pull dumbbell toward hip with elbow grazing ribcage, squeezing shoulder blade at peak.",
        "caloriesPer30Min": "115 kcal"
      }
    ]
  },
  {
    "id": "basic-equip-dumbbell-shoulder-press",
    "code": "basic-equip-5",
    "title": "Dumbbell Shoulder Press",
    "name": "Dumbbell Shoulder Press",
    "category": "With Equipment",
    "subCategory": "Basic (With Equipment)",
    "sectionKey": "basic-equip",
    "level": "Basic",
    "equipmentType": "With Equipment",
    "equipmentNeeded": "Dumbbells",
    "duration": 30,
    "calories": 105,
    "calories30Min": 105,
    "defaultMET": 3,
    "targetMuscles": [
      "shoulders",
      "triceps"
    ],
    "targetMusclesStr": "Shoulders, triceps",
    "target": "Shoulders, triceps",
    "setsReps": "3×8–12",
    "sets": 3,
    "reps": "8–12",
    "intensity": "Basic",
    "difficulty": "Basic",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_shoulders_hd.jpg",
    "description": "Hold dumbbells at shoulder level with palms facing forward or neutral. Press weights directly overhead until arms lock out, then lower with control.",
    "howTo": "Hold dumbbells at shoulder level with palms facing forward or neutral. Press weights directly overhead until arms lock out, then lower with control.",
    "exercises": [
      {
        "name": "Dumbbell Shoulder Press",
        "sets": 3,
        "reps": "3×8–12",
        "target": "Shoulders, triceps",
        "restSec": 45,
        "howTo": "Hold dumbbells at shoulder level with palms facing forward or neutral. Press weights directly overhead until arms lock out, then lower with control.",
        "caloriesPer30Min": "105 kcal"
      }
    ]
  },
  {
    "id": "basic-equip-dumbbell-biceps-curl",
    "code": "basic-equip-6",
    "title": "Dumbbell Biceps Curl",
    "name": "Dumbbell Biceps Curl",
    "category": "With Equipment",
    "subCategory": "Basic (With Equipment)",
    "sectionKey": "basic-equip",
    "level": "Basic",
    "equipmentType": "With Equipment",
    "equipmentNeeded": "Dumbbells",
    "duration": 30,
    "calories": 85,
    "calories30Min": 85,
    "defaultMET": 2.4,
    "targetMuscles": [
      "biceps"
    ],
    "targetMusclesStr": "Biceps",
    "target": "Biceps",
    "setsReps": "3×10–15",
    "sets": 3,
    "reps": "10–15",
    "intensity": "Basic",
    "difficulty": "Basic",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_biceps_hd.jpg",
    "description": "Stand with arms at sides holding dumbbells. Keep elbows pinned to ribs as you curl weights toward shoulders, squeezing biceps at top.",
    "howTo": "Stand with arms at sides holding dumbbells. Keep elbows pinned to ribs as you curl weights toward shoulders, squeezing biceps at top.",
    "exercises": [
      {
        "name": "Dumbbell Biceps Curl",
        "sets": 3,
        "reps": "3×10–15",
        "target": "Biceps",
        "restSec": 45,
        "howTo": "Stand with arms at sides holding dumbbells. Keep elbows pinned to ribs as you curl weights toward shoulders, squeezing biceps at top.",
        "caloriesPer30Min": "85 kcal"
      }
    ]
  },
  {
    "id": "basic-equip-overhead-triceps-extension",
    "code": "basic-equip-7",
    "title": "Overhead Triceps Extension",
    "name": "Overhead Triceps Extension",
    "category": "With Equipment",
    "subCategory": "Basic (With Equipment)",
    "sectionKey": "basic-equip",
    "level": "Basic",
    "equipmentType": "With Equipment",
    "equipmentNeeded": "Dumbbell",
    "duration": 30,
    "calories": 80,
    "calories30Min": 80,
    "defaultMET": 2.3,
    "targetMuscles": [
      "triceps"
    ],
    "targetMusclesStr": "Triceps",
    "target": "Triceps",
    "setsReps": "3×10–15",
    "sets": 3,
    "reps": "10–15",
    "intensity": "Basic",
    "difficulty": "Basic",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_triceps_hd.jpg",
    "description": "Hold one dumbbell with both hands overhead. Keeping elbows pointing forward and close to ears, lower weight behind head, then extend arms to return.",
    "howTo": "Hold one dumbbell with both hands overhead. Keeping elbows pointing forward and close to ears, lower weight behind head, then extend arms to return.",
    "exercises": [
      {
        "name": "Overhead Triceps Extension",
        "sets": 3,
        "reps": "3×10–15",
        "target": "Triceps",
        "restSec": 45,
        "howTo": "Hold one dumbbell with both hands overhead. Keeping elbows pointing forward and close to ears, lower weight behind head, then extend arms to return.",
        "caloriesPer30Min": "80 kcal"
      }
    ]
  },
  {
    "id": "basic-equip-dumbbell-lateral-raise",
    "code": "basic-equip-8",
    "title": "Dumbbell Lateral Raise",
    "name": "Dumbbell Lateral Raise",
    "category": "With Equipment",
    "subCategory": "Basic (With Equipment)",
    "sectionKey": "basic-equip",
    "level": "Basic",
    "equipmentType": "With Equipment",
    "equipmentNeeded": "Dumbbells",
    "duration": 30,
    "calories": 75,
    "calories30Min": 75,
    "defaultMET": 2.1,
    "targetMuscles": [
      "side delts"
    ],
    "targetMusclesStr": "Side delts",
    "target": "Side delts",
    "setsReps": "2–3×10–15",
    "sets": 2,
    "reps": "2–3×10–15",
    "intensity": "Basic",
    "difficulty": "Basic",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_side delts_hd.jpg",
    "description": "Stand tall with dumbbells at sides. Raise arms out to the sides with slight bend in elbows until parallel to floor, leading with elbows.",
    "howTo": "Stand tall with dumbbells at sides. Raise arms out to the sides with slight bend in elbows until parallel to floor, leading with elbows.",
    "exercises": [
      {
        "name": "Dumbbell Lateral Raise",
        "sets": 2,
        "reps": "2–3×10–15",
        "target": "Side delts",
        "restSec": 45,
        "howTo": "Stand tall with dumbbells at sides. Raise arms out to the sides with slight bend in elbows until parallel to floor, leading with elbows.",
        "caloriesPer30Min": "75 kcal"
      }
    ]
  },
  {
    "id": "basic-equip-resistance-band-row",
    "code": "basic-equip-9",
    "title": "Resistance-Band Row",
    "name": "Resistance-Band Row",
    "category": "With Equipment",
    "subCategory": "Basic (With Equipment)",
    "sectionKey": "basic-equip",
    "level": "Basic",
    "equipmentType": "With Equipment",
    "equipmentNeeded": "Resistance Band",
    "duration": 30,
    "calories": 95,
    "calories30Min": 95,
    "defaultMET": 2.7,
    "targetMuscles": [
      "back",
      "biceps"
    ],
    "targetMusclesStr": "Back, biceps",
    "target": "Back, biceps",
    "setsReps": "3×10–15",
    "sets": 3,
    "reps": "10–15",
    "intensity": "Basic",
    "difficulty": "Basic",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_back_hd.jpg",
    "description": "Loop band around feet while seated or standing hinged. Pull handles toward torso, retracting shoulder blades and keeping elbows tight.",
    "howTo": "Loop band around feet while seated or standing hinged. Pull handles toward torso, retracting shoulder blades and keeping elbows tight.",
    "exercises": [
      {
        "name": "Resistance-Band Row",
        "sets": 3,
        "reps": "3×10–15",
        "target": "Back, biceps",
        "restSec": 45,
        "howTo": "Loop band around feet while seated or standing hinged. Pull handles toward torso, retracting shoulder blades and keeping elbows tight.",
        "caloriesPer30Min": "95 kcal"
      }
    ]
  },
  {
    "id": "basic-equip-band-chest-press",
    "code": "basic-equip-10",
    "title": "Band Chest Press",
    "name": "Band Chest Press",
    "category": "With Equipment",
    "subCategory": "Basic (With Equipment)",
    "sectionKey": "basic-equip",
    "level": "Basic",
    "equipmentType": "With Equipment",
    "equipmentNeeded": "Resistance Band",
    "duration": 30,
    "calories": 100,
    "calories30Min": 100,
    "defaultMET": 2.9,
    "targetMuscles": [
      "chest",
      "triceps"
    ],
    "targetMusclesStr": "Chest, triceps",
    "target": "Chest, triceps",
    "setsReps": "3×10–15",
    "sets": 3,
    "reps": "10–15",
    "intensity": "Basic",
    "difficulty": "Basic",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_chest_hd.jpg",
    "description": "Anchor band behind back across shoulder blades. Press handles forward until arms extend fully, contracting pectorals at completion.",
    "howTo": "Anchor band behind back across shoulder blades. Press handles forward until arms extend fully, contracting pectorals at completion.",
    "exercises": [
      {
        "name": "Band Chest Press",
        "sets": 3,
        "reps": "3×10–15",
        "target": "Chest, triceps",
        "restSec": 45,
        "howTo": "Anchor band behind back across shoulder blades. Press handles forward until arms extend fully, contracting pectorals at completion.",
        "caloriesPer30Min": "100 kcal"
      }
    ]
  },
  {
    "id": "basic-equip-band-pull-apart",
    "code": "basic-equip-11",
    "title": "Band Pull-Apart",
    "name": "Band Pull-Apart",
    "category": "With Equipment",
    "subCategory": "Basic (With Equipment)",
    "sectionKey": "basic-equip",
    "level": "Basic",
    "equipmentType": "With Equipment",
    "equipmentNeeded": "Resistance Band",
    "duration": 30,
    "calories": 70,
    "calories30Min": 70,
    "defaultMET": 2,
    "targetMuscles": [
      "upper back",
      "rear delts"
    ],
    "targetMusclesStr": "Upper back, rear delts",
    "target": "Upper back, rear delts",
    "setsReps": "2–3×12–20",
    "sets": 2,
    "reps": "2–3×12–20",
    "intensity": "Basic",
    "difficulty": "Basic",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_upper back_hd.jpg",
    "description": "Hold band in front at shoulder height with arms straight. Pull band apart horizontally across chest until it touches sternum, squeezing rear deltoids.",
    "howTo": "Hold band in front at shoulder height with arms straight. Pull band apart horizontally across chest until it touches sternum, squeezing rear deltoids.",
    "exercises": [
      {
        "name": "Band Pull-Apart",
        "sets": 2,
        "reps": "2–3×12–20",
        "target": "Upper back, rear delts",
        "restSec": 45,
        "howTo": "Hold band in front at shoulder height with arms straight. Pull band apart horizontally across chest until it touches sternum, squeezing rear deltoids.",
        "caloriesPer30Min": "70 kcal"
      }
    ]
  },
  {
    "id": "basic-equip-band-glute-kickback",
    "code": "basic-equip-12",
    "title": "Band Glute Kickback",
    "name": "Band Glute Kickback",
    "category": "With Equipment",
    "subCategory": "Basic (With Equipment)",
    "sectionKey": "basic-equip",
    "level": "Basic",
    "equipmentType": "With Equipment",
    "equipmentNeeded": "Resistance Band",
    "duration": 30,
    "calories": 80,
    "calories30Min": 80,
    "defaultMET": 2.3,
    "targetMuscles": [
      "glutes"
    ],
    "targetMusclesStr": "Glutes",
    "target": "Glutes",
    "setsReps": "3×10–15/leg",
    "sets": 3,
    "reps": "10–15/leg",
    "intensity": "Basic",
    "difficulty": "Basic",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_glutes_hd.jpg",
    "description": "Loop band around ankles. Stand tall and kick one leg straight back without arching lower back, squeezing glute at top of range.",
    "howTo": "Loop band around ankles. Stand tall and kick one leg straight back without arching lower back, squeezing glute at top of range.",
    "exercises": [
      {
        "name": "Band Glute Kickback",
        "sets": 3,
        "reps": "3×10–15/leg",
        "target": "Glutes",
        "restSec": 45,
        "howTo": "Loop band around ankles. Stand tall and kick one leg straight back without arching lower back, squeezing glute at top of range.",
        "caloriesPer30Min": "80 kcal"
      }
    ]
  },
  {
    "id": "basic-equip-kettlebell-deadlift",
    "code": "basic-equip-13",
    "title": "Kettlebell Deadlift",
    "name": "Kettlebell Deadlift",
    "category": "With Equipment",
    "subCategory": "Basic (With Equipment)",
    "sectionKey": "basic-equip",
    "level": "Basic",
    "equipmentType": "With Equipment",
    "equipmentNeeded": "Kettlebell",
    "duration": 30,
    "calories": 135,
    "calories30Min": 135,
    "defaultMET": 3.9,
    "targetMuscles": [
      "glutes",
      "hamstrings",
      "back"
    ],
    "targetMusclesStr": "Glutes, hamstrings, back",
    "target": "Glutes, hamstrings, back",
    "setsReps": "3×8–12",
    "sets": 3,
    "reps": "8–12",
    "intensity": "Basic",
    "difficulty": "Basic",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_glutes_hd.jpg",
    "description": "Stand over kettlebell with feet shoulder-width. Hinge at hips to grip handle, brace core, and drive through floor to stand tall.",
    "howTo": "Stand over kettlebell with feet shoulder-width. Hinge at hips to grip handle, brace core, and drive through floor to stand tall.",
    "exercises": [
      {
        "name": "Kettlebell Deadlift",
        "sets": 3,
        "reps": "3×8–12",
        "target": "Glutes, hamstrings, back",
        "restSec": 45,
        "howTo": "Stand over kettlebell with feet shoulder-width. Hinge at hips to grip handle, brace core, and drive through floor to stand tall.",
        "caloriesPer30Min": "135 kcal"
      }
    ]
  },
  {
    "id": "basic-equip-step-up",
    "code": "basic-equip-14",
    "title": "Step-Up",
    "name": "Step-Up",
    "category": "With Equipment",
    "subCategory": "Basic (With Equipment)",
    "sectionKey": "basic-equip",
    "level": "Basic",
    "equipmentType": "With Equipment",
    "equipmentNeeded": "Step / Platform",
    "duration": 30,
    "calories": 170,
    "calories30Min": 170,
    "defaultMET": 4.9,
    "targetMuscles": [
      "quads",
      "glutes"
    ],
    "targetMusclesStr": "Quads, glutes",
    "target": "Quads, glutes",
    "setsReps": "3×8–12/leg",
    "sets": 3,
    "reps": "8–12/leg",
    "intensity": "Basic",
    "difficulty": "Basic",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_quads_hd.jpg",
    "description": "Hold dumbbells at sides and step one foot onto a sturdy bench or box. Drive through whole foot to stand tall without bouncing off rear leg.",
    "howTo": "Hold dumbbells at sides and step one foot onto a sturdy bench or box. Drive through whole foot to stand tall without bouncing off rear leg.",
    "exercises": [
      {
        "name": "Step-Up",
        "sets": 3,
        "reps": "3×8–12/leg",
        "target": "Quads, glutes",
        "restSec": 45,
        "howTo": "Hold dumbbells at sides and step one foot onto a sturdy bench or box. Drive through whole foot to stand tall without bouncing off rear leg.",
        "caloriesPer30Min": "170 kcal"
      }
    ]
  },
  {
    "id": "basic-equip-farmer-carry",
    "code": "basic-equip-15",
    "title": "Farmer Carry",
    "name": "Farmer Carry",
    "category": "With Equipment",
    "subCategory": "Basic (With Equipment)",
    "sectionKey": "basic-equip",
    "level": "Basic",
    "equipmentType": "With Equipment",
    "equipmentNeeded": "Dumbbells / Kettlebells",
    "duration": 30,
    "calories": 180,
    "calories30Min": 180,
    "defaultMET": 5.1,
    "targetMuscles": [
      "grip",
      "core",
      "traps",
      "legs"
    ],
    "targetMusclesStr": "Grip, core, traps, legs",
    "target": "Grip, core, traps, legs",
    "setsReps": "3×20–40m",
    "sets": 3,
    "reps": "20–40m",
    "intensity": "Basic",
    "difficulty": "Basic",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_grip_hd.jpg",
    "description": "Pick up heavy dumbbells or kettlebells at sides. Stand tall with shoulders back and walk with smooth, deliberate steps while resisting sway.",
    "howTo": "Pick up heavy dumbbells or kettlebells at sides. Stand tall with shoulders back and walk with smooth, deliberate steps while resisting sway.",
    "exercises": [
      {
        "name": "Farmer Carry",
        "sets": 3,
        "reps": "3×20–40m",
        "target": "Grip, core, traps, legs",
        "restSec": 45,
        "howTo": "Pick up heavy dumbbells or kettlebells at sides. Stand tall with shoulders back and walk with smooth, deliberate steps while resisting sway.",
        "caloriesPer30Min": "180 kcal"
      }
    ]
  },
  {
    "id": "adv-equip-dumbbell-bulgarian-split-squat",
    "code": "adv-equip-1",
    "title": "Dumbbell Bulgarian Split Squat",
    "name": "Dumbbell Bulgarian Split Squat",
    "category": "With Equipment",
    "subCategory": "Advanced (With Equipment)",
    "sectionKey": "adv-equip",
    "level": "Advanced",
    "equipmentType": "With Equipment",
    "equipmentNeeded": "Dumbbells",
    "duration": 30,
    "calories": 190,
    "calories30Min": 190,
    "defaultMET": 5.4,
    "targetMuscles": [
      "quads",
      "glutes",
      "hamstrings"
    ],
    "targetMusclesStr": "Quads, glutes, hamstrings",
    "target": "Quads, glutes, hamstrings",
    "setsReps": "4×6–12/leg",
    "sets": 4,
    "reps": "6–12/leg",
    "intensity": "Advanced",
    "difficulty": "Advanced",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_quads_hd.jpg",
    "description": "Hold dumbbells at sides with rear foot elevated on bench. Lower hips until front thigh is parallel to ground, driving through front heel to return.",
    "howTo": "Hold dumbbells at sides with rear foot elevated on bench. Lower hips until front thigh is parallel to ground, driving through front heel to return.",
    "exercises": [
      {
        "name": "Dumbbell Bulgarian Split Squat",
        "sets": 4,
        "reps": "4×6–12/leg",
        "target": "Quads, glutes, hamstrings",
        "restSec": 45,
        "howTo": "Hold dumbbells at sides with rear foot elevated on bench. Lower hips until front thigh is parallel to ground, driving through front heel to return.",
        "caloriesPer30Min": "190 kcal"
      }
    ]
  },
  {
    "id": "adv-equip-dumbbell-romanian-deadlift",
    "code": "adv-equip-2",
    "title": "Dumbbell Romanian Deadlift",
    "name": "Dumbbell Romanian Deadlift",
    "category": "With Equipment",
    "subCategory": "Advanced (With Equipment)",
    "sectionKey": "adv-equip",
    "level": "Advanced",
    "equipmentType": "With Equipment",
    "equipmentNeeded": "Dumbbells",
    "duration": 30,
    "calories": 145,
    "calories30Min": 145,
    "defaultMET": 4.1,
    "targetMuscles": [
      "hamstrings",
      "glutes"
    ],
    "targetMusclesStr": "Hamstrings, glutes",
    "target": "Hamstrings, glutes",
    "setsReps": "4×6–12",
    "sets": 4,
    "reps": "6–12",
    "intensity": "Advanced",
    "difficulty": "Advanced",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_hamstrings_hd.jpg",
    "description": "Hold heavier dumbbells, hinge deeply at hips pushing glutes backward while keeping spine rigid and neutral. Feel intense hamstring stretch and return.",
    "howTo": "Hold heavier dumbbells, hinge deeply at hips pushing glutes backward while keeping spine rigid and neutral. Feel intense hamstring stretch and return.",
    "exercises": [
      {
        "name": "Dumbbell Romanian Deadlift",
        "sets": 4,
        "reps": "4×6–12",
        "target": "Hamstrings, glutes",
        "restSec": 45,
        "howTo": "Hold heavier dumbbells, hinge deeply at hips pushing glutes backward while keeping spine rigid and neutral. Feel intense hamstring stretch and return.",
        "caloriesPer30Min": "145 kcal"
      }
    ]
  },
  {
    "id": "adv-equip-dumbbell-press",
    "code": "adv-equip-3",
    "title": "Dumbbell Press",
    "name": "Dumbbell Press",
    "category": "With Equipment",
    "subCategory": "Advanced (With Equipment)",
    "sectionKey": "adv-equip",
    "level": "Advanced",
    "equipmentType": "With Equipment",
    "equipmentNeeded": "Dumbbells",
    "duration": 30,
    "calories": 135,
    "calories30Min": 135,
    "defaultMET": 3.9,
    "targetMuscles": [
      "chest",
      "triceps"
    ],
    "targetMusclesStr": "Chest, triceps",
    "target": "Chest, triceps",
    "setsReps": "4×6–12",
    "sets": 4,
    "reps": "6–12",
    "intensity": "Advanced",
    "difficulty": "Advanced",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_chest_hd.jpg",
    "description": "Perform heavy dumbbell chest press on bench or floor. Control the descent for 2-3 seconds, then explode upward to lockout.",
    "howTo": "Perform heavy dumbbell chest press on bench or floor. Control the descent for 2-3 seconds, then explode upward to lockout.",
    "exercises": [
      {
        "name": "Dumbbell Press",
        "sets": 4,
        "reps": "4×6–12",
        "target": "Chest, triceps",
        "restSec": 45,
        "howTo": "Perform heavy dumbbell chest press on bench or floor. Control the descent for 2-3 seconds, then explode upward to lockout.",
        "caloriesPer30Min": "135 kcal"
      }
    ]
  },
  {
    "id": "adv-equip-one-arm-dumbbell-row",
    "code": "adv-equip-4",
    "title": "One-Arm Dumbbell Row",
    "name": "One-Arm Dumbbell Row",
    "category": "With Equipment",
    "subCategory": "Advanced (With Equipment)",
    "sectionKey": "adv-equip",
    "level": "Advanced",
    "equipmentType": "With Equipment",
    "equipmentNeeded": "Dumbbell",
    "duration": 30,
    "calories": 135,
    "calories30Min": 135,
    "defaultMET": 3.9,
    "targetMuscles": [
      "back",
      "biceps"
    ],
    "targetMusclesStr": "Back, biceps",
    "target": "Back, biceps",
    "setsReps": "4×8–12/side",
    "sets": 4,
    "reps": "8–12/side",
    "intensity": "Advanced",
    "difficulty": "Advanced",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_back_hd.jpg",
    "description": "Heavy single-arm row. Hinge at 45 degrees, pull dumbbell to hip socket, and hold a hard 1-second squeeze on the lat at top.",
    "howTo": "Heavy single-arm row. Hinge at 45 degrees, pull dumbbell to hip socket, and hold a hard 1-second squeeze on the lat at top.",
    "exercises": [
      {
        "name": "One-Arm Dumbbell Row",
        "sets": 4,
        "reps": "4×8–12/side",
        "target": "Back, biceps",
        "restSec": 45,
        "howTo": "Heavy single-arm row. Hinge at 45 degrees, pull dumbbell to hip socket, and hold a hard 1-second squeeze on the lat at top.",
        "caloriesPer30Min": "135 kcal"
      }
    ]
  },
  {
    "id": "adv-equip-arnold-press",
    "code": "adv-equip-5",
    "title": "Arnold Press",
    "name": "Arnold Press",
    "category": "With Equipment",
    "subCategory": "Advanced (With Equipment)",
    "sectionKey": "adv-equip",
    "level": "Advanced",
    "equipmentType": "With Equipment",
    "equipmentNeeded": "Dumbbells",
    "duration": 30,
    "calories": 120,
    "calories30Min": 120,
    "defaultMET": 3.4,
    "targetMuscles": [
      "shoulders",
      "triceps"
    ],
    "targetMusclesStr": "Shoulders, triceps",
    "target": "Shoulders, triceps",
    "setsReps": "3×8–12",
    "sets": 3,
    "reps": "8–12",
    "intensity": "Advanced",
    "difficulty": "Advanced",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_shoulders_hd.jpg",
    "description": "Start dumbbells at chest with palms facing you. As you press overhead, rotate wrists 180 degrees so palms face forward at lockout.",
    "howTo": "Start dumbbells at chest with palms facing you. As you press overhead, rotate wrists 180 degrees so palms face forward at lockout.",
    "exercises": [
      {
        "name": "Arnold Press",
        "sets": 3,
        "reps": "3×8–12",
        "target": "Shoulders, triceps",
        "restSec": 45,
        "howTo": "Start dumbbells at chest with palms facing you. As you press overhead, rotate wrists 180 degrees so palms face forward at lockout.",
        "caloriesPer30Min": "120 kcal"
      }
    ]
  },
  {
    "id": "adv-equip-tempo-goblet-squat",
    "code": "adv-equip-6",
    "title": "Tempo Goblet Squat",
    "name": "Tempo Goblet Squat",
    "category": "With Equipment",
    "subCategory": "Advanced (With Equipment)",
    "sectionKey": "adv-equip",
    "level": "Advanced",
    "equipmentType": "With Equipment",
    "equipmentNeeded": "Dumbbell / Kettlebell",
    "duration": 30,
    "calories": 145,
    "calories30Min": 145,
    "defaultMET": 4.1,
    "targetMuscles": [
      "quads",
      "glutes",
      "core"
    ],
    "targetMusclesStr": "Quads, glutes, core",
    "target": "Quads, glutes, core",
    "setsReps": "3×8–12",
    "sets": 3,
    "reps": "8–12",
    "intensity": "Advanced",
    "difficulty": "Advanced",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_quads_hd.jpg",
    "description": "Take 3-4 full seconds on the eccentric descent into a deep goblet squat, pause 1 second at the bottom, and drive up explosively.",
    "howTo": "Take 3-4 full seconds on the eccentric descent into a deep goblet squat, pause 1 second at the bottom, and drive up explosively.",
    "exercises": [
      {
        "name": "Tempo Goblet Squat",
        "sets": 3,
        "reps": "3×8–12",
        "target": "Quads, glutes, core",
        "restSec": 45,
        "howTo": "Take 3-4 full seconds on the eccentric descent into a deep goblet squat, pause 1 second at the bottom, and drive up explosively.",
        "caloriesPer30Min": "145 kcal"
      }
    ]
  },
  {
    "id": "adv-equip-kettlebell-swing",
    "code": "adv-equip-7",
    "title": "Kettlebell Swing",
    "name": "Kettlebell Swing",
    "category": "With Equipment",
    "subCategory": "Advanced (With Equipment)",
    "sectionKey": "adv-equip",
    "level": "Advanced",
    "equipmentType": "With Equipment",
    "equipmentNeeded": "Kettlebell",
    "duration": 30,
    "calories": 300,
    "calories30Min": 300,
    "defaultMET": 8.6,
    "targetMuscles": [
      "glutes",
      "hamstrings",
      "core"
    ],
    "targetMusclesStr": "Glutes, hamstrings, core",
    "target": "Glutes, hamstrings, core",
    "setsReps": "3×10–20",
    "sets": 3,
    "reps": "10–20",
    "intensity": "Advanced",
    "difficulty": "Advanced",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_glutes_hd.jpg",
    "description": "Hinge at hips to swing kettlebell between legs, then snap hips forward forcefully to propel bell to chest level using glutes, not arms.",
    "howTo": "Hinge at hips to swing kettlebell between legs, then snap hips forward forcefully to propel bell to chest level using glutes, not arms.",
    "exercises": [
      {
        "name": "Kettlebell Swing",
        "sets": 3,
        "reps": "3×10–20",
        "target": "Glutes, hamstrings, core",
        "restSec": 45,
        "howTo": "Hinge at hips to swing kettlebell between legs, then snap hips forward forcefully to propel bell to chest level using glutes, not arms.",
        "caloriesPer30Min": "300 kcal"
      }
    ]
  },
  {
    "id": "adv-equip-kettlebell-clean-press",
    "code": "adv-equip-8",
    "title": "Kettlebell Clean + Press",
    "name": "Kettlebell Clean + Press",
    "category": "With Equipment",
    "subCategory": "Advanced (With Equipment)",
    "sectionKey": "adv-equip",
    "level": "Advanced",
    "equipmentType": "With Equipment",
    "equipmentNeeded": "Kettlebell",
    "duration": 30,
    "calories": 240,
    "calories30Min": 240,
    "defaultMET": 6.9,
    "targetMuscles": [
      "full body",
      "shoulders"
    ],
    "targetMusclesStr": "Full body, shoulders",
    "target": "Full body, shoulders",
    "setsReps": "3×6–10/side",
    "sets": 3,
    "reps": "6–10/side",
    "intensity": "Advanced",
    "difficulty": "Advanced",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_full body_hd.jpg",
    "description": "Pull kettlebell from floor into the rack position in one smooth motion, then immediately press overhead with full core engagement.",
    "howTo": "Pull kettlebell from floor into the rack position in one smooth motion, then immediately press overhead with full core engagement.",
    "exercises": [
      {
        "name": "Kettlebell Clean + Press",
        "sets": 3,
        "reps": "3×6–10/side",
        "target": "Full body, shoulders",
        "restSec": 45,
        "howTo": "Pull kettlebell from floor into the rack position in one smooth motion, then immediately press overhead with full core engagement.",
        "caloriesPer30Min": "240 kcal"
      }
    ]
  },
  {
    "id": "adv-equip-band-assisted-pull-up",
    "code": "adv-equip-9",
    "title": "Band-Assisted Pull-Up",
    "name": "Band-Assisted Pull-Up",
    "category": "With Equipment",
    "subCategory": "Advanced (With Equipment)",
    "sectionKey": "adv-equip",
    "level": "Advanced",
    "equipmentType": "With Equipment",
    "equipmentNeeded": "Pull-Up Bar & Band",
    "duration": 30,
    "calories": 150,
    "calories30Min": 150,
    "defaultMET": 4.3,
    "targetMuscles": [
      "back",
      "biceps",
      "core"
    ],
    "targetMusclesStr": "Back, biceps, core",
    "target": "Back, biceps, core",
    "setsReps": "3×5–10",
    "sets": 3,
    "reps": "5–10",
    "intensity": "Advanced",
    "difficulty": "Advanced",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_back_hd.jpg",
    "description": "Loop band around pull-up bar and place foot in loop. Pull chest to bar until chin clears, control descent for 3 seconds.",
    "howTo": "Loop band around pull-up bar and place foot in loop. Pull chest to bar until chin clears, control descent for 3 seconds.",
    "exercises": [
      {
        "name": "Band-Assisted Pull-Up",
        "sets": 3,
        "reps": "3×5–10",
        "target": "Back, biceps, core",
        "restSec": 45,
        "howTo": "Loop band around pull-up bar and place foot in loop. Pull chest to bar until chin clears, control descent for 3 seconds.",
        "caloriesPer30Min": "150 kcal"
      }
    ]
  },
  {
    "id": "adv-equip-pull-up",
    "code": "adv-equip-10",
    "title": "Pull-Up",
    "name": "Pull-Up",
    "category": "With Equipment",
    "subCategory": "Advanced (With Equipment)",
    "sectionKey": "adv-equip",
    "level": "Advanced",
    "equipmentType": "With Equipment",
    "equipmentNeeded": "Pull-Up Bar",
    "duration": 30,
    "calories": 175,
    "calories30Min": 175,
    "defaultMET": 5,
    "targetMuscles": [
      "back",
      "biceps",
      "core"
    ],
    "targetMusclesStr": "Back, biceps, core",
    "target": "Back, biceps, core",
    "setsReps": "3×4–10",
    "sets": 3,
    "reps": "4–10",
    "intensity": "Advanced",
    "difficulty": "Advanced",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_back_hd.jpg",
    "description": "Overhand grip slightly wider than shoulders. Pull vertically until chin passes bar, squeeze lats, and lower under control to dead hang.",
    "howTo": "Overhand grip slightly wider than shoulders. Pull vertically until chin passes bar, squeeze lats, and lower under control to dead hang.",
    "exercises": [
      {
        "name": "Pull-Up",
        "sets": 3,
        "reps": "3×4–10",
        "target": "Back, biceps, core",
        "restSec": 45,
        "howTo": "Overhand grip slightly wider than shoulders. Pull vertically until chin passes bar, squeeze lats, and lower under control to dead hang.",
        "caloriesPer30Min": "175 kcal"
      }
    ]
  },
  {
    "id": "adv-equip-renegade-row",
    "code": "adv-equip-11",
    "title": "Renegade Row",
    "name": "Renegade Row",
    "category": "With Equipment",
    "subCategory": "Advanced (With Equipment)",
    "sectionKey": "adv-equip",
    "level": "Advanced",
    "equipmentType": "With Equipment",
    "equipmentNeeded": "Dumbbells",
    "duration": 30,
    "calories": 150,
    "calories30Min": 150,
    "defaultMET": 4.3,
    "targetMuscles": [
      "back",
      "core",
      "shoulders"
    ],
    "targetMusclesStr": "Back, core, shoulders",
    "target": "Back, core, shoulders",
    "setsReps": "3×6–10/side",
    "sets": 3,
    "reps": "6–10/side",
    "intensity": "Advanced",
    "difficulty": "Advanced",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_back_hd.jpg",
    "description": "In push-up plank on dumbbells, row one weight to hip while bracing core aggressively to prevent hips from twisting.",
    "howTo": "In push-up plank on dumbbells, row one weight to hip while bracing core aggressively to prevent hips from twisting.",
    "exercises": [
      {
        "name": "Renegade Row",
        "sets": 3,
        "reps": "3×6–10/side",
        "target": "Back, core, shoulders",
        "restSec": 45,
        "howTo": "In push-up plank on dumbbells, row one weight to hip while bracing core aggressively to prevent hips from twisting.",
        "caloriesPer30Min": "150 kcal"
      }
    ]
  },
  {
    "id": "adv-equip-dumbbell-thruster",
    "code": "adv-equip-12",
    "title": "Dumbbell Thruster",
    "name": "Dumbbell Thruster",
    "category": "With Equipment",
    "subCategory": "Advanced (With Equipment)",
    "sectionKey": "adv-equip",
    "level": "Advanced",
    "equipmentType": "With Equipment",
    "equipmentNeeded": "Dumbbells",
    "duration": 30,
    "calories": 250,
    "calories30Min": 250,
    "defaultMET": 7.1,
    "targetMuscles": [
      "legs",
      "shoulders",
      "core"
    ],
    "targetMusclesStr": "Legs, shoulders, core",
    "target": "Legs, shoulders, core",
    "setsReps": "3×8–12",
    "sets": 3,
    "reps": "8–12",
    "intensity": "Advanced",
    "difficulty": "Advanced",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_legs_hd.jpg",
    "description": "Hold dumbbells at shoulders. Descend into full squat and explode upward, using leg drive to propel weights into an overhead press.",
    "howTo": "Hold dumbbells at shoulders. Descend into full squat and explode upward, using leg drive to propel weights into an overhead press.",
    "exercises": [
      {
        "name": "Dumbbell Thruster",
        "sets": 3,
        "reps": "3×8–12",
        "target": "Legs, shoulders, core",
        "restSec": 45,
        "howTo": "Hold dumbbells at shoulders. Descend into full squat and explode upward, using leg drive to propel weights into an overhead press.",
        "caloriesPer30Min": "250 kcal"
      }
    ]
  },
  {
    "id": "adv-equip-weighted-step-up",
    "code": "adv-equip-13",
    "title": "Weighted Step-Up",
    "name": "Weighted Step-Up",
    "category": "With Equipment",
    "subCategory": "Advanced (With Equipment)",
    "sectionKey": "adv-equip",
    "level": "Advanced",
    "equipmentType": "With Equipment",
    "equipmentNeeded": "Dumbbells & Step",
    "duration": 30,
    "calories": 205,
    "calories30Min": 205,
    "defaultMET": 5.9,
    "targetMuscles": [
      "quads",
      "glutes"
    ],
    "targetMusclesStr": "Quads, glutes",
    "target": "Quads, glutes",
    "setsReps": "3×8–12/leg",
    "sets": 3,
    "reps": "8–12/leg",
    "intensity": "Advanced",
    "difficulty": "Advanced",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_quads_hd.jpg",
    "description": "Hold dumbbells at sides and perform slow, controlled step-ups onto high platform, focusing on quad isolation without pushing off back foot.",
    "howTo": "Hold dumbbells at sides and perform slow, controlled step-ups onto high platform, focusing on quad isolation without pushing off back foot.",
    "exercises": [
      {
        "name": "Weighted Step-Up",
        "sets": 3,
        "reps": "3×8–12/leg",
        "target": "Quads, glutes",
        "restSec": 45,
        "howTo": "Hold dumbbells at sides and perform slow, controlled step-ups onto high platform, focusing on quad isolation without pushing off back foot.",
        "caloriesPer30Min": "205 kcal"
      }
    ]
  },
  {
    "id": "adv-equip-suitcase-carry",
    "code": "adv-equip-14",
    "title": "Suitcase Carry",
    "name": "Suitcase Carry",
    "category": "With Equipment",
    "subCategory": "Advanced (With Equipment)",
    "sectionKey": "adv-equip",
    "level": "Advanced",
    "equipmentType": "With Equipment",
    "equipmentNeeded": "Dumbbell / Kettlebell",
    "duration": 30,
    "calories": 190,
    "calories30Min": 190,
    "defaultMET": 5.4,
    "targetMuscles": [
      "obliques",
      "grip",
      "core"
    ],
    "targetMusclesStr": "Obliques, grip, core",
    "target": "Obliques, grip, core",
    "setsReps": "3×20–40m/side",
    "sets": 3,
    "reps": "20–40m/side",
    "intensity": "Advanced",
    "difficulty": "Advanced",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_obliques_hd.jpg",
    "description": "Carry a heavy weight in only one hand. Walk with upright posture, resisting lateral flexion and keeping shoulders perfectly level.",
    "howTo": "Carry a heavy weight in only one hand. Walk with upright posture, resisting lateral flexion and keeping shoulders perfectly level.",
    "exercises": [
      {
        "name": "Suitcase Carry",
        "sets": 3,
        "reps": "3×20–40m/side",
        "target": "Obliques, grip, core",
        "restSec": 45,
        "howTo": "Carry a heavy weight in only one hand. Walk with upright posture, resisting lateral flexion and keeping shoulders perfectly level.",
        "caloriesPer30Min": "190 kcal"
      }
    ]
  },
  {
    "id": "adv-equip-dumbbell-hip-thrust",
    "code": "adv-equip-15",
    "title": "Dumbbell Hip Thrust",
    "name": "Dumbbell Hip Thrust",
    "category": "With Equipment",
    "subCategory": "Advanced (With Equipment)",
    "sectionKey": "adv-equip",
    "level": "Advanced",
    "equipmentType": "With Equipment",
    "equipmentNeeded": "Dumbbell & Bench/Couch",
    "duration": 30,
    "calories": 120,
    "calories30Min": 120,
    "defaultMET": 3.4,
    "targetMuscles": [
      "glutes",
      "hamstrings"
    ],
    "targetMusclesStr": "Glutes, hamstrings",
    "target": "Glutes, hamstrings",
    "setsReps": "4×8–15",
    "sets": 4,
    "reps": "8–15",
    "intensity": "Advanced",
    "difficulty": "Advanced",
    "exercisesCount": 1,
    "image": "/images/workouts/workout_glutes_hd.jpg",
    "description": "Rest upper back against bench with dumbbell across hips. Drive through heels to full hip extension, squeezing glutes hard at peak.",
    "howTo": "Rest upper back against bench with dumbbell across hips. Drive through heels to full hip extension, squeezing glutes hard at peak.",
    "exercises": [
      {
        "name": "Dumbbell Hip Thrust",
        "sets": 4,
        "reps": "4×8–15",
        "target": "Glutes, hamstrings",
        "restSec": 45,
        "howTo": "Rest upper back against bench with dumbbell across hips. Drive through heels to full hip extension, squeezing glutes hard at peak.",
        "caloriesPer30Min": "120 kcal"
      }
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
