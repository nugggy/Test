"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "dt:diabetes-tracker:plan:v1";

export interface DiabetesManagementPlan {
  /** Everything below comes from the person's own doctor/diabetes
   * educator - this tool only displays it clearly, it never sets or
   * suggests these numbers itself. */
  targetLowMmol: string;
  targetHighMmol: string;
  emergencyLowMmol: string;
  emergencyHighMmol: string;
  lowActionSteps: string[];
  highActionSteps: string[];
  correctionScale: string[];
  carbRatio: string;
  basalInsulin: string;
  sickDayRules: string[];
  doctorName: string;
  doctorPhone: string;
  diabetesEducatorName: string;
  nextAppointment: string; // yyyy-mm-dd
  otherNotes: string;
  /** When this plan was last confirmed with the doctor/educator - shown
   * prominently so an out-of-date plan doesn't get mistaken for current. */
  lastConfirmed: string; // yyyy-mm-dd
}

const EMPTY_PLAN: DiabetesManagementPlan = {
  targetLowMmol: "",
  targetHighMmol: "",
  emergencyLowMmol: "",
  emergencyHighMmol: "",
  lowActionSteps: [],
  highActionSteps: [],
  correctionScale: [],
  carbRatio: "",
  basalInsulin: "",
  sickDayRules: [],
  doctorName: "",
  doctorPhone: "",
  diabetesEducatorName: "",
  nextAppointment: "",
  otherNotes: "",
  lastConfirmed: "",
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

export function useDiabetesManagementPlan() {
  const [plan, setPlan] = useState<DiabetesManagementPlan>(EMPTY_PLAN);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlan({ ...EMPTY_PLAN, ...readJSON<Partial<DiabetesManagementPlan>>(STORAGE_KEY, {}) });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEY, plan);
  }, [plan, hydrated]);

  const updateField = useCallback(
    <K extends keyof DiabetesManagementPlan>(key: K, value: DiabetesManagementPlan[K]) => {
      setPlan((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const clearPlan = useCallback(() => setPlan(EMPTY_PLAN), []);

  return { plan, updateField, clearPlan, hydrated };
}
