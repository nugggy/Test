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
function normalizeEntry(entry: Partial<SeizureLogEntry>): SeizureLogEntry {
  return {
    id: entry.id ?? makeId(),
    occurredAt: entry.occurredAt ?? new Date().toISOString(),
    seizureType: entry.seizureType ?? "",
    durationSeconds: entry.durationSeconds ?? 0,
    trigger: entry.trigger ?? "",
    triggerReason: entry.triggerReason ?? "",
    whatHappened: entry.whatHappened ?? "",
    recovery: entry.recovery ?? "",
    actionsTaken: entry.actionsTaken ?? [],
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntries(
      readJSON<Partial<SeizureLogEntry>[]>(STORAGE_KEY, []).map(normalizeEntry)
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
