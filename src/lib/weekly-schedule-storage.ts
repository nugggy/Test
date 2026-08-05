"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "dt:weekly-schedule:v1";

export type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export interface WeeklyScheduleItem {
  id: string;
  label: string;
  icon: string;
  done: boolean;
}

export const DAYS: { key: DayKey; label: string }[] = [
  { key: "mon", label: "Monday" },
  { key: "tue", label: "Tuesday" },
  { key: "wed", label: "Wednesday" },
  { key: "thu", label: "Thursday" },
  { key: "fri", label: "Friday" },
  { key: "sat", label: "Saturday" },
  { key: "sun", label: "Sunday" },
];

type WeekData = Record<DayKey, WeeklyScheduleItem[]>;

function emptyWeek(): WeekData {
  return { mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [] };
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

export function useWeeklySchedule() {
  const [week, setWeek] = useState<WeekData>(emptyWeek());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // localStorage only exists client-side, so the week is synced in after
    // mount rather than during the (server) initial render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWeek({ ...emptyWeek(), ...readJSON<Partial<WeekData>>(STORAGE_KEY, {}) });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEY, week);
  }, [week, hydrated]);

  const addItem = useCallback(
    (day: DayKey, activity: { label: string; icon: string }) => {
      const id = `wk-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setWeek((prev) => ({
        ...prev,
        [day]: [
          ...prev[day],
          { id, label: activity.label, icon: activity.icon, done: false },
        ],
      }));
      return id;
    },
    []
  );

  const removeItem = useCallback((day: DayKey, id: string) => {
    setWeek((prev) => ({
      ...prev,
      [day]: prev[day].filter((item) => item.id !== id),
    }));
  }, []);

  const toggleDone = useCallback((day: DayKey, id: string) => {
    setWeek((prev) => ({
      ...prev,
      [day]: prev[day].map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      ),
    }));
  }, []);

  const resetAllDone = useCallback(() => {
    setWeek((prev) => {
      const next = { ...prev };
      for (const day of Object.keys(next) as DayKey[]) {
        next[day] = next[day].map((item) => ({ ...item, done: false }));
      }
      return next;
    });
  }, []);

  const clearWeek = useCallback(() => setWeek(emptyWeek()), []);

  return {
    week,
    addItem,
    removeItem,
    toggleDone,
    resetAllDone,
    clearWeek,
    hydrated,
  };
}
