"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export const DEFAULT_TIMEZONE = "Australia/Sydney";

export interface TimezoneOption {
  value: string;
  label: string;
}

// Common Australian/NZ zones first (this toolkit is built for the Australian
// NDIS context), plus UTC as a neutral fallback. Not exhaustive - a resident
// of any other timezone can still type theirs into an app that lists the
// world's ~400 IANA zones, but this covers this project's primary audience.
export const COMMON_TIMEZONES: TimezoneOption[] = [
  { value: "Australia/Sydney", label: "Sydney, Melbourne, Canberra, Hobart (AEST/AEDT)" },
  { value: "Australia/Brisbane", label: "Brisbane (AEST, no daylight saving)" },
  { value: "Australia/Adelaide", label: "Adelaide (ACST/ACDT)" },
  { value: "Australia/Darwin", label: "Darwin (ACST, no daylight saving)" },
  { value: "Australia/Perth", label: "Perth (AWST)" },
  { value: "Pacific/Auckland", label: "Auckland, Wellington (NZST/NZDT)" },
  { value: "UTC", label: "UTC" },
];

interface TimezoneContextValue {
  timezone: string;
  setTimezone: (tz: string) => void;
  reset: () => void;
}

const STORAGE_KEY = "dt:timezone:v1";

const TimezoneContext = createContext<TimezoneContextValue | null>(null);

function readStoredTimezone(): string {
  if (typeof window === "undefined") return DEFAULT_TIMEZONE;
  try {
    return window.localStorage.getItem(STORAGE_KEY) || DEFAULT_TIMEZONE;
  } catch {
    return DEFAULT_TIMEZONE;
  }
}

export function TimezoneProvider({ children }: { children: ReactNode }) {
  const [timezone, setTimezoneState] = useState(DEFAULT_TIMEZONE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Reading localStorage must happen after mount (it doesn't exist on the
    // server), so this intentionally syncs client-only state on first paint.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTimezoneState(readStoredTimezone());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, timezone);
    } catch {
      // Storage may be unavailable (private browsing etc). The timezone
      // still applies for this session via React state.
    }
  }, [timezone, hydrated]);

  const value: TimezoneContextValue = {
    timezone,
    setTimezone: setTimezoneState,
    reset: () => setTimezoneState(DEFAULT_TIMEZONE),
  };

  return (
    <TimezoneContext.Provider value={value}>
      {children}
    </TimezoneContext.Provider>
  );
}

export function useTimezone() {
  const ctx = useContext(TimezoneContext);
  if (!ctx) {
    throw new Error("useTimezone must be used within a TimezoneProvider");
  }
  return ctx;
}
