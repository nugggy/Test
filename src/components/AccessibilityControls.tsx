"use client";

import { useState, useRef, useEffect } from "react";
import { useAccessibility, type TextSize } from "@/lib/accessibility-context";

const TEXT_SIZE_LABELS: Record<TextSize, string> = {
  default: "Standard",
  large: "Large",
  xl: "Extra large",
};

export default function AccessibilityControls() {
  const { textSize, setTextSize, contrast, setContrast, font, setFont } =
    useAccessibility();
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
        <span className="hidden sm:inline">Display settings</span>
      </button>

      {open && (
        <div
          id="accessibility-panel"
          role="dialog"
          aria-label="Display and accessibility settings"
          className="absolute right-0 z-40 mt-2 w-80 max-w-[90vw] rounded-2xl border-2 border-border bg-surface p-4 shadow-xl"
        >
          <fieldset className="mb-4">
            <legend className="font-display font-bold mb-2">Text size</legend>
            <div className="flex gap-2">
              {(Object.keys(TEXT_SIZE_LABELS) as TextSize[]).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setTextSize(size)}
                  aria-pressed={textSize === size}
                  className={`flex-1 rounded-lg border-2 py-2 px-2 text-sm font-semibold touch-target ${
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

          <div className="mb-3 flex items-center justify-between gap-3">
            <label htmlFor="contrast-toggle" className="font-semibold">
              High contrast
            </label>
            <button
              id="contrast-toggle"
              type="button"
              role="switch"
              aria-checked={contrast === "high"}
              onClick={() =>
                setContrast(contrast === "high" ? "default" : "high")
              }
              className={`relative h-8 w-14 shrink-0 rounded-full border-2 transition-colors ${
                contrast === "high"
                  ? "border-brand bg-brand"
                  : "border-border bg-background"
              }`}
            >
              <span
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                  contrast === "high" ? "translate-x-6" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between gap-3">
            <label htmlFor="font-toggle" className="font-semibold">
              Easy-read font
            </label>
            <button
              id="font-toggle"
              type="button"
              role="switch"
              aria-checked={font === "dyslexia"}
              onClick={() => setFont(font === "dyslexia" ? "default" : "dyslexia")}
              className={`relative h-8 w-14 shrink-0 rounded-full border-2 transition-colors ${
                font === "dyslexia"
                  ? "border-brand bg-brand"
                  : "border-border bg-background"
              }`}
            >
              <span
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                  font === "dyslexia" ? "translate-x-6" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
