"use client";

import { useCallback, useEffect, useState } from "react";
import { getDeviceId } from "@/lib/device-id";
import { recordFavourite } from "@/app/actions/favourites";

const STORAGE_KEY = "dt:favourite-tools:v1";

function readFavourites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeFavourites(slugs: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  } catch {
    // If storage is full or unavailable, the choice just won't persist
    // across visits - favouriting still works for the current session.
  }
}

export function useFavourites() {
  const [favourites, setFavourites] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFavourites(new Set(readFavourites()));
    setHydrated(true);
  }, []);

  const toggleFavourite = useCallback((slug: string) => {
    setFavourites((prev) => {
      const next = new Set(prev);
      const isNowFavourited = !next.has(slug);
      if (isNowFavourited) {
        next.add(slug);
        // Best-effort: contributes to the public "most favourited" count.
        // Unfavouriting only updates this device's own list below, since
        // there's no way to verify ownership of an anonymous vote to
        // retract it server-side - see the migration for why.
        const deviceId = getDeviceId();
        if (deviceId) {
          recordFavourite(slug, deviceId).catch(() => {
            // Silently ignore - favouriting locally still works offline.
          });
        }
      } else {
        next.delete(slug);
      }
      writeFavourites(Array.from(next));
      return next;
    });
  }, []);

  return { favourites, toggleFavourite, hydrated };
}
