"use client";

import { formatCurrency } from "@/lib/budget-data";
import type { BudgetTransaction } from "@/lib/budget-storage";

interface BudgetSummaryProps {
  transactions: BudgetTransaction[];
}

export default function BudgetSummary({ transactions }: BudgetSummaryProps) {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expenses;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div className="rounded-2xl border-2 border-border bg-surface p-4">
        <p className="text-sm font-semibold text-muted">Income</p>
        <p className="font-display text-2xl font-bold">{formatCurrency(income)}</p>
      </div>
      <div className="rounded-2xl border-2 border-border bg-surface p-4">
        <p className="text-sm font-semibold text-muted">Expenses</p>
        <p className="font-display text-2xl font-bold">{formatCurrency(expenses)}</p>
      </div>
      <div className="rounded-2xl border-2 border-border bg-surface p-4">
        <p className="text-sm font-semibold text-muted">Balance</p>
        <p
          className="font-display text-2xl font-bold"
          style={{ color: balance < 0 ? "var(--cat-pain)" : "var(--brand)" }}
        >
          {formatCurrency(balance)}
        </p>
      </div>
    </div>
  );
}
