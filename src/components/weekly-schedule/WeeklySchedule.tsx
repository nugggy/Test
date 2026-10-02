"use client";

import { useEffect, useState } from "react";
import { DAYS, useWeeklySchedule, type DayKey } from "@/lib/weekly-schedule-storage";
import { useTimezone } from "@/lib/timezone-context";
import ActivityPickerDialog from "@/components/weekly-schedule/ActivityPickerDialog";
import PrintButton from "@/components/PrintButton";

const WEEKDAYS: DayKey[] = ["mon", "tue", "wed", "thu", "fri"];
const BUTTON =
  "touch-target rounded-xl border-2 border-border bg-surface px-3 text-sm font-semibold disabled:opacity-30";

/** Today's day key in the chosen timezone (defaults to Australia/Sydney). */
function todayKey(timezone: string): DayKey | null {
  try {
    const short = new Intl.DateTimeFormat("en-AU", { timeZone: timezone, weekday: "short" })
      .format(new Date())
      .slice(0, 3)
      .toLowerCase();
    return (DAYS.find((d) => d.key === short)?.key ?? null) as DayKey | null;
  } catch {
    return null;
  }
}

export default function WeeklySchedule() {
  const {
    week,
    addItem,
    removeItem,
    toggleDone,
    resetAllDone,
    clearWeek,
    moveItem,
    copyDay,
  } = useWeeklySchedule();
  const { timezone } = useTimezone();
  const [pickerDay, setPickerDay] = useState<DayKey | null>(null);
  const [editing, setEditing] = useState(false);
  const [today, setToday] = useState<DayKey | null>(null);
  const [announcement, setAnnouncement] = useState("");

  // Work out "today" on the client only, and keep it right if the page is
  // left open past midnight.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToday(todayKey(timezone));
    const id = setInterval(() => setToday(todayKey(timezone)), 60_000);
    return () => clearInterval(id);
  }, [timezone]);

  const pickerDayLabel = pickerDay
    ? DAYS.find((d) => d.key === pickerDay)?.label ?? ""
    : "";
  const anyDone = DAYS.some((d) => week[d.key].some((item) => item.done));
  const anyItems = DAYS.some((d) => week[d.key].length > 0);

  function handleCopy(from: DayKey, choice: string) {
    if (!choice) return;
    const fromLabel = DAYS.find((d) => d.key === from)?.label ?? "";
    let targets: DayKey[];
    let targetLabel: string;
    if (choice === "weekdays") {
      targets = WEEKDAYS.filter((d) => d !== from);
      targetLabel = "the other weekdays";
    } else if (choice === "all") {
      targets = DAYS.map((d) => d.key).filter((d) => d !== from);
      targetLabel = "every other day";
    } else {
      targets = [choice as DayKey];
      targetLabel = DAYS.find((d) => d.key === choice)?.label ?? "";
    }
    const willReplace = targets.some((d) => week[d].length > 0);
    if (
      willReplace &&
      !window.confirm(
        `Copy ${fromLabel} to ${targetLabel}? This replaces what is already planned there.`
      )
    ) {
      return;
    }
    copyDay(from, targets);
    setAnnouncement(`Copied ${fromLabel} to ${targetLabel}.`);
  }

  return (
    <div className="flex flex-col gap-4">
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
      <div className="no-print flex flex-wrap justify-end gap-2">
        {today && (
          <a href={`#week-day-${today}`} className={`${BUTTON} inline-flex items-center`}>
            <span aria-hidden="true">📍</span>&nbsp;Go to today
          </a>
        )}
        <button
          type="button"
          onClick={() => setEditing((v) => !v)}
          aria-pressed={editing}
          className={`touch-target rounded-xl border-2 px-3 text-sm font-semibold ${
            editing ? "border-brand bg-brand text-brand-ink" : "border-border bg-surface"
          }`}
        >
          <span aria-hidden="true">✏️</span> {editing ? "Finish changing" : "Change order or copy days"}
        </button>
        <button type="button" onClick={resetAllDone} disabled={!anyDone} className={BUTTON}>
          <span aria-hidden="true">↺</span> Untick all
        </button>
        <button
          type="button"
          disabled={!anyItems}
          onClick={() => {
            if (window.confirm("Clear the whole week? This can't be undone.")) {
              clearWeek();
            }
          }}
          className={BUTTON}
        >
          Clear week
        </button>
        <PrintButton label="Print" />
      </div>
      <p className="no-print text-sm text-muted">
        Ticks clear by themselves at the start of each new week (Monday), so the
        same plan is ready to use again.
      </p>

      <div
        className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${
          editing ? "lg:grid-cols-3" : "xl:grid-cols-7"
        }`}
      >
        {DAYS.map((day) => {
          const isToday = day.key === today;
          const items = week[day.key];
          return (
            <section
              key={day.key}
              id={`week-day-${day.key}`}
              aria-label={`${day.label}${isToday ? ", today" : ""}`}
              className={`print-avoid-break flex scroll-mt-24 flex-col gap-2 rounded-2xl border-2 p-3 ${
                isToday ? "border-brand bg-brand-soft" : "border-border bg-surface"
              }`}
            >
              <h2 className="font-display flex flex-wrap items-center gap-2 font-bold">
                {day.label}
                {isToday && (
                  <span className="rounded-full bg-brand px-3 py-0.5 text-xs font-bold uppercase text-brand-ink">
                    Today
                  </span>
                )}
              </h2>
              {items.length === 0 ? (
                <p className="rounded-lg border-2 border-dashed border-border p-3 text-center text-sm text-muted">
                  Nothing planned
                </p>
              ) : (
                <ul className="flex flex-col gap-1.5">
                  {items.map((item, i) => (
                    <li
                      key={item.id}
                      className={`flex flex-col gap-1 rounded-lg border-2 p-1 text-sm ${
                        item.done
                          ? "border-border bg-surface-2 opacity-75"
                          : "border-border bg-background"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleDone(day.key, item.id)}
                        aria-pressed={item.done}
                        aria-label={
                          item.done
                            ? `${item.label}, ${day.label}, done. Tap to mark as not done`
                            : `${item.label}, ${day.label}. Tap to mark as done`
                        }
                        className="touch-target flex w-full items-center gap-2 rounded-lg px-2 text-left"
                      >
                        <span aria-hidden="true" className="shrink-0 text-2xl">
                          {item.icon}
                        </span>
                        <span className={`font-semibold ${item.done ? "line-through" : ""}`}>
                          {item.label}
                        </span>
                        {item.done && (
                          <span aria-hidden="true" className="ml-auto shrink-0">
                            ✅
                          </span>
                        )}
                      </button>
                      {editing && (
                        <div className="no-print flex flex-wrap gap-1">
                          <button
                            type="button"
                            onClick={() => moveItem(day.key, item.id, "up")}
                            disabled={i === 0}
                            aria-label={`Move ${item.label} earlier on ${day.label}`}
                            className={BUTTON}
                          >
                            <span aria-hidden="true">▲</span> Earlier
                          </button>
                          <button
                            type="button"
                            onClick={() => moveItem(day.key, item.id, "down")}
                            disabled={i === items.length - 1}
                            aria-label={`Move ${item.label} later on ${day.label}`}
                            className={BUTTON}
                          >
                            <span aria-hidden="true">▼</span> Later
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem(day.key, item.id)}
                            aria-label={`Remove ${item.label} from ${day.label}`}
                            className={BUTTON}
                          >
                            <span aria-hidden="true">✕</span> Remove
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              <button
                type="button"
                onClick={() => setPickerDay(day.key)}
                aria-label={`Add an activity to ${day.label}`}
                className="no-print touch-target mt-auto w-full rounded-xl border-2 border-dashed border-border bg-background px-2 text-sm font-semibold hover:border-brand"
              >
                <span aria-hidden="true">➕</span> Add
              </button>
              {editing && items.length > 0 && (
                <label className="no-print flex flex-col gap-1 text-sm font-semibold">
                  Copy {day.label} to
                  <select
                    value=""
                    onChange={(e) => handleCopy(day.key, e.target.value)}
                    className="touch-target rounded-xl border-2 border-border bg-surface px-2"
                  >
                    <option value="">Choose a day…</option>
                    {WEEKDAYS.includes(day.key) && (
                      <option value="weekdays">The other weekdays</option>
                    )}
                    <option value="all">Every other day</option>
                    {DAYS.filter((d) => d.key !== day.key).map((d) => (
                      <option key={d.key} value={d.key}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </section>
          );
        })}
      </div>

      <ActivityPickerDialog
        open={pickerDay !== null}
        dayLabel={pickerDayLabel}
        onClose={() => setPickerDay(null)}
        onSave={(activity) => {
          if (pickerDay) {
            addItem(pickerDay, activity);
            setAnnouncement(`Added ${activity.label} to ${pickerDayLabel}.`);
          }
          setPickerDay(null);
        }}
      />
    </div>
  );
}
