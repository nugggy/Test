"use client";

import { useEffect, useRef, useState } from "react";
import {
  useTimerSettings,
  TIMER_COLOR_PRESETS,
  TIMER_PRESETS_SECONDS,
  type TimerStyle,
} from "@/lib/visual-timer-storage";
import { useCountdown } from "@/lib/use-countdown";
import { playAlertBeep, vibrateAlert } from "@/lib/alert-sound";
import { useSpeech } from "@/lib/use-speech";
import TimerFace from "@/components/TimerFace";

export default function VisualTimer() {
  const { settings, updateField } = useTimerSettings();
  const [totalSeconds, setTotalSeconds] = useState(
    () => settings.lastMinutes * 60 + settings.lastSeconds
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const displayRef = useRef<HTMLDivElement>(null);
  const { speak } = useSpeech();

  // Once settings hydrate from localStorage, adopt the last-used duration.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTotalSeconds(settings.lastMinutes * 60 + settings.lastSeconds);
  }, [settings.lastMinutes, settings.lastSeconds]);

  function handleFinish() {
    if (settings.soundOn) playAlertBeep();
    if (settings.vibrateOn) vibrateAlert();
    speak("Time's up!");
  }

  const { remainingSeconds, running, finished, start, pause, reset } = useCountdown(
    totalSeconds,
    handleFinish
  );

  function setDuration(seconds: number) {
    if (running) return;
    setTotalSeconds(seconds);
    updateField("lastMinutes", Math.floor(seconds / 60));
    updateField("lastSeconds", seconds % 60);
  }

  async function toggleFullscreen() {
    if (!displayRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await displayRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      // Full-screen isn't available on some browsers/devices - the timer
      // still works at normal size.
    }
  }

  const size = 260;

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={displayRef}
        className="flex flex-col items-center justify-center gap-5 rounded-2xl border-2 border-border p-8"
        style={{ backgroundColor: settings.backgroundColor }}
      >
        <TimerFace
          remainingSeconds={remainingSeconds}
          totalSeconds={totalSeconds || 1}
          style={settings.style}
          color={settings.color}
          size={size}
        />

        {finished && (
          <p
            aria-live="assertive"
            className="font-display rounded-full bg-[var(--sev-5)] px-5 py-2 text-lg font-bold text-white"
          >
            ⏰ Time&apos;s up!
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
              ▶️ Start
            </button>
          ) : (
            <button
              type="button"
              onClick={pause}
              className="touch-target rounded-xl border-2 border-border bg-surface px-6 text-lg font-bold"
            >
              ⏸️ Pause
            </button>
          )}
          <button
            type="button"
            onClick={reset}
            className="touch-target rounded-xl border-2 border-border bg-surface px-6 text-lg font-bold"
          >
            ↺ Reset
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="touch-target rounded-xl border-2 border-border bg-surface px-4 font-semibold"
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
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={180}
              value={Math.floor(totalSeconds / 60)}
              onChange={(e) =>
                setDuration(Math.max(0, Number(e.target.value)) * 60 + (totalSeconds % 60))
              }
              disabled={running}
              aria-label="Minutes"
              className="w-20 rounded-xl border-2 border-border bg-background px-3 py-3 text-center touch-target disabled:opacity-40"
            />
            <span className="text-sm text-muted">min</span>
            <input
              type="number"
              min={0}
              max={59}
              value={totalSeconds % 60}
              onChange={(e) =>
                setDuration(
                  Math.floor(totalSeconds / 60) * 60 +
                    Math.min(59, Math.max(0, Number(e.target.value)))
                )
              }
              disabled={running}
              aria-label="Seconds"
              className="w-20 rounded-xl border-2 border-border bg-background px-3 py-3 text-center touch-target disabled:opacity-40"
            />
            <span className="text-sm text-muted">sec</span>
          </div>
        </div>

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
                  className={`touch-target flex-1 rounded-lg border-2 px-3 text-sm font-semibold capitalize ${
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
                  className={`h-8 w-8 shrink-0 rounded-full border-2 ${
                    settings.color === colour ? "border-brand" : "border-border"
                  }`}
                  style={{ backgroundColor: colour }}
                />
              ))}
              <input
                type="color"
                value={settings.color}
                onChange={(e) => updateField("color", e.target.value)}
                aria-label="Custom timer colour"
                className="h-8 w-8 shrink-0 rounded-full border-2 border-border"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              checked={settings.soundOn}
              onChange={(e) => updateField("soundOn", e.target.checked)}
              className="h-5 w-5 accent-brand"
            />
            Play a sound when time&apos;s up
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              checked={settings.vibrateOn}
              onChange={(e) => updateField("vibrateOn", e.target.checked)}
              className="h-5 w-5 accent-brand"
            />
            Vibrate when time&apos;s up (if supported)
          </label>
        </div>
      </div>
    </div>
  );
}
