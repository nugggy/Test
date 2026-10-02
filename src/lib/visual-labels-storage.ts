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

// Print size is stored under its own key so the saved labels list keeps
// exactly the same shape as before.
const SIZE_KEY = "dt:visual-labels:size:v1";

export type LabelSize = "small" | "medium" | "large" | "sign";

export const LABEL_SIZES: { id: LabelSize; name: string; hint: string }[] = [
  { id: "small", name: "Small", hint: "4 across. Good for cupboards and drawers." },
  { id: "medium", name: "Medium", hint: "3 across." },
  { id: "large", name: "Large", hint: "2 across. Good for doors." },
  { id: "sign", name: "Sign", hint: "1 per page. Good for a door or wall sign." },
];

function isLabelSize(value: unknown): value is LabelSize {
  return LABEL_SIZES.some((s) => s.id === value);
}

export function useLabelSize() {
  const [size, setSize] = useState<LabelSize>("medium");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readJSON<unknown>(SIZE_KEY, "medium");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSize(isLabelSize(stored) ? stored : "medium");
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(SIZE_KEY, size);
  }, [size, hydrated]);

  return { size, setSize };
}
