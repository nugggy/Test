"use client";

import { useState } from "react";
import type { DailyTask } from "@/lib/daily-life-storage";
import ChecklistSection from "@/components/ChecklistSection";
import EmojiPicker from "@/components/EmojiPicker";

interface DailyTaskCardProps {
  task: DailyTask;
  onChange: (patch: Partial<Omit<DailyTask, "id">>) => void;
  onReset: () => void;
  onRemove: () => void;
}

export default function DailyTaskCard({
  task,
  onChange,
  onReset,
  onRemove,
}: DailyTaskCardProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const doneCount = task.steps.filter((s) => s.done).length;
  const allDone = task.steps.length > 0 && doneCount === task.steps.length;

  return (
    <div className="print-avoid-break rounded-2xl border-2 border-border bg-surface p-4">
      <div className="mb-2 flex items-start gap-2">
        <button
          type="button"
          onClick={() => setPickerOpen((v) => !v)}
          aria-expanded={pickerOpen}
          aria-label="Change icon"
          className="no-print touch-target w-16 shrink-0 rounded-xl border-2 border-border bg-background text-2xl"
        >
          {task.emoji}
        </button>
        <span aria-hidden="true" className="hidden print:block text-2xl">
          {task.emoji}
        </span>
        <input
          type="text"
          value={task.title}
          onChange={(e) => onChange({ title: e.target.value })}
          maxLength={140}
          placeholder="Task"
          aria-label="Task name"
          className="touch-target flex-1 rounded-xl border-2 border-border bg-background px-3 text-base font-bold"
        />
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove task "${task.title}"`}
          className="no-print touch-target shrink-0 rounded-xl border-2 border-border bg-background px-3"
        >
          <span aria-hidden="true">🗑️</span>
        </button>
      </div>

      {pickerOpen && (
        <div className="no-print mb-3">
          <EmojiPicker
            value={task.emoji}
            onChange={(emoji) => {
              onChange({ emoji });
              setPickerOpen(false);
            }}
          />
        </div>
      )}

      {task.steps.length > 0 && (
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-muted">
            {allDone ? "All done! 🎉" : `${doneCount} of ${task.steps.length} steps done`}
          </p>
          {allDone && (
            <button
              type="button"
              onClick={onReset}
              className="no-print touch-target rounded-xl border-2 border-border bg-background px-3 text-sm font-semibold hover:border-brand"
            >
              Reset for next time
            </button>
          )}
        </div>
      )}

      <ChecklistSection
        title="Steps"
        description="Break the task into small, ordered steps"
        placeholder="e.g. Put clothes in the machine"
        items={task.steps}
        onChange={(steps) => onChange({ steps })}
      />
    </div>
  );
}
