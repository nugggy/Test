"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "dt:first-then-board:v1";
const CUSTOM_KEY = "dt:first-then-board:custom-pictures:v1";

export type BoardMode = "firstThen" | "choice";

export interface PictureItem {
  id: string;
  label: string;
  emoji: string;
}

interface BoardState {
  mode: BoardMode;
  firstItem: PictureItem | null;
  thenItem: PictureItem | null;
  firstDone: boolean;
  choiceItems: PictureItem[];
  selectedChoiceId: string | null;
}

const DEFAULT_STATE: BoardState = {
  mode: "firstThen",
  firstItem: null,
  thenItem: null,
  firstDone: false,
  choiceItems: [],
  selectedChoiceId: null,
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

export function useFirstThenBoard() {
  const [state, setState] = useState<BoardState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ ...DEFAULT_STATE, ...readJSON<Partial<BoardState>>(STORAGE_KEY, {}) });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEY, state);
  }, [state, hydrated]);

  const setMode = useCallback((mode: BoardMode) => {
    setState((prev) => ({ ...prev, mode }));
  }, []);

  const setFirstItem = useCallback((item: PictureItem | null) => {
    setState((prev) => ({ ...prev, firstItem: item, firstDone: false }));
  }, []);

  const setThenItem = useCallback((item: PictureItem | null) => {
    setState((prev) => ({ ...prev, thenItem: item }));
  }, []);

  const toggleFirstDone = useCallback(() => {
    setState((prev) => ({ ...prev, firstDone: !prev.firstDone }));
  }, []);

  // "Then" becomes the new "First", ready to choose what comes after it.
  // Lets one board walk through a whole chain of activities.
  const moveOn = useCallback(() => {
    setState((prev) =>
      prev.thenItem
        ? { ...prev, firstItem: prev.thenItem, thenItem: null, firstDone: false }
        : prev
    );
  }, []);

  const resetFirstThen = useCallback(() => {
    setState((prev) => ({ ...prev, firstDone: false }));
  }, []);

  const setChoiceItems = useCallback((items: PictureItem[]) => {
    setState((prev) => ({ ...prev, choiceItems: items, selectedChoiceId: null }));
  }, []);

  const addChoiceItem = useCallback((item: PictureItem) => {
    setState((prev) =>
      prev.choiceItems.length >= 6 || prev.choiceItems.some((i) => i.id === item.id)
        ? prev
        : { ...prev, choiceItems: [...prev.choiceItems, item] }
    );
  }, []);

  const removeChoiceItem = useCallback((itemId: string) => {
    setState((prev) => ({
      ...prev,
      choiceItems: prev.choiceItems.filter((i) => i.id !== itemId),
      selectedChoiceId: prev.selectedChoiceId === itemId ? null : prev.selectedChoiceId,
    }));
  }, []);

  const selectChoice = useCallback((itemId: string | null) => {
    setState((prev) => ({ ...prev, selectedChoiceId: itemId }));
  }, []);

  return {
    state,
    hydrated,
    setMode,
    setFirstItem,
    setThenItem,
    toggleFirstDone,
    moveOn,
    resetFirstThen,
    setChoiceItems,
    addChoiceItem,
    removeChoiceItem,
    selectChoice,
  };
}

export function useCustomPictures() {
  const [customPictures, setCustomPictures] = useState<PictureItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCustomPictures(readJSON<PictureItem[]>(CUSTOM_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(CUSTOM_KEY, customPictures);
  }, [customPictures, hydrated]);

  const addCustomPicture = useCallback((label: string, emoji: string) => {
    const trimmed = label.trim();
    if (!trimmed) return null;
    const item: PictureItem = { id: makeId(), label: trimmed, emoji };
    setCustomPictures((prev) => [...prev, item]);
    return item;
  }, []);

  const removeCustomPicture = useCallback((id: string) => {
    setCustomPictures((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return { customPictures, addCustomPicture, removeCustomPicture, hydrated };
}
