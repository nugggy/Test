"use client";

import { useCallback, useEffect, useState } from "react";
import type { BoardItem } from "@/lib/communication-board-data";

const FAVOURITES_KEY = "dt:comm-board:favourites:v1";
const CUSTOM_ITEMS_KEY = "dt:comm-board:custom-items:v1";

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

export function useFavourites() {
  const [favourites, setFavourites] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // localStorage only exists client-side, so favourites are synced in
    // after mount rather than during the (server) initial render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFavourites(readJSON<string[]>(FAVOURITES_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(FAVOURITES_KEY, favourites);
  }, [favourites, hydrated]);

  const toggleFavourite = useCallback((itemId: string) => {
    setFavourites((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  }, []);

  const isFavourite = useCallback(
    (itemId: string) => favourites.includes(itemId),
    [favourites]
  );

  return { favourites, toggleFavourite, isFavourite, hydrated };
}

export function useCustomItems() {
  const [customItems, setCustomItems] = useState<BoardItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Same as favourites above: sync from localStorage after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCustomItems(readJSON<BoardItem[]>(CUSTOM_ITEMS_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(CUSTOM_ITEMS_KEY, customItems);
  }, [customItems, hydrated]);

  const addCustomItem = useCallback((item: BoardItem) => {
    setCustomItems((prev) => [...prev, item]);
  }, []);

  const removeCustomItem = useCallback((itemId: string) => {
    setCustomItems((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  return { customItems, addCustomItem, removeCustomItem, hydrated };
}
