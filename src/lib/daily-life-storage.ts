"use client";

import { useCallback, useEffect, useState } from "react";
import type { ChecklistItem } from "@/components/ChecklistSection";

const STORAGE_KEY = "dt:daily-life-assistant:v1";

export interface DailyTask {
  id: string;
  title: string;
  emoji: string;
  steps: ChecklistItem[];
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

export function useDailyTasks() {
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTasks(readJSON<DailyTask[]>(STORAGE_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEY, tasks);
  }, [tasks, hydrated]);

  const addTask = useCallback((title: string, emoji: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setTasks((prev) => [...prev, { id: makeId(), title: trimmed, emoji, steps: [] }]);
  }, []);

  const updateTask = useCallback((id: string, patch: Partial<Omit<DailyTask, "id">>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const resetTaskSteps = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, steps: t.steps.map((s) => ({ ...s, done: false })) } : t
      )
    );
  }, []);

  return { tasks, addTask, updateTask, removeTask, resetTaskSteps, hydrated };
}
