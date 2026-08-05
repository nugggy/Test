"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "dt:support-plan:v1";

export interface SupportPlan {
  aboutMe: string;
  goals: string[];
  supports: string[];
  healthAndSafety: string[];
  communicationTips: string[];
  emergencyContacts: string[];
}

const EMPTY_PLAN: SupportPlan = {
  aboutMe: "",
  goals: [],
  supports: [],
  healthAndSafety: [],
  communicationTips: [],
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
    // reloads — the tool still works for the current session.
  }
}

export function useSupportPlan() {
  const [plan, setPlan] = useState<SupportPlan>(EMPTY_PLAN);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // localStorage only exists client-side, so the plan is synced in after
    // mount rather than during the (server) initial render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlan({ ...EMPTY_PLAN, ...readJSON<Partial<SupportPlan>>(STORAGE_KEY, {}) });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEY, plan);
  }, [plan, hydrated]);

  const updateField = useCallback(
    <K extends keyof SupportPlan>(key: K, value: SupportPlan[K]) => {
      setPlan((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const clearPlan = useCallback(() => setPlan(EMPTY_PLAN), []);

  return { plan, updateField, clearPlan, hydrated };
}
