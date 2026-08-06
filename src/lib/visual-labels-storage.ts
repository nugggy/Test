"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "dt:visual-labels:v1";

export interface VisualLabel {
  id: string;
  text: string;
  emoji: string;
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

export function useVisualLabels() {
  const [labels, setLabels] = useState<VisualLabel[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLabels(readJSON<VisualLabel[]>(STORAGE_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEY, labels);
  }, [labels, hydrated]);

  const addLabel = useCallback((text: string, emoji: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setLabels((prev) => [...prev, { id: makeId(), text: trimmed, emoji }]);
  }, []);

  const removeLabel = useCallback((id: string) => {
    setLabels((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const clearAll = useCallback(() => setLabels([]), []);

  return { labels, addLabel, removeLabel, clearAll, hydrated };
}
