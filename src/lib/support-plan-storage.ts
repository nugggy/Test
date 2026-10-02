"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "dt:support-plan:v1";

export interface SupportPlan {
  /** Added in a later version - older saved data loads with "". */
  name: string;
  aboutMe: string;
  /** "What's important to me" - added later, older data loads with []. */
  importantToMe: string[];
  /** "How to support me well" - added later, older data loads with []. */
  howToSupportMe: string[];
  goals: string[];
  supports: string[];
  healthAndSafety: string[];
  communicationTips: string[];
  emergencyContacts: string[];
  /** ISO timestamp of the last change, so new staff can see how current
   * the plan is. "" for plans saved before this was added. */
  updatedAt: string;
}

export const EMPTY_PLAN: SupportPlan = {
  name: "",
  aboutMe: "",
  importantToMe: [],
  howToSupportMe: [],
  goals: [],
  supports: [],
  healthAndSafety: [],
  communicationTips: [],
  emergencyContacts: [],
  updatedAt: "",
};

const LIST_FIELDS = [
  "importantToMe",
  "howToSupportMe",
  "goals",
  "supports",
  "healthAndSafety",
  "communicationTips",
  "emergencyContacts",
] as const;

function toStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string");
}

/** Turns whatever is in storage (any older version, or partly broken data)
 * into a complete, valid plan. Missing or wrong-typed fields get their
 * empty default - nothing valid is thrown away. */
export function normaliseSupportPlan(raw: unknown): SupportPlan {
  const src = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const plan: SupportPlan = { ...EMPTY_PLAN };
  plan.name = typeof src.name === "string" ? src.name : "";
  plan.aboutMe = typeof src.aboutMe === "string" ? src.aboutMe : "";
  plan.updatedAt = typeof src.updatedAt === "string" ? src.updatedAt : "";
  for (const key of LIST_FIELDS) {
    plan[key] = toStringList(src[key]);
  }
  return plan;
}

export function planHasContent(plan: SupportPlan): boolean {
  return (
    plan.name.trim() !== "" ||
    plan.aboutMe.trim() !== "" ||
    LIST_FIELDS.some((k) => plan[k].length > 0)
  );
}

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

type EditableKey = Exclude<keyof SupportPlan, "updatedAt">;

export function useSupportPlan() {
  const [plan, setPlan] = useState<SupportPlan>(EMPTY_PLAN);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // localStorage only exists client-side, so the plan is synced in after
    // mount rather than during the (server) initial render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlan(normaliseSupportPlan(readRaw(STORAGE_KEY)));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEY, plan);
  }, [plan, hydrated]);

  const updateField = useCallback(
    <K extends EditableKey>(key: K, value: SupportPlan[K]) => {
      setPlan((prev) => ({ ...prev, [key]: value, updatedAt: new Date().toISOString() }));
    },
    []
  );

  const clearPlan = useCallback(() => setPlan(EMPTY_PLAN), []);

  return { plan, updateField, clearPlan, hydrated };
}
