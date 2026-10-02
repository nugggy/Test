"use client";

import { useCallback, useEffect, useState } from "react";
import { EMPTY_PLAN, normalisePlan, type RegulationPlan } from "@/lib/regulation-plan-data";

export type { RegulationPlan } from "@/lib/regulation-plan-data";

// Same key as the very first version - older plans are upgraded on load by
// normalisePlan(), never wiped.
const STORAGE_KEY = "dt:regulation-plan:v1";

function readRaw(key: string): unknown {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
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

export function useRegulationPlan() {
  const [plan, setPlan] = useState<RegulationPlan>(EMPTY_PLAN);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // localStorage only exists client-side, so the plan is synced in after
    // mount rather than during the (server) initial render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlan(normalisePlan(readRaw(STORAGE_KEY)));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEY, plan);
  }, [plan, hydrated]);

  const updateField = useCallback(
    <K extends keyof RegulationPlan>(key: K, value: RegulationPlan[K]) => {
      setPlan((prev) => ({ ...prev, [key]: value, updatedAt: new Date().toISOString() }));
    },
    []
  );

  const clearPlan = useCallback(() => setPlan(EMPTY_PLAN), []);

  return { plan, updateField, clearPlan, hydrated };
}
