"use client";

import { useState } from "react";
import { useGoals } from "@/lib/goal-tracker-storage";
import { goalProgress } from "@/lib/goal-tracker-calc";
import { downloadCsv } from "@/lib/csv-export";
import { getTodayDateString } from "@/lib/datetime";
import { useTimezone } from "@/lib/timezone-context";
import GoalCard from "./GoalCard";
import PrintButton from "@/components/PrintButton";

const GOAL_SUGGESTIONS = [
  "Catch the bus by myself",
  "Cook a meal by myself",
  "Look after my own money",
  "Make a new friend",
  "Find a job or volunteer role",
  "Join a club or group",
];

const STEP_SUGGESTIONS = [
  "Find out what I need to do",
  "Ask someone to help me",
  "Practise with support",
  "Try it by myself",
  "Keep doing it each week",
];

export default function GoalTracker() {
  const { goals, addGoal, updateGoal, removeGoal } = useGoals();
  const { timezone } = useTimezone();
  const [newGoal, setNewGoal] = useState("");
  const today = getTodayDateString(timezone);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    addGoal(newGoal);
    setNewGoal("");
  }

  function handleExportCsv() {
    downloadCsv(
      "goals",
      ["Goal", "Status", "Target date", "Steps done", "Total steps", "Next step", "Notes"],
      goals.map((g) => {
        const p = goalProgress(g.steps, g.targetDate, today);
        return [
          g.title,
          p.achieved ? "Achieved" : "Working on it",
          g.targetDate,
          p.done,
          p.total,
          p.nextStep ?? "",
          g.notes,
        ];
      })
    );
  }

  const withProgress = goals.map((goal) => ({
    goal,
    achieved: goalProgress(goal.steps, goal.targetDate, today).achieved,
  }));
  const working = withProgress.filter((g) => !g.achieved);
  const achieved = withProgress.filter((g) => g.achieved);
  const unusedSuggestions = GOAL_SUGGESTIONS.filter(
    (s) => !goals.some((g) => g.title.trim().toLowerCase() === s.toLowerCase())
  );

  function renderCard(goal: (typeof goals)[number]) {
    return (
      <GoalCard
        key={goal.id}
        goal={goal}
        stepSuggestions={STEP_SUGGESTIONS}
        onChange={(patch) => updateGoal(goal.id, patch)}
        onRemove={() => removeGoal(goal.id)}
      />
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

      <div className="no-print rounded-2xl border-2 border-border bg-surface p-4">
        <form onSubmit={handleAdd} className="flex gap-2">
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
            className="touch-target flex-1 rounded-xl border-2 border-border bg-background px-4 py-3"
          />
          <button
            type="submit"
            className="touch-target shrink-0 rounded-xl border-2 border-brand bg-brand px-4 font-semibold text-brand-ink"
          >
            Add goal
          </button>
        </form>
        {unusedSuggestions.length > 0 && (
          <>
            <p className="mb-2 mt-3 text-sm font-semibold">Or tap an idea:</p>
            <div className="flex flex-wrap gap-2">
              {unusedSuggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addGoal(s)}
                  className="touch-target rounded-xl border-2 border-border bg-background px-3 text-sm font-semibold hover:border-brand"
                >
                  {s}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {goals.length === 0 ? (
        <p className="rounded-xl border-2 border-dashed border-border p-8 text-center text-muted">
          No goals yet. Add your first one above.
        </p>
      ) : (
        <>
          {working.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="font-display text-lg font-bold">
                Working on ({working.length})
              </h2>
              {working.map(({ goal }) => renderCard(goal))}
            </section>
          )}
          {achieved.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="font-display text-lg font-bold">
                <span aria-hidden="true">🏆 </span>Achieved ({achieved.length})
              </h2>
              {achieved.map(({ goal }) => renderCard(goal))}
            </section>
          )}
        </>
      )}
    </div>
  );
}
