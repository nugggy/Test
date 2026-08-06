"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "dt:know-your-rights:v1";

export interface RightsNotes {
  questionsToAsk: string[];
  rightsToLearnMore: string[];
  myAdvocatesAndSupportPeople: string[];
}

const EMPTY: RightsNotes = {
  questionsToAsk: [],
  rightsToLearnMore: [],
  myAdvocatesAndSupportPeople: [],
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
    // reloads — the tool still works for the current session.
  }
}

export function useRightsNotes() {
  const [notes, setNotes] = useState<RightsNotes>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNotes({ ...EMPTY, ...readJSON<Partial<RightsNotes>>(STORAGE_KEY, {}) });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEY, notes);
  }, [notes, hydrated]);

  const updateField = useCallback(
    <K extends keyof RightsNotes>(key: K, value: RightsNotes[K]) => {
      setNotes((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  return { notes, updateField, hydrated };
}
