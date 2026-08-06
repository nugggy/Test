"use client";

import { useCallback, useEffect, useState } from "react";
import type { ChecklistItem } from "@/components/ChecklistSection";

export interface Goal {
  id: string;
  title: string;
  category: string;
  targetDate: string;
  notes: string;
  steps: ChecklistItem[];
}

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

function makeId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Factory so Goal Tracker and Friendship Goal Planner can each get their own
 * localStorage-backed goal list, scoped to their own storage key and
 * default category, without duplicating the read/write logic.
 */
export function createGoalListStorage(storageKey: string, defaultCategory: string) {
  return function useGoalList() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
      setGoals(readJSON<Goal[]>(storageKey, []));
      setHydrated(true);
    }, []);

    useEffect(() => {
      if (hydrated) writeJSON(storageKey, goals);
    }, [goals, hydrated]);

    const addGoal = useCallback(
      (title: string, category: string = defaultCategory) => {
        const text = title.trim();
        if (!text) return;
        setGoals((prev) => [
          ...prev,
          { id: makeId(), title: text, category, targetDate: "", notes: "", steps: [] },
        ]);
      },
      []
    );

    const updateGoal = useCallback((id: string, patch: Partial<Omit<Goal, "id">>) => {
      setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)));
    }, []);

    const removeGoal = useCallback((id: string) => {
      setGoals((prev) => prev.filter((g) => g.id !== id));
    }, []);

    return { goals, addGoal, updateGoal, removeGoal, hydrated };
  };
}

export type UseGoalList = ReturnType<typeof createGoalListStorage>;

export const useGoals = createGoalListStorage("dt:goal-tracker:v1", "General");
