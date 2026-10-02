// Pure helpers for the Holiday Planner. Unit tested in
// src/lib/__tests__/holiday-planner-calc.test.ts.

import { daysBetween, fromCents, isDateString, toCents } from "./budget-calc";

export type TripStatus =
  | { kind: "none" }
  | { kind: "upcoming"; sleeps: number }
  | { kind: "today" }
  | { kind: "during"; day: number; of: number }
  | { kind: "finished" };

/** Where today sits relative to the trip dates. */
export function tripStatus(startDate: string, endDate: string, today: string): TripStatus {
  if (!isDateString(startDate)) return { kind: "none" };
  const untilStart = daysBetween(today, startDate);
  if (untilStart > 0) return { kind: "upcoming", sleeps: untilStart };
  if (untilStart === 0) return { kind: "today" };
  if (isDateString(endDate) && endDate >= startDate) {
    const of = daysBetween(startDate, endDate) + 1;
    const day = daysBetween(startDate, today) + 1;
    if (day <= of) return { kind: "during", day, of };
    return { kind: "finished" };
  }
  return { kind: "finished" };
}

/** Trip length in days and nights, or null if the dates aren't usable. */
export function tripLength(startDate: string, endDate: string): { days: number; nights: number } | null {
  if (!isDateString(startDate) || !isDateString(endDate) || endDate < startDate) return null;
  const nights = daysBetween(startDate, endDate);
  return { days: nights + 1, nights };
}

/**
 * Adds up the first dollar amount written on each budget line, e.g.
 * "Flights - $450" and "Food $1,200.50". Lines without a "$" amount are
 * skipped and counted, so the person can see what wasn't included.
 */
export function budgetTotal(lines: string[]): { total: number; counted: number; skipped: number } {
  let cents = 0;
  let counted = 0;
  let skipped = 0;
  for (const line of lines) {
    const match = line.match(/\$\s?(\d{1,3}(?:,\d{3})+|\d+)(\.\d{1,2})?/);
    if (!match) {
      skipped += 1;
      continue;
    }
    const value = Number(`${match[1].replace(/,/g, "")}${match[2] ?? ""}`);
    if (!Number.isFinite(value)) {
      skipped += 1;
      continue;
    }
    cents += toCents(value);
    counted += 1;
  }
  return { total: fromCents(cents), counted, skipped };
}
