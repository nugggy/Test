"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "dt:seizure-log:entries:v1";

export interface SeizureLogEntry {
  id: string;
  occurredAt: string; // ISO - when the seizure started
  seizureType: string;
  durationSeconds: number;
  trigger: string;
  /** Why the person logging thinks this was the trigger - only meaningful
   * when `trigger` is filled in. */
  triggerReason: string;
  whatHappened: string;
  recovery: string;
  actionsTaken: string[];
  notes: string;
  /** How severe it was, in the loggers own judgement - "" if not recorded
   * (entries saved before this field existed). */
  severity: string;
  /** Awareness/consciousness during the seizure - "" if not recorded. */
  consciousness: string;
  /** Any warning signs beforehand (aura), e.g. a strange smell or feeling. */
  warningSigns: string;
  /** Where it happened, e.g. Home, School, In the community. */
  location: string;
  /** Medication name/dose given, if "Rescue medication given" was ticked. */
  medicationDetail: string;
  /** How long recovery/confusion afterwards lasted, in minutes - separate
   * from the free-text `recovery` description. 0 if not recorded. */
  recoveryMinutes: number;
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

function makeId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/** Fills in defaults for fields added after some entries were already
 * saved, so older localStorage data keeps working without a migration. */
export function normalizeEntry(entry: Partial<SeizureLogEntry>): SeizureLogEntry {
  return {
    id: entry.id ?? makeId(),
    occurredAt: entry.occurredAt ?? new Date().toISOString(),
    seizureType: entry.seizureType ?? "",
    durationSeconds: entry.durationSeconds ?? 0,
    trigger: entry.trigger ?? "",
    triggerReason: entry.triggerReason ?? "",
    whatHappened: entry.whatHappened ?? "",
    recovery: entry.recovery ?? "",
    actionsTaken: Array.isArray(entry.actionsTaken) ? entry.actionsTaken : [],
    notes: entry.notes ?? "",
    severity: entry.severity ?? "",
    consciousness: entry.consciousness ?? "",
    warningSigns: entry.warningSigns ?? "",
    location: entry.location ?? "",
    medicationDetail: entry.medicationDetail ?? "",
    recoveryMinutes: entry.recoveryMinutes ?? 0,
  };
}

export function useSeizureLog() {
  const [entries, setEntries] = useState<SeizureLogEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readJSON<unknown>(STORAGE_KEY, []);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntries(
      Array.isArray(stored)
        ? stored
            .filter((e): e is Partial<SeizureLogEntry> => !!e && typeof e === "object")
            .map(normalizeEntry)
        : []
    );
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEY, entries);
  }, [entries, hydrated]);

  const addEntry = useCallback((data: Omit<SeizureLogEntry, "id">) => {
    setEntries((prev) => [{ id: makeId(), ...data }, ...prev]);
  }, []);

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  const clearAll = useCallback(() => setEntries([]), []);

  return { entries, addEntry, removeEntry, clearAll, hydrated };
}

/** dd/mm/yyyy HH:MM (24-hour) in `timezone`, for exports and printouts. */
export function formatRecordDateTime(iso: string, timezone: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  try {
    const parts = new Intl.DateTimeFormat("en-AU", {
      timeZone: timezone,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(date);
    const l = Object.fromEntries(parts.map((p) => [p.type, p.value]));
    return `${l.day}/${l.month}/${l.year} ${l.hour}:${l.minute}`;
  } catch {
    return date.toISOString();
  }
}

export function formatElapsed(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

// ---- Live seizure timer ---------------------------------------------------
// Saved as soon as it starts, so a reload, a locked screen or the browser
// closing in the middle of a seizure doesn't lose the start time.

const TIMER_KEY = "dt:seizure-log:active-timer:v1";

export interface TimerEvent {
  label: string;
  at: string; // ISO
}

export interface ActiveSeizureTimer {
  startedAt: string; // ISO
  events: TimerEvent[];
}

export function parseActiveTimer(raw: unknown): ActiveSeizureTimer | null {
  if (!raw || typeof raw !== "object") return null;
  const t = raw as Partial<ActiveSeizureTimer>;
  if (typeof t.startedAt !== "string" || Number.isNaN(new Date(t.startedAt).getTime())) return null;
  const events = Array.isArray(t.events)
    ? t.events.filter(
        (e): e is TimerEvent =>
          !!e && typeof e === "object" && typeof e.label === "string" && typeof e.at === "string"
      )
    : [];
  return { startedAt: t.startedAt, events };
}

export function useActiveSeizureTimer() {
  const [timer, setTimer] = useState<ActiveSeizureTimer | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTimer(parseActiveTimer(readJSON<unknown>(TIMER_KEY, null)));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (timer) window.localStorage.setItem(TIMER_KEY, JSON.stringify(timer));
      else window.localStorage.removeItem(TIMER_KEY);
    } catch {
      // Storage unavailable - the timer still runs for this session.
    }
  }, [timer, hydrated]);

  const start = useCallback(() => {
    setTimer({ startedAt: new Date().toISOString(), events: [] });
  }, []);

  const addEvent = useCallback((label: string) => {
    setTimer((prev) =>
      prev ? { ...prev, events: [...prev.events, { label, at: new Date().toISOString() }] } : prev
    );
  }, []);

  const clear = useCallback(() => setTimer(null), []);

  return { timer, start, addEvent, clear, hydrated };
}

// ---- Details from the person's own seizure management plan --------------

const PLAN_KEY = "dt:seizure-log:plan:v1";

export interface SeizurePlanNotes {
  /** Minutes, copied from the person's own seizure management plan. The app
   * never sets or suggests this. "" when not entered. */
  emergencyMinutes: string;
  /** What the plan says to do, in the plan's own words. */
  planSteps: string;
}

const EMPTY_PLAN: SeizurePlanNotes = { emergencyMinutes: "", planSteps: "" };

export function normalizePlan(raw: unknown): SeizurePlanNotes {
  if (!raw || typeof raw !== "object") return EMPTY_PLAN;
  const p = raw as Partial<SeizurePlanNotes>;
  return {
    emergencyMinutes: typeof p.emergencyMinutes === "string" ? p.emergencyMinutes : "",
    planSteps: typeof p.planSteps === "string" ? p.planSteps : "",
  };
}

/** The plan time in seconds, or null if not entered / not a usable number. */
export function planEmergencySeconds(plan: SeizurePlanNotes): number | null {
  const minutes = Number(plan.emergencyMinutes);
  if (!plan.emergencyMinutes.trim() || !Number.isFinite(minutes) || minutes <= 0) return null;
  return Math.round(minutes * 60);
}

export function useSeizurePlanNotes() {
  const [plan, setPlan] = useState<SeizurePlanNotes>(EMPTY_PLAN);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlan(normalizePlan(readJSON<unknown>(PLAN_KEY, null)));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(PLAN_KEY, plan);
  }, [plan, hydrated]);

  const updatePlan = useCallback((patch: Partial<SeizurePlanNotes>) => {
    setPlan((prev) => ({ ...prev, ...patch }));
  }, []);

  return { plan, updatePlan, hydrated };
}
