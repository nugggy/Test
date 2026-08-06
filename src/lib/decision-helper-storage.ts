"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "dt:decision-helper:v1";
const LOG_STORAGE_KEY = "dt:decision-helper:log:v1";

export interface DecisionOption {
  id: string;
  name: string;
  pros: string[];
  cons: string[];
  consequences: string[];
}

export interface Decision {
  question: string;
  options: DecisionOption[];
  peopleToTalkTo: string[];
  questionsToAsk: string[];
  finalChoice: string;
  reasoning: string;
}

export interface DecisionLogEntry {
  id: string;
  decidedAt: string;
  question: string;
  options: DecisionOption[];
  finalChoice: string;
  reasoning: string;
}

const EMPTY_DECISION: Decision = {
  question: "",
  options: [],
  peopleToTalkTo: [],
  questionsToAsk: [],
  finalChoice: "",
  reasoning: "",
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
    // reloads - the tool still works for the current session.
  }
}

function makeId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function useDecisionHelper() {
  const [decision, setDecision] = useState<Decision>(EMPTY_DECISION);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // localStorage only exists client-side, so the decision is synced in
    // after mount rather than during the (server) initial render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDecision({ ...EMPTY_DECISION, ...readJSON<Partial<Decision>>(STORAGE_KEY, {}) });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEY, decision);
  }, [decision, hydrated]);

  const updateField = useCallback(
    <K extends keyof Decision>(key: K, value: Decision[K]) => {
      setDecision((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const addOption = useCallback((name: string) => {
    const text = name.trim();
    if (!text) return;
    setDecision((prev) => ({
      ...prev,
      options: [
        ...prev.options,
        { id: makeId(), name: text, pros: [], cons: [], consequences: [] },
      ],
    }));
  }, []);

  const removeOption = useCallback((id: string) => {
    setDecision((prev) => ({
      ...prev,
      options: prev.options.filter((o) => o.id !== id),
      // If the option being removed was the recorded final choice, clear it
      // rather than leaving a "chosen" option that no longer exists.
      finalChoice:
        prev.options.find((o) => o.id === id)?.name === prev.finalChoice
          ? ""
          : prev.finalChoice,
    }));
  }, []);

  const renameOption = useCallback((id: string, name: string) => {
    setDecision((prev) => {
      const old = prev.options.find((o) => o.id === id);
      return {
        ...prev,
        options: prev.options.map((o) => (o.id === id ? { ...o, name } : o)),
        finalChoice: old && old.name === prev.finalChoice ? name : prev.finalChoice,
      };
    });
  }, []);

  const updateOptionList = useCallback(
    (id: string, key: "pros" | "cons" | "consequences", items: string[]) => {
      setDecision((prev) => ({
        ...prev,
        options: prev.options.map((o) => (o.id === id ? { ...o, [key]: items } : o)),
      }));
    },
    []
  );

  const clearDecision = useCallback(() => setDecision(EMPTY_DECISION), []);

  return {
    decision,
    updateField,
    addOption,
    removeOption,
    renameOption,
    updateOptionList,
    clearDecision,
    hydrated,
  };
}

export function useDecisionLog() {
  const [entries, setEntries] = useState<DecisionLogEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntries(readJSON<DecisionLogEntry[]>(LOG_STORAGE_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(LOG_STORAGE_KEY, entries);
  }, [entries, hydrated]);

  const addEntry = useCallback((decision: Decision) => {
    const entry: DecisionLogEntry = {
      id: makeId(),
      decidedAt: new Date().toISOString(),
      question: decision.question,
      options: decision.options,
      finalChoice: decision.finalChoice,
      reasoning: decision.reasoning,
    };
    setEntries((prev) => [entry, ...prev]);
  }, []);

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return { entries, addEntry, removeEntry, hydrated };
}
