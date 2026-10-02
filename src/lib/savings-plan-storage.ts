"use client";

import { useCallback, useEffect, useState } from "react";
import { isPayPeriod, type PayPeriod } from "./budget-calc";
import { savingsProgress } from "./savings-plan-calc";

const STORAGE_KEY = "dt:savings-plan:v1";

export interface SavingsContribution {
  id: string;
  date: string; // yyyy-mm-dd
  /** Positive = money put in. Negative = money taken out. */
  amount: number;
  note: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  targetDate: string; // yyyy-mm-dd, optional
  contributions: SavingsContribution[];
  /** Optional: how much the person plans to put aside each period. 0 = not set. */
  regularAmount: number;
  /** How often the regular amount goes in. Defaults to fortnightly (Centrelink cycle). */
  regularPeriod: PayPeriod;
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

function toNumber(value: unknown, allowNegative = false): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return 0;
  if (!allowNegative && n < 0) return 0;
  return Math.round(n * 100) / 100;
}

/**
 * Loads saved goals of any age. Goals saved before regular amounts existed
 * get regularAmount 0 (not set) and a fortnightly period.
 */
export function normaliseSavingsGoals(raw: unknown): SavingsGoal[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((g): g is Record<string, unknown> => !!g && typeof g === "object")
    .map((g, index) => ({
      id: typeof g.id === "string" ? g.id : `goal-legacy-${index}`,
      title: typeof g.title === "string" ? g.title : "",
      targetAmount: toNumber(g.targetAmount),
      targetDate: typeof g.targetDate === "string" ? g.targetDate : "",
      contributions: (Array.isArray(g.contributions) ? g.contributions : [])
        .filter((c): c is Record<string, unknown> => !!c && typeof c === "object")
        .map((c, cIndex) => ({
          id: typeof c.id === "string" ? c.id : `contribution-legacy-${index}-${cIndex}`,
          date: typeof c.date === "string" ? c.date : "",
          amount: toNumber(c.amount, true),
          note: typeof c.note === "string" ? c.note : "",
        })),
      regularAmount: toNumber(g.regularAmount),
      regularPeriod: isPayPeriod(g.regularPeriod) ? g.regularPeriod : "fortnight",
    }));
}

export function totalSaved(goal: SavingsGoal): number {
  return savingsProgress(goal.targetAmount, goal.contributions.map((c) => c.amount)).saved;
}

export function useSavingsGoals() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGoals(normaliseSavingsGoals(readJSON<unknown>(STORAGE_KEY, [])));
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
      {
        id: makeId(),
        title: text,
        targetAmount,
        targetDate: "",
        contributions: [],
        regularAmount: 0,
        regularPeriod: "fortnight",
      },
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
