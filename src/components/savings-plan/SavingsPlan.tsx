"use client";

import { useState } from "react";
import { useSavingsGoals, totalSaved } from "@/lib/savings-plan-storage";
import { downloadCsv } from "@/lib/csv-export";
import SavingsGoalCard from "./SavingsGoalCard";
import PrintButton from "@/components/PrintButton";

export default function SavingsPlan() {
  const {
    goals,
    addGoal,
    updateGoal,
    removeGoal,
    addContribution,
    removeContribution,
  } = useSavingsGoals();
  const [newTitle, setNewTitle] = useState("");
  const [newTarget, setNewTarget] = useState("");

  function handleAddGoal(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addGoal(newTitle, Number(newTarget) || 0);
    setNewTitle("");
    setNewTarget("");
  }

  function handleExportCsv() {
    downloadCsv(
      "savings-plan",
      ["Goal", "Target amount", "Saved so far", "Contribution date", "Contribution amount", "Note"],
      goals.flatMap((g) =>
        g.contributions.length > 0
          ? g.contributions.map((c) => [
              g.title,
              g.targetAmount,
              totalSaved(g),
              c.date,
              c.amount,
              c.note,
            ])
          : [[g.title, g.targetAmount, totalSaved(g), "", "", ""]]
      )
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="no-print flex justify-end gap-2">
        {goals.length > 0 && (
          <button
            type="button"
            onClick={handleExportCsv}
            className="touch-target rounded-xl border-2 border-border bg-surface px-3 text-sm font-semibold hover:border-brand"
          >
            ⬇️ Download CSV
          </button>
        )}
        <PrintButton />
      </div>

      <form onSubmit={handleAddGoal} className="no-print flex flex-wrap gap-2">
        <label htmlFor="new-savings-goal" className="sr-only">
          Add a savings goal
        </label>
        <input
          id="new-savings-goal"
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="e.g. New wheelchair, Holiday, Emergency fund"
          maxLength={140}
          className="min-w-[200px] flex-[2] rounded-xl border-2 border-border bg-surface px-4 py-3 touch-target"
        />
        <input
          type="number"
          min={0}
          value={newTarget}
          onChange={(e) => setNewTarget(e.target.value)}
          placeholder="Target amount"
          className="w-40 flex-1 rounded-xl border-2 border-border bg-surface px-4 py-3 touch-target"
        />
        <button
          type="submit"
          className="touch-target shrink-0 rounded-xl border-2 border-brand bg-brand px-4 font-semibold text-brand-ink"
        >
          Add goal
        </button>
      </form>

      {goals.length === 0 ? (
        <p className="rounded-xl border-2 border-dashed border-border p-8 text-center text-muted">
          No savings goals yet - add your first one above.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {goals.map((goal) => (
            <SavingsGoalCard
              key={goal.id}
              goal={goal}
              onChange={(patch) => updateGoal(goal.id, patch)}
              onRemove={() => removeGoal(goal.id)}
              onAddContribution={(data) => addContribution(goal.id, data)}
              onRemoveContribution={(contributionId) => removeContribution(goal.id, contributionId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
