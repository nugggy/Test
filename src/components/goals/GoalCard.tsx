"use client";

import type { Goal } from "@/lib/goal-tracker-storage";
import { goalProgress } from "@/lib/goal-tracker-calc";
import { formatDateOnly } from "@/lib/budget-calc";
import { getTodayDateString } from "@/lib/datetime";
import { useTimezone } from "@/lib/timezone-context";
import ChecklistSection from "@/components/ChecklistSection";

interface GoalCardProps {
  goal: Goal;
  categories?: string[];
  stepSuggestions?: string[];
  onChange: (patch: Partial<Omit<Goal, "id">>) => void;
  onRemove: () => void;
}

// Shared by Goal Tracker, Friendship Goal Planner and Fitness Plan - keep
// the props backward compatible.
export default function GoalCard({
  goal,
  categories,
  stepSuggestions,
  onChange,
  onRemove,
}: GoalCardProps) {
  const { timezone } = useTimezone();
  const today = getTodayDateString(timezone);
  const p = goalProgress(goal.steps, goal.targetDate, today);

  return (
    <div
      className={`print-avoid-break rounded-2xl border-2 bg-surface p-4 ${
        p.achieved ? "border-brand" : "border-border"
      }`}
    >
      <div className="mb-2 flex items-start gap-2">
        <input
          type="text"
          value={goal.title}
          onChange={(e) => onChange({ title: e.target.value })}
          maxLength={140}
          placeholder="Goal"
          className="touch-target flex-1 rounded-xl border-2 border-border bg-background px-3 text-base font-bold"
          aria-label="Goal"
        />
        <button
          type="button"
          onClick={() => {
            if (window.confirm(`Delete the goal "${goal.title || "goal"}" and its steps?`)) {
              onRemove();
            }
          }}
          aria-label={`Delete goal "${goal.title || "goal"}"`}
          className="no-print touch-target shrink-0 rounded-xl border-2 border-border bg-background px-3"
        >
          <span aria-hidden="true">🗑️</span>
        </button>
      </div>

      {goal.steps.length > 0 && (
        <div className="mb-3 rounded-xl border-2 border-border bg-background p-3" aria-live="polite">
          {p.achieved ? (
            <p className="font-display text-xl font-bold">
              <span aria-hidden="true">🏆 </span>Goal achieved! Well done.
            </p>
          ) : (
            <>
              <p className="text-sm font-semibold text-muted">
                {p.done} of {p.total} steps done
              </p>
              {p.nextStep && (
                <p className="mt-1 text-lg font-bold">
                  <span aria-hidden="true">👉 </span>Next step: {p.nextStep}
                </p>
              )}
            </>
          )}
          <div
            role="progressbar"
            aria-valuenow={p.pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${goal.title || "Goal"} progress`}
            className="mt-2 h-5 w-full overflow-hidden rounded-full border-2 border-border bg-surface"
          >
            <div
              className="h-full rounded-full bg-brand transition-[width] motion-reduce:transition-none"
              style={{ width: `${p.pct}%` }}
            />
          </div>
        </div>
      )}

      <div className="mb-3 grid gap-2 sm:grid-cols-2">
        {categories && categories.length > 0 && (
          <label className="text-sm">
            <span className="mb-1 block font-semibold text-muted">Category</span>
            <select
              value={goal.category}
              onChange={(e) => onChange({ category: e.target.value })}
              className="touch-target w-full rounded-lg border-2 border-border bg-background px-3"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="text-sm">
          <span className="mb-1 block font-semibold text-muted">Target date (optional)</span>
          <input
            type="date"
            value={goal.targetDate}
            onChange={(e) => onChange({ targetDate: e.target.value })}
            className="touch-target w-full rounded-lg border-2 border-border bg-background px-3"
          />
          {p.daysLeft !== null && !p.achieved && (
            <span className="mt-1 block text-sm font-semibold">
              {p.daysLeft > 0
                ? `${p.daysLeft} ${p.daysLeft === 1 ? "day" : "days"} to go (${formatDateOnly(goal.targetDate)})`
                : p.daysLeft === 0
                  ? "The target date is today"
                  : "The target date has passed. You can choose a new one."}
            </span>
          )}
        </label>
      </div>

      <ChecklistSection
        title="Steps"
        description="Small steps are easier. Add them in the order you will do them."
        placeholder="e.g. Look up bus timetables"
        items={goal.steps}
        suggestions={stepSuggestions}
        onChange={(steps) => onChange({ steps })}
      />

      <label className="mt-3 block text-sm">
        <span className="mb-1 block font-semibold text-muted">Notes</span>
        <textarea
          value={goal.notes}
          onChange={(e) => onChange({ notes: e.target.value })}
          rows={2}
          maxLength={500}
          placeholder="Anything else worth remembering about this goal"
          className="w-full rounded-lg border-2 border-border bg-background px-3 py-2"
        />
      </label>
    </div>
  );
}
