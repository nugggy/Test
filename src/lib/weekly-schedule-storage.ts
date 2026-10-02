"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "dt:weekly-schedule:v1";
/** The Monday (device-local yyyy-mm-dd) the ticks belong to. Separate key,
 * so the saved week keeps exactly the shape it always had. */
const TICKS_WEEK_KEY = "dt:weekly-schedule:ticks-week:v1";

export type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export interface WeeklyScheduleItem {
  id: string;
  label: string;
  icon: string;
  done: boolean;
}

export const DAYS: { key: DayKey; label: string }[] = [
  { key: "mon", label: "Monday" },
  { key: "tue", label: "Tuesday" },
  { key: "wed", label: "Wednesday" },
  { key: "thu", label: "Thursday" },
  { key: "fri", label: "Friday" },
  { key: "sat", label: "Saturday" },
  { key: "sun", label: "Sunday" },
];

export type WeekData = Record<DayKey, WeeklyScheduleItem[]>;

function emptyWeek(): WeekData {
  return { mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [] };
}

const DAY_KEYS: DayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

function makeId() {
  return `wk-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Cleans saved data so a damaged save can't break the page. Items keep
 * their ids, labels, pictures and ticks. */
export function parseWeek(raw: unknown): WeekData {
  const week = emptyWeek();
  if (!raw || typeof raw !== "object") return week;
  const r = raw as Partial<Record<DayKey, unknown>>;
  for (const day of DAY_KEYS) {
    const list = r[day];
    if (!Array.isArray(list)) continue;
    week[day] = list
      .filter((x): x is Partial<WeeklyScheduleItem> => !!x && typeof x === "object")
      .filter((x) => typeof x.label === "string" && x.label.trim() !== "")
      .map((x) => ({
        id: typeof x.id === "string" && x.id ? x.id : makeId(),
        label: x.label as string,
        icon: typeof x.icon === "string" && x.icon ? x.icon : "✨",
        done: x.done === true,
      }));
  }
  return week;
}

/** Monday of the week containing `d`, as a device-local yyyy-mm-dd. */
export function mondayOf(d: Date = new Date()): string {
  const copy = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const offset = (copy.getDay() + 6) % 7; // Monday = 0
  copy.setDate(copy.getDate() - offset);
  return `${copy.getFullYear()}-${String(copy.getMonth() + 1).padStart(2, "0")}-${String(
    copy.getDate()
  ).padStart(2, "0")}`;
}

function clearTicks(week: WeekData): WeekData {
  const next = { ...week };
  for (const day of DAY_KEYS) {
    next[day] = next[day].map((item) => (item.done ? { ...item, done: false } : item));
  }
  return next;
}

/** Copies `from`'s activities into each target day, replacing what was
 * there. Copies get new ids and start unticked. */
export function copyDayInto(week: WeekData, from: DayKey, targets: DayKey[]): WeekData {
  const next = { ...week };
  for (const target of targets) {
    if (target === from) continue;
    next[target] = week[from].map((item) => ({
      id: makeId(),
      label: item.label,
      icon: item.icon,
      done: false,
    }));
  }
  return next;
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

export function useWeeklySchedule() {
  const [week, setWeek] = useState<WeekData>(emptyWeek());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // localStorage only exists client-side, so the week is synced in after
    // mount rather than during the (server) initial render.
    const loaded = parseWeek(readJSON<unknown>(STORAGE_KEY, {}));
    const thisWeek = mondayOf();
    const ticksWeek = readJSON<string>(TICKS_WEEK_KEY, "");
    // The week is usually the same plan every week, so last week's ticks
    // are cleared once a new week starts (on Monday). Activities are kept.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWeek(ticksWeek && ticksWeek !== thisWeek ? clearTicks(loaded) : loaded);
    writeJSON(TICKS_WEEK_KEY, thisWeek);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEY, week);
  }, [week, hydrated]);

  // Also catch the new week while the page stays open.
  useEffect(() => {
    if (!hydrated) return;
    function check() {
      const thisWeek = mondayOf();
      if (readJSON<string>(TICKS_WEEK_KEY, "") === thisWeek) return;
      writeJSON(TICKS_WEEK_KEY, thisWeek);
      setWeek((prev) => clearTicks(prev));
    }
    const id = setInterval(check, 60_000);
    document.addEventListener("visibilitychange", check);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", check);
    };
  }, [hydrated]);

  const moveItem = useCallback((day: DayKey, id: string, direction: "up" | "down") => {
    setWeek((prev) => {
      const list = prev[day];
      const index = list.findIndex((item) => item.id === id);
      const target = direction === "up" ? index - 1 : index + 1;
      if (index === -1 || target < 0 || target >= list.length) return prev;
      const next = [...list];
      [next[index], next[target]] = [next[target], next[index]];
      return { ...prev, [day]: next };
    });
  }, []);

  const copyDay = useCallback((from: DayKey, targets: DayKey[]) => {
    setWeek((prev) => copyDayInto(prev, from, targets));
  }, []);

  const addItem = useCallback(
    (day: DayKey, activity: { label: string; icon: string }) => {
      const id = makeId();
      setWeek((prev) => ({
        ...prev,
        [day]: [
          ...prev[day],
          { id, label: activity.label, icon: activity.icon, done: false },
        ],
      }));
      return id;
    },
    []
  );

  const removeItem = useCallback((day: DayKey, id: string) => {
    setWeek((prev) => ({
      ...prev,
      [day]: prev[day].filter((item) => item.id !== id),
    }));
  }, []);

  const toggleDone = useCallback((day: DayKey, id: string) => {
    setWeek((prev) => ({
      ...prev,
      [day]: prev[day].map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      ),
    }));
  }, []);

  const resetAllDone = useCallback(() => {
    setWeek((prev) => {
      const next = { ...prev };
      for (const day of Object.keys(next) as DayKey[]) {
        next[day] = next[day].map((item) => ({ ...item, done: false }));
      }
      return next;
    });
  }, []);

  const clearWeek = useCallback(() => setWeek(emptyWeek()), []);

  return {
    week,
    addItem,
    removeItem,
    toggleDone,
    resetAllDone,
    clearWeek,
    moveItem,
    copyDay,
    hydrated,
  };
}
