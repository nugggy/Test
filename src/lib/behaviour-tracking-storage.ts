"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "dt:behaviour-tracking:entries:v1";

export interface BehaviourLogEntry {
  id: string;
  antecedent: string;
  behaviour: string;
  consequence: string;
  severity: number; // 1-5
  occurredAt: string; // ISO - the moment the behaviour happened
  /** Optional extra detail, added later. 0 / "" for older entries. */
  durationMinutes: number;
  setting: string; // where it happened
  notes: string;
  recordedBy: string; // name or initials of whoever logged it
}

export type BehaviourLogInput = Omit<BehaviourLogEntry, "id">;

function makeId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? `abc-${crypto.randomUUID()}`
    : `abc-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/** Loads saved entries, filling in fields added after they were saved. */
export function normalizeBehaviourEntries(raw: unknown): BehaviourLogEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((e): e is Partial<BehaviourLogEntry> => !!e && typeof e === "object")
    .map((e) => {
      const severity = Math.round(Number(e.severity));
      const duration = Number(e.durationMinutes);
      return {
        id: typeof e.id === "string" && e.id ? e.id : makeId(),
        antecedent: typeof e.antecedent === "string" ? e.antecedent : "",
        behaviour: typeof e.behaviour === "string" ? e.behaviour : "",
        consequence: typeof e.consequence === "string" ? e.consequence : "",
        severity: severity >= 1 && severity <= 5 ? severity : 3,
        occurredAt: typeof e.occurredAt === "string" ? e.occurredAt : new Date().toISOString(),
        durationMinutes: Number.isFinite(duration) && duration > 0 ? duration : 0,
        setting: typeof e.setting === "string" ? e.setting : "",
        notes: typeof e.notes === "string" ? e.notes : "",
        recordedBy: typeof e.recordedBy === "string" ? e.recordedBy : "",
      };
    });
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

/** Part of the day for an hour 0-23, for the time-of-day pattern. */
export function partOfDay(hour: number): "Morning (6am to 12pm)" | "Afternoon (12pm to 5pm)" | "Evening (5pm to 9pm)" | "Night (9pm to 6am)" {
  if (hour >= 6 && hour < 12) return "Morning (6am to 12pm)";
  if (hour >= 12 && hour < 17) return "Afternoon (12pm to 5pm)";
  if (hour >= 17 && hour < 21) return "Evening (5pm to 9pm)";
  return "Night (9pm to 6am)";
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

export function useBehaviourLog() {
  const [entries, setEntries] = useState<BehaviourLogEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // localStorage only exists client-side, so entries are synced in after
    // mount rather than during the (server) initial render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntries(normalizeBehaviourEntries(readJSON<unknown>(STORAGE_KEY, [])));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEY, entries);
  }, [entries, hydrated]);

  const addEntry = useCallback((data: BehaviourLogInput) => {
    const id = makeId();
    setEntries((prev) => [{ id, ...data }, ...prev]);
  }, []);

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  const clearAll = useCallback(() => setEntries([]), []);

  return { entries, addEntry, removeEntry, clearAll, hydrated };
}
