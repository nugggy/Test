"use client";

import { useCallback, useEffect, useState } from "react";
import type { WeatherLocation } from "@/lib/weather-data";

const STORAGE_KEY = "dt:weather:v1";

export type TemperatureUnit = "celsius" | "fahrenheit";

export interface WeatherSettings {
  location: WeatherLocation | null;
  unit: TemperatureUnit;
  showHumidity: boolean;
  showWind: boolean;
  showFeelsLike: boolean;
  forecastDays: number;
  backgroundColor: string;
  textColor: string;
  fontScale: number;
}

export const DEFAULT_WEATHER_SETTINGS: WeatherSettings = {
  location: null,
  unit: "celsius",
  showHumidity: true,
  showWind: true,
  showFeelsLike: true,
  forecastDays: 5,
  backgroundColor: "#1a2b4c",
  textColor: "#ffffff",
  fontScale: 1,
};

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

export function useWeatherSettings() {
  const [settings, setSettings] = useState<WeatherSettings>(DEFAULT_WEATHER_SETTINGS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSettings({
      ...DEFAULT_WEATHER_SETTINGS,
      ...readJSON<Partial<WeatherSettings>>(STORAGE_KEY, {}),
    });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEY, settings);
  }, [settings, hydrated]);

  const updateField = useCallback(
    <K extends keyof WeatherSettings>(key: K, value: WeatherSettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetStyle = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      backgroundColor: DEFAULT_WEATHER_SETTINGS.backgroundColor,
      textColor: DEFAULT_WEATHER_SETTINGS.textColor,
      fontScale: DEFAULT_WEATHER_SETTINGS.fontScale,
    }));
  }, []);

  return { settings, updateField, resetStyle, hydrated };
}
