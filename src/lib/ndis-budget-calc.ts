// Pure maths for the NDIS Plan Budget Tracker. It only ever adds up and
// compares the figures the person typed in from their own plan - it never
// sets or suggests any amounts. Unit tested in
// src/lib/__tests__/ndis-budget-calc.test.ts.

import { daysBetween, fromCents, isDateString, toCents } from "./budget-calc";
import { NDIS_CATEGORIES, type NdisCategory, type NdisGroup } from "./ndis-budget-data";

export interface NdisPlanLike {
  startDate: string;
  endDate: string;
  allocations: Record<string, number>;
}

export interface NdisExpenseLike {
  amount: number;
  categoryId: string;
  date: string;
}

export function hasValidPlanDates(plan: NdisPlanLike): boolean {
  return (
    isDateString(plan.startDate) &&
    isDateString(plan.endDate) &&
    plan.endDate >= plan.startDate
  );
}

/**
 * Spending that belongs to this plan period. When plan dates are set,
 * entries outside them (e.g. from a previous plan) are left out so they
 * don't eat into the new plan's budget. Without dates, everything counts.
 */
export function splitByPlanDates<T extends NdisExpenseLike>(
  plan: NdisPlanLike,
  expenses: T[]
): { inPlan: T[]; outside: T[] } {
  if (!hasValidPlanDates(plan)) return { inPlan: expenses, outside: [] };
  const inPlan: T[] = [];
  const outside: T[] = [];
  for (const e of expenses) {
    if (e.date >= plan.startDate && e.date <= plan.endDate) inPlan.push(e);
    else outside.push(e);
  }
  return { inPlan, outside };
}

export interface CategoryRow {
  category: NdisCategory;
  allocated: number;
  spent: number;
  /** Can be negative if overspent. */
  left: number;
  /** spent / allocated, 0 if nothing allocated. */
  fraction: number;
}

export function categoryRows(plan: NdisPlanLike, expenses: NdisExpenseLike[]): CategoryRow[] {
  return NDIS_CATEGORIES.map((category) => {
    const allocatedCents = toCents(plan.allocations[category.id] ?? 0);
    const spentCents = expenses
      .filter((e) => e.categoryId === category.id)
      .reduce((sum, e) => sum + toCents(e.amount), 0);
    return {
      category,
      allocated: fromCents(allocatedCents),
      spent: fromCents(spentCents),
      left: fromCents(allocatedCents - spentCents),
      fraction: allocatedCents > 0 ? spentCents / allocatedCents : 0,
    };
  });
}

/** Rows worth showing: anything with money allocated or spent. */
export function activeRows(rows: CategoryRow[]): CategoryRow[] {
  return rows.filter((r) => r.allocated > 0 || r.spent > 0);
}

export interface Totals {
  allocated: number;
  spent: number;
  left: number;
  fraction: number;
}

export function totalsOf(rows: CategoryRow[]): Totals {
  const allocatedCents = rows.reduce((s, r) => s + toCents(r.allocated), 0);
  const spentCents = rows.reduce((s, r) => s + toCents(r.spent), 0);
  return {
    allocated: fromCents(allocatedCents),
    spent: fromCents(spentCents),
    left: fromCents(allocatedCents - spentCents),
    fraction: allocatedCents > 0 ? spentCents / allocatedCents : 0,
  };
}

export function groupTotals(rows: CategoryRow[], group: NdisGroup): Totals {
  return totalsOf(rows.filter((r) => r.category.group === group));
}

/**
 * Weeks left in the plan from today (counting today), rounded up. Null if
 * there's no valid plan, or the plan has already ended.
 */
export function weeksLeftInPlan(plan: NdisPlanLike, today: string): number | null {
  if (!hasValidPlanDates(plan)) return null;
  const from = today < plan.startDate ? plan.startDate : today;
  const days = daysBetween(from, plan.endDate) + 1;
  if (days <= 0) return null;
  return Math.ceil(days / 7);
}

/** Money left spread evenly over the weeks left, to the cent. Null if not meaningful. */
export function perWeek(left: number, weeks: number | null): number | null {
  if (weeks === null || weeks <= 0 || left <= 0) return null;
  return fromCents(Math.floor(toCents(left) / weeks));
}
