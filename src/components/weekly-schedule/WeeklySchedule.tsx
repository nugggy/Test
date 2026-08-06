"use client";

import { useState } from "react";
import { DAYS, useWeeklySchedule, type DayKey } from "@/lib/weekly-schedule-storage";
import ActivityPickerDialog from "@/components/weekly-schedule/ActivityPickerDialog";
import PrintButton from "@/components/PrintButton";

export default function WeeklySchedule() {
  const { week, addItem, removeItem, toggleDone, resetAllDone, clearWeek } =
    useWeeklySchedule();
  const [pickerDay, setPickerDay] = useState<DayKey | null>(null);

  const pickerDayLabel = pickerDay
    ? DAYS.find((d) => d.key === pickerDay)?.label ?? ""
    : "";

  return (
    <div className="flex flex-col gap-4">
      <div className="no-print flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={resetAllDone}
          className="touch-target rounded-xl border-2 border-border bg-surface px-3 text-sm font-semibold"
        >
          Reset all ticks
        </button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Clear the whole week? This can't be undone.")) {
              clearWeek();
            }
          }}
          className="touch-target rounded-xl border-2 border-border bg-surface px-3 text-sm font-semibold"
        >
          Clear week
        </button>
        <PrintButton label="Print" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-7">
        {DAYS.map((day) => (
          <div
            key={day.key}
            className="flex flex-col rounded-2xl border-2 border-border bg-surface p-3"
          >
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-display font-bold">{day.label}</h2>
              <button
                type="button"
                onClick={() => setPickerDay(day.key)}
                aria-label={`Add activity to ${day.label}`}
                className="no-print grid h-9 w-9 shrink-0 place-items-center rounded-lg border-2 border-border bg-background hover:border-brand"
              >
                <span aria-hidden="true">➕</span>
              </button>
            </div>
            {week[day.key].length === 0 ? (
              <p className="flex-1 rounded-lg border-2 border-dashed border-border p-3 text-center text-xs text-muted">
                Nothing yet
              </p>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {week[day.key].map((item) => (
                  <li
                    key={item.id}
                    className={`flex items-center gap-2 rounded-lg border-2 p-2 text-sm ${
                      item.done
                        ? "border-brand/40 bg-brand/5 opacity-70"
                        : "border-border bg-background"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleDone(day.key, item.id)}
                      aria-pressed={item.done}
                      aria-label={
                        item.done
                          ? `Mark ${item.label} as not done`
                          : `Mark ${item.label} as done`
                      }
                      className="flex flex-1 items-center gap-2 text-left"
                    >
                      <span aria-hidden="true">{item.icon}</span>
                      <span
                        className={`font-semibold ${item.done ? "line-through" : ""}`}
                      >
                        {item.label}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(day.key, item.id)}
                      aria-label={`Remove ${item.label} from ${day.label}`}
                      className="no-print shrink-0 text-muted hover:text-foreground"
                    >
                      <span aria-hidden="true">✕</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <ActivityPickerDialog
        open={pickerDay !== null}
        dayLabel={pickerDayLabel}
        onClose={() => setPickerDay(null)}
        onSave={(activity) => {
          if (pickerDay) addItem(pickerDay, activity);
          setPickerDay(null);
        }}
      />
    </div>
  );
}
