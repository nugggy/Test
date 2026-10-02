"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "dt:fitness-plan:log:v1";

export interface FitnessLogEntry {
  id: string;
  date: string; // yyyy-mm-dd
  activity: string;
  durationMinutes: number;
  notes: string;
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
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}


/** Loads saved sessions, skipping rows with no date and filling gaps. */
export function normalizeFitnessEntries(raw: unknown): FitnessLogEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((e): e is Partial<FitnessLogEntry> => !!e && typeof e === "object")
    .filter((e) => typeof e.date === "string" && e.date !== "")
    .map((e) => {
      const minutes = Number(e.durationMinutes);
      return {
        id: typeof e.id === "string" && e.id ? e.id : makeId(),
        date: e.date as string,
        activity: typeof e.activity === "string" ? e.activity : "",
        durationMinutes: Number.isFinite(minutes) && minutes > 0 ? minutes : 0,
        notes: typeof e.notes === "string" ? e.notes : "",
      };
    });
}

/** dd/mm/yyyy for a yyyy-mm-dd key. */
export function formatFitnessDate(key: string): string {
  const [y, m, d] = key.split("-");
  return y && m && d ? `${d}/${m}/${y}` : key;
}

/** Monday (yyyy-mm-dd) of the week containing `key`. */
export function weekStartKey(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(Date.UTC(y, (m || 1) - 1, d || 1));
  const daysSinceMonday = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - daysSinceMonday);
  return date.toISOString().slice(0, 10);
}

/** Sessions and minutes in the Monday-to-Sunday week containing `todayKey`. */
export function weekSummary(entries: FitnessLogEntry[], todayKey: string) {
  const start = weekStartKey(todayKey);
  const [y, m, d] = start.split("-").map(Number);
  const endDate = new Date(Date.UTC(y, m - 1, d));
  endDate.setUTCDate(endDate.getUTCDate() + 6);
  const end = endDate.toISOString().slice(0, 10);
  const inWeek = entries.filter((e) => e.date >= start && e.date <= end);
  return {
    start,
    end,
    sessions: inWeek.length,
    minutes: inWeek.reduce((sum, e) => sum + e.durationMinutes, 0),
    activeDays: new Set(inWeek.map((e) => e.date)).size,
  };
}

export function useFitnessLog() {
  const [entries, setEntries] = useState<FitnessLogEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntries(normalizeFitnessEntries(readJSON<unknown>(STORAGE_KEY, [])));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEY, entries);
  }, [entries, hydrated]);

  const addEntry = useCallback((data: Omit<FitnessLogEntry, "id">) => {
    setEntries((prev) => [{ id: makeId(), ...data }, ...prev]);
  }, []);

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  const clearAll = useCallback(() => setEntries([]), []);

  return { entries, addEntry, removeEntry, clearAll, hydrated };
}
