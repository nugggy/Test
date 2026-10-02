"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "dt:visual-timer:v1";

export type TimerStyle = "pie" | "bar";

export interface VisualTimerSettings {
  lastMinutes: number;
  lastSeconds: number;
  style: TimerStyle;
  color: string;
  backgroundColor: string;
  soundOn: boolean;
  vibrateOn: boolean;
}

export const DEFAULT_TIMER_SETTINGS: VisualTimerSettings = {
  lastMinutes: 5,
  lastSeconds: 0,
  style: "pie",
  color: "#0f6e67",
  backgroundColor: "#ffffff",
  soundOn: true,
  vibrateOn: true,
};

export const TIMER_COLOR_PRESETS = [
  "#0f6e67", "#e8a33d", "#e0524a", "#f2c230", "#4caf6d", "#1a2b4c",
];

export const TIMER_PRESETS_SECONDS = [
  { label: "30 sec", seconds: 30 },
  { label: "1 min", seconds: 60 },
  { label: "2 min", seconds: 120 },
  { label: "5 min", seconds: 300 },
  { label: "10 min", seconds: 600 },
  { label: "15 min", seconds: 900 },
  { label: "20 min", seconds: 1200 },
  { label: "30 min", seconds: 1800 },
];

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

export function useTimerSettings() {
  const [settings, setSettings] = useState<VisualTimerSettings>(DEFAULT_TIMER_SETTINGS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSettings({
      ...DEFAULT_TIMER_SETTINGS,
      ...readJSON<Partial<VisualTimerSettings>>(STORAGE_KEY, {}),
    });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEY, settings);
  }, [settings, hydrated]);

  const updateField = useCallback(
    <K extends keyof VisualTimerSettings>(key: K, value: VisualTimerSettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  return { settings, updateField, hydrated };
}
