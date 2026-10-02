// Pure arithmetic for the Savings Plan - no advice, just the person's own
// numbers worked out for them. Unit tested in
// src/lib/__tests__/savings-plan-calc.test.ts.

import { addDays, daysBetween, fromCents, toCents, type PayPeriod } from "./budget-calc";

export interface SavingsProgress {
  saved: number;
  toGo: number;
  /** 0-100, whole number. */
  pct: number;
  reached: boolean;
}

export function savingsProgress(targetAmount: number, amounts: number[]): SavingsProgress {
  const savedCents = amounts.reduce((sum, a) => sum + toCents(a), 0);
  const targetCents = toCents(targetAmount);
  const toGoCents = Math.max(0, targetCents - savedCents);
  const pct =
    targetCents > 0 ? Math.min(100, Math.max(0, Math.floor((savedCents / targetCents) * 100))) : 0;
  return {
    saved: fromCents(savedCents),
    toGo: fromCents(toGoCents),
    pct,
    reached: targetCents > 0 && savedCents >= targetCents,
  };
}

/** Adds whole calendar months to a yyyy-mm-dd date, clamping to the month's last day. */
export function addMonths(date: string, months: number): string {
  const [y, m, d] = date.split("-").map(Number);
  if (!y || !m || !d) return date;
  const totalMonths = y * 12 + (m - 1) + months;
  const ny = Math.floor(totalMonths / 12);
  const nm = (totalMonths % 12) + 1;
  const lastDay = new Date(Date.UTC(ny, nm, 0)).getUTCDate();
  const nd = Math.min(d, lastDay);
  return `${ny}-${String(nm).padStart(2, "0")}-${String(nd).padStart(2, "0")}`;
}

function addPeriods(date: string, period: PayPeriod, count: number): string {
  if (period === "month") return addMonths(date, count);
  return addDays(date, count * (period === "week" ? 7 : 14));
}

/** How many whole pay periods are left from today until (and including) the target date. */
export function periodsUntil(today: string, targetDate: string, period: PayPeriod): number {
  const days = daysBetween(today, targetDate);
  if (days <= 0) return 0;
  if (period === "month") {
    let count = 0;
    while (addMonths(today, count + 1) <= targetDate) count += 1;
    return Math.max(1, count);
  }
  const periodDays = period === "week" ? 7 : 14;
  return Math.max(1, Math.floor(days / periodDays));
}

/**
 * To reach the target by the target date, roughly how much to put aside
 * each period. Returns null when there's no date, the date has passed, or
 * nothing is left to save.
 */
export function amountPerPeriod(
  toGo: number,
  today: string,
  targetDate: string,
  period: PayPeriod
): { amount: number; periods: number } | null {
  if (!targetDate || toGo <= 0) return null;
  const periods = periodsUntil(today, targetDate, period);
  if (periods <= 0) return null;
  // Round up to the next cent so the total is never short.
  const amountCents = Math.ceil(toCents(toGo) / periods);
  return { amount: fromCents(amountCents), periods };
}

/**
 * If the person puts aside `regular` each period, how many periods until
 * the goal is reached, and roughly which date that is.
 */
export function timeToReach(
  toGo: number,
  regular: number,
  period: PayPeriod,
  today: string
): { periods: number; date: string } | null {
  if (toGo <= 0 || regular <= 0) return null;
  const periods = Math.ceil(toCents(toGo) / toCents(regular));
  return { periods, date: addPeriods(today, period, periods) };
}
