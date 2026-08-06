"use client";

import { useCallback, useEffect, useState } from "react";

const MEDICATIONS_KEY = "dt:medication-reminder:medications:v1";
const LOG_KEY = "dt:medication-reminder:log:v1";

export interface Medication {
  id: string;
  name: string;
  dose: string;
  times: string[];
  notes: string;
}

export interface MedicationLogEntry {
  id: string;
  medicationId: string;
  time: string;
  date: string; // yyyy-mm-dd, the day this dose applies to
  takenAt: string; // ISO timestamp of when it was ticked off
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
    // reloads — the tool still works for the current session.
  }
}

function makeId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useMedications() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMedications(readJSON<Medication[]>(MEDICATIONS_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(MEDICATIONS_KEY, medications);
  }, [medications, hydrated]);

  const addMedication = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setMedications((prev) => [
      ...prev,
      { id: makeId(), name: trimmed, dose: "", times: [], notes: "" },
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

export function useMedicationLog() {
  const [entries, setEntries] = useState<MedicationLogEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntries(readJSON<MedicationLogEntry[]>(LOG_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(LOG_KEY, entries);
  }, [entries, hydrated]);

  const markTaken = useCallback((medicationId: string, time: string, date: string) => {
    setEntries((prev) => [
      ...prev,
      { id: makeId(), medicationId, time, date, takenAt: new Date().toISOString() },
    ]);
  }, []);

  const markNotTaken = useCallback((medicationId: string, time: string, date: string) => {
    setEntries((prev) =>
      prev.filter((e) => !(e.medicationId === medicationId && e.time === time && e.date === date))
    );
  }, []);

  const isTaken = useCallback(
    (medicationId: string, time: string, date: string) =>
      entries.some((e) => e.medicationId === medicationId && e.time === time && e.date === date),
    [entries]
  );

  return { entries, markTaken, markNotTaken, isTaken, hydrated };
}
