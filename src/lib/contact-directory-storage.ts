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
    // reloads - the tool still works for the current session.
  }
}

function makeId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/** Fills in any missing fields so older or hand-edited data still loads. */
export function normalizeContacts(raw: unknown, fallbackCategory = "Other"): ContactEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((c): c is Partial<ContactEntry> => !!c && typeof c === "object")
    .map((c) => ({
      id: typeof c.id === "string" && c.id ? c.id : makeId(),
      name: typeof c.name === "string" ? c.name : "",
      category: typeof c.category === "string" && c.category ? c.category : fallbackCategory,
      organisation: typeof c.organisation === "string" ? c.organisation : "",
      phone: typeof c.phone === "string" ? c.phone : "",
      email: typeof c.email === "string" ? c.email : "",
      notes: typeof c.notes === "string" ? c.notes : "",
    }));
}

/**
 * Builds a safe tel: link from whatever was typed, keeping only digits and
 * a single leading +. Returns null if there aren't enough digits to dial.
 */
export function telHref(phone: string): string | null {
  const trimmed = phone.trim();
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length < 3) return null;
  return `tel:${trimmed.startsWith("+") ? "+" : ""}${digits}`;
}

/** sms: link for Australian mobile numbers (04..., +614...) or other
 * international numbers, using the same digits-only rule. Landlines get no
 * text button. */
export function smsHref(phone: string): string | null {
  const tel = telHref(phone);
  if (!tel) return null;
  const number = tel.slice(4);
  const isAuMobile = /^04\d{8}$/.test(number) || /^\+614\d{8}$/.test(number);
  const isOtherInternational = number.startsWith("+") && !number.startsWith("+61");
  return isAuMobile || isOtherInternational ? `sms:${number}` : null;
}

/** mailto: link only for something that looks like a single email address. */
export function mailtoHref(email: string): string | null {
  const trimmed = email.trim();
  if (!/^[^\s@<>"',;:\\()[\]]+@[^\s@<>"',;:\\()[\]]+\.[^\s@<>"',;:\\()[\]]+$/.test(trimmed)) {
    return null;
  }
  return `mailto:${encodeURIComponent(trimmed).replace(/%40/g, "@")}`;
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
      // localStorage only exists client-side, so contacts are synced in
      // after mount rather than during the (server) initial render.
      setContacts(normalizeContacts(readJSON<unknown>(storageKey, [])));
      setHydrated(true);
    }, []);

    useEffect(() => {
      if (hydrated) writeJSON(storageKey, contacts);
    }, [contacts, hydrated]);

    /** Adds a blank contact and returns its id, so the caller can open it
     * straight into edit mode. */
    const addContact = useCallback((category: string): string => {
      const id = makeId();
      setContacts((prev) => [
        ...prev,
        {
          id,
          name: "",
          category,
          organisation: "",
          phone: "",
          email: "",
          notes: "",
        },
      ]);
      return id;
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
