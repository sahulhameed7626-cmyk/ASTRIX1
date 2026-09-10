// FitSport Personalized Motivation & Athletic Recovery Engine
import { fitSportTools } from '../agent/tools.js';

export class RecommendationService {
  constructor(tools = fitSportTools) {
    this.tools = tools;
  }

  /**
   * Generate personalized daily motivation based on actual stored metrics
   */
  generateDailyMotivation(userId = 'default_user') {
    const prog = this.tools.getDailyProgress(userId);
    const user = this.tools.getUserProfile(userId);

    const cPct = prog.nutrition.percentages.calories;
    const pPct = prog.nutrition.percentages.protein;
    const wPct = prog.water.percent;
    const pTotal = prog.nutrition.totals.protein;
    const wkDone = prog.workoutCompleted;

    let motivation = "";
    let spokenMotivation = "";

    if (pPct >= 80 && wPct >= 70) {
      motivation = `Outstanding discipline today, ${user.name.split(' ')[0]}! You've reached ${pPct}% of your protein goal (${pTotal}g) and ${wPct}% of your hydration target. ` +
        `${wkDone ? `Your ${prog.latestWorkout.title} was logged with high effort.` : 'Keep up this athletic baseline.'} You are on track toward your target weight of ${user.targetWeight} kg.`;
      spokenMotivation = `Outstanding discipline today! You have hit ${pPct} percent of your protein goal and ${wPct} percent of your water target. Keep up the high standard!`;
    } else if (pPct >= 70 && wPct < 60) {
      motivation = `Strong athletic nutrition today! Your protein is solid at ${pPct}% (${pTotal}g), but hydration is lagging at ${wPct}%. ` +
        `Prioritize fluid intake this evening to prevent muscular cramping and optimize tomorrow's output.`;
      spokenMotivation = `Strong effort today! Your protein is solid at ${pPct} percent, but water is at ${wPct} percent. Focus on hydration this evening.`;
    } else {
      motivation = `Good momentum today! You've logged ${pTotal}g of protein and burned ${prog.caloriesBurned} kcal. ` +
        `Every clean meal and completed habit moves you closer to ${user.targetWeight} kg. Focus on steady hydration and solid sleep tonight.`;
      spokenMotivation = `Good momentum today! You have logged ${pTotal} grams of protein and burned ${prog.caloriesBurned} calories. Stay consistent!`;
    }

    return {
      text: motivation,
      spokenText: spokenMotivation,
      metrics: prog
    };
  }

  /**
   * Weekly progress analysis (Section 26)
   */
  generateWeeklyAnalysis(userId = 'default_user') {
    const user = this.tools.getUserProfile(userId);
    const history = this.tools.getTodayHistory(userId);
    const workouts = history.filter(h => h.type === 'workouts');
    const sports = history.filter(h => h.type === 'sports');

    return {
      summary: `Weekly Athletic Review for ${user.name}: ` +
        `Completed ${workouts.length} workout routines and ${sports.length} sport sessions. ` +
        `Current weight is ${user.currentWeight} kg towards target ${user.targetWeight} kg.`,
      workoutsCount: workouts.length,
      sportsCount: sports.length,
      whatWentWell: "Consistency in tracking daily nutrition and structured athletic training.",
      whatNeedsImprovement: "Ensure hydration levels remain above 3.5 Liters on high-intensity training days.",
      suggestedFocus: "Prioritize post-workout protein timing (within 45 minutes) and scheduled recovery."
    };
  }
}

export const recommendationService = new RecommendationService();
