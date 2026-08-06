"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "dt:money-counter:v1";

export type MoneyCounts = Record<string, number>;

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
    // If storage is full or unavailable, the pile just won't persist across
    // reloads - the tool still works for the current session.
  }
}

export function useMoneyCounter() {
  const [counts, setCounts] = useState<MoneyCounts>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCounts(readJSON<MoneyCounts>(STORAGE_KEY, {}));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEY, counts);
  }, [counts, hydrated]);

  const addPiece = useCallback((id: string) => {
    setCounts((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  }, []);

  const removePiece = useCallback((id: string) => {
    setCounts((prev) => {
      const current = prev[id] ?? 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: current - 1 };
    });
  }, []);

  const clearAll = useCallback(() => setCounts({}), []);

  return { counts, addPiece, removePiece, clearAll, hydrated };
}
