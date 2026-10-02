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

const LIST_FIELDS = ["lowActionSteps", "highActionSteps", "correctionScale", "sickDayRules"] as const;

/** Loads a saved plan, keeping known fields and filling any gaps. */
export function normalizeDiabetesPlan(raw: unknown): DiabetesManagementPlan {
  const out: DiabetesManagementPlan = { ...EMPTY_PLAN };
  if (!raw || typeof raw !== "object") return out;
  const source = raw as Record<string, unknown>;
  for (const key of Object.keys(EMPTY_PLAN) as (keyof DiabetesManagementPlan)[]) {
    const value = source[key];
    if ((LIST_FIELDS as readonly string[]).includes(key)) {
      if (Array.isArray(value)) {
        (out[key] as string[]) = value.filter((v): v is string => typeof v === "string");
      }
    } else if (typeof value === "string") {
      (out[key] as string) = value;
    } else if (typeof value === "number" && Number.isFinite(value)) {
      (out[key] as string) = String(value);
    }
  }
  return out;
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

export function useDiabetesManagementPlan() {
  const [plan, setPlan] = useState<DiabetesManagementPlan>(EMPTY_PLAN);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlan(normalizeDiabetesPlan(readJSON<unknown>(STORAGE_KEY, {})));
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

export type ReadingBand = "emergency-low" | "low" | "in-range" | "high" | "emergency-high";

function toNumber(value: string): number | null {
  if (!value.trim()) return null;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** The person's own target range from their plan, or null if not entered
 * (or entered back to front). */
export function planTargetRange(
  plan: Pick<DiabetesManagementPlan, "targetLowMmol" | "targetHighMmol">
): { low: number; high: number } | null {
  const low = toNumber(plan.targetLowMmol);
  const high = toNumber(plan.targetHighMmol);
  if (low === null || high === null || low >= high) return null;
  return { low, high };
}

/**
 * Where a reading sits against the numbers the person copied from their
 * own diabetes plan. Returns null when no target range has been entered -
 * this tool never applies a range of its own.
 */
export function classifyReading(
  bglMmol: number,
  plan: Pick<
    DiabetesManagementPlan,
    "targetLowMmol" | "targetHighMmol" | "emergencyLowMmol" | "emergencyHighMmol"
  >
): ReadingBand | null {
  const range = planTargetRange(plan);
  if (!range || !Number.isFinite(bglMmol)) return null;
  const emergencyLow = toNumber(plan.emergencyLowMmol);
  const emergencyHigh = toNumber(plan.emergencyHighMmol);
  if (emergencyLow !== null && bglMmol < emergencyLow) return "emergency-low";
  if (bglMmol < range.low) return "low";
  if (emergencyHigh !== null && bglMmol > emergencyHigh) return "emergency-high";
  if (bglMmol > range.high) return "high";
  return "in-range";
}

export const READING_BAND_LABELS: Record<ReadingBand, string> = {
  "emergency-low": "Below the plan's emergency low",
  low: "Below the plan's target range",
  "in-range": "Within the plan's target range",
  high: "Above the plan's target range",
  "emergency-high": "Above the plan's emergency high",
};

export const READING_BAND_COLOURS: Record<ReadingBand, string> = {
  "emergency-low": "var(--sev-5)",
  low: "var(--sev-4)",
  "in-range": "var(--sev-1)",
  high: "var(--sev-3)",
  "emergency-high": "var(--sev-5)",
};
