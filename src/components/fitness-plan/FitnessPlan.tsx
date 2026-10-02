"use client";

import { useState } from "react";
import { useFitnessGoals, FITNESS_CATEGORIES } from "@/lib/fitness-plan-storage";
import { formatFitnessDate, useFitnessLog, weekSummary } from "@/lib/fitness-log-storage";
import { getTodayDateString } from "@/lib/datetime";
import { useTimezone } from "@/lib/timezone-context";
import { downloadCsv } from "@/lib/csv-export";
import GoalCard from "@/components/goals/GoalCard";
import FitnessLogForm from "./FitnessLogForm";
import FitnessTrendChart from "./FitnessTrendChart";
import FitnessLogList from "./FitnessLogList";
import PrintButton from "@/components/PrintButton";

const STEP_SUGGESTIONS = [
  "Walk for 10 minutes",
  "Try a home workout video",
  "Stretch for 5 minutes",
  "Go to a class",
  "Ask my support worker to join me",
];

export default function FitnessPlan() {
  const { goals, addGoal, updateGoal, removeGoal } = useFitnessGoals();
  const { entries, addEntry, removeEntry, clearAll } = useFitnessLog();
  const [newGoal, setNewGoal] = useState("");
  const { timezone } = useTimezone();
  const week = weekSummary(entries, getTodayDateString(timezone));

  function handleAddGoal(e: React.FormEvent) {
    e.preventDefault();
    addGoal(newGoal);
    setNewGoal("");
  }

  function handleExportCsv() {
    downloadCsv(
      "fitness-log",
      ["Date", "Activity", "Duration (minutes)", "Notes"],
      [...entries]
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((e) => [formatFitnessDate(e.date), e.activity, e.durationMinutes, e.notes])
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="no-print flex justify-end">
        <PrintButton />
      </div>

      <div>
        <h2 className="font-display mb-3 text-lg font-bold">My fitness goals</h2>
        <form onSubmit={handleAddGoal} className="no-print mb-3 flex gap-2">
          <label htmlFor="new-fitness-goal" className="sr-only">
            Add a fitness goal
          </label>
          <input
            id="new-fitness-goal"
            type="text"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="e.g. Walk 20 minutes, 3 times a week"
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
            No goals yet - add your first one above.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                categories={FITNESS_CATEGORIES}
                stepSuggestions={STEP_SUGGESTIONS}
                onChange={(patch) => updateGoal(goal.id, patch)}
                onRemove={() => removeGoal(goal.id)}
              />
            ))}
          </div>
        )}
      </div>

      <FitnessLogForm onSave={addEntry} />

      <div className="rounded-2xl border-2 border-border bg-surface p-4">
        <h2 className="font-display mb-3 text-lg font-bold">Progress</h2>
        <div className="mb-4 grid grid-cols-3 gap-2">
          <div className="rounded-xl border-2 border-border bg-background p-3">
            <p className="text-xs font-semibold text-muted">Sessions this week</p>
            <p className="font-display text-2xl font-bold">{week.sessions}</p>
          </div>
          <div className="rounded-xl border-2 border-border bg-background p-3">
            <p className="text-xs font-semibold text-muted">Minutes this week</p>
            <p className="font-display text-2xl font-bold">{week.minutes}</p>
          </div>
          <div className="rounded-xl border-2 border-border bg-background p-3">
            <p className="text-xs font-semibold text-muted">Active days this week</p>
            <p className="font-display text-2xl font-bold">{week.activeDays}</p>
          </div>
        </div>
        <p className="mb-3 text-xs text-muted">
          This week is Monday {formatFitnessDate(week.start)} to Sunday {formatFitnessDate(week.end)}.
        </p>
        <FitnessTrendChart entries={entries} />
      </div>

      <div className="rounded-2xl border-2 border-border bg-surface p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-bold">Session log</h2>
          {entries.length > 0 && (
            <div className="no-print flex items-center gap-3">
              <button
                type="button"
                onClick={handleExportCsv}
                className="touch-target rounded-xl border-2 border-border bg-background px-3 text-sm font-semibold hover:border-brand"
              >
                ⬇️ Download CSV
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Clear all logged sessions? This can't be undone.")) {
                    clearAll();
                  }
                }}
                className="touch-target rounded-xl border-2 border-border bg-background px-3 text-sm font-semibold text-muted hover:text-foreground"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
        <FitnessLogList entries={entries} onRemove={removeEntry} />
      </div>
    </div>
  );
}
