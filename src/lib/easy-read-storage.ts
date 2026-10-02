"use client";

import { useCallback, useEffect, useState } from "react";

const DRAFT_KEY = "dt:easy-read:draft:v1";

export interface EasyReadLine {
  id: string;
  text: string;
  emoji: string | null;
}

export interface EasyReadDraft {
  input: string;
  lines: EasyReadLine[];
}

const EMPTY_DRAFT: EasyReadDraft = { input: "", lines: [] };

export function makeLineId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `line-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Defensive parse: anything malformed is dropped rather than crashing the tool. */
export function parseDraft(raw: unknown): EasyReadDraft {
  if (!raw || typeof raw !== "object") return EMPTY_DRAFT;
  const obj = raw as Record<string, unknown>;
  const input = typeof obj.input === "string" ? obj.input : "";
  const lines = Array.isArray(obj.lines)
    ? obj.lines
        .filter((l): l is Record<string, unknown> => Boolean(l) && typeof l === "object")
        .map((l) => ({
          id: typeof l.id === "string" ? l.id : makeLineId(),
          text: typeof l.text === "string" ? l.text : "",
          emoji: typeof l.emoji === "string" && l.emoji ? l.emoji : null,
        }))
    : [];
  return { input, lines };
}

/**
 * Keeps the pasted text and the edited Easy Read lines on this device, so a
 * half-finished document isn't lost if the page is closed or reloaded.
 */
export function useEasyReadDraft() {
  const [draft, setDraft] = useState<EasyReadDraft>(EMPTY_DRAFT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let loaded = EMPTY_DRAFT;
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (raw) loaded = parseDraft(JSON.parse(raw));
    } catch {
      // Unreadable saved draft - start fresh.
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(loaded);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      // Storage full or unavailable - the tool still works this session.
    }
  }, [draft, hydrated]);

  const setInput = useCallback((input: string) => {
    setDraft((prev) => ({ ...prev, input }));
  }, []);

  const setLines = useCallback((lines: EasyReadLine[]) => {
    setDraft((prev) => ({ ...prev, lines }));
  }, []);

  const updateLine = useCallback((id: string, changes: Partial<Omit<EasyReadLine, "id">>) => {
    setDraft((prev) => ({
      ...prev,
      lines: prev.lines.map((l) => (l.id === id ? { ...l, ...changes } : l)),
    }));
  }, []);

  const removeLine = useCallback((id: string) => {
    setDraft((prev) => ({ ...prev, lines: prev.lines.filter((l) => l.id !== id) }));
  }, []);

  const moveLine = useCallback((id: string, direction: "up" | "down") => {
    setDraft((prev) => {
      const index = prev.lines.findIndex((l) => l.id === id);
      const target = direction === "up" ? index - 1 : index + 1;
      if (index === -1 || target < 0 || target >= prev.lines.length) return prev;
      const lines = [...prev.lines];
      [lines[index], lines[target]] = [lines[target], lines[index]];
      return { ...prev, lines };
    });
  }, []);

  const addLineAfter = useCallback((afterId: string | null) => {
    const line: EasyReadLine = { id: makeLineId(), text: "", emoji: null };
    setDraft((prev) => {
      const index = afterId ? prev.lines.findIndex((l) => l.id === afterId) : -1;
      const lines = [...prev.lines];
      if (index === -1) lines.push(line);
      else lines.splice(index + 1, 0, line);
      return { ...prev, lines };
    });
    return line.id;
  }, []);

  const clearDraft = useCallback(() => setDraft(EMPTY_DRAFT), []);

  return {
    draft,
    hydrated,
    setInput,
    setLines,
    updateLine,
    removeLine,
    moveLine,
    addLineAfter,
    clearDraft,
  };
}
