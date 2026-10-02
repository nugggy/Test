"use client";

import { useId } from "react";
import { NDIS_CATEGORIES, formatCurrency } from "@/lib/ndis-budget-data";
import type { NdisPlan } from "@/lib/ndis-budget-storage";
import { getTotalAllocated } from "@/lib/ndis-budget-storage";

interface NdisPlanSetupProps {
  plan: NdisPlan;
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
export default function NdisPlanSetup({ plan, onSetDates, onSetAllocation }: NdisPlanSetupProps) {
  const formId = useId();
  const total = getTotalAllocated(plan);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border-2 border-border bg-surface p-4">
      <h2 className="font-display text-lg font-bold">My NDIS plan</h2>
      <p className="text-sm text-muted">
        Enter the dates and category totals straight from your NDIS plan
        document, so this tool can show spend against what you&apos;re
        actually funded for.
      </p>

      <div className="grid grid-cols-2 gap-3">
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

      <div className="flex flex-col gap-3">
        {NDIS_CATEGORIES.map((category) => (
          <div key={category.id}>
            <label
              htmlFor={`${formId}-${category.id}`}
              className="mb-1 block text-sm font-semibold"
            >
              {category.label}
              <span className="ml-1 font-normal text-muted">({category.group})</span>
            </label>
            <input
              id={`${formId}-${category.id}`}
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={plan.allocations[category.id] ?? ""}
              onChange={(e) => {
                const parsed = parseFloat(e.target.value);
                onSetAllocation(category.id, Number.isFinite(parsed) ? parsed : 0);
              }}
              className="touch-target w-full rounded-xl border-2 border-border bg-background px-4 py-3"
            />
          </div>
        ))}
      </div>

      <p className="text-right text-sm font-bold">
        Total allocated: {formatCurrency(total)}
      </p>

      <p className="rounded-xl border-2 border-dashed border-border bg-background p-3 text-xs text-muted">
        Core Supports categories are usually flexible - unspent funds in one
        can often be used in another. Capacity Building and Capital funding
        is typically fixed to its stated purpose. Check your plan or with
        your planner if you&apos;re not sure.
      </p>
    </div>
  );
}
