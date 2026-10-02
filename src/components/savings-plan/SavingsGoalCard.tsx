"use client";

import { useId, useState } from "react";
import { formatCurrency } from "@/lib/budget-data";
import {
  PAY_PERIODS,
  formatDateOnly,
  parseDollars,
  type PayPeriod,
} from "@/lib/budget-calc";
import { amountPerPeriod, savingsProgress, timeToReach } from "@/lib/savings-plan-calc";
import type { SavingsGoal, SavingsContribution } from "@/lib/savings-plan-storage";
import { getTodayDateString } from "@/lib/datetime";
import { useTimezone } from "@/lib/timezone-context";

interface SavingsGoalCardProps {
  goal: SavingsGoal;
  onChange: (patch: Partial<Omit<SavingsGoal, "id" | "contributions">>) => void;
  onRemove: () => void;
  onAddContribution: (data: Omit<SavingsContribution, "id">) => void;
  onRemoveContribution: (contributionId: string) => void;
}

const PERIOD_WORD: Record<PayPeriod, { one: string; many: string }> = {
  week: { one: "week", many: "weeks" },
  fortnight: { one: "fortnight", many: "fortnights" },
  month: { one: "month", many: "months" },
};

export default function SavingsGoalCard({
  goal,
  onChange,
  onRemove,
  onAddContribution,
  onRemoveContribution,
}: SavingsGoalCardProps) {
  const { timezone } = useTimezone();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [targetInput, setTargetInput] = useState(goal.targetAmount ? String(goal.targetAmount) : "");
  const [regularInput, setRegularInput] = useState(
    goal.regularAmount ? String(goal.regularAmount) : ""
  );
  const [message, setMessage] = useState("");
  const baseId = useId();

  const today = getTodayDateString(timezone);
  const progress = savingsProgress(goal.targetAmount, goal.contributions.map((c) => c.amount));
  const period = goal.regularPeriod;
  const words = PERIOD_WORD[period];
  const perPeriod = amountPerPeriod(progress.toGo, today, goal.targetDate, period);
  const eta = timeToReach(progress.toGo, goal.regularAmount, period, today);
  const datePassed = !!goal.targetDate && goal.targetDate < today && !progress.reached;

  function handleMoney(direction: 1 | -1) {
    const value = parseDollars(amount);
    if (value === null || value <= 0) return;
    onAddContribution({ date: today, amount: direction * value, note: note.trim() });
    setMessage(
      direction === 1
        ? `Added ${formatCurrency(value)} to ${goal.title || "this goal"}.`
        : `Took ${formatCurrency(value)} out of ${goal.title || "this goal"}.`
    );
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
          aria-label="Goal name"
        />
        <button
          type="button"
          onClick={() => {
            if (
              window.confirm(
                `Delete the goal "${goal.title || "goal"}" and everything saved in it? This can't be undone.`
              )
            ) {
              onRemove();
            }
          }}
          aria-label={`Delete goal "${goal.title || "goal"}"`}
          className="no-print touch-target shrink-0 rounded-xl border-2 border-border bg-background px-3"
        >
          <span aria-hidden="true">🗑️</span>
        </button>
      </div>

      <div className="mb-3 grid gap-2 sm:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block font-semibold text-muted">Goal amount ($)</span>
          <input
            type="text"
            inputMode="decimal"
            value={targetInput}
            onChange={(e) => {
              setTargetInput(e.target.value);
              onChange({ targetAmount: parseDollars(e.target.value) ?? 0 });
            }}
            placeholder="0.00"
            className="touch-target w-full rounded-lg border-2 border-border bg-background px-3"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-semibold text-muted">I want it by (optional)</span>
          <input
            type="date"
            value={goal.targetDate}
            onChange={(e) => onChange({ targetDate: e.target.value })}
            className="touch-target w-full rounded-lg border-2 border-border bg-background px-3"
          />
        </label>
      </div>

      <div className="mb-3 rounded-xl border-2 border-border bg-background p-3">
        <div className="mb-1 flex flex-wrap items-baseline justify-between gap-1">
          <span className="font-display text-xl font-bold">{formatCurrency(progress.saved)} saved</span>
          <span className="text-sm font-semibold text-muted">
            {progress.pct}% of {formatCurrency(goal.targetAmount)}
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={progress.pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${goal.title || "Savings goal"} progress`}
          className="h-6 w-full overflow-hidden rounded-full border-2 border-border bg-surface"
        >
          <div
            className="h-full rounded-full bg-brand transition-[width] motion-reduce:transition-none"
            style={{ width: `${progress.pct}%` }}
          />
        </div>
        <p className="mt-2 font-semibold">
          {progress.reached ? (
            <>
              <span aria-hidden="true">🎉 </span>You reached your goal!
            </>
          ) : goal.targetAmount > 0 ? (
            <>{formatCurrency(progress.toGo)} to go</>
          ) : (
            "Put in a goal amount to see how far you have to go."
          )}
        </p>
        {goal.targetDate && !progress.reached && (
          <p className="text-sm text-muted">
            {datePassed
              ? `Your date (${formatDateOnly(goal.targetDate)}) has passed. You can pick a new date.`
              : perPeriod
                ? `To reach it by ${formatDateOnly(goal.targetDate)}, put aside about ${formatCurrency(perPeriod.amount)} each ${words.one} (${perPeriod.periods} ${perPeriod.periods === 1 ? words.one : words.many} left).`
                : null}
          </p>
        )}
      </div>

      <div className="no-print mb-3 rounded-xl border-2 border-dashed border-border p-3">
        <p className="mb-2 text-sm font-semibold">How much can you put aside? (optional)</p>
        <div className="flex flex-wrap gap-2">
          <label className="sr-only" htmlFor={`${baseId}-regular`}>
            Amount I can put aside each {words.one}
          </label>
          <input
            id={`${baseId}-regular`}
            type="text"
            inputMode="decimal"
            value={regularInput}
            onChange={(e) => {
              setRegularInput(e.target.value);
              onChange({ regularAmount: parseDollars(e.target.value) ?? 0 });
            }}
            placeholder="$ amount"
            className="touch-target w-32 rounded-xl border-2 border-border bg-background px-3"
          />
          <div role="group" aria-label="How often" className="flex flex-1 flex-wrap gap-2">
            {PAY_PERIODS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onChange({ regularPeriod: p.id })}
                aria-pressed={period === p.id}
                className={`touch-target flex-1 rounded-xl border-2 px-2 text-sm font-semibold ${
                  period === p.id
                    ? "border-brand bg-brand text-brand-ink"
                    : "border-border bg-background"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        {eta && !progress.reached && (
          <p className="mt-2 text-sm">
            At {formatCurrency(goal.regularAmount)} each {words.one}, you would reach your goal
            in about {eta.periods} {eta.periods === 1 ? words.one : words.many} (around{" "}
            {formatDateOnly(eta.date)}).
          </p>
        )}
      </div>

      <div className="no-print mb-3 flex flex-wrap gap-2">
        <label className="sr-only" htmlFor={`${baseId}-amount`}>
          Amount
        </label>
        <input
          id={`${baseId}-amount`}
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="$ amount"
          className="touch-target w-32 flex-1 rounded-xl border-2 border-border bg-background px-3 py-2"
        />
        <label className="sr-only" htmlFor={`${baseId}-note`}>
          Note (optional)
        </label>
        <input
          id={`${baseId}-note`}
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={100}
          placeholder="Note (optional)"
          className="touch-target flex-[2] rounded-xl border-2 border-border bg-background px-3 py-2"
        />
        <div className="flex w-full gap-2">
          <button
            type="button"
            onClick={() => handleMoney(1)}
            className="touch-target flex-1 rounded-xl border-2 border-brand bg-brand px-4 font-semibold text-brand-ink"
          >
            <span aria-hidden="true">➕ </span>I saved this
          </button>
          <button
            type="button"
            onClick={() => handleMoney(-1)}
            className="touch-target flex-1 rounded-xl border-2 border-border bg-background px-4 font-semibold"
          >
            <span aria-hidden="true">➖ </span>I took this out
          </button>
        </div>
      </div>
      <p aria-live="polite" className="sr-only">
        {message}
      </p>

      {goal.contributions.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {goal.contributions.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between gap-2 rounded-lg border-2 border-border bg-background px-3 py-1.5 text-sm"
            >
              <span>
                <span className="font-semibold">
                  {c.amount < 0 ? `Took out ${formatCurrency(-c.amount)}` : `Saved ${formatCurrency(c.amount)}`}
                </span>{" "}
                · {formatDateOnly(c.date)}
                {c.note && ` · ${c.note}`}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Delete this entry?")) onRemoveContribution(c.id);
                }}
                aria-label={`Delete entry of ${formatCurrency(Math.abs(c.amount))} on ${formatDateOnly(c.date)}`}
                className="no-print touch-target grid shrink-0 place-items-center rounded-lg border-2 border-border bg-surface"
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
