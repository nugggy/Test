"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "dt:traffic-light:log:v1";
const ZONE_GUIDE_KEY = "dt:traffic-light:zone-guide:v1";

export interface TrafficLightEntry {
  id: string;
  state: "green" | "amber" | "red";
  note?: string;
  timestamp: string; // ISO
}

export interface ZoneGuide {
  green: string[];
  amber: string[];
  red: string[];
}

const EMPTY_ZONE_GUIDE: ZoneGuide = { green: [], amber: [], red: [] };

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

export function useTrafficLightLog() {
  const [entries, setEntries] = useState<TrafficLightEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // localStorage only exists client-side, so entries are synced in after
    // mount rather than during the (server) initial render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntries(readJSON<TrafficLightEntry[]>(STORAGE_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEY, entries);
  }, [entries, hydrated]);

  const addEntry = useCallback(
    (data: { state: TrafficLightEntry["state"]; note?: string }) => {
      setEntries((prev) => [
        {
          id: `tl-${Date.now()}`,
          state: data.state,
          note: data.note,
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ]);
    },
    []
  );

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  const clearAll = useCallback(() => setEntries([]), []);

  return { entries, addEntry, removeEntry, clearAll, hydrated };
}

export function useZoneGuide() {
  const [guide, setGuide] = useState<ZoneGuide>(EMPTY_ZONE_GUIDE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // localStorage only exists client-side, so the guide is synced in after
    // mount rather than during the (server) initial render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGuide({ ...EMPTY_ZONE_GUIDE, ...readJSON<Partial<ZoneGuide>>(ZONE_GUIDE_KEY, {}) });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(ZONE_GUIDE_KEY, guide);
  }, [guide, hydrated]);

  const setZoneItems = useCallback((zone: keyof ZoneGuide, items: string[]) => {
    setGuide((prev) => ({ ...prev, [zone]: items }));
  }, []);

  return { guide, setZoneItems, hydrated };
}
