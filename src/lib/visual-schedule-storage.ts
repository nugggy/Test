"use client";

import { useCallback, useEffect, useState } from "react";

const SCHEDULE_KEY = "dt:visual-schedule:items:v1";

export interface ScheduleItem {
  id: string;
  label: string;
  icon: string;
  done: boolean;
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
    // reloads — the tool still works for the current session.
  }
}

export function useScheduleItems() {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // localStorage only exists client-side, so items are synced in after
    // mount rather than during the (server) initial render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(readJSON<ScheduleItem[]>(SCHEDULE_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(SCHEDULE_KEY, items);
  }, [items, hydrated]);

  const addItem = useCallback((activity: { label: string; icon: string }) => {
    setItems((prev) => [
      ...prev,
      {
        id: `sched-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        label: activity.label,
        icon: activity.icon,
        done: false,
      },
    ]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toggleDone = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  }, []);

  const moveItem = useCallback((id: string, direction: "up" | "down") => {
    setItems((prev) => {
      const index = prev.findIndex((item) => item.id === id);
      if (index === -1) return prev;
      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[newIndex]] = [next[newIndex], next[index]];
      return next;
    });
  }, []);

  const resetDone = useCallback(() => {
    setItems((prev) => prev.map((item) => ({ ...item, done: false })));
  }, []);

  const clearAll = useCallback(() => setItems([]), []);

  return {
    items,
    addItem,
    removeItem,
    toggleDone,
    moveItem,
    resetDone,
    clearAll,
    hydrated,
  };
}
