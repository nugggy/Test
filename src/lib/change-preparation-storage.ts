"use client";

import { useCallback, useEffect, useState } from "react";
import type { ChecklistItem } from "@/components/ChecklistSection";

const STORAGE_KEY = "dt:change-preparation:entries:v1";

export interface ChangePrepEntry {
  id: string;
  title: string;
  changeDate: string; // yyyy-mm-dd, blank if there's no specific date yet
  whatsChanging: ChecklistItem[];
  whatsStaying: ChecklistItem[];
  thingsThatMightHelp: ChecklistItem[];
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
    : `change-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function parseChecklist(raw: unknown): ChecklistItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((x): x is Partial<ChecklistItem> => !!x && typeof x === "object")
    .filter((x) => typeof x.text === "string")
    .map((x) => ({
      id: typeof x.id === "string" && x.id ? x.id : makeId(),
      text: x.text as string,
      done: x.done === true,
    }));
}

/** Cleans saved plans so older or damaged data can't break the page.
 * Missing lists become empty, nothing readable is dropped. */
export function parseChangePrepEntries(raw: unknown): ChangePrepEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((x): x is Partial<ChangePrepEntry> => !!x && typeof x === "object")
    .map((x) => ({
      id: typeof x.id === "string" && x.id ? x.id : makeId(),
      title: typeof x.title === "string" && x.title.trim() ? x.title : "My change",
      changeDate:
        typeof x.changeDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(x.changeDate)
          ? x.changeDate
          : "",
      whatsChanging: parseChecklist(x.whatsChanging),
      whatsStaying: parseChecklist(x.whatsStaying),
      thingsThatMightHelp: parseChecklist(x.thingsThatMightHelp),
      notes: typeof x.notes === "string" ? x.notes : "",
    }));
}

export function useChangePrepEntries() {
  const [entries, setEntries] = useState<ChangePrepEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntries(parseChangePrepEntries(readJSON<unknown>(STORAGE_KEY, [])));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEY, entries);
  }, [entries, hydrated]);

  const addEntry = useCallback((title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return null;
    const entry: ChangePrepEntry = {
      id: makeId(),
      title: trimmed,
      changeDate: "",
      whatsChanging: [],
      whatsStaying: [],
      thingsThatMightHelp: [],
      notes: "",
    };
    setEntries((prev) => [...prev, entry]);
    return entry.id;
  }, []);

  const updateEntry = useCallback(
    <K extends keyof ChangePrepEntry>(entryId: string, key: K, value: ChangePrepEntry[K]) => {
      setEntries((prev) =>
        prev.map((entry) => (entry.id === entryId ? { ...entry, [key]: value } : entry))
      );
    },
    []
  );

  const removeEntry = useCallback((entryId: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== entryId));
  }, []);

  return { entries, addEntry, updateEntry, removeEntry, hydrated };
}
