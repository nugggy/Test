"use client";

import { useState } from "react";
import { TIME_OF_DAY_GROUPS } from "@/lib/memory-aid-data";
import { useReminders, type TimeOfDay } from "@/lib/memory-aid-storage";
import EmojiPicker from "@/components/EmojiPicker";
import PrintButton from "@/components/PrintButton";

export default function MemoryAidBoard() {
  const { reminders, addReminder, removeReminder, toggleDone, resetForToday, clearAll } =
    useReminders();
  const [label, setLabel] = useState("");
  const [emoji, setEmoji] = useState("✨");
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("anytime");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!label.trim()) return;
    addReminder({ label, emoji, timeOfDay });
    setLabel("");
    setEmoji("✨");
  }

  const doneCount = reminders.filter((r) => r.done).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="no-print flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted">
          {reminders.length === 0
            ? "No reminders yet."
            : `${doneCount} of ${reminders.length} done today`}
        </p>
        <div className="flex gap-2">
          {reminders.length > 0 && (
            <button
              type="button"
              onClick={resetForToday}
              className="touch-target rounded-xl border-2 border-border bg-surface px-3 text-sm font-semibold hover:border-brand"
            >
              ↺ Reset for today
            </button>
          )}
          <PrintButton label="Print" />
        </div>
      </div>

      {reminders.length === 0 ? (
        <p className="rounded-xl border-2 border-dashed border-border p-6 text-center text-muted">
          Add your first reminder below - it&apos;ll show up here every day,
          grouped by time of day. It resets automatically each morning.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {TIME_OF_DAY_GROUPS.map((group) => {
            const groupReminders = reminders.filter((r) => r.timeOfDay === group.id);
            if (groupReminders.length === 0) return null;
            return (
              <div
                key={group.id}
                className="print-avoid-break rounded-2xl border-2 border-border bg-surface p-4"
              >
                <h2 className="font-display mb-3 text-lg font-bold">
                  <span aria-hidden="true">{group.icon}</span> {group.label}
                </h2>
                <ul className="flex flex-col gap-2">
                  {groupReminders.map((reminder) => (
                    <li
                      key={reminder.id}
                      className={`flex items-center gap-3 rounded-xl border-2 p-3 ${
                        reminder.done
                          ? "border-brand/40 bg-brand/5 opacity-70"
                          : "border-border bg-background"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleDone(reminder.id)}
                        aria-pressed={reminder.done}
                        aria-label={
                          reminder.done
                            ? `Mark ${reminder.label} as not done`
                            : `Mark ${reminder.label} as done`
                        }
                        className="touch-target flex flex-1 items-center gap-3 rounded-lg text-left"
                      >
                        <span aria-hidden="true" className="shrink-0 text-2xl">
                          {reminder.emoji}
                        </span>
                        <span className={`font-semibold ${reminder.done ? "line-through" : ""}`}>
                          {reminder.label}
                        </span>
                        {reminder.done && (
                          <span aria-hidden="true" className="ml-auto text-xl">
                            ✅
                          </span>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeReminder(reminder.id)}
                        aria-label={`Delete ${reminder.label}`}
                        className="no-print grid h-9 w-9 shrink-0 place-items-center rounded-lg border-2 border-border bg-surface"
                      >
                        <span aria-hidden="true">🗑️</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      <form
        onSubmit={handleAdd}
        className="no-print flex flex-col gap-4 rounded-2xl border-2 border-border bg-surface p-4"
      >
        <h2 className="font-display text-lg font-bold">Add a reminder</h2>
        <EmojiPicker value={emoji} onChange={setEmoji} label="Picture" />
        <div>
          <label htmlFor="reminder-label" className="mb-1 block font-semibold">
            Reminder
          </label>
          <input
            id="reminder-label"
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Take medication"
            maxLength={80}
            className="touch-target w-full rounded-xl border-2 border-border bg-background px-4 py-3"
          />
        </div>
        <div role="group" aria-label="Time of day" className="flex flex-wrap gap-2">
          {TIME_OF_DAY_GROUPS.map((group) => (
            <button
              key={group.id}
              type="button"
              onClick={() => setTimeOfDay(group.id)}
              aria-pressed={timeOfDay === group.id}
              className={`touch-target rounded-xl border-2 px-4 font-semibold ${
                timeOfDay === group.id
                  ? "border-brand bg-brand text-brand-ink"
                  : "border-border bg-background"
              }`}
            >
              <span aria-hidden="true">{group.icon}</span> {group.label}
            </button>
          ))}
        </div>
        <button
          type="submit"
          className="touch-target rounded-xl border-2 border-brand bg-brand font-semibold text-brand-ink"
        >
          + Add reminder
        </button>
      </form>

      {reminders.length > 0 && (
        <div className="no-print flex justify-end">
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Delete every reminder? This can't be undone.")) {
                clearAll();
              }
            }}
            className="text-sm font-semibold text-muted hover:text-foreground"
          >
            Delete all reminders
          </button>
        </div>
      )}
    </div>
  );
}
