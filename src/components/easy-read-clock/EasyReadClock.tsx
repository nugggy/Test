"use client";

import { useRef } from "react";
import { useSpeech } from "@/lib/use-speech";
import {
  useClockSettings,
  BACKGROUND_PRESETS,
  TEXT_COLOR_PRESETS,
  FACE_COLOR_PRESETS,
  FONT_SCALE_OPTIONS,
  type ClockMode,
  type ClockSettings,
  type NumberStyle,
  type HandStyle,
} from "@/lib/easy-read-clock-storage";
import { useClockTime } from "@/lib/use-clock-time";
import { WORLD_TIMEZONES } from "@/lib/world-timezones";
import { partOfDay, spokenTime, timeInWords } from "@/lib/easy-read-clock-words";
import {
  useFullscreenDisplay,
  useViewportFaceSize,
  useWakeLock,
} from "@/lib/visual-timer-display";
import AnalogClockFace from "./AnalogClockFace";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

interface SwatchRowProps {
  colours: string[];
  value: string;
  onChange: (colour: string) => void;
  labelPrefix: string;
  /** Adds a "see-through" first option (analog face only). */
  allowTransparent?: boolean;
}

/** A row of colour choices, each a full-size touch target, plus a custom
 * colour picker labelled "Other". */
function SwatchRow({ colours, value, onChange, labelPrefix, allowTransparent }: SwatchRowProps) {
  const swatchClass = (selected: boolean) =>
    `touch-target grid shrink-0 place-items-center rounded-xl border-2 ${
      selected ? "border-brand bg-brand-soft" : "border-border bg-background"
    }`;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {allowTransparent && (
        <button
          type="button"
          onClick={() => onChange("transparent")}
          aria-label={`${labelPrefix}: none (see-through)`}
          aria-pressed={value === "transparent"}
          className={swatchClass(value === "transparent")}
        >
          <span
            aria-hidden="true"
            className="block h-10 w-10 rounded-full border-2 border-border"
            style={{
              backgroundImage: "repeating-conic-gradient(#bbb 0% 25%, #eee 0% 50%)",
              backgroundSize: "10px 10px",
            }}
          />
        </button>
      )}
      {colours.map((colour) => (
        <button
          key={colour}
          type="button"
          onClick={() => onChange(colour)}
          aria-label={`${labelPrefix} ${colour}`}
          aria-pressed={value === colour}
          className={swatchClass(value === colour)}
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
          value={value === "transparent" ? "#ffffff" : value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={`${labelPrefix}: choose any colour`}
          className="h-10 w-10 cursor-pointer rounded-full border-2 border-border"
        />
        Other
      </label>
    </div>
  );
}

type BoolKey = {
  [K in keyof ClockSettings]: ClockSettings[K] extends boolean ? K : never;
}[keyof ClockSettings];

const CHECKBOX_LABEL =
  "touch-target flex items-center gap-3 rounded-xl border-2 border-border bg-background px-3 text-sm font-semibold";

function OptionButtons<T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: [T, string][];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(([optionValue, label]) => (
        <button
          key={String(optionValue)}
          type="button"
          onClick={() => onChange(optionValue)}
          aria-pressed={value === optionValue}
          className={`touch-target flex-1 rounded-lg border-2 px-3 text-sm font-semibold ${
            value === optionValue
              ? "border-brand bg-brand text-brand-ink"
              : "border-border bg-background"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default function EasyReadClock() {
  const { settings, updateField, reset } = useClockSettings();
  const time = useClockTime(settings.timezone);
  const displayRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, isOverlay, toggle: toggleFullscreen } = useFullscreenDisplay(displayRef);
  const analogSize = useViewportFaceSize(isFullscreen, 220 * Math.min(settings.fontScale, 1.6));
  const { speak, stop, speaking, supported: speechSupported } = useSpeech();
  // A clock on the wall shouldn't let the screen go to sleep.
  useWakeLock(isFullscreen);

  // useClockTime starts neutral (midnight) until it has read the real time
  // on the client. Hide the words until then so they never say "Midnight"
  // by mistake.
  const timeReady = time.weekday !== "";
  const part = partOfDay(time.hour);

  const hour12 = (time.hour % 12) || 12;
  const displayHour = settings.format24h ? time.hour : hour12;
  const ampm = time.hour < 12 ? "AM" : "PM";

  function speakTime() {
    if (speaking) {
      stop();
      return;
    }
    let phrase: string;
    if (settings.showWords) {
      phrase = spokenTime(time.hour, time.minute);
    } else {
      const minutePart =
        time.minute === 0 ? "o'clock" : time.minute < 10 ? `oh ${time.minute}` : `${time.minute}`;
      phrase = `It's ${displayHour} ${minutePart}`;
      if (!settings.format24h) {
        phrase += part.id === "night" ? " at night" : ` in the ${part.id}`;
      }
      phrase += ".";
    }
    if (settings.showDate) {
      phrase += ` ${time.weekday}, the ${time.day} of ${time.month}.`;
    }
    speak(phrase);
  }

  function bool(key: BoolKey, label: string) {
    return (
      <label className={CHECKBOX_LABEL}>
        <input
          type="checkbox"
          checked={settings[key]}
          onChange={(e) => updateField(key, e.target.checked)}
          className="h-6 w-6 shrink-0 accent-brand"
        />
        {label}
      </label>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={displayRef}
        className={`flex flex-col items-center justify-center gap-5 p-10 ${
          isOverlay
            ? "fixed inset-0 z-50 overflow-y-auto"
            : isFullscreen
              ? ""
              : "rounded-2xl border-2 border-border"
        }`}
        style={{ backgroundColor: settings.backgroundColor, color: settings.textColor }}
      >
        {timeReady && settings.showPartOfDay && (
          <p
            className="font-display text-center font-bold"
            style={{ fontSize: `${(isFullscreen ? 2 : 1.4) * settings.fontScale}rem`, lineHeight: 1.2 }}
          >
            <span aria-hidden="true">{part.emoji}</span> {part.label}
          </p>
        )}
        {settings.mode === "digital" ? (
          <div
            className="text-center font-display font-extrabold tabular-nums"
            style={{
              fontSize: `${(isFullscreen ? 5 : 3) * settings.fontScale}rem`,
              lineHeight: 1.1,
            }}
          >
            {pad(displayHour)}:{pad(time.minute)}
            {settings.showSeconds && `:${pad(time.second)}`}
            {!settings.format24h && (
              <span
                className="ml-2 align-middle font-semibold"
                style={{ fontSize: `${(isFullscreen ? 2 : 1.2) * settings.fontScale}rem` }}
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
            sizePx={isFullscreen ? analogSize : undefined}
            numberStyle={settings.numberStyle}
            showMinuteTicks={settings.showMinuteTicks}
            faceColor={settings.faceColor}
            secondHandColor={settings.secondHandColor}
            handStyle={settings.handStyle}
          />
        )}
        {timeReady && settings.showWords && (
          <p
            className="font-display text-center font-bold"
            style={{ fontSize: `${(isFullscreen ? 2.4 : 1.6) * settings.fontScale}rem`, lineHeight: 1.2 }}
          >
            {timeInWords(time.hour, time.minute)}
          </p>
        )}
        {settings.showDate && (
          <p
            className="text-center font-semibold"
            style={{ fontSize: `${(isFullscreen ? 1.6 : 1.1) * settings.fontScale}rem` }}
          >
            {time.weekday}, {time.day} {time.month} {time.year}
          </p>
        )}
        <div className="no-print flex flex-wrap items-center justify-center gap-2">
          {speechSupported && (
            <button
              type="button"
              onClick={speakTime}
              aria-pressed={speaking}
              className="touch-target rounded-xl border-2 px-4 font-semibold"
              style={{ borderColor: settings.textColor, color: settings.textColor }}
            >
              <span aria-hidden="true">{speaking ? "⏹️" : "🔊"}</span>{" "}
              {speaking ? "Stop" : "Tap to hear the time"}
            </button>
          )}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="touch-target rounded-xl border-2 px-4 font-semibold"
            style={{ borderColor: settings.textColor, color: settings.textColor }}
          >
            <span aria-hidden="true">{isFullscreen ? "🡼" : "⛶"}</span>{" "}
            {isFullscreen ? "Exit full screen" : "Full screen"}
          </button>
        </div>
      </div>

      <div className="no-print rounded-2xl border-2 border-border bg-surface p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-bold">Customise</h2>
          <button
            type="button"
            onClick={reset}
            className="touch-target rounded-xl border-2 border-border bg-background px-3 text-sm font-semibold"
          >
            Reset to default
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <fieldset>
            <legend className="mb-1.5 block text-sm font-semibold">Style</legend>
            <OptionButtons<ClockMode>
              options={[
                ["digital", "Digital"],
                ["analog", "Analog"],
              ]}
              value={settings.mode}
              onChange={(v) => updateField("mode", v)}
            />
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
            <OptionButtons<number>
              options={FONT_SCALE_OPTIONS.map(({ value, label }) => [value, label])}
              value={settings.fontScale}
              onChange={(v) => updateField("fontScale", v)}
            />
          </fieldset>

          <div className="flex flex-col gap-2">
            {bool("showWords", "Time in words (e.g. \"Quarter past 3\")")}
            {bool("showPartOfDay", "Morning, afternoon, evening or night")}
            {bool("format24h", "24-hour time")}
            {bool("showSeconds", "Show seconds")}
            {bool("showDate", "Show date")}
          </div>

          {settings.mode === "analog" && (
            <>
              <fieldset>
                <legend className="mb-1.5 block text-sm font-semibold">Numbers on the face</legend>
                <OptionButtons<NumberStyle>
                  options={[
                    ["arabic", "1, 2, 3…"],
                    ["roman", "Roman numerals"],
                    ["none", "No numbers"],
                  ]}
                  value={settings.numberStyle}
                  onChange={(v) => updateField("numberStyle", v)}
                />
              </fieldset>

              <fieldset>
                <legend className="mb-1.5 block text-sm font-semibold">Hand style</legend>
                <OptionButtons<HandStyle>
                  options={[
                    ["classic", "Classic"],
                    ["modern", "Modern"],
                    ["minimal", "Minimal"],
                  ]}
                  value={settings.handStyle}
                  onChange={(v) => updateField("handStyle", v)}
                />
              </fieldset>

              {bool("showMinuteTicks", "Show minute tick marks")}

              <div>
                <span className="mb-1.5 block text-sm font-semibold">Clock face colour</span>
                <SwatchRow
                  colours={FACE_COLOR_PRESETS}
                  value={settings.faceColor}
                  onChange={(c) => updateField("faceColor", c)}
                  labelPrefix="Face colour"
                  allowTransparent
                />
              </div>

              {settings.showSeconds && (
                <div>
                  <span className="mb-1.5 block text-sm font-semibold">Second hand colour</span>
                  <SwatchRow
                    colours={TEXT_COLOR_PRESETS}
                    value={settings.secondHandColor}
                    onChange={(c) => updateField("secondHandColor", c)}
                    labelPrefix="Second hand colour"
                  />
                </div>
              )}
            </>
          )}

          <div>
            <span className="mb-1.5 block text-sm font-semibold">Background colour</span>
            <SwatchRow
              colours={BACKGROUND_PRESETS}
              value={settings.backgroundColor}
              onChange={(c) => updateField("backgroundColor", c)}
              labelPrefix="Background colour"
            />
          </div>

          <div>
            <span className="mb-1.5 block text-sm font-semibold">Text &amp; hands colour</span>
            <SwatchRow
              colours={TEXT_COLOR_PRESETS}
              value={settings.textColor}
              onChange={(c) => updateField("textColor", c)}
              labelPrefix="Text colour"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
