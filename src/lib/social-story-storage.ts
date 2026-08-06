"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "dt:social-story:stories:v1";

export interface StoryPage {
  id: string;
  emoji: string;
  text: string;
}

export interface SocialStory {
  id: string;
  title: string;
  pages: StoryPage[];
  createdAt: string; // ISO
  updatedAt: string; // ISO
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

export function useSocialStories() {
  const [stories, setStories] = useState<SocialStory[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // localStorage only exists client-side, so stories are synced in after
    // mount rather than during the (server) initial render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStories(readJSON<SocialStory[]>(STORAGE_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEY, stories);
  }, [stories, hydrated]);

  const createStory = useCallback((title: string) => {
    const now = new Date().toISOString();
    const id = `story-${Date.now()}`;
    setStories((prev) => [
      { id, title, pages: [], createdAt: now, updatedAt: now },
      ...prev,
    ]);
    return id;
  }, []);

  const updateStory = useCallback(
    (id: string, updates: Partial<Pick<SocialStory, "title" | "pages">>) => {
      setStories((prev) =>
        prev.map((story) =>
          story.id === id
            ? { ...story, ...updates, updatedAt: new Date().toISOString() }
            : story
        )
      );
    },
    []
  );

  const deleteStory = useCallback((id: string) => {
    setStories((prev) => prev.filter((story) => story.id !== id));
  }, []);

  return { stories, createStory, updateStory, deleteStory, hydrated };
}
