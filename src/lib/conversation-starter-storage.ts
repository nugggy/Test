"use client";

import { useCallback, useEffect, useState } from "react";
import type { ConversationCard } from "@/lib/conversation-starter-data";

const FAVOURITES_KEY = "dt:conversation-starters:favourites:v1";
const CUSTOM_CARDS_KEY = "dt:conversation-starters:custom-cards:v1";

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

export function useFavouriteCards() {
  const [favourites, setFavourites] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFavourites(readJSON<string[]>(FAVOURITES_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(FAVOURITES_KEY, favourites);
  }, [favourites, hydrated]);

  const toggleFavourite = useCallback((cardId: string) => {
    setFavourites((prev) =>
      prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId]
    );
  }, []);

  const isFavourite = useCallback((cardId: string) => favourites.includes(cardId), [favourites]);

  return { favourites, toggleFavourite, isFavourite, hydrated };
}

export function useCustomCards() {
  const [customCards, setCustomCards] = useState<ConversationCard[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCustomCards(readJSON<ConversationCard[]>(CUSTOM_CARDS_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(CUSTOM_CARDS_KEY, customCards);
  }, [customCards, hydrated]);

  const addCustomCard = useCallback((card: ConversationCard) => {
    setCustomCards((prev) => [...prev, card]);
  }, []);

  const removeCustomCard = useCallback((cardId: string) => {
    setCustomCards((prev) => prev.filter((card) => card.id !== cardId));
  }, []);

  return { customCards, addCustomCard, removeCustomCard, hydrated };
}
