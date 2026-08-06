"use client";

import { useCallback, useEffect, useState } from "react";
import { EMOTIONS } from "@/lib/emotion-tracker-data";

const STORAGE_KEY = "dt:what-next:custom-strategies:v1";

export type CustomStrategies = Record<string, string[]>;

function emptyCustomStrategies(): CustomStrategies {
  return Object.fromEntries(EMOTIONS.map((e) => [e.id, []]));
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

export function useCustomStrategies() {
  const [custom, setCustom] = useState<CustomStrategies>(emptyCustomStrategies());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCustom({
      ...emptyCustomStrategies(),
      ...readJSON<CustomStrategies>(STORAGE_KEY, {}),
    });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEY, custom);
  }, [custom, hydrated]);

  const updateMoodStrategies = useCallback((moodId: string, items: string[]) => {
    setCustom((prev) => ({ ...prev, [moodId]: items }));
  }, []);

  return { custom, updateMoodStrategies, hydrated };
}
