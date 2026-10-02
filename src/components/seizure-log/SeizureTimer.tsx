"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  formatElapsed,
  planEmergencySeconds,
  useActiveSeizureTimer,
  useSeizurePlanNotes,
} from "@/lib/seizure-log-storage";

export interface TimerResult {
  startedAt: string;
  durationSeconds: number;
  events: { label: string; offsetSeconds: number }[];
}

interface SeizureTimerProps {
  onStopped: (result: TimerResult) => void;
}

const RESCUE_EVENT = "Rescue medication given";
const AMBULANCE_EVENT = "Ambulance called (000)";

/** Keeps the screen awake while timing, where the browser supports it. */
function useWakeLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    let lock: { release: () => Promise<void> } | null = null;
    let cancelled = false;
    const nav = navigator as Navigator & {
      wakeLock?: { request: (type: "screen") => Promise<{ release: () => Promise<void> }> };
    };
    nav.wakeLock
      ?.request("screen")
      .then((l) => {
        if (cancelled) void l.release().catch(() => {});
        else lock = l;
      })
      .catch(() => {
        // Not supported or not allowed - the timer still works.
      });
    return () => {
      cancelled = true;
      if (lock) void lock.release().catch(() => {});
    };
  }, [active]);
}

export default function SeizureTimer({ onStopped }: SeizureTimerProps) {
  const { timer, start, addEvent, clear } = useActiveSeizureTimer();
  const { plan, updatePlan } = useSeizurePlanNotes();
  const [now, setNow] = useState(() => Date.now());
  const [showPlan, setShowPlan] = useState(false);
  const lastAnnouncedMinute = useRef(-1);
  const [announcement, setAnnouncement] = useState("");
  const minutesId = useId();
  const stepsId = useId();

  const running = timer !== null;
  useWakeLock(running);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(id);
  }, [running]);

  const elapsed = timer ? Math.max(0, Math.floor((now - new Date(timer.startedAt).getTime()) / 1000)) : 0;
  const planSeconds = planEmergencySeconds(plan);
  const planReached = running && planSeconds !== null && elapsed >= planSeconds;

  // Announce each whole minute for screen reader users, not every second.
  useEffect(() => {
    if (!running) {
      lastAnnouncedMinute.current = -1;
      return;
    }
    const minute = Math.floor(elapsed / 60);
    if (minute > 0 && minute !== lastAnnouncedMinute.current) {
      lastAnnouncedMinute.current = minute;
      setAnnouncement(`${minute} ${minute === 1 ? "minute" : "minutes"} since the seizure started.`);
    }
  }, [elapsed, running]);

  function handleStart() {
    setNow(Date.now());
    start();
    setAnnouncement("Timer started.");
  }

  function handleStop() {
    if (!timer) return;
    const startMs = new Date(timer.startedAt).getTime();
    const durationSeconds = Math.max(0, Math.round((Date.now() - startMs) / 1000));
    onStopped({
      startedAt: timer.startedAt,
      durationSeconds,
      events: timer.events.map((e) => ({
        label: e.label,
        offsetSeconds: Math.max(0, Math.round((new Date(e.at).getTime() - startMs) / 1000)),
      })),
    });
    clear();
    setAnnouncement(
      `Timer stopped at ${formatElapsed(durationSeconds)}. The time and duration have been filled in below.`
    );
  }

  function handleEvent(label: string) {
    addEvent(label);
    setAnnouncement(`${label} at ${formatElapsed(elapsed)} noted.`);
  }

  const startMs = timer ? new Date(timer.startedAt).getTime() : 0;

  return (
    <section
      aria-labelledby="seizure-timer-heading"
      className="no-print flex flex-col gap-3 rounded-2xl border-2 border-brand bg-surface p-4"
    >
      <h2 id="seizure-timer-heading" className="font-display text-lg font-bold">
        Seizure timer
      </h2>
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      {!running ? (
        <>
          <p className="text-sm text-muted">
            Tap Start when the seizure begins and Stop when it ends. The timer
            keeps going if the screen locks or the page is reloaded.
          </p>
          <button
            type="button"
            onClick={handleStart}
            className="touch-target w-full rounded-2xl border-2 border-brand bg-brand py-6 font-display text-3xl font-bold text-brand-ink"
          >
            <span aria-hidden="true">▶</span> Start timer
          </button>
        </>
      ) : (
        <>
          <p className="text-center text-sm font-semibold text-muted">Time since it started</p>
          <p
            className="text-center font-display text-7xl font-bold tabular-nums"
            aria-hidden="true"
          >
            {formatElapsed(elapsed)}
          </p>
          <p className="sr-only">
            {Math.floor(elapsed / 60)} minutes {elapsed % 60} seconds
          </p>

          {planReached && (
            <div
              role="alert"
              className="rounded-xl border-4 border-[var(--sev-5)] bg-background p-3 text-center"
            >
              <p className="font-display text-lg font-bold">
                <span aria-hidden="true">⚠️</span> The time in the seizure plan has been reached
                ({plan.emergencyMinutes} min).
              </p>
              <p className="font-semibold">Follow the plan now.</p>
            </div>
          )}

          <button
            type="button"
            onClick={handleStop}
            className="touch-target w-full rounded-2xl border-2 border-ink-block bg-ink-block py-6 font-display text-3xl font-bold text-ink-block-fg"
          >
            <span aria-hidden="true">■</span> Stop, seizure ended
          </button>

          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => handleEvent(RESCUE_EVENT)}
              className="touch-target rounded-xl border-2 border-border bg-background px-4 font-semibold"
            >
              Note: rescue medication given now
            </button>
            <button
              type="button"
              onClick={() => handleEvent(AMBULANCE_EVENT)}
              className="touch-target rounded-xl border-2 border-border bg-background px-4 font-semibold"
            >
              Note: 000 called now
            </button>
          </div>

          {timer.events.length > 0 && (
            <ul className="text-sm">
              {timer.events.map((e, i) => (
                <li key={`${e.at}-${i}`}>
                  {e.label} at{" "}
                  {formatElapsed((new Date(e.at).getTime() - startMs) / 1000)}
                </li>
              ))}
            </ul>
          )}

          <button
            type="button"
            onClick={() => {
              if (window.confirm("Cancel the timer without saving the time?")) {
                clear();
                setAnnouncement("Timer cancelled.");
              }
            }}
            className="touch-target self-start rounded-xl border-2 border-border bg-background px-4 text-sm font-semibold"
          >
            Cancel timer
          </button>
        </>
      )}

      <div className="rounded-xl border-2 border-border bg-background p-3">
        {plan.planSteps.trim() || planSeconds !== null ? (
          <>
            <p className="text-sm font-bold">From the seizure management plan</p>
            {planSeconds !== null && (
              <p className="text-sm">
                Plan time: <strong>{plan.emergencyMinutes} minutes</strong>
              </p>
            )}
            {plan.planSteps.trim() && (
              <p className="whitespace-pre-wrap text-sm">{plan.planSteps}</p>
            )}
          </>
        ) : (
          <p className="text-sm text-muted">
            You can copy the key time and steps from the person&apos;s own
            seizure management plan here, so they show while timing.
          </p>
        )}
        <p className="mt-2 text-sm font-semibold">
          In an emergency, or if you are unsure, call 000.
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <a
            href="tel:000"
            className="touch-target inline-flex items-center justify-center rounded-xl border-2 border-brand bg-brand px-4 font-semibold text-brand-ink"
          >
            <span aria-hidden="true">📞</span>&nbsp;Call 000
          </a>
          <button
            type="button"
            onClick={() => setShowPlan((v) => !v)}
            aria-expanded={showPlan}
            className="touch-target rounded-xl border-2 border-border bg-surface px-4 text-sm font-semibold"
          >
            {showPlan ? "Done" : "Edit plan details"}
          </button>
        </div>
        {showPlan && (
          <div className="mt-3 flex flex-col gap-3">
            <p className="text-sm text-muted">
              Only enter what is written in the person&apos;s own seizure
              management plan from their doctor or neurologist. This app does
              not set or suggest these.
            </p>
            <div>
              <label htmlFor={minutesId} className="mb-1 block text-sm font-semibold">
                Time from the plan that needs action (minutes)
              </label>
              <input
                id={minutesId}
                type="number"
                inputMode="decimal"
                min={0}
                step={0.5}
                value={plan.emergencyMinutes}
                onChange={(e) => updatePlan({ emergencyMinutes: e.target.value })}
                placeholder="As written in the plan"
                className="touch-target w-40 rounded-xl border-2 border-border bg-surface px-3"
              />
            </div>
            <div>
              <label htmlFor={stepsId} className="mb-1 block text-sm font-semibold">
                What the plan says to do
              </label>
              <textarea
                id={stepsId}
                value={plan.planSteps}
                onChange={(e) => updatePlan({ planSteps: e.target.value })}
                rows={3}
                maxLength={800}
                placeholder="Copy the steps from the plan, in its own words"
                className="touch-target w-full rounded-xl border-2 border-border bg-surface px-3 py-2"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
