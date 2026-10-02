"use client";

import { useCallback, useEffect, useState } from "react";

const MEDICATIONS_KEY = "dt:medication-reminder:medications:v1";
const LOG_KEY = "dt:medication-reminder:log:v1";
const RECORDED_BY_KEY = "dt:medication-reminder:recorded-by:v1";
// Read directly (never written here) so the one-off date repair below uses
// the same timezone the person picked in the site settings.
const TIMEZONE_KEY = "dt:timezone:v1";
const FALLBACK_TIMEZONE = "Australia/Sydney";

export interface Medication {
  id: string;
  name: string;
  dose: string;
  times: string[];
  notes: string;
  /** "As needed" (PRN) medication: no fixed times, doses are recorded
   * whenever one is given. false for medications saved before this
   * field existed. */
  asNeeded: boolean;
}

export type DoseStatus = "taken" | "not-taken";
export type DoseKind = "scheduled" | "as-needed";

export interface MedicationLogEntry {
  id: string;
  medicationId: string;
  /** Scheduled time (HH:MM) for scheduled doses, or the time it was given
   * for as-needed doses. */
  time: string;
  date: string; // yyyy-mm-dd, the day this dose applies to (in the person's timezone)
  takenAt: string; // ISO timestamp of when this record was made
  status: DoseStatus;
  kind: DoseKind;
  /** Why a dose wasn't taken, or a short note for an as-needed dose. */
  reason: string;
  /** Optional name or initials of whoever recorded it (handy on shared
   * devices in group homes). */
  recordedBy: string;
  /** Name and dose at the time it was recorded, so the history still makes
   * sense if the medication is later renamed or removed. "" for entries
   * saved before this field existed. */
  medicationName: string;
  doseText: string;
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

function readStoredTimezone(): string {
  if (typeof window === "undefined") return FALLBACK_TIMEZONE;
  try {
    return window.localStorage.getItem(TIMEZONE_KEY) || FALLBACK_TIMEZONE;
  } catch {
    return FALLBACK_TIMEZONE;
  }
}

/** yyyy-mm-dd for `date` as it is in `timezone`. */
export function dateKeyInTimezone(date: Date, timezone: string): string {
  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(date);
    const lookup = Object.fromEntries(parts.map((p) => [p.type, p.value]));
    return `${lookup.year}-${lookup.month}-${lookup.day}`;
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

/** HH:MM (24-hour) for `date` as it is in `timezone`. */
export function timeHmInTimezone(date: Date, timezone: string): string {
  try {
    const parts = new Intl.DateTimeFormat("en-AU", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(date);
    const lookup = Object.fromEntries(parts.map((p) => [p.type, p.value]));
    return `${lookup.hour}:${lookup.minute}`;
  } catch {
    return date.toTimeString().slice(0, 5);
  }
}

/** Adds (or subtracts) whole days to a yyyy-mm-dd key. */
export function addDaysToKey(key: string, days: number): string {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(Date.UTC(y, (m || 1) - 1, d || 1));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** dd/mm/yyyy for a yyyy-mm-dd key. */
export function formatDateKey(key: string): string {
  const [y, m, d] = key.split("-");
  if (!y || !m || !d) return key;
  return `${d}/${m}/${y}`;
}

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export function normalizeMedication(raw: unknown): Medication | null {
  if (!raw || typeof raw !== "object") return null;
  const m = raw as Partial<Medication>;
  const times = Array.isArray(m.times)
    ? [
        ...new Set(
          m.times.filter((t): t is string => typeof t === "string" && TIME_RE.test(t))
        ),
      ].sort()
    : [];
  return {
    id: typeof m.id === "string" && m.id ? m.id : makeId(),
    name: typeof m.name === "string" ? m.name : "",
    dose: typeof m.dose === "string" ? m.dose : "",
    times,
    notes: typeof m.notes === "string" ? m.notes : "",
    asNeeded: m.asNeeded === true,
  };
}

export function normalizeMedications(raw: unknown): Medication[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(normalizeMedication).filter((m): m is Medication => m !== null);
}

/**
 * Loads saved log entries, filling in fields added later.
 *
 * Entries saved by the first version of this tool have no `status`. That
 * version also worked out "today" in UTC rather than local time, so a dose
 * ticked before about 10 am in Sydney was filed under the previous day.
 * Back then only today's doses could be ticked, so the intended day is
 * simply the local date of `takenAt`, and those entries are re-dated to
 * that. If that leaves two records for the same dose on the same day, the
 * earliest is kept. Nothing else is dropped.
 */
export function normalizeLogEntries(raw: unknown, timezone: string): MedicationLogEntry[] {
  if (!Array.isArray(raw)) return [];
  const out: MedicationLogEntry[] = [];
  const seen = new Set<string>();
  const sorted = raw
    .filter((e): e is Partial<MedicationLogEntry> => !!e && typeof e === "object")
    .sort((a, b) => String(a.takenAt ?? "").localeCompare(String(b.takenAt ?? "")));
  for (const e of sorted) {
    if (typeof e.medicationId !== "string" || typeof e.time !== "string") continue;
    const takenAt = typeof e.takenAt === "string" ? e.takenAt : new Date().toISOString();
    const legacy = e.status !== "taken" && e.status !== "not-taken";
    let date = typeof e.date === "string" ? e.date : "";
    if (legacy) {
      const takenDate = new Date(takenAt);
      if (!Number.isNaN(takenDate.getTime())) date = dateKeyInTimezone(takenDate, timezone);
    }
    if (!date) continue;
    const kind: DoseKind = e.kind === "as-needed" ? "as-needed" : "scheduled";
    if (kind === "scheduled") {
      const slot = `${e.medicationId}|${e.time}|${date}`;
      if (seen.has(slot)) continue;
      seen.add(slot);
    }
    out.push({
      id: typeof e.id === "string" && e.id ? e.id : makeId(),
      medicationId: e.medicationId,
      time: e.time,
      date,
      takenAt,
      status: legacy ? "taken" : (e.status as DoseStatus),
      kind,
      reason: typeof e.reason === "string" ? e.reason : "",
      recordedBy: typeof e.recordedBy === "string" ? e.recordedBy : "",
      medicationName: typeof e.medicationName === "string" ? e.medicationName : "",
      doseText: typeof e.doseText === "string" ? e.doseText : "",
    });
  }
  return out;
}

export function useMedications() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMedications(normalizeMedications(readJSON<unknown>(MEDICATIONS_KEY, [])));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(MEDICATIONS_KEY, medications);
  }, [medications, hydrated]);

  const addMedication = useCallback((name: string, asNeeded = false) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setMedications((prev) => [
      ...prev,
      { id: makeId(), name: trimmed, dose: "", times: [], notes: "", asNeeded },
    ]);
  }, []);

