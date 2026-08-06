"use client";

import { useCallback, useEffect, useState } from "react";

const CHECKED_KEY = "dt:meal-planner:checked-ingredients:v1";
const EXTRA_KEY = "dt:meal-planner:extra-items:v1";

export interface ExtraShoppingItem {
  id: string;
  label: string;
  checked: boolean;
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

export function useShoppingListState() {
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  const [extraItems, setExtraItems] = useState<ExtraShoppingItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // localStorage only exists client-side, so state is synced in after
    // mount rather than during the (server) initial render.
    /* eslint-disable react-hooks/set-state-in-effect */
    setCheckedKeys(readJSON<string[]>(CHECKED_KEY, []));
    setExtraItems(readJSON<ExtraShoppingItem[]>(EXTRA_KEY, []));
    /* eslint-enable react-hooks/set-state-in-effect */
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(CHECKED_KEY, checkedKeys);
  }, [checkedKeys, hydrated]);

  useEffect(() => {
    if (hydrated) writeJSON(EXTRA_KEY, extraItems);
  }, [extraItems, hydrated]);

  const isChecked = useCallback(
    (key: string) => checkedKeys.includes(key),
    [checkedKeys]
  );

  const toggleChecked = useCallback((key: string) => {
    setCheckedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }, []);

  const clearChecked = useCallback(() => setCheckedKeys([]), []);

  const addExtraItem = useCallback((label: string) => {
    setExtraItems((prev) => [
      ...prev,
      { id: `extra-${Date.now()}`, label, checked: false },
    ]);
  }, []);

  const toggleExtraItem = useCallback((id: string) => {
    setExtraItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  }, []);

  const removeExtraItem = useCallback((id: string) => {
    setExtraItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return {
    isChecked,
    toggleChecked,
    clearChecked,
    extraItems,
    addExtraItem,
    toggleExtraItem,
    removeExtraItem,
    hydrated,
  };
}
