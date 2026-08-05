"use client";

import { useBudgetTransactions } from "@/lib/budget-storage";
import BudgetForm from "@/components/budget/BudgetForm";
import BudgetSummary from "@/components/budget/BudgetSummary";
import WeeklyBudgetPlan from "@/components/budget/WeeklyBudgetPlan";
import BudgetCategoryChart from "@/components/budget/BudgetCategoryChart";
import BudgetTransactionList from "@/components/budget/BudgetTransactionList";

export default function BudgetTracker() {
  const { transactions, addTransaction, removeTransaction, clearAll } =
    useBudgetTransactions();

  return (
    <div className="flex flex-col gap-6">
      <BudgetSummary transactions={transactions} />
      <WeeklyBudgetPlan />
      <BudgetForm onSave={addTransaction} />

      <div className="rounded-2xl border-2 border-border bg-surface p-4">
        <h2 className="font-display mb-3 text-lg font-bold">
          Spending by category
        </h2>
        <BudgetCategoryChart transactions={transactions} />
      </div>

      <div className="rounded-2xl border-2 border-border bg-surface p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Transactions</h2>
          {transactions.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    "Clear all transactions? This can't be undone."
                  )
                ) {
                  clearAll();
                }
              }}
              className="no-print text-sm font-semibold text-muted hover:text-foreground"
            >
              Clear all
            </button>
          )}
        </div>
        <BudgetTransactionList transactions={transactions} onRemove={removeTransaction} />
      </div>
    </div>
  );
}
