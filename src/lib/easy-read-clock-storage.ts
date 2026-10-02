"use client";

import { useCallback, useEffect, useState } from "react";
import { DEFAULT_TIMEZONE } from "@/lib/timezone-context";

const STORAGE_KEY = "dt:easy-read-clock:v1";

export type ClockMode = "digital" | "analog";
export type NumberStyle = "arabic" | "roman" | "none";
export type HandStyle = "classic" | "modern" | "minimal";

export interface ClockSettings {
  mode: ClockMode;
  timezone: string;
  format24h: boolean;
  showSeconds: boolean;
  showDate: boolean;
  backgroundColor: string;
  textColor: string;
  fontScale: number; // 1 = default, up to 2.4 = huge
  // Analog-only customisation
  numberStyle: NumberStyle;
  showMinuteTicks: boolean;
  faceColor: string; // "transparent" = see-through, otherwise a CSS colour
  secondHandColor: string;
  handStyle: HandStyle;
}

export const DEFAULT_CLOCK_SETTINGS: ClockSettings = {
  mode: "digital",
  timezone: DEFAULT_TIMEZONE,
  format24h: false,
  showSeconds: true,
  showDate: true,
  backgroundColor: "#241a38",
  textColor: "#ffffff",
  fontScale: 1,
  numberStyle: "arabic",
  showMinuteTicks: true,
  faceColor: "transparent",
  secondHandColor: "#e0524a",
  handStyle: "classic",
};

export const BACKGROUND_PRESETS = [
  "#241a38", "#0a0a0a", "#1c1032", "#0b3d2e", "#1a2b4c", "#3a1c00", "#ffffff", "#f6f2fb",
];

export const TEXT_COLOR_PRESETS = [
  "#ffffff", "#ffe066", "#9b6fe8", "#4caf6d", "#f2c230", "#e0524a", "#241a38", "#000000",
];

export const FACE_COLOR_PRESETS = [
  "#ffffff", "#f6f2fb", "#0a0a0a", "#241a38", "#0b3d2e", "#fff4e0",
];

export const FONT_SCALE_OPTIONS: { value: number; label: string }[] = [
  { value: 1, label: "Standard" },
  { value: 1.4, label: "Large" },
  { value: 1.8, label: "Extra large" },
  { value: 2.4, label: "Huge" },
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

export function useClockSettings() {
  const [settings, setSettings] = useState<ClockSettings>(DEFAULT_CLOCK_SETTINGS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSettings({
      ...DEFAULT_CLOCK_SETTINGS,
      ...readJSON<Partial<ClockSettings>>(STORAGE_KEY, {}),
    });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEY, settings);
  }, [settings, hydrated]);

  const updateField = useCallback(
    <K extends keyof ClockSettings>(key: K, value: ClockSettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const reset = useCallback(() => setSettings(DEFAULT_CLOCK_SETTINGS), []);

  return { settings, updateField, reset, hydrated };
}
