"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "dt:memory-aid-board:v1";

export type TimeOfDay = "morning" | "afternoon" | "evening" | "anytime";

export interface Reminder {
  id: string;
  label: string;
  emoji: string;
  timeOfDay: TimeOfDay;
  done: boolean;
}

interface RemindersState {
  reminders: Reminder[];
  lastResetDate: string; // yyyy-mm-dd, device-local date the ticks were last cleared
}

const EMPTY_STATE: RemindersState = { reminders: [], lastResetDate: "" };

function todayLocalDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
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

function makeId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `reminder-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function useReminders() {
  const [state, setState] = useState<RemindersState>(EMPTY_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const today = todayLocalDateString();
    const loaded = { ...EMPTY_STATE, ...readJSON<Partial<RemindersState>>(STORAGE_KEY, {}) };
    // A new day since the ticks were last cleared - start the checklist
    // fresh automatically, the way a daily reminder board should.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(
      loaded.lastResetDate !== today
        ? {
            reminders: loaded.reminders.map((r) => ({ ...r, done: false })),
            lastResetDate: today,
          }
        : loaded
    );
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEY, state);
  }, [state, hydrated]);

  const addReminder = useCallback((data: { label: string; emoji: string; timeOfDay: TimeOfDay }) => {
    const trimmed = data.label.trim();
    if (!trimmed) return;
    setState((prev) => ({
      ...prev,
      reminders: [
        ...prev.reminders,
        { id: makeId(), label: trimmed, emoji: data.emoji, timeOfDay: data.timeOfDay, done: false },
      ],
    }));
  }, []);

  const removeReminder = useCallback((id: string) => {
    setState((prev) => ({ ...prev, reminders: prev.reminders.filter((r) => r.id !== id) }));
  }, []);

  const toggleDone = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      reminders: prev.reminders.map((r) => (r.id === id ? { ...r, done: !r.done } : r)),
    }));
  }, []);

  const resetForToday = useCallback(() => {
    setState((prev) => ({
      reminders: prev.reminders.map((r) => ({ ...r, done: false })),
      lastResetDate: todayLocalDateString(),
    }));
  }, []);

  const clearAll = useCallback(() => setState(EMPTY_STATE), []);

  return {
    reminders: state.reminders,
    addReminder,
    removeReminder,
    toggleDone,
    resetForToday,
    clearAll,
    hydrated,
  };
}
