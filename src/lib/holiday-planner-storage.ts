"use client";

import { useCallback, useEffect, useState } from "react";
import type { ChecklistItem } from "@/components/ChecklistSection";

const STORAGE_KEY = "dt:holiday-planner:v1";

export interface HolidayPlan {
  destination: string;
  startDate: string;
  endDate: string;
  overview: string;
  accommodationAndTransport: string[];
  itinerary: string[];
  packingChecklist: ChecklistItem[];
  documentsChecklist: ChecklistItem[];
  budget: string[];
  emergencyContacts: string[];
}

const EMPTY_PLAN: HolidayPlan = {
  destination: "",
  startDate: "",
  endDate: "",
  overview: "",
  accommodationAndTransport: [],
  itinerary: [],
  packingChecklist: [],
  documentsChecklist: [],
  budget: [],
  emergencyContacts: [],
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

export function useHolidayPlan() {
  const [plan, setPlan] = useState<HolidayPlan>(EMPTY_PLAN);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlan({ ...EMPTY_PLAN, ...readJSON<Partial<HolidayPlan>>(STORAGE_KEY, {}) });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEY, plan);
  }, [plan, hydrated]);

  const updateField = useCallback(
    <K extends keyof HolidayPlan>(key: K, value: HolidayPlan[K]) => {
      setPlan((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const clearPlan = useCallback(() => setPlan(EMPTY_PLAN), []);

  return { plan, updateField, clearPlan, hydrated };
}
