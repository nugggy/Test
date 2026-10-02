"use client";

import { useCallback, useEffect, useState } from "react";
import {
  EMPTY_SENSORY_NOTES,
  normaliseSensoryNotes,
  type SensoryNeedsNotes,
} from "@/lib/sensory-needs-data";

export type { SensoryNeedsNotes } from "@/lib/sensory-needs-data";

// Same key as the first version - older profiles are upgraded on load by
// normaliseSensoryNotes(), never wiped.
const STORAGE_KEY = "dt:sensory-needs:v1";

function readRaw(key: string): unknown {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
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
  const [notes, setNotes] = useState<SensoryNeedsNotes>(EMPTY_SENSORY_NOTES);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNotes(normaliseSensoryNotes(readRaw(STORAGE_KEY)));
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

  const updateName = useCallback((name: string) => {
    setNotes((prev) => ({ ...prev, name }));
  }, []);

  return { notes, updateHelps, updateOverwhelms, updateName, hydrated };
}
