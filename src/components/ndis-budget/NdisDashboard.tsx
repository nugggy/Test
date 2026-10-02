"use client";

import { NDIS_CATEGORIES, formatCurrency } from "@/lib/ndis-budget-data";
import {
  getCategorySpent,
  getPlanElapsedFraction,
  getTotalAllocated,
  getTotalSpent,
  type NdisExpense,
  type NdisPlan,
} from "@/lib/ndis-budget-storage";
import { getTodayDateString } from "@/lib/datetime";
import { useTimezone } from "@/lib/timezone-context";

interface NdisDashboardProps {
  plan: NdisPlan;
  expenses: NdisExpense[];
}

// A category is flagged as spending faster than the plan period once its
// spent-vs-elapsed gap passes this margin - loose enough that normal
// week-to-week variation in a support schedule doesn't trigger false alarms.
const PACE_WARNING_MARGIN = 0.15;

function paceColor(pctSpent: number, elapsedFraction: number | null): string {
  if (pctSpent > 1) return "var(--sev-5)";
  if (elapsedFraction !== null && pctSpent - elapsedFraction > PACE_WARNING_MARGIN) {
    return "var(--sev-3)";
  }
  return "var(--sev-1)";
}

function paceLabel(
  allocated: number,
  pctSpent: number,
  elapsedFraction: number | null
): string {
  if (allocated <= 0) return "No amount allocated yet";
  if (pctSpent > 1) return "Over the allocated amount";
  if (elapsedFraction === null) return "Set plan dates to see pacing";
  if (pctSpent - elapsedFraction > PACE_WARNING_MARGIN) {
    return "Spending faster than the plan period so far";
  }
  if (elapsedFraction - pctSpent > PACE_WARNING_MARGIN) {
    return "Underspending compared to the plan period so far";
  }
  return "On track with the plan period";
}

export default function NdisDashboard({ plan, expenses }: NdisDashboardProps) {
  const { timezone } = useTimezone();
  const today = getTodayDateString(timezone);
  const elapsedFraction = getPlanElapsedFraction(plan, today);

  const totalAllocated = getTotalAllocated(plan);
  const totalSpent = getTotalSpent(expenses);
  const totalPct = totalAllocated > 0 ? totalSpent / totalAllocated : 0;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border-2 border-border bg-surface p-4">
      <h2 className="font-display text-lg font-bold">Plan dashboard</h2>

      <div className="rounded-xl border-2 border-border bg-background p-3">
        <div className="mb-1 flex flex-wrap items-baseline justify-between gap-1">
          <span className="font-semibold">Overall</span>
          <span className="text-sm text-muted">
            {formatCurrency(totalSpent)} of {formatCurrency(totalAllocated)} spent
          </span>
        </div>
        <ProgressBar pct={totalPct} color={paceColor(totalPct, elapsedFraction)} />
        {elapsedFraction !== null && (
          <p className="mt-1 text-xs text-muted">
            {Math.round(elapsedFraction * 100)}% of the plan period has passed
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {NDIS_CATEGORIES.map((category) => {
          const allocated = plan.allocations[category.id] ?? 0;
          const spent = getCategorySpent(expenses, category.id);
          const pct = allocated > 0 ? spent / allocated : 0;
          const color = paceColor(pct, elapsedFraction);
          return (
            <div key={category.id} className="rounded-xl border-2 border-border bg-background p-3">
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-1">
                <span className="text-sm font-semibold">{category.label}</span>
                <span className="text-sm text-muted">
                  {formatCurrency(spent)} of {formatCurrency(allocated)}
                </span>
              </div>
              <ProgressBar pct={pct} color={color} />
              <p className="mt-1 text-xs" style={{ color }}>
                {paceLabel(allocated, pct, elapsedFraction)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProgressBar({ pct, color }: { pct: number; color: string }) {
  const width = Math.min(100, Math.max(pct > 0 ? 3 : 0, pct * 100));
  return (
    <div
      className="h-4 overflow-hidden rounded-full bg-border/40"
      role="img"
      aria-label={`${Math.round(pct * 100)}% spent`}
    >
      <div
        className="h-full rounded-full transition-[width]"
        style={{ width: `${width}%`, backgroundColor: color }}
      />
    </div>
  );
}
