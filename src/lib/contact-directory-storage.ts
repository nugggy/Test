"use client";

import { useCallback, useEffect, useState } from "react";

export interface ContactEntry {
  id: string;
  name: string;
  category: string;
  organisation: string;
  phone: string;
  email: string;
  notes: string;
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

function makeId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Factory so two different tools (Support Team Directory, Friends & Family
 * Directory) can each get their own localStorage-backed contact list hook,
 * scoped to their own storage key, without duplicating the read/write logic.
 */
export function createContactDirectoryStorage(storageKey: string) {
  return function useContactDirectory() {
    const [contacts, setContacts] = useState<ContactEntry[]>([]);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
      setContacts(readJSON<ContactEntry[]>(storageKey, []));
      setHydrated(true);
    }, []);

    useEffect(() => {
      if (hydrated) writeJSON(storageKey, contacts);
    }, [contacts, hydrated]);

    const addContact = useCallback((category: string) => {
      setContacts((prev) => [
        ...prev,
        {
          id: makeId(),
          name: "",
          category,
          organisation: "",
          phone: "",
          email: "",
          notes: "",
        },
      ]);
    }, []);

    const updateContact = useCallback((id: string, patch: Partial<ContactEntry>) => {
      setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    }, []);

    const removeContact = useCallback((id: string) => {
      setContacts((prev) => prev.filter((c) => c.id !== id));
    }, []);

    const clearAll = useCallback(() => setContacts([]), []);

    return { contacts, addContact, updateContact, removeContact, clearAll, hydrated };
  };
}

export type UseContactDirectory = ReturnType<typeof createContactDirectoryStorage>;
