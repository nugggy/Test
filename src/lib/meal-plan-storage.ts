"use client";

import { useCallback, useEffect, useState } from "react";
import type { DayKey } from "@/lib/weekly-schedule-storage";

const STORAGE_KEY = "dt:meal-planner:week:v1";

export interface DayMealAssignment {
  recipeId: string;
  /** id of the entry this created in the Weekly Schedule tool, so it can be removed if the meal changes. */
  scheduleItemId: string;
}

export type MealPlanData = Partial<Record<DayKey, DayMealAssignment>>;

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // If storage is full or unavailable, changes just won't persist across
    // reloads - the tool still works for the current session.
  }
}

export function useMealPlan() {
  const [mealPlan, setMealPlan] = useState<MealPlanData>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // localStorage only exists client-side, so the plan is synced in after
    // mount rather than during the (server) initial render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMealPlan(readJSON<MealPlanData>(STORAGE_KEY, {}));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEY, mealPlan);
  }, [mealPlan, hydrated]);

  const setDayMeal = useCallback((day: DayKey, assignment: DayMealAssignment) => {
    setMealPlan((prev) => ({ ...prev, [day]: assignment }));
  }, []);

  const clearDayMeal = useCallback((day: DayKey) => {
    setMealPlan((prev) => {
      const next = { ...prev };
      delete next[day];
      return next;
    });
  }, []);

  return { mealPlan, setDayMeal, clearDayMeal, hydrated };
}
