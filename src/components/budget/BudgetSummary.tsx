"use client";

import { formatCurrency } from "@/lib/budget-data";
import { summariseTransactions } from "@/lib/budget-calc";
import type { BudgetTransaction } from "@/lib/budget-storage";

interface BudgetSummaryProps {
  transactions: BudgetTransaction[];
  rangeLabel: string;
}

export default function BudgetSummary({ transactions, rangeLabel }: BudgetSummaryProps) {
  const { income, expenses, balance } = summariseTransactions(transactions);

  return (
    <div>
      <h2 className="sr-only">Totals for {rangeLabel.toLowerCase()}</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border-2 border-border bg-surface p-4">
          <p className="text-sm font-semibold text-muted">
            <span aria-hidden="true">➕ </span>Money in
          </p>
          <p className="font-display text-2xl font-bold">{formatCurrency(income)}</p>
        </div>
        <div className="rounded-2xl border-2 border-border bg-surface p-4">
          <p className="text-sm font-semibold text-muted">
            <span aria-hidden="true">➖ </span>Money out
          </p>
          <p className="font-display text-2xl font-bold">{formatCurrency(expenses)}</p>
        </div>
        <div className="rounded-2xl border-2 border-border bg-surface p-4">
          <p className="text-sm font-semibold text-muted">Difference</p>
          <p
            className="font-display text-2xl font-bold"
            style={{ color: balance < 0 ? "var(--cat-pain)" : "var(--brand)" }}
          >
            {formatCurrency(balance)}
          </p>
          <p className="text-xs text-muted">
            {balance < 0
              ? "More money went out than came in."
              : balance > 0
                ? "More money came in than went out."
                : "Money in and out are the same."}
          </p>
        </div>
      </div>
    </div>
  );
}