  const updateMedication = useCallback(
    (id: string, patch: Partial<Omit<Medication, "id">>) => {
      setMedications((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
    },
    []
  );

  const removeMedication = useCallback((id: string) => {
    setMedications((prev) => prev.filter((m) => m.id !== id));
  }, []);

  return { medications, addMedication, updateMedication, removeMedication, hydrated };
}

export interface RecordDoseInput {
  medicationId: string;
  time: string;
  date: string;
  status: DoseStatus;
  kind?: DoseKind;
  reason?: string;
  recordedBy?: string;
  medicationName?: string;
  doseText?: string;
}

/** Pure version of recording a dose, so it can be unit tested. A scheduled
 * dose replaces any earlier record for the same medication, time and day;
 * an as-needed dose is always added. */
export function applyRecordDose(
  prev: MedicationLogEntry[],
  input: RecordDoseInput,
  id: string,
  nowIso: string
): MedicationLogEntry[] {
  const kind = input.kind ?? "scheduled";
  const entry: MedicationLogEntry = {
    id,
    medicationId: input.medicationId,
    time: input.time,
    date: input.date,
    takenAt: nowIso,
    status: input.status,
    kind,
    reason: (input.reason ?? "").trim().slice(0, 200),
    recordedBy: (input.recordedBy ?? "").trim().slice(0, 60),
    medicationName: (input.medicationName ?? "").slice(0, 120),
    doseText: (input.doseText ?? "").slice(0, 80),
  };
  const rest =
    kind === "scheduled"
      ? prev.filter(
          (e) =>
            !(
              e.kind === "scheduled" &&
              e.medicationId === input.medicationId &&
              e.time === input.time &&
              e.date === input.date
            )
        )
      : prev;
  return [...rest, entry];
}

export function useMedicationLog() {
  const [entries, setEntries] = useState<MedicationLogEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntries(normalizeLogEntries(readJSON<unknown>(LOG_KEY, []), readStoredTimezone()));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(LOG_KEY, entries);
  }, [entries, hydrated]);

