"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "dt:regulation-plan:v1";

export interface RegulationPlan {
  warningSigns: string[];
  strategies: string[];
  groundingTechniques: string[];
  avoid: string[];
  supportPeople: string[];
  urgentHelpNotes: string;
}

const EMPTY_PLAN: RegulationPlan = {
  warningSigns: [],
  strategies: [],
  groundingTechniques: [],
  avoid: [],
  supportPeople: [],
  urgentHelpNotes: "",
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

export function useRegulationPlan() {
  const [plan, setPlan] = useState<RegulationPlan>(EMPTY_PLAN);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // localStorage only exists client-side, so the plan is synced in after
    // mount rather than during the (server) initial render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlan({ ...EMPTY_PLAN, ...readJSON<Partial<RegulationPlan>>(STORAGE_KEY, {}) });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEY, plan);
  }, [plan, hydrated]);

  const updateField = useCallback(
    <K extends keyof RegulationPlan>(key: K, value: RegulationPlan[K]) => {
      setPlan((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const clearPlan = useCallback(() => setPlan(EMPTY_PLAN), []);

  return { plan, updateField, clearPlan, hydrated };
}
