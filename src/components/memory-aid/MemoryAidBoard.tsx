"use client";

import { useEffect, useState } from "react";
import { TIME_OF_DAY_GROUPS, currentTimeOfDay } from "@/lib/memory-aid-data";
import { useReminders, type TimeOfDay } from "@/lib/memory-aid-storage";
import { useTimezone } from "@/lib/timezone-context";
import { getHourInTimezone } from "@/lib/datetime";
import { useSpeech } from "@/lib/use-speech";
import EmojiPicker from "@/components/EmojiPicker";
import PrintButton from "@/components/PrintButton";

const SMALL_BUTTON =
  "touch-target rounded-xl border-2 border-border bg-surface px-3 text-sm font-semibold disabled:opacity-30";

function formatToday(date: Date, timezone: string): string {
  try {
    return new Intl.DateTimeFormat("en-AU", {
      timeZone: timezone,
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {
    return new Intl.DateTimeFormat("en-AU", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  }
}

export default function MemoryAidBoard() {
  const {
    reminders,
    addReminder,
    removeReminder,
    toggleDone,
    moveReminder,
    resetForToday,
    clearAll,
    hydrated,
  } = useReminders();
  const { timezone } = useTimezone();
  const { speak, supported: speechSupported } = useSpeech();
  const [label, setLabel] = useState("");
  const [emoji, setEmoji] = useState("✨");
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("anytime");
  const [editing, setEditing] = useState(false);
  const [now, setNow] = useState<Date | null>(null);

  // Read the clock only on the client (avoids a server/client mismatch),
  // then refresh each minute so "Today is..." and the "Now" group stay right
  // on a screen left open all day.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const currentGroup = now ? currentTimeOfDay(getHourInTimezone(now.toISOString(), timezone)) : null;
  const showEditor = editing || (hydrated && reminders.length === 0);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!label.trim()) return;
    addReminder({ label, emoji, timeOfDay });
    setLabel("");
    setEmoji("✨");
  }

  const doneCount = reminders.filter((r) => r.done).length;
  const allDone = reminders.length > 0 && doneCount === reminders.length;

  function readOutLeft() {
    const left = reminders.filter((r) => !r.done);
    if (left.length === 0) {
      speak("Everything is done for today. Well done.");
      return;
    }
    speak(`Still to do today: ${left.map((r) => r.label).join(". ")}.`);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border-2 border-brand bg-brand-soft p-4">
        <p className="font-display text-xl font-bold sm:text-2xl">
          {now ? `Today is ${formatToday(now, timezone)}` : "Today"}
        </p>
        <p aria-live="polite" className="mt-1 font-semibold">
          {reminders.length === 0
            ? "No reminders yet."
            : allDone
              ? "🎉 All done for today. Well done!"
              : `${doneCount} of ${reminders.length} done today`}
        </p>
        <p className="mt-1 text-sm text-muted">
          The ticks clear by themselves after midnight, ready for a new day.
        </p>
      </div>

      <div className="no-print flex flex-wrap items-center justify-end gap-2">
        {speechSupported && reminders.length > 0 && (
          <button type="button" onClick={readOutLeft} className={SMALL_BUTTON}>
            <span aria-hidden="true">🔊</span> Read out what&apos;s left
          </button>
        )}
        {reminders.length > 0 && (
          <button
            type="button"
            onClick={() => setEditing((v) => !v)}
            aria-pressed={editing}
            className={`touch-target rounded-xl border-2 px-3 text-sm font-semibold ${
              editing ? "border-brand bg-brand text-brand-ink" : "border-border bg-surface"
            }`}
          >
            <span aria-hidden="true">✏️</span> {editing ? "Finish changing" : "Change reminders"}
          </button>
        )}
        {doneCount > 0 && (
          <button type="button" onClick={resetForToday} className={SMALL_BUTTON}>
            <span aria-hidden="true">↺</span> Untick all
          </button>
        )}
        <PrintButton label="Print" />
      </div>

      {reminders.length === 0 ? (
        <p className="rounded-xl border-2 border-dashed border-border p-6 text-center text-muted">
          Add your first reminder below. It will show here every day, grouped by
          time of day, and the ticks clear by themselves each night.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {TIME_OF_DAY_GROUPS.map((group) => {
            const groupReminders = reminders.filter((r) => r.timeOfDay === group.id);
            if (groupReminders.length === 0) return null;
            const isNow = group.id === currentGroup;
            return (
              <section
                key={group.id}
                aria-label={`${group.label}${isNow ? ", now" : ""}`}
                className={`print-avoid-break rounded-2xl border-2 p-4 ${
                  isNow ? "border-brand bg-surface" : "border-border bg-surface"
                }`}
              >
                <h2 className="font-display mb-3 flex flex-wrap items-center gap-2 text-lg font-bold">
                  <span aria-hidden="true">{group.icon}</span> {group.label}
                  {isNow && (
                    <span className="rounded-full bg-brand px-3 py-0.5 text-xs font-bold uppercase text-brand-ink">
                      Now
                    </span>
                  )}
                </h2>
                <ul className="flex flex-col gap-2">
                  {groupReminders.map((reminder, i) => (
                    <li
                      key={reminder.id}
                      className={`flex flex-col gap-2 rounded-xl border-2 p-3 ${
                        reminder.done
                          ? "border-border bg-surface-2 opacity-75"
                          : "border-border bg-background"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleDone(reminder.id)}
                        aria-pressed={reminder.done}
                        aria-label={
                          reminder.done
                            ? `${reminder.label}, done. Tap to mark as not done`
                            : `${reminder.label}. Tap to mark as done`
                        }
                        className="touch-target flex flex-1 items-center gap-3 rounded-lg text-left"
                      >
                        <span
                          aria-hidden="true"
                          className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg border-2 text-xl ${
                            reminder.done ? "border-brand bg-brand text-brand-ink" : "border-border-strong bg-surface"
                          }`}
                        >
                          {reminder.done ? "✓" : ""}
                        </span>
                        <span aria-hidden="true" className="shrink-0 text-3xl">
                          {reminder.emoji}
                        </span>
                        <span
                          className={`text-lg font-semibold ${reminder.done ? "line-through" : ""}`}
                        >
                          {reminder.label}
                        </span>
                      </button>
                      {editing && (
                        <div className="no-print flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => moveReminder(reminder.id, "up")}
                            disabled={i === 0}
                            aria-label={`Move ${reminder.label} up`}
                            className={SMALL_BUTTON}
                          >
                            <span aria-hidden="true">▲</span> Up
                          </button>
                          <button
                            type="button"
                            onClick={() => moveReminder(reminder.id, "down")}
                            disabled={i === groupReminders.length - 1}
                            aria-label={`Move ${reminder.label} down`}
                            className={SMALL_BUTTON}
                          >
                            <span aria-hidden="true">▼</span> Down
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete the reminder "${reminder.label}"?`)) {
                                removeReminder(reminder.id);
                              }
                            }}
                            aria-label={`Delete ${reminder.label}`}
                            className={SMALL_BUTTON}
                          >
                            <span aria-hidden="true">🗑️</span> Delete
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}

      {showEditor && (
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
          <fieldset>
            <legend className="mb-1 font-semibold">When?</legend>
            <div className="flex flex-wrap gap-2">
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
          </fieldset>
          <button
            type="submit"
            className="touch-target rounded-xl border-2 border-brand bg-brand font-semibold text-brand-ink"
          >
            + Add reminder
          </button>
        </form>
      )}

      {editing && reminders.length > 0 && (
        <div className="no-print flex justify-end">
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Delete every reminder? This can't be undone.")) {
                clearAll();
                setEditing(false);
              }
            }}
            className="touch-target rounded-xl border-2 border-border bg-surface px-3 text-sm font-semibold"
          >
            Delete all reminders
          </button>
        </div>
      )}
    </div>
  );
}
