"use client";

import { useCallback, useEffect, useState } from "react";
import { NDIS_CATEGORIES } from "./ndis-budget-data";

const PLAN_STORAGE_KEY = "dt:ndis-budget:plan:v1";
const EXPENSES_STORAGE_KEY = "dt:ndis-budget:expenses:v1";

export interface NdisPlan {
  startDate: string; // yyyy-mm-dd
  endDate: string; // yyyy-mm-dd
  allocations: Record<string, number>; // categoryId -> allocated $
}

export interface NdisExpense {
  id: string;
  description: string;
  amount: number;
  categoryId: string;
  date: string; // yyyy-mm-dd
  /** Who was paid (provider, shop). Optional - empty in older saved data. */
  provider: string;
}

const EMPTY_PLAN: NdisPlan = { startDate: "", endDate: "", allocations: {} };

function toAmount(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) / 100 : 0;
}

/** Loads a saved plan of any age without crashing on unexpected values. */
export function normaliseNdisPlan(raw: unknown): NdisPlan {
  if (!raw || typeof raw !== "object") return EMPTY_PLAN;
  const obj = raw as Record<string, unknown>;
  const allocations: Record<string, number> = {};
  if (obj.allocations && typeof obj.allocations === "object") {
    for (const [key, value] of Object.entries(obj.allocations as Record<string, unknown>)) {
      allocations[key] = toAmount(value);
    }
  }
  return {
    startDate: typeof obj.startDate === "string" ? obj.startDate : "",
    endDate: typeof obj.endDate === "string" ? obj.endDate : "",
    allocations,
  };
}

/** Loads saved spending of any age. Entries saved before "provider" existed get "". */
export function normaliseNdisExpenses(raw: unknown): NdisExpense[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((e): e is Record<string, unknown> => !!e && typeof e === "object")
    .map((e, index) => ({
      id: typeof e.id === "string" ? e.id : `ndis-legacy-${index}`,
      description: typeof e.description === "string" ? e.description : "",
      amount: toAmount(e.amount),
      categoryId: typeof e.categoryId === "string" ? e.categoryId : "",
      date: typeof e.date === "string" ? e.date : "",
      provider: typeof e.provider === "string" ? e.provider : "",
    }));
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

export function useNdisPlan() {
  const [plan, setPlan] = useState<NdisPlan>(EMPTY_PLAN);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlan(normaliseNdisPlan(readJSON<unknown>(PLAN_STORAGE_KEY, null)));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(PLAN_STORAGE_KEY, plan);
  }, [plan, hydrated]);

  const setDates = useCallback((startDate: string, endDate: string) => {
    setPlan((prev) => ({ ...prev, startDate, endDate }));
  }, []);

  const setAllocation = useCallback((categoryId: string, amount: number) => {
    setPlan((prev) => ({
      ...prev,
      allocations: { ...prev.allocations, [categoryId]: amount },
    }));
  }, []);

  const clearPlan = useCallback(() => setPlan(EMPTY_PLAN), []);

  return { plan, setDates, setAllocation, clearPlan, hydrated };
}

export function useNdisExpenses() {
  const [expenses, setExpenses] = useState<NdisExpense[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setExpenses(normaliseNdisExpenses(readJSON<unknown>(EXPENSES_STORAGE_KEY, [])));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(EXPENSES_STORAGE_KEY, expenses);
  }, [expenses, hydrated]);

  const addExpense = useCallback((data: Omit<NdisExpense, "id">) => {
    setExpenses((prev) => [{ id: makeId(), ...data }, ...prev]);
  }, []);

  const removeExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const clearAll = useCallback(() => setExpenses([]), []);

  return { expenses, addExpense, removeExpense, clearAll, hydrated };
}

/** Total allocated across every category in the plan. */
export function getTotalAllocated(plan: NdisPlan): number {
  return NDIS_CATEGORIES.reduce((sum, c) => sum + (plan.allocations[c.id] ?? 0), 0);
}

/** Total spent across every logged expense. */
export function getTotalSpent(expenses: NdisExpense[]): number {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}

/** Amount spent so far in a single category. */
export function getCategorySpent(expenses: NdisExpense[], categoryId: string): number {
  return expenses
    .filter((e) => e.categoryId === categoryId)
    .reduce((sum, e) => sum + e.amount, 0);
}

/**
 * Fraction (0-1) of the plan period that has elapsed as of today, clamped
 * to the plan's date range. Returns null when the plan has no valid dates
 * yet, so callers can hide pacing until a plan is actually set up.
 */
export function getPlanElapsedFraction(plan: NdisPlan, today: string): number | null {
  if (!plan.startDate || !plan.endDate) return null;
  const start = new Date(plan.startDate).getTime();
  const end = new Date(plan.endDate).getTime();
  const now = new Date(today).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return null;
  return Math.min(1, Math.max(0, (now - start) / (end - start)));
}
