import { createGoalListStorage } from "@/lib/goal-tracker-storage";

export const FRIENDSHIP_GOAL_CATEGORIES = [
  "Meeting people",
  "Maintaining friendships",
  "Community inclusion",
];

export const useFriendshipGoals = createGoalListStorage(
  "dt:friendship-goals:v1",
  FRIENDSHIP_GOAL_CATEGORIES[0]
);
