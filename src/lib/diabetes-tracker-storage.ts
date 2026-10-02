"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "dt:diabetes-tracker:entries:v1";

export interface GlucoseEntry {
  id: string;
  occurredAt: string; // ISO - when the reading was taken
  bglMmol: number;
  context: string; // e.g. "Before breakfast"
  insulinType: string;
  insulinDose: string; // kept as text (units, e.g. "6" or "6.5")
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

export function useGlucoseLog() {
  const [entries, setEntries] = useState<GlucoseEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntries(normalizeGlucoseEntries(readJSON<unknown>(STORAGE_KEY, [])));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEY, entries);
  }, [entries, hydrated]);

  const addEntry = useCallback((data: Omit<GlucoseEntry, "id">) => {
    setEntries((prev) => [{ id: makeId(), ...data }, ...prev]);
  }, []);

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  const clearAll = useCallback(() => setEntries([]), []);

  return { entries, addEntry, removeEntry, clearAll, hydrated };
}

/** dd/mm/yyyy HH:MM (24-hour) in `timezone`, for exports and printouts. */
export function formatRecordDateTime(iso: string, timezone: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  try {
    const parts = new Intl.DateTimeFormat("en-AU", {
      timeZone: timezone,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(date);
    const l = Object.fromEntries(parts.map((p) => [p.type, p.value]));
    return `${l.day}/${l.month}/${l.year} ${l.hour}:${l.minute}`;
  } catch {
    return date.toISOString();
  }
}

/** Loads saved readings, skipping anything unusable and filling gaps. */
export function normalizeGlucoseEntries(raw: unknown): GlucoseEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((e): e is Partial<GlucoseEntry> => !!e && typeof e === "object")
    .map((e) => ({
      id: typeof e.id === "string" && e.id ? e.id : makeId(),
      occurredAt: typeof e.occurredAt === "string" ? e.occurredAt : new Date().toISOString(),
      bglMmol: Number(e.bglMmol),
      context: typeof e.context === "string" ? e.context : "",
      insulinType: typeof e.insulinType === "string" ? e.insulinType : "",
      insulinDose: typeof e.insulinDose === "string" ? e.insulinDose : e.insulinDose != null ? String(e.insulinDose) : "",
      notes: typeof e.notes === "string" ? e.notes : "",
    }))
    .filter((e) => Number.isFinite(e.bglMmol));
}
