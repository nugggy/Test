"use client";

import { useId, useState } from "react";
import { NDIS_CATEGORIES, NDIS_GROUPS, formatCurrency } from "@/lib/ndis-budget-data";
import type { NdisPlan } from "@/lib/ndis-budget-storage";
import { getTotalAllocated } from "@/lib/ndis-budget-storage";
import { formatDateOnly } from "@/lib/budget-calc";

interface NdisPlanSetupProps {
  plan: NdisPlan;
  /** Category ids that have spending logged against them. */
  usedCategoryIds: Set<string>;
  onSetDates: (startDate: string, endDate: string) => void;
  onSetAllocation: (categoryId: string, amount: number) => void;
}

/**
 * Plan period + per-category allocation entry - always from the participant's
 * own NDIS plan document. This tool never sets or suggests any of these
 * figures itself, only totals and displays what's entered (same rule as the
 * Diabetes Management Plan). Fully controlled inputs (rather than
 * defaultValue) so the fields correctly pick up the saved plan once it's
 * read from local storage after hydration.
 */
export default function NdisPlanSetup({
  plan,
  usedCategoryIds,
  onSetDates,
  onSetAllocation,
}: NdisPlanSetupProps) {
  const formId = useId();
  const total = getTotalAllocated(plan);
  // null = not chosen yet: open while the plan is empty, closed once it has amounts.
  const [editing, setEditing] = useState<boolean | null>(null);
  const open = editing ?? total === 0;

  const visible = NDIS_CATEGORIES.filter(
    (c) => !c.legacy || (plan.allocations[c.id] ?? 0) > 0 || usedCategoryIds.has(c.id)
  );
  const hasLegacy = visible.some((c) => c.legacy);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border-2 border-border bg-surface p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="font-display text-lg font-bold">My NDIS plan</h2>
          <p className="text-sm text-muted">
            {plan.startDate && plan.endDate
              ? `${formatDateOnly(plan.startDate)} to ${formatDateOnly(plan.endDate)} · `
              : ""}
            Total in plan: {formatCurrency(total)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing(!open)}
          aria-expanded={open}
          className="no-print touch-target rounded-xl border-2 border-border bg-background px-4 text-sm font-semibold"
        >
          {open ? "Hide plan details" : "Change plan details"}
        </button>
      </div>

      {open && (
        <>
          <p className="text-sm text-muted">
            Copy the dates and amounts from your NDIS plan. Only fill in the
            categories your plan has money in. Leave the rest empty.
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor={`${formId}-start`} className="mb-1 block font-semibold">
                Plan start date
              </label>
              <input
                id={`${formId}-start`}
                type="date"
                value={plan.startDate}
                onChange={(e) => onSetDates(e.target.value, plan.endDate)}
                className="touch-target w-full rounded-xl border-2 border-border bg-background px-4 py-3"
              />
            </div>
            <div>
              <label htmlFor={`${formId}-end`} className="mb-1 block font-semibold">
                Plan end date
              </label>
              <input
                id={`${formId}-end`}
                type="date"
                value={plan.endDate}
                onChange={(e) => onSetDates(plan.startDate, e.target.value)}
                className="touch-target w-full rounded-xl border-2 border-border bg-background px-4 py-3"
              />
            </div>
          </div>
          {plan.startDate && plan.endDate && plan.endDate < plan.startDate && (
            <p className="text-sm font-semibold" role="alert">
              <span aria-hidden="true">⚠️ </span>The end date is before the start date.
            </p>
          )}

          {NDIS_GROUPS.map((group) => {
            const cats = visible.filter((c) => c.group === group.id);
            if (cats.length === 0) return null;
            return (
              <fieldset
                key={group.id}
                className="flex flex-col gap-3 rounded-xl border-2 border-border bg-background p-3"
              >
                <legend className="px-1 font-display font-bold">{group.id}</legend>
                <p className="text-xs text-muted">{group.note}</p>
                {cats.map((category) => (
                  <div key={category.id}>
                    <label
                      htmlFor={`${formId}-${category.id}`}
                      className="mb-1 block text-sm font-semibold"
                    >
                      {category.number && <span className="text-muted">{category.number} </span>}
                      {category.label}
                      {category.hint && (
                        <span className="block text-xs font-normal text-muted">{category.hint}</span>
                      )}
                    </label>
                    <input
                      id={`${formId}-${category.id}`}
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.01"
                      placeholder="$0.00"
                      value={plan.allocations[category.id] ?? ""}
                      onChange={(e) => {
                        const parsed = parseFloat(e.target.value);
                        onSetAllocation(
                          category.id,
                          Number.isFinite(parsed) && parsed >= 0 ? Math.round(parsed * 100) / 100 : 0
                        );
                      }}
                      className="touch-target w-full rounded-xl border-2 border-border bg-surface px-4 py-3"
                    />
                  </div>
                ))}
              </fieldset>
            );
          })}

          {hasLegacy && (
            <p className="rounded-xl border-2 border-dashed border-border bg-background p-3 text-xs text-muted">
              Older versions of this tool had one total for all Capacity
              Building and one for all Capital Supports. Those amounts are
              kept as they were. You can move them into the separate
              categories whenever you like.
            </p>
          )}

          <p className="text-right text-sm font-bold">Total in plan: {formatCurrency(total)}</p>

          <p className="rounded-xl border-2 border-dashed border-border bg-background p-3 text-xs text-muted">
            The notes about what money can be moved are general only. Check
            your own plan, or ask your planner, Local Area Coordinator or
            support coordinator if you are not sure.
          </p>
        </>
      )}
    </div>
  );
}
