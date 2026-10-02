"use client";

import { useState } from "react";
import { useDailyTasks } from "@/lib/daily-life-storage";
import DailyTaskCard from "./DailyTaskCard";
import PrintButton from "@/components/PrintButton";
import { STARTER_TASKS } from "@/lib/daily-life-data";


export default function DailyLifeAssistant() {
  const { tasks, addTask, updateTask, removeTask, resetTaskSteps } = useDailyTasks();
  const [title, setTitle] = useState("");
  const [emoji, setEmoji] = useState("✅");
  const existingTitles = new Set(tasks.map((t) => t.title.trim().toLowerCase()));
  const starters = STARTER_TASKS.filter((s) => !existingTitles.has(s.title.toLowerCase()));

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    addTask(title, emoji);
    setTitle("");
    setEmoji("✅");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="no-print flex justify-end">
        <PrintButton />
      </div>

      <div className="rounded-2xl border-2 border-border bg-surface p-4">
        <h2 className="font-display mb-3 text-lg font-bold">Create a task</h2>
        <p className="mb-3 text-sm text-muted">
          Any everyday task you want step-by-step instructions for. Type a name, then add the steps.
        </p>
        <form onSubmit={handleAdd} className="no-print flex gap-2">
          <label htmlFor="task-emoji" className="sr-only">
            Icon
          </label>
          <input
            id="task-emoji"
            type="text"
            value={emoji}
            onChange={(e) => setEmoji(e.target.value.slice(0, 4))}
            maxLength={4}
            className="touch-target w-16 shrink-0 rounded-xl border-2 border-border bg-background px-2 text-center text-2xl"
          />
          <label htmlFor="task-title" className="sr-only">
            Task name
          </label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. How to do laundry"
            maxLength={140}
            className="flex-1 rounded-xl border-2 border-border bg-background px-4 py-3 touch-target"
          />
          <button
            type="submit"
            className="touch-target shrink-0 rounded-xl border-2 border-brand bg-brand px-4 font-semibold text-brand-ink"
          >
            Add task
          </button>
        </form>
        {starters.length > 0 && (
          <div className="no-print mt-4">
            <p className="mb-2 text-sm font-semibold">
              Or start with one of these. The steps are already filled in, and
              you can change them.
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {starters.map((s) => (
                <button
                  key={s.title}
                  type="button"
                  onClick={() => addTask(s.title, s.emoji, s.steps)}
                  className="touch-target flex items-center gap-3 rounded-xl border-2 border-border bg-background px-3 text-left font-semibold hover:border-brand"
                >
                  <span aria-hidden="true" className="text-2xl">
                    {s.emoji}
                  </span>
                  <span className="flex-1">{s.title}</span>
                  <span className="text-xs font-normal text-muted">{s.steps.length} steps</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {tasks.length === 0 ? (
        <p className="rounded-xl border-2 border-dashed border-border p-8 text-center text-muted">
          No tasks yet - add your first one above.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {tasks.map((task) => (
            <DailyTaskCard
              key={task.id}
              task={task}
              onChange={(patch) => updateTask(task.id, patch)}
              onReset={() => resetTaskSteps(task.id)}
              onRemove={() => removeTask(task.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
