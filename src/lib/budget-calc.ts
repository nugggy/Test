// Pure money/date helpers for the Budget Tracker (and reused by the
// Savings Plan and NDIS Budget Tracker). No React, no storage - so they
// can be unit tested (see src/lib/__tests__/budget-calc.test.ts).
//
// All money maths is done in whole cents to avoid floating point drift
// (0.1 + 0.2 !== 0.3), then converted back to dollars for display.

export type PayPeriod = "week" | "fortnight" | "month";

export const PAY_PERIODS: { id: PayPeriod; label: string; each: string }[] = [
  { id: "week", label: "Every week", each: "each week" },
  { id: "fortnight", label: "Every fortnight", each: "each fortnight" },
  { id: "month", label: "Every month", each: "each month" },
];

export function isPayPeriod(value: unknown): value is PayPeriod {
  return value === "week" || value === "fortnight" || value === "month";
}

export function toCents(amount: number): number {
  return Number.isFinite(amount) ? Math.round(amount * 100) : 0;
}

export function fromCents(cents: number): number {
  return cents / 100;
}

/** Adds up dollar amounts without floating point drift. */
export function sumDollars(amounts: number[]): number {
  return fromCents(amounts.reduce((sum, a) => sum + toCents(a), 0));
}

export interface AffordCheck {
  canAfford: boolean;
  /** Money left after buying it (0 or more). */
  leftAfter: number;
  /** How much more money would be needed (0 if it is affordable). */
  shortBy: number;
}

/** "Can I afford this?" - simple arithmetic on the person's own figures. */
export function checkAfford(available: number, price: number): AffordCheck {
  const diff = toCents(available) - toCents(price);
  return diff >= 0
    ? { canAfford: true, leftAfter: fromCents(diff), shortBy: 0 }
    : { canAfford: false, leftAfter: 0, shortBy: fromCents(-diff) };
}

/** Parses a typed dollar amount ("12.50", "$12.50", "1,200") to a number, or null. */
export function parseDollars(text: string): number | null {
  const cleaned = text.replace(/[$,\s]/g, "");
  if (!cleaned) return null;
  if (!/^\d*\.?\d+$/.test(cleaned) && !/^\d+\.$/.test(cleaned)) return null;
  const value = Number(cleaned);
  if (!Number.isFinite(value) || value < 0) return null;
  return Math.round(value * 100) / 100;
}

// ---- Date-only strings (yyyy-mm-dd) ----
// These are calendar dates, not instants, so they're handled in UTC to
// avoid a daylight saving change shifting a date by a day.

export function isDateString(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function dateToUtcMs(date: string): number {
  return Date.parse(`${date}T00:00:00Z`);
}

export function addDays(date: string, days: number): string {
  const ms = dateToUtcMs(date);
  if (!Number.isFinite(ms)) return date;
  return new Date(ms + days * 86_400_000).toISOString().slice(0, 10);
}

/** Whole days from `from` to `to` (negative if `to` is earlier). */
export function daysBetween(from: string, to: string): number {
  const a = dateToUtcMs(from);
  const b = dateToUtcMs(to);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return 0;
  return Math.round((b - a) / 86_400_000);
}

const DATE_FORMATTER = new Intl.DateTimeFormat("en-AU", {
  timeZone: "UTC",
  day: "numeric",
  month: "short",
  year: "numeric",
});

/** "2026-08-31" -> "31 Aug 2026". Falls back to the raw text if it isn't a date. */
export function formatDateOnly(date: string): string {
  if (!isDateString(date)) return date;
  const ms = dateToUtcMs(date);
  return Number.isFinite(ms) ? DATE_FORMATTER.format(new Date(ms)) : date;
}

export type DateRange = "7d" | "14d" | "month" | "all";

export const DATE_RANGES: { id: DateRange; label: string }[] = [
  { id: "7d", label: "Last 7 days" },
  { id: "14d", label: "Last 14 days" },
  { id: "month", label: "This month" },
  { id: "all", label: "All time" },
];

/** First date (inclusive) included in a range, or null for "all time". */
export function rangeStart(range: DateRange, today: string): string | null {
  switch (range) {
    case "7d":
      return addDays(today, -6);
    case "14d":
      return addDays(today, -13);
    case "month":
      return `${today.slice(0, 7)}-01`;
    default:
      return null;
  }
}

export function filterByRange<T extends { date: string }>(
  items: T[],
  range: DateRange,
  today: string
): T[] {
  const start = rangeStart(range, today);
  if (!start) return items;
  return items.filter((item) => item.date >= start && item.date <= today);
}

export interface MoneyTotals {
  income: number;
  expenses: number;
  balance: number;
}

export function summariseTransactions(
  transactions: { type: "income" | "expense"; amount: number }[]
): MoneyTotals {
  let income = 0;
  let expenses = 0;
  for (const t of transactions) {
    if (t.type === "income") income += toCents(t.amount);
    else expenses += toCents(t.amount);
  }
  return {
    income: fromCents(income),
    expenses: fromCents(expenses),
    balance: fromCents(income - expenses),
  };
}
