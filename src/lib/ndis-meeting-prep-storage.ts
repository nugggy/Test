"use client";

import { useCallback, useEffect, useState } from "react";
import type { ChecklistItem } from "@/components/ChecklistSection";

const STORAGE_KEY = "dt:ndis-meeting-prep:v1";

export interface NdisMeetingPrep {
  /** Added in a later version - older saved data loads with "". */
  participantName: string;
  meetingDate: string;
  meetingType: string;
  meetingFormat: string;
  planStartDate: string;
  planEndDate: string;
  planManagerName: string;
  supportCoordinatorName: string;
  attendees: string;
  /** The few things that matter most, shown at the top of the printed
   * summary. Added in a later version - older saved data loads with []. */
  topPriorities: string[];
  workingWell: string[];
  notWorking: string[];
  changesSinceLastPlan: string[];
  dailyLifeImpact: string[];
  supportNeeds: string[];
  futureGoals: string[];
  questionsForPlanner: string[];
  documentsToBring: ChecklistItem[];
}

export const EMPTY_PREP: NdisMeetingPrep = {
  participantName: "",
  meetingDate: "",
  meetingType: "",
  meetingFormat: "",
  planStartDate: "",
  planEndDate: "",
  planManagerName: "",
  supportCoordinatorName: "",
  attendees: "",
  topPriorities: [],
  workingWell: [],
  notWorking: [],
  changesSinceLastPlan: [],
  dailyLifeImpact: [],
  supportNeeds: [],
  futureGoals: [],
  questionsForPlanner: [],
  documentsToBring: [],
};

const STRING_FIELDS = [
  "participantName",
  "meetingDate",
  "meetingType",
  "meetingFormat",
  "planStartDate",
  "planEndDate",
  "planManagerName",
  "supportCoordinatorName",
  "attendees",
] as const;

const LIST_FIELDS = [
  "topPriorities",
  "workingWell",
  "notWorking",
  "changesSinceLastPlan",
  "dailyLifeImpact",
  "supportNeeds",
  "futureGoals",
  "questionsForPlanner",
] as const;

function toStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string");
}

function toChecklist(value: unknown): ChecklistItem[] {
  if (!Array.isArray(value)) return [];
  const out: ChecklistItem[] = [];
  value.forEach((v, i) => {
    if (typeof v === "string") {
      out.push({ id: `legacy-${i}`, text: v, done: false });
    } else if (v && typeof v === "object" && typeof (v as ChecklistItem).text === "string") {
      const item = v as Partial<ChecklistItem>;
      out.push({
        id: typeof item.id === "string" && item.id ? item.id : `legacy-${i}`,
        text: item.text as string,
        done: item.done === true,
      });
    }
  });
  return out;
}

/** Turns whatever is in storage (any older version, or partly broken data)
 * into a complete, valid prep object. Fields that are missing or the wrong
 * type get their empty default - nothing that is valid is thrown away. */
export function normaliseMeetingPrep(raw: unknown): NdisMeetingPrep {
  const src = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const prep: NdisMeetingPrep = { ...EMPTY_PREP };
  for (const key of STRING_FIELDS) {
    const v = src[key];
    prep[key] = typeof v === "string" ? v : "";
  }
  for (const key of LIST_FIELDS) {
    prep[key] = toStringList(src[key]);
  }
  prep.documentsToBring = toChecklist(src.documentsToBring);
  return prep;
}

/** "2026-10-02" -> "2 October 2026". Returns "" for anything not a valid
 * YYYY-MM-DD date. Formatted in UTC so the day never shifts by timezone. */
export function formatDayAU(ymd: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
  if (!m) return "";
  const date = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  if (Number.isNaN(date.getTime()) || date.getUTCDate() !== Number(m[3])) return "";
  return new Intl.DateTimeFormat("en-AU", {
    timeZone: "UTC",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/** Whole days from `fromYmd` to `toYmd` (both YYYY-MM-DD). Negative if
 * `toYmd` is in the past. null if either date is invalid. */
export function daysBetween(fromYmd: string, toYmd: string): number | null {
  const parse = (s: string) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    return m ? Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : NaN;
  };
  const a = parse(fromYmd);
  const b = parse(toYmd);
  if (Number.isNaN(a) || Number.isNaN(b)) return null;
  return Math.round((b - a) / 86_400_000);
}

/** True if the person has written anything at all, so the summary can
 * show a helpful empty state instead of a blank page. */
export function hasAnyContent(prep: NdisMeetingPrep): boolean {
  return (
    STRING_FIELDS.some((k) => prep[k].trim() !== "") ||
    LIST_FIELDS.some((k) => prep[k].length > 0) ||
    prep.documentsToBring.length > 0
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

export function useNdisMeetingPrep() {
  const [prep, setPrep] = useState<NdisMeetingPrep>(EMPTY_PREP);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPrep(normaliseMeetingPrep(readRaw(STORAGE_KEY)));
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
