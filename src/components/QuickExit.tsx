"use client";

import { isAndroidApp } from "@/lib/native-app";

/**
 * "Quick exit" for pages someone may need to hide fast (for example from a
 * controlling partner or family member): one tap replaces this page with a
 * neutral one. `location.replace` swaps the current history entry, so the
 * back button doesn't return to the page that was showing.
 *
 * In the Android app it goes to the Weather tool (external sites would open
 * in a separate browser, leaving this page on screen); in a browser it goes
 * to Google. This hides the screen quickly; it does not erase browser
 * history, which the page explains next to the button.
 */
export default function QuickExit() {
  function leave() {
    if (isAndroidApp()) {
      window.location.replace("/tools/weather");
    } else {
      window.location.replace("https://www.google.com.au/");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={leave}
        aria-label="Quick exit: leave this page now"
        className="no-print touch-target fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-2xl bg-ink-block px-5 text-lg font-semibold text-ink-block-fg shadow-xl"
      >
        <span aria-hidden="true">✕</span> Quick exit
      </button>
      <p className="no-print mb-6 rounded-xl bg-surface-2 px-4 py-3 text-sm">
        <strong>Quick exit:</strong> tap the button in the corner to leave this
        page straight away. It hides the screen quickly, but it doesn&apos;t
        clear your browser history.
      </p>
    </>
  );
}
