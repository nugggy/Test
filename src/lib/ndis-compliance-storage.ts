"use client";

import { useCallback, useEffect, useState } from "react";
import type { ChecklistItem } from "@/components/ChecklistSection";

const STORAGE_KEY = "dt:ndis-compliance:v1";

export interface NoticedEntry {
  id: string;
  /** YYYY-MM-DD, or "" for entries saved before dates were added. */
  date: string;
  text: string;
}

export interface NdisComplianceNotes {
  checklist: ChecklistItem[];
  questionsForProvider: string[];
  /** Was a plain string[] in earlier versions - those load as entries with
   * no date (see normaliseComplianceNotes). */
  thingsIveNoticed: NoticedEntry[];
}

const EMPTY: NdisComplianceNotes = {
  checklist: [],
  questionsForProvider: [],
  thingsIveNoticed: [],
};

function toStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string");
}

function toChecklist(value: unknown): ChecklistItem[] {
  if (!Array.isArray(value)) return [];
  const out: ChecklistItem[] = [];
  value.forEach((v, i) => {
    if (v && typeof v === "object" && typeof (v as ChecklistItem).text === "string") {
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

function toNoticed(value: unknown): NoticedEntry[] {
  if (!Array.isArray(value)) return [];
  const out: NoticedEntry[] = [];
  value.forEach((v, i) => {
    if (typeof v === "string") {
      // Older versions stored plain text with no date.
      out.push({ id: `legacy-${i}`, date: "", text: v });
    } else if (v && typeof v === "object" && typeof (v as NoticedEntry).text === "string") {
      const e = v as Partial<NoticedEntry>;
      out.push({
        id: typeof e.id === "string" && e.id ? e.id : `legacy-${i}`,
        date: typeof e.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(e.date) ? e.date : "",
        text: e.text as string,
      });
    }
  });
  return out;
}

/** Turns whatever is in storage (any older version) into valid notes,
 * keeping everything that can be kept. */
export function normaliseComplianceNotes(raw: unknown): NdisComplianceNotes {
  const src = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  return {
    checklist: toChecklist(src.checklist),
    questionsForProvider: toStringList(src.questionsForProvider),
    thingsIveNoticed: toNoticed(src.thingsIveNoticed),
  };
}

/** Newest first; undated (older) entries last, in their original order. */
export function sortNoticed(entries: NoticedEntry[]): NoticedEntry[] {
  return entries
    .map((e, i) => ({ e, i }))
    .sort((a, b) => {
      if (a.e.date && b.e.date && a.e.date !== b.e.date) return a.e.date < b.e.date ? 1 : -1;
      if (a.e.date && !b.e.date) return -1;
      if (!a.e.date && b.e.date) return 1;
      return a.i - b.i;
    })
    .map(({ e }) => e);
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

export function useNdisComplianceNotes() {
  const [notes, setNotes] = useState<NdisComplianceNotes>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNotes(normaliseComplianceNotes(readRaw(STORAGE_KEY)));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEY, notes);
  }, [notes, hydrated]);

  const updateField = useCallback(
    <K extends keyof NdisComplianceNotes>(key: K, value: NdisComplianceNotes[K]) => {
      setNotes((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  return { notes, updateField, hydrated };
}
