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

export interface RemindersState {
  reminders: Reminder[];
  lastResetDate: string; // yyyy-mm-dd, device-local date the ticks were last cleared
}

const EMPTY_STATE: RemindersState = { reminders: [], lastResetDate: "" };

const TIMES: TimeOfDay[] = ["morning", "afternoon", "evening", "anytime"];

/** Cleans up saved data so a damaged or older save can't break the board.
 * Reminders keep their ids, labels and ticks; anything unreadable is
 * skipped rather than wiping the whole list. */
export function parseRemindersState(raw: unknown): RemindersState {
  if (!raw || typeof raw !== "object") return { ...EMPTY_STATE };
  const r = raw as { reminders?: unknown; lastResetDate?: unknown };
  const list = Array.isArray(r.reminders) ? r.reminders : [];
  const reminders: Reminder[] = [];
  for (const item of list) {
    if (!item || typeof item !== "object") continue;
    const x = item as Partial<Reminder>;
    if (typeof x.label !== "string" || !x.label.trim()) continue;
    reminders.push({
      id: typeof x.id === "string" && x.id ? x.id : makeId(),
      label: x.label,
      emoji: typeof x.emoji === "string" && x.emoji ? x.emoji : "✨",
      timeOfDay: TIMES.includes(x.timeOfDay as TimeOfDay) ? (x.timeOfDay as TimeOfDay) : "anytime",
      done: x.done === true,
    });
  }
  return {
    reminders,
    lastResetDate: typeof r.lastResetDate === "string" ? r.lastResetDate : "",
  };
}

/** If `today` is a different day from the last reset, untick everything.
 * Returns the same object when nothing needs to change. */
export function rollOverIfNewDay(state: RemindersState, today: string): RemindersState {
  if (state.lastResetDate === today) return state;
  return {
    reminders: state.reminders.map((r) => (r.done ? { ...r, done: false } : r)),
    lastResetDate: today,
  };
}

export function todayLocalDateString(): string {
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
    const loaded = parseRemindersState(readJSON<unknown>(STORAGE_KEY, {}));
    // A new day since the ticks were last cleared - start the checklist
    // fresh automatically, the way a daily reminder board should.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(rollOverIfNewDay(loaded, todayLocalDateString()));
    setHydrated(true);
  }, []);

  // The board is often left open all day and night on a tablet or fridge
  // screen, so checking only on page load isn't enough. Check once a minute
  // and whenever the screen is shown again, and reset after midnight.
  useEffect(() => {
    if (!hydrated) return;
    function check() {
      setState((prev) => rollOverIfNewDay(prev, todayLocalDateString()));
    }
    const id = setInterval(check, 60_000);
    document.addEventListener("visibilitychange", check);
    window.addEventListener("focus", check);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", check);
      window.removeEventListener("focus", check);
    };
  }, [hydrated]);

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
    setState((prev) => {
      // If the day has rolled over since the last check, reset first so a
      // tick made just after midnight counts for the new day.
      const current = rollOverIfNewDay(prev, todayLocalDateString());
      return {
        ...current,
        reminders: current.reminders.map((r) => (r.id === id ? { ...r, done: !r.done } : r)),
      };
    });
  }, []);

  /** Moves a reminder one place earlier or later within its own time of
   * day group. */
  const moveReminder = useCallback((id: string, direction: "up" | "down") => {
    setState((prev) => {
      const list = prev.reminders;
      const index = list.findIndex((r) => r.id === id);
      if (index === -1) return prev;
      const group = list[index].timeOfDay;
      const step = direction === "up" ? -1 : 1;
      let swapWith = index + step;
      while (swapWith >= 0 && swapWith < list.length && list[swapWith].timeOfDay !== group) {
        swapWith += step;
      }
      if (swapWith < 0 || swapWith >= list.length) return prev;
      const next = [...list];
      [next[index], next[swapWith]] = [next[swapWith], next[index]];
      return { ...prev, reminders: next };
    });
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
    moveReminder,
    resetForToday,
    clearAll,
    hydrated,
  };
}
