"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/budget-data";
import { totalSaved, type SavingsGoal, type SavingsContribution } from "@/lib/savings-plan-storage";

interface SavingsGoalCardProps {
  goal: SavingsGoal;
  onChange: (patch: Partial<Omit<SavingsGoal, "id" | "contributions">>) => void;
  onRemove: () => void;
  onAddContribution: (data: Omit<SavingsContribution, "id">) => void;
  onRemoveContribution: (contributionId: string) => void;
}

function todayKey() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function SavingsGoalCard({
  goal,
  onChange,
  onRemove,
  onAddContribution,
  onRemoveContribution,
}: SavingsGoalCardProps) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const saved = totalSaved(goal);
  const pct = goal.targetAmount > 0 ? Math.min(100, Math.round((saved / goal.targetAmount) * 100)) : 0;

  function handleAddContribution(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(amount);
    if (!value || value <= 0) return;
    onAddContribution({ date: todayKey(), amount: value, note: note.trim() });
    setAmount("");
    setNote("");
  }

  return (
    <div className="print-avoid-break rounded-2xl border-2 border-border bg-surface p-4">
      <div className="mb-2 flex items-start gap-2">
        <input
          type="text"
          value={goal.title}
          onChange={(e) => onChange({ title: e.target.value })}
          maxLength={140}
          placeholder="Savings goal"
          className="touch-target flex-1 rounded-xl border-2 border-border bg-background px-3 text-base font-bold"
          aria-label="Goal title"
        />
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove goal "${goal.title || "goal"}"`}
          className="no-print touch-target shrink-0 rounded-xl border-2 border-border bg-background px-3"
        >
          <span aria-hidden="true">🗑️</span>
        </button>
      </div>

      <div className="mb-3 grid gap-2 sm:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block font-semibold text-muted">Target amount</span>
          <input
            type="number"
            min={0}
            step={1}
            value={goal.targetAmount || ""}
            onChange={(e) => onChange({ targetAmount: Math.max(0, Number(e.target.value)) })}
            className="touch-target w-full rounded-lg border-2 border-border bg-background px-3"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-semibold text-muted">Target date (optional)</span>
          <input
            type="date"
            value={goal.targetDate}
            onChange={(e) => onChange({ targetDate: e.target.value })}
            className="touch-target w-full rounded-lg border-2 border-border bg-background px-3"
          />
        </label>
      </div>

      <div className="mb-3">
        <div className="mb-1 flex items-center justify-between text-sm font-semibold">
          <span>
            {formatCurrency(saved)} of {formatCurrency(goal.targetAmount)}
          </span>
          <span className="text-muted">{pct}%</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${goal.title || "Savings goal"} progress`}
          className="h-4 w-full overflow-hidden rounded-full border-2 border-border bg-background"
        >
          <div
            className="h-full rounded-full bg-brand transition-[width]"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleAddContribution} className="no-print mb-3 flex flex-wrap gap-2">
        <label className="sr-only" htmlFor={`contribution-amount-${goal.id}`}>
          Add money saved
        </label>
        <input
          id={`contribution-amount-${goal.id}`}
          type="number"
          min={0}
          step={0.01}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount saved"
          className="w-32 flex-1 rounded-xl border-2 border-border bg-background px-3 py-2 touch-target"
        />
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={100}
          placeholder="Note (optional)"
          className="flex-[2] rounded-xl border-2 border-border bg-background px-3 py-2 touch-target"
        />
        <button
          type="submit"
          className="touch-target shrink-0 rounded-xl border-2 border-brand bg-brand px-4 font-semibold text-brand-ink"
        >
          Add
        </button>
      </form>

      {goal.contributions.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {goal.contributions.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between gap-2 rounded-lg border-2 border-border bg-background px-3 py-1.5 text-sm"
            >
              <span>
                {formatCurrency(c.amount)} - {c.date}
                {c.note && ` - ${c.note}`}
              </span>
              <button
                type="button"
                onClick={() => onRemoveContribution(c.id)}
                aria-label={`Remove contribution of ${formatCurrency(c.amount)} on ${c.date}`}
                className="no-print shrink-0 text-muted hover:text-foreground"
              >
                <span aria-hidden="true">🗑️</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
