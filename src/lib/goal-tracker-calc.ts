// Pure helpers for goal progress, shared by Goal Tracker, Friendship Goal
// Planner and Fitness Plan cards. Unit tested in
// src/lib/__tests__/goal-tracker-calc.test.ts.

import { daysBetween, isDateString } from "./budget-calc";

export interface GoalProgress {
  done: number;
  total: number;
  /** 0-100, whole number. */
  pct: number;
  /** True when there is at least one step and every step is ticked. */
  achieved: boolean;
  /** The first unticked step, in list order. */
  nextStep: string | null;
  /** Days from today to the target date (negative if passed), or null if no date. */
  daysLeft: number | null;
}

export function goalProgress(
  steps: { text: string; done: boolean }[],
  targetDate: string,
  today: string
): GoalProgress {
  const total = steps.length;
  const done = steps.filter((s) => s.done).length;
  const next = steps.find((s) => !s.done);
  return {
    done,
    total,
    pct: total > 0 ? Math.round((done / total) * 100) : 0,
    achieved: total > 0 && done === total,
    nextStep: next ? next.text : null,
    daysLeft: isDateString(targetDate) ? daysBetween(today, targetDate) : null,
  };
}
