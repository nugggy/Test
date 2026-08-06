"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "dt:behaviour-tracking:entries:v1";

export interface BehaviourLogEntry {
  id: string;
  antecedent: string;
  behaviour: string;
  consequence: string;
  severity: number; // 1-5
  occurredAt: string; // ISO - the moment the behaviour happened
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

export function useBehaviourLog() {
  const [entries, setEntries] = useState<BehaviourLogEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // localStorage only exists client-side, so entries are synced in after
    // mount rather than during the (server) initial render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntries(readJSON<BehaviourLogEntry[]>(STORAGE_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEY, entries);
  }, [entries, hydrated]);

  const addEntry = useCallback(
    (data: {
      antecedent: string;
      behaviour: string;
      consequence: string;
      severity: number;
      occurredAt: string;
    }) => {
      setEntries((prev) => [
        { id: `abc-${Date.now()}`, ...data },
        ...prev,
      ]);
    },
    []
  );

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  const clearAll = useCallback(() => setEntries([]), []);

  return { entries, addEntry, removeEntry, clearAll, hydrated };
}
