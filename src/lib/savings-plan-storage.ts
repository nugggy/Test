"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "dt:savings-plan:v1";

export interface SavingsContribution {
  id: string;
  date: string; // yyyy-mm-dd
  amount: number;
  note: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  targetDate: string; // yyyy-mm-dd, optional
  contributions: SavingsContribution[];
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
    // reloads — the tool still works for the current session.
  }
}

function makeId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function totalSaved(goal: SavingsGoal): number {
  return goal.contributions.reduce((sum, c) => sum + c.amount, 0);
}

export function useSavingsGoals() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGoals(readJSON<SavingsGoal[]>(STORAGE_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEY, goals);
  }, [goals, hydrated]);

  const addGoal = useCallback((title: string, targetAmount: number) => {
    const text = title.trim();
    if (!text) return;
    setGoals((prev) => [
      ...prev,
      { id: makeId(), title: text, targetAmount, targetDate: "", contributions: [] },
    ]);
  }, []);

  const updateGoal = useCallback((id: string, patch: Partial<Omit<SavingsGoal, "id" | "contributions">>) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)));
  }, []);

  const removeGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const addContribution = useCallback((goalId: string, data: Omit<SavingsContribution, "id">) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId
          ? { ...g, contributions: [{ id: makeId(), ...data }, ...g.contributions] }
          : g
      )
    );
  }, []);

  const removeContribution = useCallback((goalId: string, contributionId: string) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId
          ? { ...g, contributions: g.contributions.filter((c) => c.id !== contributionId) }
          : g
      )
    );
  }, []);

  return { goals, addGoal, updateGoal, removeGoal, addContribution, removeContribution, hydrated };
}
