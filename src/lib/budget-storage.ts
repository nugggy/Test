"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "dt:budget:transactions:v1";

export type TransactionType = "income" | "expense";

export interface BudgetTransaction {
  id: string;
  type: TransactionType;
  description: string;
  amount: number; // always positive; sign is determined by `type`
  category: string;
  date: string; // yyyy-mm-dd
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
