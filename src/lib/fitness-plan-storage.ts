import { createGoalListStorage } from "@/lib/goal-tracker-storage";

export const FITNESS_CATEGORIES = ["Strength", "Cardio", "Flexibility", "Balance", "General"];

export const useFitnessGoals = createGoalListStorage("dt:fitness-plan:goals:v1", "General");
