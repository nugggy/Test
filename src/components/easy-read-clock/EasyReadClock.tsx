"use client";

import { useRef, useState } from "react";
import {
  useClockSettings,
  BACKGROUND_PRESETS,
  TEXT_COLOR_PRESETS,
  type ClockMode,
} from "@/lib/easy-read-clock-storage";
import { useClockTime } from "@/lib/use-clock-time";
import { WORLD_TIMEZONES } from "@/lib/world-timezones";
import AnalogClockFace from "./AnalogClockFace";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function EasyReadClock() {
  const { settings, updateField, reset } = useClockSettings();
  const time = useClockTime(settings.timezone);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const displayRef = useRef<HTMLDivElement>(null);

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
      // Full-screen isn't available on some browsers/devices (e.g. some
      // iPad Safari contexts) - the clock still works at normal size.
    }
  }

  const hour12 = (time.hour % 12) || 12;
  const displayHour = settings.format24h ? time.hour : hour12;
  const ampm = time.hour < 12 ? "AM" : "PM";

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={displayRef}
        className="flex flex-col items-center justify-center gap-5 rounded-2xl border-2 border-border p-10"
        style={{ backgroundColor: settings.backgroundColor, color: settings.textColor }}
      >
        {settings.mode === "digital" ? (
          <div
            className="text-center font-display font-extrabold tabular-nums"
            style={{ fontSize: `${3 * settings.fontScale}rem`, lineHeight: 1.1 }}
          >
            {pad(displayHour)}:{pad(time.minute)}
            {settings.showSeconds && `:${pad(time.second)}`}
            {!settings.format24h && (
              <span
                className="ml-2 align-middle font-semibold"
                style={{ fontSize: `${1.2 * settings.fontScale}rem` }}
              >
                {ampm}
              </span>
            )}
          </div>
        ) : (
          <AnalogClockFace
            hour={time.hour}
            minute={time.minute}
            second={time.second}
            showSeconds={settings.showSeconds}
            color={settings.textColor}
            scale={settings.fontScale}
          />
        )}
        {settings.showDate && (
          <p
            className="text-center font-semibold"
            style={{ fontSize: `${1.1 * settings.fontScale}rem` }}
          >
            {time.weekday}, {time.day} {time.month} {time.year}
          </p>
        )}
        <button
          type="button"
          onClick={toggleFullscreen}
          className="no-print touch-target rounded-xl border-2 px-4 font-semibold"
          style={{ borderColor: settings.textColor, color: settings.textColor }}
        >
          <span aria-hidden="true">{isFullscreen ? "🡼" : "⛶"}</span>{" "}
          {isFullscreen ? "Exit full screen" : "Full screen"}
        </button>
      </div>

      <div className="no-print rounded-2xl border-2 border-border bg-surface p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Customise</h2>
          <button
            type="button"
            onClick={reset}
            className="text-sm font-semibold text-muted hover:text-foreground"
          >
            Reset to default
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <fieldset>
            <legend className="mb-1.5 block text-sm font-semibold">Style</legend>
            <div className="flex flex-wrap gap-2">
              {(["digital", "analog"] as ClockMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => updateField("mode", mode)}
                  aria-pressed={settings.mode === mode}
                  className={`touch-target flex-1 rounded-lg border-2 px-3 text-sm font-semibold capitalize ${
                    settings.mode === mode
                      ? "border-brand bg-brand text-brand-ink"
                      : "border-border bg-background"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="text-sm">
            <span className="mb-1.5 block font-semibold">Timezone</span>
            <select
              value={settings.timezone}
              onChange={(e) => updateField("timezone", e.target.value)}
              className="touch-target w-full rounded-lg border-2 border-border bg-background px-3"
            >
              {WORLD_TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </label>

          <fieldset>
            <legend className="mb-1.5 block text-sm font-semibold">Text size</legend>
            <div className="flex gap-2">
              {[1, 1.4, 1.8].map((scale) => (
                <button
                  key={scale}
                  type="button"
                  onClick={() => updateField("fontScale", scale)}
                  aria-pressed={settings.fontScale === scale}
                  className={`touch-target flex-1 rounded-lg border-2 px-3 text-sm font-semibold ${
                    settings.fontScale === scale
                      ? "border-brand bg-brand text-brand-ink"
                      : "border-border bg-background"
                  }`}
                >
                  {scale === 1 ? "Standard" : scale === 1.4 ? "Large" : "Extra large"}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={settings.format24h}
                onChange={(e) => updateField("format24h", e.target.checked)}
                className="h-5 w-5 accent-brand"
              />
              24-hour time
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={settings.showSeconds}
                onChange={(e) => updateField("showSeconds", e.target.checked)}
                className="h-5 w-5 accent-brand"
              />
              Show seconds
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={settings.showDate}
                onChange={(e) => updateField("showDate", e.target.checked)}
                className="h-5 w-5 accent-brand"
              />
              Show date
            </label>
          </div>

          <div>
            <span className="mb-1.5 block text-sm font-semibold">Background colour</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {BACKGROUND_PRESETS.map((colour) => (
                <button
                  key={colour}
                  type="button"
                  onClick={() => updateField("backgroundColor", colour)}
                  aria-label={`Background colour ${colour}`}
                  aria-pressed={settings.backgroundColor === colour}
                  className={`h-8 w-8 shrink-0 rounded-full border-2 ${
                    settings.backgroundColor === colour ? "border-brand" : "border-border"
                  }`}
                  style={{ backgroundColor: colour }}
                />
              ))}
              <input
                type="color"
                value={settings.backgroundColor}
                onChange={(e) => updateField("backgroundColor", e.target.value)}
                aria-label="Custom background colour"
                className="h-8 w-8 shrink-0 rounded-full border-2 border-border"
              />
            </div>
          </div>

          <div>
            <span className="mb-1.5 block text-sm font-semibold">Text &amp; hands colour</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {TEXT_COLOR_PRESETS.map((colour) => (
                <button
                  key={colour}
                  type="button"
                  onClick={() => updateField("textColor", colour)}
                  aria-label={`Text colour ${colour}`}
                  aria-pressed={settings.textColor === colour}
                  className={`h-8 w-8 shrink-0 rounded-full border-2 ${
                    settings.textColor === colour ? "border-brand" : "border-border"
                  }`}
                  style={{ backgroundColor: colour }}
                />
              ))}
              <input
                type="color"
                value={settings.textColor}
                onChange={(e) => updateField("textColor", e.target.value)}
                aria-label="Custom text colour"
                className="h-8 w-8 shrink-0 rounded-full border-2 border-border"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
