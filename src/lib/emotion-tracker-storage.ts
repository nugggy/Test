"use client";

import { useCallback, useEffect, useState } from "react";

const LOG_KEY = "dt:emotion-tracker:log:v1";

export interface EmotionLogEntry {
  id: string;
  emotionId: string;
  intensity: number;
  note?: string;
  timestamp: string; // ISO
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

export function useEmotionLog() {
  const [entries, setEntries] = useState<EmotionLogEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // localStorage only exists client-side, so entries are synced in after
    // mount rather than during the (server) initial render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntries(readJSON<EmotionLogEntry[]>(LOG_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(LOG_KEY, entries);
  }, [entries, hydrated]);

  const addEntry = useCallback(
    (data: { emotionId: string; intensity: number; note?: string }) => {
      setEntries((prev) => [
        {
          id: `emo-${Date.now()}`,
          emotionId: data.emotionId,
          intensity: data.intensity,
          note: data.note,
          timestamp: new Date().toISOString(),
        },
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
