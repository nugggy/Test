"use client";

import { useState } from "react";
import { useGoals } from "@/lib/goal-tracker-storage";
import { downloadCsv } from "@/lib/csv-export";
import GoalCard from "./GoalCard";
import PrintButton from "@/components/PrintButton";

export default function GoalTracker() {
  const { goals, addGoal, updateGoal, removeGoal } = useGoals();
  const [newGoal, setNewGoal] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    addGoal(newGoal);
    setNewGoal("");
  }

  function handleExportCsv() {
    downloadCsv(
      "goals",
      ["Goal", "Target date", "Steps done", "Total steps", "Notes"],
      goals.map((g) => [
        g.title,
        g.targetDate,
        g.steps.filter((s) => s.done).length,
        g.steps.length,
        g.notes,
      ])
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

      <form onSubmit={handleAdd} className="no-print flex gap-2">
        <label htmlFor="new-goal" className="sr-only">
          Add a goal
        </label>
        <input
          id="new-goal"
          type="text"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          placeholder="e.g. Learn to catch the bus by myself"
          maxLength={140}
          className="flex-1 rounded-xl border-2 border-border bg-surface px-4 py-3 touch-target"
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
          No goals yet — add your first one above.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onChange={(patch) => updateGoal(goal.id, patch)}
              onRemove={() => removeGoal(goal.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
