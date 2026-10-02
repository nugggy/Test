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
  /** Give a heads-up this many seconds before the end. 0 = no warning.
   * Added later - older saved settings get the default below. */
  warnAtSeconds: number;
  /** Optional "what happens next" label, shown under the timer and read out
   * when time is up, to help with the transition. */
  nextLabel: string;
}

export const DEFAULT_TIMER_SETTINGS: VisualTimerSettings = {
  lastMinutes: 5,
  lastSeconds: 0,
  style: "pie",
  color: "#c23b37",
  backgroundColor: "#ffffff",
  soundOn: true,
  vibrateOn: true,
  warnAtSeconds: 60,
  nextLabel: "",
};

export const WARNING_OPTIONS: { seconds: number; label: string }[] = [
  { seconds: 0, label: "No warning" },
  { seconds: 30, label: "30 sec before" },
  { seconds: 60, label: "1 min before" },
  { seconds: 120, label: "2 min before" },
  { seconds: 300, label: "5 min before" },
];

export const MAX_TIMER_MINUTES = 180;

/** Merges saved settings over the defaults, ignoring any values of the wrong
 * type, so older or damaged saved data can never break the timer. */
export function normaliseTimerSettings(raw: unknown): VisualTimerSettings {
  const d = DEFAULT_TIMER_SETTINGS;
  if (!raw || typeof raw !== "object") return { ...d };
  const r = raw as Partial<Record<keyof VisualTimerSettings, unknown>>;
  const num = (v: unknown, fallback: number, min: number, max: number) =>
    typeof v === "number" && Number.isFinite(v) ? Math.min(max, Math.max(min, Math.floor(v))) : fallback;
  const str = (v: unknown, fallback: string) => (typeof v === "string" ? v : fallback);
  const bool = (v: unknown, fallback: boolean) => (typeof v === "boolean" ? v : fallback);
  return {
    lastMinutes: num(r.lastMinutes, d.lastMinutes, 0, MAX_TIMER_MINUTES),
    lastSeconds: num(r.lastSeconds, d.lastSeconds, 0, 59),
    style: r.style === "bar" || r.style === "pie" ? r.style : d.style,
    color: str(r.color, d.color),
    backgroundColor: str(r.backgroundColor, d.backgroundColor),
    soundOn: bool(r.soundOn, d.soundOn),
    vibrateOn: bool(r.vibrateOn, d.vibrateOn),
    warnAtSeconds: num(r.warnAtSeconds, d.warnAtSeconds, 0, 3600),
    nextLabel: str(r.nextLabel, d.nextLabel).slice(0, 60),
  };
}

export const TIMER_COLOR_PRESETS = [
  "#c23b37", "#f5b324", "#e0524a", "#f2c230", "#4caf6d", "#1a2b4c",
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
    setSettings(normaliseTimerSettings(readJSON<unknown>(STORAGE_KEY, {})));
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
