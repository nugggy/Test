"use client";

import { useEffect, useRef, useState } from "react";
import {
  useTimerSettings,
  TIMER_COLOR_PRESETS,
  TIMER_PRESETS_SECONDS,
  WARNING_OPTIONS,
  MAX_TIMER_MINUTES,
  type TimerStyle,
} from "@/lib/visual-timer-storage";
import {
  useFullscreenDisplay,
  useViewportFaceSize,
  useWakeLock,
  playSoftChime,
  describeSeconds,
} from "@/lib/visual-timer-display";
import { useCountdown } from "@/lib/use-countdown";
import { playAlertBeep, vibrateAlert } from "@/lib/alert-sound";
import { useSpeech } from "@/lib/use-speech";
import TimerFace from "@/components/TimerFace";

export default function VisualTimer() {
  const { settings, updateField } = useTimerSettings();
  const [totalSeconds, setTotalSeconds] = useState(
    () => settings.lastMinutes * 60 + settings.lastSeconds
  );
  const displayRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, isOverlay, toggle: toggleFullscreen } = useFullscreenDisplay(displayRef);
  const faceSize = useViewportFaceSize(isFullscreen, 260);
  const { speak } = useSpeech();
  const warnedRef = useRef(false);

  // Once settings hydrate from localStorage, adopt the last-used duration.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTotalSeconds(settings.lastMinutes * 60 + settings.lastSeconds);
  }, [settings.lastMinutes, settings.lastSeconds]);

  const nextLabel = settings.nextLabel.trim();

  function handleFinish() {
    if (settings.soundOn) playAlertBeep();
    if (settings.vibrateOn) vibrateAlert();
    if (settings.soundOn) {
      speak(nextLabel ? `Time's up. Now it's time for ${nextLabel}.` : "Time's up!");
    }
  }

  const { remainingSeconds, running, finished, start, pause, reset } = useCountdown(
    totalSeconds,
    handleFinish
  );

  useWakeLock(running);

  const warnAt = settings.warnAtSeconds;
  const warningApplies = warnAt > 0 && totalSeconds > warnAt;
  // Derived, not stored: the "nearly finished" banner shows whenever the
  // countdown is inside the warning window.
  const inWarningWindow =
    warningApplies && !finished && remainingSeconds > 0 && remainingSeconds <= warnAt &&
    remainingSeconds < totalSeconds;

  // Fire the heads-up sound once per run, as the countdown crosses into the
  // warning window. Re-arms whenever the timer is back above it (reset, new
  // duration, or started again).
  useEffect(() => {
    if (!warningApplies || remainingSeconds > warnAt) {
      warnedRef.current = false;
      return;
    }
    if (!running || warnedRef.current || remainingSeconds <= 0) return;
    warnedRef.current = true;
    if (settings.soundOn) {
      playSoftChime();
      speak(`${describeSeconds(warnAt)} left.`);
    }
    if (settings.vibrateOn) {
      try {
        navigator.vibrate?.(150);
      } catch {
        // No vibration support - the banner still shows.
      }
    }
  }, [remainingSeconds, running, warnAt, warningApplies, settings.soundOn, settings.vibrateOn, speak]);

  function setDuration(seconds: number) {
    if (running) return;
    const clamped = Math.min(MAX_TIMER_MINUTES * 60 + 59, Math.max(0, Math.floor(seconds) || 0));
    setTotalSeconds(clamped);
    updateField("lastMinutes", Math.floor(clamped / 60));
    updateField("lastSeconds", clamped % 60);
  }

  const statusText = finished
    ? nextLabel
      ? `Time's up. Now it's time for ${nextLabel}.`
      : "Time's up!"
    : inWarningWindow
      ? `Nearly finished. ${describeSeconds(warnAt)} or less left.`
      : running
        ? "Timer running."
        : remainingSeconds < totalSeconds && remainingSeconds > 0
          ? "Timer paused."
          : "";

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={displayRef}
        className={`flex flex-col items-center justify-center gap-5 bg-surface p-8 ${
          isOverlay
            ? "fixed inset-0 z-50 overflow-y-auto"
            : isFullscreen
              ? ""
              : "rounded-2xl border-2 border-border"
        }`}
      >
        <TimerFace
          remainingSeconds={remainingSeconds}
          totalSeconds={totalSeconds || 1}
          style={settings.style}
          color={settings.color}
          size={faceSize}
        />

        {nextLabel && !finished && (
          <p className="font-display text-center text-2xl font-bold">
            Next: {nextLabel}
          </p>
        )}

        {/* One polite live region for all status changes, so screen readers
            hear the warning and the end without double announcements. */}
        <p aria-live="polite" className="sr-only">
          {statusText}
        </p>

        {inWarningWindow && (
          <p className="font-display rounded-full border-2 border-accent bg-accent-soft px-5 py-2 text-center text-lg font-bold">
            <span aria-hidden="true">⏳</span> Nearly finished
          </p>
        )}

        {finished && (
          <p className="font-display rounded-2xl bg-[var(--sev-5)] px-5 py-2 text-center text-lg font-bold text-white">
            <span aria-hidden="true">⏰</span> Time&apos;s up!
            {nextLabel && (
              <>
                <br />
                Now it&apos;s time for {nextLabel}
              </>
            )}
          </p>
        )}

        <div className="no-print flex flex-wrap items-center justify-center gap-2">
          {!running ? (
            <button
              type="button"
              onClick={start}
              disabled={totalSeconds <= 0}
              className="touch-target rounded-xl border-2 border-brand bg-brand px-6 text-lg font-bold text-brand-ink disabled:opacity-40"
            >
              <span aria-hidden="true">▶️</span>{" "}
              {remainingSeconds < totalSeconds && remainingSeconds > 0 ? "Keep going" : "Start"}
            </button>
          ) : (
            <button
              type="button"
              onClick={pause}
              className="touch-target rounded-xl border-2 border-border bg-background px-6 text-lg font-bold"
            >
              <span aria-hidden="true">⏸️</span> Pause
            </button>
          )}
          <button
            type="button"
            onClick={reset}
            className="touch-target rounded-xl border-2 border-border bg-background px-6 text-lg font-bold"
          >
            <span aria-hidden="true">↺</span> Reset
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="touch-target rounded-xl border-2 border-border bg-background px-4 font-semibold"
          >
            <span aria-hidden="true">{isFullscreen ? "🡼" : "⛶"}</span>{" "}
            {isFullscreen ? "Exit full screen" : "Full screen"}
          </button>
        </div>
      </div>

      <div className="no-print rounded-2xl border-2 border-border bg-surface p-4">
        <h2 className="font-display mb-3 text-lg font-bold">Set the timer</h2>

        <div className="mb-4">
          <span className="mb-1.5 block text-sm font-semibold">Choose a length</span>
          <div className="flex flex-wrap gap-2">
            {TIMER_PRESETS_SECONDS.map(({ label, seconds }) => (
              <button
                key={seconds}
                type="button"
                onClick={() => setDuration(seconds)}
                disabled={running}
                aria-pressed={totalSeconds === seconds}
                className={`touch-target rounded-xl border-2 px-4 text-sm font-semibold disabled:opacity-40 ${
                  totalSeconds === seconds
                    ? "border-brand bg-brand text-brand-ink"
                    : "border-border bg-background"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <span className="mb-1.5 block text-sm font-semibold">Or set a custom length</span>
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={MAX_TIMER_MINUTES}
                value={Math.floor(totalSeconds / 60)}
                onChange={(e) =>
                  setDuration(
                    Math.min(MAX_TIMER_MINUTES, Math.max(0, Number(e.target.value) || 0)) * 60 +
                      (totalSeconds % 60)
                  )
                }
                disabled={running}
                className="w-24 rounded-xl border-2 border-border bg-background px-3 py-3 text-center touch-target disabled:opacity-40"
              />
              <span className="text-sm font-semibold">minutes</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={59}
                value={totalSeconds % 60}
                onChange={(e) =>
                  setDuration(
                    Math.floor(totalSeconds / 60) * 60 +
                      Math.min(59, Math.max(0, Number(e.target.value) || 0))
                  )
                }
                disabled={running}
                className="w-24 rounded-xl border-2 border-border bg-background px-3 py-3 text-center touch-target disabled:opacity-40"
              />
              <span className="text-sm font-semibold">seconds</span>
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="timer-next-label" className="mb-1.5 block text-sm font-semibold">
            What happens when time is up? (optional)
          </label>
          <input
            id="timer-next-label"
            type="text"
            value={settings.nextLabel}
            onChange={(e) => updateField("nextLabel", e.target.value.slice(0, 60))}
            maxLength={60}
            placeholder="e.g. Lunch, Get in the car, Bath time"
            className="touch-target w-full rounded-xl border-2 border-border bg-background px-4"
          />
          <p className="mt-1 text-xs text-muted">
            Shows as &quot;Next&quot; under the timer, and is read out when time is up.
          </p>
        </div>

        <fieldset className="mb-4">
          <legend className="mb-1.5 block text-sm font-semibold">
            Give a warning before the end
          </legend>
          <div className="flex flex-wrap gap-2">
            {WARNING_OPTIONS.map(({ seconds, label }) => (
              <button
                key={seconds}
                type="button"
                onClick={() => updateField("warnAtSeconds", seconds)}
                aria-pressed={settings.warnAtSeconds === seconds}
                className={`touch-target rounded-xl border-2 px-4 text-sm font-semibold ${
                  settings.warnAtSeconds === seconds
                    ? "border-brand bg-brand text-brand-ink"
                    : "border-border bg-background"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="mt-1 text-xs text-muted">
            A soft chime and a &quot;Nearly finished&quot; sign, so the change doesn&apos;t
            come as a surprise. Only used when the timer is longer than the warning.
          </p>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <fieldset>
            <legend className="mb-1.5 block text-sm font-semibold">Style</legend>
            <div className="flex gap-2">
              {(["pie", "bar"] as TimerStyle[]).map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => updateField("style", style)}
                  aria-pressed={settings.style === style}
                  className={`touch-target flex-1 rounded-lg border-2 px-3 text-sm font-semibold ${
                    settings.style === style
                      ? "border-brand bg-brand text-brand-ink"
                      : "border-border bg-background"
                  }`}
                >
                  {style === "pie" ? "Pie / sand timer" : "Bar"}
                </button>
              ))}
            </div>
          </fieldset>

          <div>
            <span className="mb-1.5 block text-sm font-semibold">Colour</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {TIMER_COLOR_PRESETS.map((colour) => (
                <button
                  key={colour}
                  type="button"
                  onClick={() => updateField("color", colour)}
                  aria-label={`Timer colour ${colour}`}
                  aria-pressed={settings.color === colour}
                  className={`touch-target grid shrink-0 place-items-center rounded-xl border-2 ${
                    settings.color === colour ? "border-brand bg-brand-soft" : "border-border bg-background"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="block h-10 w-10 rounded-full border-2 border-border"
                    style={{ backgroundColor: colour }}
                  />
                </button>
              ))}
              <label className="touch-target grid shrink-0 cursor-pointer place-items-center rounded-xl border-2 border-border bg-background px-2 text-center text-xs font-semibold">
                <input
                  type="color"
                  value={settings.color}
                  onChange={(e) => updateField("color", e.target.value)}
                  className="h-10 w-10 cursor-pointer rounded-full border-2 border-border"
                />
                Other
              </label>
            </div>
          </div>

          <label className="touch-target flex items-center gap-3 rounded-xl border-2 border-border bg-background px-3 text-sm font-semibold">
            <input
              type="checkbox"
              checked={settings.soundOn}
              onChange={(e) => updateField("soundOn", e.target.checked)}
              className="h-6 w-6 shrink-0 accent-brand"
            />
            Sound and spoken words (warning and time&apos;s up)
          </label>
          <label className="touch-target flex items-center gap-3 rounded-xl border-2 border-border bg-background px-3 text-sm font-semibold">
            <input
              type="checkbox"
              checked={settings.vibrateOn}
              onChange={(e) => updateField("vibrateOn", e.target.checked)}
              className="h-6 w-6 shrink-0 accent-brand"
            />
            Vibrate (if your device can)
          </label>
        </div>
      </div>
    </div>
  );
}
