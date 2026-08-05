"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "dt:meal-planner:recipes:v1";

export interface Recipe {
  id: string;
  name: string;
  emoji: string;
  ingredients: string[];
  instructions: string;
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

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // localStorage only exists client-side, so recipes are synced in after
    // mount rather than during the (server) initial render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRecipes(readJSON<Recipe[]>(STORAGE_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEY, recipes);
  }, [recipes, hydrated]);

  const createRecipe = useCallback((data: { name: string; emoji: string }) => {
    const id = `recipe-${Date.now()}`;
    setRecipes((prev) => [
      ...prev,
      { id, name: data.name, emoji: data.emoji, ingredients: [], instructions: "" },
    ]);
    return id;
  }, []);

  const updateRecipe = useCallback(
    (id: string, updates: Partial<Omit<Recipe, "id">>) => {
      setRecipes((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
      );
    },
    []
  );

  const deleteRecipe = useCallback((id: string) => {
    setRecipes((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return { recipes, createRecipe, updateRecipe, deleteRecipe, hydrated };
}
