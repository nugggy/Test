"use client";

import { useCallback, useEffect, useState } from "react";
import type { ChecklistItem } from "@/components/ChecklistSection";

const STORAGE_KEY = "dt:active-support:v1";

export interface ActiveSupportNotes {
  selfReflection: ChecklistItem[];
  ideasForThisPerson: string[];
  /** What each of the five elements looks like for this specific person,
   * keyed by element id (see ACTIVE_SUPPORT_ELEMENTS in active-support-data.ts). */
  personalExamples: Record<string, string[]>;
}

const EMPTY: ActiveSupportNotes = {
  selfReflection: [],
  ideasForThisPerson: [],
  personalExamples: {},
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

export function useActiveSupportNotes() {
  const [notes, setNotes] = useState<ActiveSupportNotes>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNotes({ ...EMPTY, ...readJSON<Partial<ActiveSupportNotes>>(STORAGE_KEY, {}) });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEY, notes);
  }, [notes, hydrated]);

  const updateField = useCallback(
    <K extends keyof ActiveSupportNotes>(key: K, value: ActiveSupportNotes[K]) => {
      setNotes((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const updatePersonalExamples = useCallback((elementId: string, items: string[]) => {
    setNotes((prev) => ({
      ...prev,
      personalExamples: { ...prev.personalExamples, [elementId]: items },
    }));
  }, []);

  return { notes, updateField, updatePersonalExamples, hydrated };
}
