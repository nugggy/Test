"use client";

import { formatCurrency } from "@/lib/budget-data";
import { formatDateOnly } from "@/lib/budget-calc";
import type { BudgetTransaction } from "@/lib/budget-storage";

interface BudgetTransactionListProps {
  transactions: BudgetTransaction[];
  /** True if there are saved transactions, even if none are in the chosen dates. */
  hasAny: boolean;
  onRemove: (id: string) => void;
}

export default function BudgetTransactionList({
  transactions,
  hasAny,
  onRemove,
}: BudgetTransactionListProps) {
  if (transactions.length === 0) {
    return (
      <p className="rounded-xl border-2 border-dashed border-border p-6 text-center text-muted">
        {hasAny
          ? "Nothing saved in these dates. Try All time."
          : "Nothing saved yet. Use the form above to add the first one."}
      </p>
    );
  }

  const sorted = [...transactions].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <ul className="flex flex-col gap-2">
      {sorted.map((t) => (
        <li
          key={t.id}
          className="flex items-center gap-3 rounded-xl border-2 border-border bg-background p-3"
        >
          <span
            aria-hidden="true"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-black/10 text-sm"
            style={{
              background: t.type === "income" ? "var(--cat-activities)" : "var(--cat-food)",
              color: t.type === "income" ? "var(--cat-activities-ink)" : "var(--cat-food-ink)",
            }}
          >
            {t.type === "income" ? "＋" : "－"}
          </span>
          <div className="flex-1">
            <p className="font-semibold">
              <span className="sr-only">{t.type === "income" ? "Money in: " : "Money out: "}</span>
              {t.description}
            </p>
            <p className="text-sm text-muted">
              {t.category} · {formatDateOnly(t.date)}
            </p>
          </div>
          <span className="shrink-0 font-display text-lg font-bold">
            {t.type === "income" ? "+" : "-"}
            {formatCurrency(t.amount)}
          </span>
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Delete "${t.description}"?`)) onRemove(t.id);
            }}
            aria-label={`Delete ${t.description}`}
            className="no-print touch-target grid shrink-0 place-items-center rounded-lg border-2 border-border bg-surface"
          >
            <span aria-hidden="true">🗑️</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
