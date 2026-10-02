"use client";

import { useCallback, useEffect, useState } from "react";
import { isPayPeriod, type PayPeriod } from "./budget-calc";

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
  /** Ticked off once it has been paid/bought. Missing in older saved data. */
  paid: boolean;
}

export interface WeeklyPlan {
  /** Money to spend in one pay period. Kept under its original name so
   * plans saved before pay periods existed still load. */
  weeklyAmount: number;
  /** How often the money comes in. Older saved plans had no period and
   * were always weekly, so "week" is the default. */
  period: PayPeriod;
  items: PlannedItem[];
}

const EMPTY_PLAN: WeeklyPlan = { weeklyAmount: 0, period: "week", items: [] };

function toAmount(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) / 100 : 0;
}

/** Loads a saved plan of any age, filling in fields added since. */
export function normaliseWeeklyPlan(raw: unknown): WeeklyPlan {
  if (!raw || typeof raw !== "object") return EMPTY_PLAN;
  const obj = raw as Record<string, unknown>;
  const items = Array.isArray(obj.items) ? obj.items : [];
  return {
    weeklyAmount: toAmount(obj.weeklyAmount),
    period: isPayPeriod(obj.period) ? obj.period : "week",
    items: items
      .filter((i): i is Record<string, unknown> => !!i && typeof i === "object")
      .map((i, index) => ({
        id: typeof i.id === "string" ? i.id : `plan-legacy-${index}`,
        label: typeof i.label === "string" ? i.label : "",
        cost: toAmount(i.cost),
        paid: i.paid === true,
      })),
  };
}

/** Loads saved transactions, skipping anything unreadable rather than crashing. */
export function normaliseTransactions(raw: unknown): BudgetTransaction[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((t): t is Record<string, unknown> => !!t && typeof t === "object")
    .map((t, index) => ({
      id: typeof t.id === "string" ? t.id : `txn-legacy-${index}`,
      type: t.type === "income" ? ("income" as const) : ("expense" as const),
      description: typeof t.description === "string" ? t.description : "",
      amount: toAmount(t.amount),
      category: typeof t.category === "string" ? t.category : "Other",
      date: typeof t.date === "string" ? t.date : "",
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

export function useBudgetTransactions() {
  const [transactions, setTransactions] = useState<BudgetTransaction[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // localStorage only exists client-side, so transactions are synced in
    // after mount rather than during the (server) initial render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTransactions(normaliseTransactions(readJSON<unknown>(STORAGE_KEY, [])));
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
    setPlan(normaliseWeeklyPlan(readJSON<unknown>(PLAN_STORAGE_KEY, null)));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(PLAN_STORAGE_KEY, plan);
  }, [plan, hydrated]);

  const setWeeklyAmount = useCallback((amount: number) => {
    setPlan((prev) => ({ ...prev, weeklyAmount: amount }));
  }, []);

  const setPeriod = useCallback((period: PayPeriod) => {
    setPlan((prev) => ({ ...prev, period }));
  }, []);

  const addItem = useCallback((data: { label: string; cost: number }) => {
    setPlan((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { id: `plan-${Date.now()}-${prev.items.length}`, ...data, paid: false },
      ],
    }));
  }, []);

  const togglePaid = useCallback((id: string) => {
    setPlan((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, paid: !item.paid } : item
      ),
    }));
  }, []);

  /** Unticks every "paid" item, ready for the next pay period. */
  const resetPaid = useCallback(() => {
    setPlan((prev) => ({
      ...prev,
      items: prev.items.map((item) => ({ ...item, paid: false })),
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

  return {
    plan,
    setWeeklyAmount,
    setPeriod,
    addItem,
    togglePaid,
    resetPaid,
    removeItem,
    clearItems,
    hydrated,
  };
}