  const recordDose = useCallback((input: RecordDoseInput) => {
    const id = makeId();
    const nowIso = new Date().toISOString();
    setEntries((prev) => applyRecordDose(prev, input, id, nowIso));
  }, []);

  /** Clears the record for one scheduled dose (undo). */
  const clearDose = useCallback((medicationId: string, time: string, date: string) => {
    setEntries((prev) =>
      prev.filter(
        (e) =>
          !(
            e.kind === "scheduled" &&
            e.medicationId === medicationId &&
            e.time === time &&
            e.date === date
          )
      )
    );
  }, []);

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const getDose = useCallback(
    (medicationId: string, time: string, date: string) =>
      entries.find(
        (e) =>
          e.kind === "scheduled" &&
          e.medicationId === medicationId &&
          e.time === time &&
          e.date === date
      ),
    [entries]
  );

  return { entries, recordDose, clearDose, removeEntry, getDose, hydrated };
}

/** Remembers the optional "recorded by" name on this device. */
export function useRecordedBy() {
  const [recordedBy, setRecordedBy] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readJSON<unknown>(RECORDED_BY_KEY, "");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRecordedBy(typeof stored === "string" ? stored : "");
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(RECORDED_BY_KEY, recordedBy);
  }, [recordedBy, hydrated]);

  return { recordedBy, setRecordedBy };
}

export interface AdherenceDay {
  key: string;
  expectedCount: number;
  takenCount: number;
  notTakenCount: number;
  missedCount: number;
}

/**
 * Taken / not taken counts per day for the last `windowDays` days, using
 * the current schedule. Only scheduled doses count; as-needed doses are
 * listed separately. For today, only doses whose time has passed are
 * expected. "Missed" means no "Taken" record for a dose that was due,
 * whether it was recorded as not taken or nothing was recorded.
 */
export function computeAdherenceDays(
  medications: Medication[],
  entries: MedicationLogEntry[],
  todayKey: string,
  nowHm: string,
  windowDays: number
): AdherenceDay[] {
  const scheduled = medications.filter((m) => !m.asNeeded);
  return Array.from({ length: windowDays }, (_, i) => {
    const daysAgo = windowDays - 1 - i;
    const key = addDaysToKey(todayKey, -daysAgo);
    let expectedCount = 0;
    let takenCount = 0;
    let notTakenCount = 0;
    for (const med of scheduled) {
      for (const time of med.times) {
        if (daysAgo === 0 && time > nowHm) continue;
        expectedCount += 1;
        const record = entries.find(
          (e) =>
            e.kind === "scheduled" &&
            e.medicationId === med.id &&
            e.time === time &&
            e.date === key
        );
        if (record?.status === "taken") takenCount += 1;
        else if (record?.status === "not-taken") notTakenCount += 1;
      }
    }
    return {
      key,
      expectedCount,
      takenCount,
      notTakenCount,
      missedCount: expectedCount - takenCount,
    };
  });
}
