"use client";

import { useEffect, useState } from "react";

export interface ClockTimeParts {
  hour: number; // 0-23, in the target timezone
  minute: number;
  second: number;
  weekday: string;
  day: string;
  month: string;
  year: string;
}

const FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
};

function computeParts(timezone: string): ClockTimeParts {
  const now = new Date();
  let formatter: Intl.DateTimeFormat;
  try {
    formatter = new Intl.DateTimeFormat("en-AU", { ...FORMAT_OPTIONS, timeZone: timezone });
  } catch {
    // An invalid/unsupported timezone string — fall back to the browser's
    // own local time rather than crashing the clock.
    formatter = new Intl.DateTimeFormat("en-AU", FORMAT_OPTIONS);
  }
  const map: Record<string, string> = {};
  for (const part of formatter.formatToParts(now)) {
    if (part.type !== "literal") map[part.type] = part.value;
  }
  return {
    hour: Number(map.hour) % 24,
    minute: Number(map.minute) || 0,
    second: Number(map.second) || 0,
    weekday: map.weekday ?? "",
    day: map.day ?? "",
    month: map.month ?? "",
    year: map.year ?? "",
  };
}

const NEUTRAL_PARTS: ClockTimeParts = {
  hour: 0,
  minute: 0,
  second: 0,
  weekday: "",
  day: "",
  month: "",
  year: "",
};

/** Ticks once a second, returning the wall-clock time in the given IANA
 * timezone (not the browser's local time) as separate numeric parts —
 * used for both the digital readout and the analog hand angles.
 *
 * Starts from a neutral, non-time-dependent value rather than "now" so the
 * server-rendered markup and the client's first paint always match — the
 * real time is only read once mounted on the client, like every other
 * localStorage-hydrated value in this app. */
export function useClockTime(timezone: string): ClockTimeParts {
  const [parts, setParts] = useState<ClockTimeParts>(NEUTRAL_PARTS);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParts(computeParts(timezone));
    const id = setInterval(() => setParts(computeParts(timezone)), 1000);
    return () => clearInterval(id);
  }, [timezone]);

  return parts;
}
