"use client";

import { useState } from "react";
import { ACTIVITY_LIBRARY } from "@/lib/visual-schedule-data";
import { useScheduleItems } from "@/lib/visual-schedule-storage";
import AddActivityDialog from "@/components/visual-schedule/AddActivityDialog";
import ScheduleList from "@/components/visual-schedule/ScheduleList";
import PrintButton from "@/components/PrintButton";

export default function VisualSchedule() {
  const {
    items,
    addItem,
    removeItem,
    toggleDone,
    moveItem,
    resetDone,
    clearAll,
  } = useScheduleItems();
  const [dialogOpen, setDialogOpen] = useState(false);

  const doneCount = items.filter((item) => item.done).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="no-print rounded-2xl border-2 border-border bg-surface p-4">
        <h2 className="font-display mb-3 text-lg font-bold">Add an activity</h2>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
          {ACTIVITY_LIBRARY.map((activity) => (
            <button
              key={activity.id}
              type="button"
              onClick={() => addItem(activity)}
              className="touch-target flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-border bg-background p-2 text-center hover:border-brand"
            >
              <span aria-hidden="true" className="text-2xl">
                {activity.icon}
              </span>
              <span className="text-xs font-semibold leading-tight">
                {activity.label}
              </span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="touch-target flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border bg-background p-2 text-center hover:border-brand"
          >
            <span aria-hidden="true" className="text-2xl">
              ➕
            </span>
            <span className="text-xs font-semibold leading-tight">
              Add your own
            </span>
          </button>
        </div>
      </div>

      <div className="rounded-2xl border-2 border-border bg-surface p-4">
        <div className="no-print mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold">Today&apos;s schedule</h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={resetDone}
              disabled={items.length === 0}
              className="touch-target rounded-xl border-2 border-border bg-background px-3 text-sm font-semibold disabled:opacity-40"
            >
              Reset ticks
            </button>
            <button
              type="button"
              onClick={clearAll}
              disabled={items.length === 0}
              className="touch-target rounded-xl border-2 border-border bg-background px-3 text-sm font-semibold disabled:opacity-40"
            >
              Clear all
            </button>
            <PrintButton label="Print" disabled={items.length === 0} />
          </div>
        </div>

        <p aria-live="polite" className="no-print mb-3 text-sm text-muted">
          {items.length === 0
            ? "No activities yet - add some above to build today's schedule."
            : `${doneCount} of ${items.length} done`}
        </p>

        <ScheduleList
          items={items}
          onToggleDone={toggleDone}
          onRemove={removeItem}
          onMove={moveItem}
        />
      </div>

      <AddActivityDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={(activity) => {
          addItem(activity);
          setDialogOpen(false);
        }}
      />
    </div>
  );
}
