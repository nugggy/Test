"use client";

import { useCallback, useEffect, useState } from "react";
import { createContactDirectoryStorage } from "./contact-directory-storage";

const STORAGE_KEY = "dt:emergency-info-card:profile:v1";
const CONTACTS_STORAGE_KEY = "dt:emergency-info-card:contacts:v1";

export interface AboutMeProfile {
  name: string;
  preferredName: string;
  dob: string;
  conditions: string;
  allergies: string;
  medications: string;
  communicationNeeds: string;
  whatHelpsInCrisis: string;
  otherInfo: string;
}

const EMPTY_PROFILE: AboutMeProfile = {
  name: "",
  preferredName: "",
  dob: "",
  conditions: "",
  allergies: "",
  medications: "",
  communicationNeeds: "",
  whatHelpsInCrisis: "",
  otherInfo: "",
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

export function useAboutMeProfile() {
  const [profile, setProfile] = useState<AboutMeProfile>(EMPTY_PROFILE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProfile({ ...EMPTY_PROFILE, ...readJSON<Partial<AboutMeProfile>>(STORAGE_KEY, {}) });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEY, profile);
  }, [profile, hydrated]);

  const updateField = useCallback(
    <K extends keyof AboutMeProfile>(key: K, value: AboutMeProfile[K]) => {
      setProfile((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const clearProfile = useCallback(() => setProfile(EMPTY_PROFILE), []);

  return { profile, updateField, clearProfile, hydrated };
}

// One shared contact list, split into "Emergency contact" and "Doctor / key
// contact" groups by this category tag - reuses the same directory storage
// factory as Support Team/Friends & Family Directory rather than a
// second bespoke contacts implementation.
export const useEmergencyCardContacts = createContactDirectoryStorage(CONTACTS_STORAGE_KEY);
export const EMERGENCY_CONTACT_CATEGORY = "Emergency contact";
export const KEY_CONTACT_CATEGORY = "Doctor / key contact";
