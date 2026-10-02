"use client";

import { useCallback, useEffect, useState } from "react";

const SCHEDULE_KEY = "dt:visual-schedule:items:v1";
/** The device-local date (yyyy-mm-dd) the ticks belong to. Kept under its
 * own key so the saved items array keeps exactly the shape it always had. */
const TICKS_DAY_KEY = "dt:visual-schedule:ticks-day:v1";

/** Device-local date as yyyy-mm-dd. The device clock is used (not the app's
 * timezone setting) because "a new day" should follow the person's own
 * midnight. */
export function localDateString(d: Date = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

/** Index of the first step not yet done ("Now"), or -1 when every step is
 * done or the schedule is empty. */
export function currentStepIndex(items: { done: boolean }[]): number {
  return items.findIndex((item) => !item.done);
}

/** Index of the step after "Now" that isn't done yet ("Next"), or -1. */
export function nextStepIndex(items: { done: boolean }[]): number {
  const now = currentStepIndex(items);
  if (now === -1) return -1;
  for (let i = now + 1; i < items.length; i++) {
    if (!items[i].done) return i;
  }
  return -1;
}

export interface ScheduleItem {
  id: string;
  label: string;
  icon: string;
  done: boolean;
  /** Minutes to spend on this step - 0 means no countdown offered. */
  durationMinutes: number;
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

/** Fills in defaults for fields added after some items were already saved,
 * so older localStorage data keeps working without a migration. */
function normalizeItem(item: Partial<ScheduleItem>): ScheduleItem {
  return {
    id:
      typeof item.id === "string" && item.id
        ? item.id
        : `sched-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    label: typeof item.label === "string" ? item.label : "",
    icon: typeof item.icon === "string" && item.icon ? item.icon : "✨",
    done: item.done === true,
    durationMinutes:
      typeof item.durationMinutes === "number" && Number.isFinite(item.durationMinutes)
        ? Math.max(0, item.durationMinutes)
        : 0,
  };
}

/** Parses whatever is saved into a clean item list - never throws, and
 * skips anything that isn't an object, so damaged data can't break the
 * page. */
export function parseScheduleItems(raw: unknown): ScheduleItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item): item is Partial<ScheduleItem> => !!item && typeof item === "object")
    .map(normalizeItem);
}

export function useScheduleItems() {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // localStorage only exists client-side, so items are synced in after
    // mount rather than during the (server) initial render.
    const loaded = parseScheduleItems(readJSON<unknown>(SCHEDULE_KEY, []));
    const today = localDateString();
    const ticksDay = readJSON<string>(TICKS_DAY_KEY, "");
    // A schedule is usually reused day after day, so yesterday's ticks are
    // cleared on a new day - otherwise "Now" would point at the wrong step.
    // Only the ticks reset; the steps themselves are always kept.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(
      ticksDay && ticksDay !== today ? loaded.map((item) => ({ ...item, done: false })) : loaded
    );
    writeJSON(TICKS_DAY_KEY, today);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(SCHEDULE_KEY, items);
  }, [items, hydrated]);

  // Catch midnight while the page stays open (e.g. a tablet left on the
  // kitchen bench): check once a minute and whenever the page is shown again.
  useEffect(() => {
    if (!hydrated) return;
    function checkNewDay() {
      const today = localDateString();
      if (readJSON<string>(TICKS_DAY_KEY, "") === today) return;
      writeJSON(TICKS_DAY_KEY, today);
      setItems((prev) =>
        prev.some((item) => item.done) ? prev.map((item) => ({ ...item, done: false })) : prev
      );
    }
    const id = setInterval(checkNewDay, 60_000);
    document.addEventListener("visibilitychange", checkNewDay);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", checkNewDay);
    };
  }, [hydrated]);

  const addItem = useCallback((activity: { label: string; icon: string }) => {
    setItems((prev) => [
      ...prev,
      {
        id: `sched-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        label: activity.label,
        icon: activity.icon,
        done: false,
        durationMinutes: 0,
      },
    ]);
  }, []);

  const setDuration = useCallback((id: string, minutes: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, durationMinutes: Math.max(0, minutes) } : item
      )
    );
  }, []);

  /** Reorders by dragging `id` to sit just before `beforeId` (or to the end
   * when `beforeId` is null) - the drag-and-drop counterpart to `moveItem`'s
   * one-step-at-a-time arrows, which stay in place for keyboard/switch
   * access. */
  const reorderItem = useCallback((id: string, beforeId: string | null) => {
    setItems((prev) => {
      if (id === beforeId) return prev;
      const dragged = prev.find((item) => item.id === id);
      if (!dragged) return prev;
      const withoutDragged = prev.filter((item) => item.id !== id);
      const targetIndex =
        beforeId == null
          ? withoutDragged.length
          : withoutDragged.findIndex((item) => item.id === beforeId);
      if (targetIndex === -1) return prev;
      const next = [...withoutDragged];
      next.splice(targetIndex, 0, dragged);
      return next;
    });
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
    reorderItem,
    setDuration,
    resetDone,
    clearAll,
    hydrated,
  };
}
