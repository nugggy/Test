"use client";

import { printPage } from "@/lib/native-app";

interface PrintButtonProps {
  /** Button text. Defaults to the most common label used across tools. */
  label?: string;
  disabled?: boolean;
  /** Extra classes, e.g. to override margin/width in a specific layout. */
  className?: string;
}

/**
 * Shared print/PDF button, used on every tool page instead of a one-off
 * `<button onClick={() => window.print()}>`. Goes through `printPage()` so it
 * also works inside the Android app, where WebViews have no window.print().
 * Styled to stand out from
 * secondary actions (Clear, Download CSV, etc.) - filled accent colour,
 * bold text and a shadow - so it's easy to find at a glance rather than
 * blending in as just another bordered button.
 */
export default function PrintButton({
  label = "Print / Download PDF",
  disabled = false,
  className = "",
}: PrintButtonProps) {
  return (
    <button
      type="button"
      onClick={() => void printPage()}
      disabled={disabled}
      className={`touch-target inline-flex shrink-0 items-center gap-2 rounded-xl border-2 border-accent bg-accent px-5 text-base font-bold text-accent-ink shadow-md shadow-accent/40 transition-transform hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 ${className}`}
    >
      <span aria-hidden="true" className="text-xl">
        🖨️
      </span>
      {label}
    </button>
  );
}
