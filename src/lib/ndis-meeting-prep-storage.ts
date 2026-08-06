"use client";

import { useCallback, useEffect, useState } from "react";
import type { ChecklistItem } from "@/components/ChecklistSection";

const STORAGE_KEY = "dt:ndis-meeting-prep:v1";

export interface NdisMeetingPrep {
  meetingDate: string;
  meetingType: string;
  meetingFormat: string;
  planStartDate: string;
  planEndDate: string;
  planManagerName: string;
  supportCoordinatorName: string;
  attendees: string;
  workingWell: string[];
  notWorking: string[];
  changesSinceLastPlan: string[];
  dailyLifeImpact: string[];
  supportNeeds: string[];
  futureGoals: string[];
  questionsForPlanner: string[];
  documentsToBring: ChecklistItem[];
}

const EMPTY_PREP: NdisMeetingPrep = {
  meetingDate: "",
  meetingType: "",
  meetingFormat: "",
  planStartDate: "",
  planEndDate: "",
  planManagerName: "",
  supportCoordinatorName: "",
  attendees: "",
  workingWell: [],
  notWorking: [],
  changesSinceLastPlan: [],
  dailyLifeImpact: [],
  supportNeeds: [],
  futureGoals: [],
  questionsForPlanner: [],
  documentsToBring: [],
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
    // reloads — the tool still works for the current session.
  }
}

export function useNdisMeetingPrep() {
  const [prep, setPrep] = useState<NdisMeetingPrep>(EMPTY_PREP);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPrep({ ...EMPTY_PREP, ...readJSON<Partial<NdisMeetingPrep>>(STORAGE_KEY, {}) });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEY, prep);
  }, [prep, hydrated]);

  const updateField = useCallback(
    <K extends keyof NdisMeetingPrep>(key: K, value: NdisMeetingPrep[K]) => {
      setPrep((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const clearPrep = useCallback(() => setPrep(EMPTY_PREP), []);

  return { prep, updateField, clearPrep, hydrated };
}
