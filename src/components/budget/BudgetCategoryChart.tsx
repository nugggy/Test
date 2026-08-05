"use client";

import { formatCurrency } from "@/lib/budget-data";
import type { BudgetTransaction } from "@/lib/budget-storage";

interface BudgetCategoryChartProps {
  transactions: BudgetTransaction[];
}

const MAX_BARS = 8;

export default function BudgetCategoryChart({
  transactions,
}: BudgetCategoryChartProps) {
  const expenses = transactions.filter((t) => t.type === "expense");

  if (expenses.length === 0) {
    return (
      <p className="rounded-xl border-2 border-dashed border-border p-6 text-center text-muted">
        Log an expense above to see spending by category.
      </p>
    );
  }

  const totals = new Map<string, number>();
  for (const t of expenses) {
    totals.set(t.category, (totals.get(t.category) ?? 0) + t.amount);
  }
  const sorted = [...totals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_BARS);
  const max = sorted[0]?.[1] ?? 1;

  return (
    <div className="flex flex-col gap-3">
      {sorted.map(([category, total]) => (
        <div key={category} className="flex items-center gap-3">
          <span
            className="w-24 shrink-0 truncate text-sm font-semibold sm:w-36"
            title={category}
          >
            {category}
          </span>
          <div
            className="h-6 flex-1 overflow-hidden rounded-full bg-background"
            role="img"
            aria-label={`${category}: ${formatCurrency(total)}`}
          >
            <div
              className="h-full rounded-full bg-brand"
              style={{ width: `${Math.max((total / max) * 100, 6)}%` }}
            />
          </div>
          <span className="w-20 shrink-0 text-right text-sm font-bold text-muted">
            {formatCurrency(total)}
          </span>
        </div>
      ))}
    </div>
  );
}
