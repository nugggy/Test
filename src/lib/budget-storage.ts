"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "dt:budget:transactions:v1";
const PLAN_STORAGE_KEY = "dt:budget:weekly-plan:v1";

export type TransactionType = "income" | "expense";

export interface BudgetTransaction {
  id: string;
  type: TransactionType;
  description: string;
  amount: number; // always positive; sign is determined by `type`
  category: string;
  date: string; // yyyy-mm-dd
}

export interface PlannedItem {
  id: string;
  label: string;
  cost: number;
}

export interface WeeklyPlan {
  weeklyAmount: number;
  items: PlannedItem[];
}

const EMPTY_PLAN: WeeklyPlan = { weeklyAmount: 0, items: [] };

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

export function useBudgetTransactions() {
  const [transactions, setTransactions] = useState<BudgetTransaction[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // localStorage only exists client-side, so transactions are synced in
    // after mount rather than during the (server) initial render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTransactions(readJSON<BudgetTransaction[]>(STORAGE_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEY, transactions);
  }, [transactions, hydrated]);

  const addTransaction = useCallback((data: Omit<BudgetTransaction, "id">) => {
    setTransactions((prev) => [{ id: `txn-${Date.now()}`, ...data }, ...prev]);
  }, []);

  const removeTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAll = useCallback(() => setTransactions([]), []);

  return { transactions, addTransaction, removeTransaction, clearAll, hydrated };
}

export function useWeeklyPlan() {
  const [plan, setPlan] = useState<WeeklyPlan>(EMPTY_PLAN);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // localStorage only exists client-side, so the plan is synced in after
    // mount rather than during the (server) initial render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlan({ ...EMPTY_PLAN, ...readJSON<Partial<WeeklyPlan>>(PLAN_STORAGE_KEY, {}) });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(PLAN_STORAGE_KEY, plan);
  }, [plan, hydrated]);

  const setWeeklyAmount = useCallback((amount: number) => {
    setPlan((prev) => ({ ...prev, weeklyAmount: amount }));
  }, []);

  const addItem = useCallback((data: { label: string; cost: number }) => {
    setPlan((prev) => ({
      ...prev,
      items: [...prev.items, { id: `plan-${Date.now()}`, ...data }],
    }));
  }, []);

  const removeItem = useCallback((id: string) => {
    setPlan((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  }, []);

  const clearItems = useCallback(() => {
    setPlan((prev) => ({ ...prev, items: [] }));
  }, []);

  return { plan, setWeeklyAmount, addItem, removeItem, clearItems, hydrated };
}
