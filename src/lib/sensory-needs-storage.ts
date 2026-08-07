"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "dt:sensory-needs:v1";

export interface SensoryNeedsNotes {
  /** What helps, keyed by sensory domain id (see SENSORY_DOMAINS). */
  helps: Record<string, string[]>;
  /** What overwhelms/triggers, keyed by sensory domain id. */
  overwhelms: Record<string, string[]>;
}

const EMPTY: SensoryNeedsNotes = {
  helps: {},
  overwhelms: {},
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

export function useSensoryNeedsNotes() {
  const [notes, setNotes] = useState<SensoryNeedsNotes>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNotes({ ...EMPTY, ...readJSON<Partial<SensoryNeedsNotes>>(STORAGE_KEY, {}) });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEY, notes);
  }, [notes, hydrated]);

  const updateHelps = useCallback((domainId: string, items: string[]) => {
    setNotes((prev) => ({ ...prev, helps: { ...prev.helps, [domainId]: items } }));
  }, []);

  const updateOverwhelms = useCallback((domainId: string, items: string[]) => {
    setNotes((prev) => ({ ...prev, overwhelms: { ...prev.overwhelms, [domainId]: items } }));
  }, []);

  return { notes, updateHelps, updateOverwhelms, hydrated };
}
