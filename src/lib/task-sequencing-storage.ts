"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "dt:task-sequencing:sequences:v1";

export interface SequenceStep {
  id: string;
  label: string;
  emoji: string;
  done: boolean;
}

export interface TaskSequence {
  id: string;
  name: string;
  steps: SequenceStep[];
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

function makeId(prefix: string) {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Defensive parse of saved sequences: malformed entries get sensible
 * defaults instead of breaking the tool, and nothing valid is dropped.
 */
export function parseSequences(raw: unknown): TaskSequence[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((s): s is Record<string, unknown> => Boolean(s) && typeof s === "object")
    .map((s, i) => ({
      id: typeof s.id === "string" ? s.id : `seq-restored-${i}`,
      name: typeof s.name === "string" && s.name.trim() ? s.name : "My task",
      steps: Array.isArray(s.steps)
        ? s.steps
            .filter((st): st is Record<string, unknown> => Boolean(st) && typeof st === "object")
            .map((st, j) => ({
              id: typeof st.id === "string" ? st.id : `step-restored-${i}-${j}`,
              label: typeof st.label === "string" ? st.label : "",
              emoji: typeof st.emoji === "string" ? st.emoji : "✨",
              done: st.done === true,
            }))
        : [],
    }));
}

export function useTaskSequences() {
  const [sequences, setSequences] = useState<TaskSequence[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSequences(parseSequences(readJSON<unknown>(STORAGE_KEY, [])));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEY, sequences);
  }, [sequences, hydrated]);

  const addSequence = useCallback((name: string, steps: { label: string; emoji: string }[] = []) => {
    const trimmed = name.trim();
    if (!trimmed) return null;
    const sequence: TaskSequence = {
      id: makeId("seq"),
      name: trimmed,
      steps: steps.map((s) => ({ id: makeId("step"), label: s.label, emoji: s.emoji, done: false })),
    };
    setSequences((prev) => [...prev, sequence]);
    return sequence.id;
  }, []);

  const renameSequence = useCallback((sequenceId: string, name: string) => {
    setSequences((prev) =>
      prev.map((seq) => (seq.id === sequenceId ? { ...seq, name } : seq))
    );
  }, []);

  const removeSequence = useCallback((sequenceId: string) => {
    setSequences((prev) => prev.filter((seq) => seq.id !== sequenceId));
  }, []);

  const addStep = useCallback((sequenceId: string, data: { label: string; emoji: string }) => {
    const trimmed = data.label.trim();
    if (!trimmed) return;
    setSequences((prev) =>
      prev.map((seq) =>
        seq.id === sequenceId
          ? {
              ...seq,
              steps: [
                ...seq.steps,
                { id: makeId("step"), label: trimmed, emoji: data.emoji, done: false },
              ],
            }
          : seq
      )
    );
  }, []);

  const removeStep = useCallback((sequenceId: string, stepId: string) => {
    setSequences((prev) =>
      prev.map((seq) =>
        seq.id === sequenceId
          ? { ...seq, steps: seq.steps.filter((step) => step.id !== stepId) }
          : seq
      )
    );
  }, []);

  const moveStep = useCallback((sequenceId: string, stepId: string, direction: "up" | "down") => {
    setSequences((prev) =>
      prev.map((seq) => {
        if (seq.id !== sequenceId) return seq;
        const index = seq.steps.findIndex((step) => step.id === stepId);
        if (index === -1) return seq;
        const newIndex = direction === "up" ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= seq.steps.length) return seq;
        const steps = [...seq.steps];
        [steps[index], steps[newIndex]] = [steps[newIndex], steps[index]];
        return { ...seq, steps };
      })
    );
  }, []);

  const updateStep = useCallback(
    (sequenceId: string, stepId: string, changes: { label?: string; emoji?: string }) => {
      setSequences((prev) =>
        prev.map((seq) =>
          seq.id === sequenceId
            ? {
                ...seq,
                steps: seq.steps.map((step) => (step.id === stepId ? { ...step, ...changes } : step)),
              }
            : seq
        )
      );
    },
    []
  );

  const toggleStepDone = useCallback((sequenceId: string, stepId: string) => {
    setSequences((prev) =>
      prev.map((seq) =>
        seq.id === sequenceId
          ? {
              ...seq,
              steps: seq.steps.map((step) =>
                step.id === stepId ? { ...step, done: !step.done } : step
              ),
            }
          : seq
      )
    );
  }, []);

  const resetSequence = useCallback((sequenceId: string) => {
    setSequences((prev) =>
      prev.map((seq) =>
        seq.id === sequenceId
          ? { ...seq, steps: seq.steps.map((step) => ({ ...step, done: false })) }
          : seq
      )
    );
  }, []);

  return {
    sequences,
    addSequence,
    renameSequence,
    removeSequence,
    addStep,
    removeStep,
    moveStep,
    updateStep,
    toggleStepDone,
    resetSequence,
    hydrated,
  };
}
