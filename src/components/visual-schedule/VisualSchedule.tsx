"use client";

import { useState } from "react";
import { ACTIVITY_LIBRARY } from "@/lib/visual-schedule-data";
import {
  useScheduleItems,
  currentStepIndex,
  nextStepIndex,
} from "@/lib/visual-schedule-storage";
import { useSpeech } from "@/lib/use-speech";
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
    reorderItem,
    setDuration,
    resetDone,
    clearAll,
    hydrated,
  } = useScheduleItems();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const { speak, supported: speechSupported } = useSpeech();

  const doneCount = items.filter((item) => item.done).length;
  const nowIndex = currentStepIndex(items);
  const nextIndex = nextStepIndex(items);
  const nowItem = nowIndex >= 0 ? items[nowIndex] : null;
  const nextItem = nextIndex >= 0 ? items[nextIndex] : null;
  const allDone = items.length > 0 && nowIndex === -1;

  const nowNextSentence = allDone
    ? "All done. Well done!"
    : nowItem
      ? `Now: ${nowItem.label}.${nextItem ? ` Next: ${nextItem.label}.` : " This is the last one."}`
      : "";

  return (
    <div className="flex flex-col gap-6">
      {hydrated && items.length > 0 && (
        <section
          aria-labelledby="now-next-heading"
          className="no-print rounded-2xl border-2 border-brand bg-brand-soft p-4"
        >
          <h2 id="now-next-heading" className="sr-only">
            Now and next
          </h2>
          <p aria-live="polite" className="sr-only">
            {nowNextSentence}
          </p>
          {allDone ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <span aria-hidden="true" className="text-6xl">
                🎉
              </span>
              <p className="font-display text-2xl font-bold">All done! Well done.</p>
              <p className="text-sm text-muted">
                The ticks clear by themselves tomorrow, or tap &quot;Start again&quot; below.
              </p>
            </div>
          ) : (
            nowItem && (
              <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
                <div className="flex flex-col items-center gap-2 rounded-2xl border-2 border-brand bg-surface p-4 text-center">
                  <span className="font-display rounded-full bg-brand px-4 py-1 text-sm font-bold uppercase tracking-wide text-brand-ink">
                    Now
                  </span>
                  <span aria-hidden="true" className="text-7xl leading-none">
                    {nowItem.icon}
                  </span>
                  <span className="font-display text-2xl font-bold sm:text-3xl">
                    {nowItem.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleDone(nowItem.id)}
                    className="touch-target mt-1 w-full max-w-xs rounded-xl border-2 border-brand bg-brand px-4 text-lg font-bold text-brand-ink"
                  >
                    <span aria-hidden="true">✅</span> Done
                  </button>
                </div>
                <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-border bg-surface p-4 text-center">
                  <span className="font-display rounded-full border-2 border-border px-4 py-1 text-sm font-bold uppercase tracking-wide">
                    Next
                  </span>
                  {nextItem ? (
                    <>
                      <span aria-hidden="true" className="text-5xl leading-none">
                        {nextItem.icon}
                      </span>
                      <span className="font-display text-xl font-bold">{nextItem.label}</span>
                    </>
                  ) : (
                    <span className="font-display text-lg font-bold">
                      Nothing else. This is the last one.
                    </span>
                  )}
                </div>
              </div>
            )
          )}
          {speechSupported && nowNextSentence && (
            <div className="mt-3 flex justify-center">
              <button
                type="button"
                onClick={() => speak(nowNextSentence)}
                className="touch-target rounded-xl border-2 border-border bg-surface px-4 font-semibold"
              >
                <span aria-hidden="true">🔊</span> Say it out loud
              </button>
            </div>
          )}
        </section>
      )}

      <div className="rounded-2xl border-2 border-border bg-surface p-4">
        <div className="no-print mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold">Today&apos;s schedule</h2>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setEditing((e) => !e)}
              aria-pressed={editing}
              disabled={items.length === 0}
              className={`touch-target rounded-xl border-2 px-3 text-sm font-semibold disabled:opacity-40 ${
                editing ? "border-brand bg-brand text-brand-ink" : "border-border bg-background"
              }`}
            >
              <span aria-hidden="true">✏️</span> {editing ? "Finish changing" : "Change order or timers"}
            </button>
            <button
              type="button"
              onClick={resetDone}
              disabled={doneCount === 0}
              className="touch-target rounded-xl border-2 border-border bg-background px-3 text-sm font-semibold disabled:opacity-40"
            >
              <span aria-hidden="true">↺</span> Start again
            </button>
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Remove every activity from the schedule? This can't be undone.")) {
                  clearAll();
                  setEditing(false);
                }
              }}
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
            ? "No activities yet. Add some below to build today's schedule."
            : `${doneCount} of ${items.length} done`}
        </p>

        <ScheduleList
          items={items}
          nowIndex={nowIndex}
          nextIndex={nextIndex}
          editing={editing}
          onToggleDone={toggleDone}
          onRemove={removeItem}
          onMove={moveItem}
          onSetDuration={setDuration}
          onReorder={reorderItem}
        />
      </div>

      <div className="no-print rounded-2xl border-2 border-border bg-surface p-4">
        <h2 className="font-display mb-3 text-lg font-bold">Add an activity</h2>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
          {ACTIVITY_LIBRARY.map((activity) => (
            <button
              key={activity.id}
              type="button"
              onClick={() => addItem(activity)}
              aria-label={`Add ${activity.label} to the schedule`}
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
