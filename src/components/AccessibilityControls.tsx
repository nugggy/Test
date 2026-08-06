"use client";

import { useState, useRef, useEffect, useId } from "react";
import { useAccessibility, type TextSize } from "@/lib/accessibility-context";
import { useTimezone, COMMON_TIMEZONES } from "@/lib/timezone-context";

const TEXT_SIZE_LABELS: Record<TextSize, string> = {
  default: "Standard",
  large: "Large",
  xl: "Extra large",
};

interface ToggleRowProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  const id = useId();
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <div>
        <label htmlFor={id} className="font-semibold">
          {label}
        </label>
        {description && <p className="text-sm text-muted">{description}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-8 w-14 shrink-0 rounded-full border-2 transition-colors ${
          checked ? "border-brand bg-brand" : "border-border bg-background"
        }`}
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-6" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

export default function AccessibilityControls() {
  const {
    textSize,
    setTextSize,
    theme,
    setTheme,
    contrast,
    setContrast,
    font,
    setFont,
    motion,
    setMotion,
    linkStyle,
    setLinkStyle,
    spacing,
    setSpacing,
    touchSize,
    setTouchSize,
  } = useAccessibility();
  const { timezone, setTimezone } = useTimezone();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="accessibility-panel"
        className="touch-target flex items-center gap-2 rounded-xl border-2 border-border bg-surface px-4 py-2 font-semibold hover:border-brand"
      >
        <span aria-hidden="true" className="text-xl">
          ⚙
        </span>
        <span className="hidden sm:inline">Accessibility settings</span>
      </button>

      {open && (
        <div
          id="accessibility-panel"
          role="dialog"
          aria-label="Accessibility settings"
          className="absolute right-0 z-40 mt-2 max-h-[80vh] w-80 max-w-[90vw] overflow-y-auto rounded-2xl border-2 border-border bg-surface p-4 shadow-xl"
        >
          <fieldset className="mb-4">
            <legend className="font-display font-bold mb-2">Text size</legend>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(TEXT_SIZE_LABELS) as TextSize[]).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setTextSize(size)}
                  aria-pressed={textSize === size}
                  className={`min-w-[80px] flex-1 rounded-lg border-2 py-2 px-2 text-sm font-semibold touch-target ${
                    textSize === size
                      ? "border-brand bg-brand text-brand-ink"
                      : "border-border bg-background"
                  }`}
                >
                  {TEXT_SIZE_LABELS[size]}
                </button>
              ))}
            </div>
          </fieldset>

          <ToggleRow
            label="Dark mode"
            description="Switches to a dark background with light text."
            checked={theme === "dark"}
            onChange={(v) => setTheme(v ? "dark" : "default")}
          />
          <ToggleRow
            label="High contrast"
            checked={contrast === "high"}
            onChange={(v) => setContrast(v ? "high" : "default")}
          />
          <ToggleRow
            label="Easy-read font"
            checked={font === "dyslexia"}
            onChange={(v) => setFont(v ? "dyslexia" : "default")}
          />
          <ToggleRow
            label="Reduce motion"
            description="Turns off animations and transitions."
            checked={motion === "reduced"}
            onChange={(v) => setMotion(v ? "reduced" : "default")}
          />
          <ToggleRow
            label="Underline links"
            description="Makes links easier to spot without relying on colour."
            checked={linkStyle === "underline"}
            onChange={(v) => setLinkStyle(v ? "underline" : "default")}
          />
          <ToggleRow
            label="Easy-read spacing"
            description="Adds extra space between lines, letters and words."
            checked={spacing === "relaxed"}
            onChange={(v) => setSpacing(v ? "relaxed" : "default")}
          />
          <ToggleRow
            label="Larger touch targets"
            description="Makes buttons and pictures bigger and easier to tap."
            checked={touchSize === "large"}
            onChange={(v) => setTouchSize(v ? "large" : "default")}
          />

          <div className="mt-1 border-t-2 border-border pt-4">
            <label htmlFor="timezone-select" className="block font-semibold mb-1">
              Timezone
            </label>
            <p className="mb-2 text-sm text-muted">
              Used for dates and times in tools like the schedule and
              behaviour tracker.
            </p>
            <select
              id="timezone-select"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full rounded-xl border-2 border-border bg-background px-3 py-2.5 text-sm touch-target"
            >
              {COMMON_TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
