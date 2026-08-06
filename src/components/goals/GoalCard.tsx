"use client";

import type { Goal } from "@/lib/goal-tracker-storage";
import ChecklistSection from "@/components/ChecklistSection";

interface GoalCardProps {
  goal: Goal;
  categories?: string[];
  stepSuggestions?: string[];
  onChange: (patch: Partial<Omit<Goal, "id">>) => void;
  onRemove: () => void;
}

export default function GoalCard({
  goal,
  categories,
  stepSuggestions,
  onChange,
  onRemove,
}: GoalCardProps) {
  const doneCount = goal.steps.filter((s) => s.done).length;

  return (
    <div className="print-avoid-break rounded-2xl border-2 border-border bg-surface p-4">
      <div className="mb-2 flex items-start gap-2">
        <input
          type="text"
          value={goal.title}
          onChange={(e) => onChange({ title: e.target.value })}
          maxLength={140}
          placeholder="Goal"
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
        </label>
      </div>

      {goal.steps.length > 0 && (
        <p className="mb-2 text-sm font-semibold text-muted">
          {doneCount} of {goal.steps.length} steps done
        </p>
      )}

      <ChecklistSection
        title="Steps"
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
