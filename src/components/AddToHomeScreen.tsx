"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isIos(): boolean {
  return typeof navigator !== "undefined" && /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true;
}

/**
 * A small "add to home screen" nudge shown on tool pages, so a tool opens
 * straight up like an app next time - without a store, an account, or
 * anything to install beyond what the browser already offers.
 *
 * `beforeinstallprompt` (Chrome/Edge/Android) lets us trigger the real
 * install prompt directly. iOS Safari has no equivalent event, so there we
 * fall back to instructions for its manual Share -> Add to Home Screen flow.
 * Browsers that support neither (e.g. desktop Firefox/Safari) show nothing,
 * rather than guessing at instructions we can't verify.
 */
export default function AddToHomeScreen() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [standalone, setStandalone] = useState(true);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStandalone(isStandalone());
    setIos(isIos());

    function handleBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () =>
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  if (standalone || dismissed) return null;
  if (!deferredPrompt && !ios) return null;

  async function handleInstallClick() {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
    } catch {
      // The browser refused (e.g. not a direct user tap) - keep the tip.
      return;
    }
    setDeferredPrompt(null);
  }

  return (
    <div className="no-print mb-6 flex items-start justify-between gap-3 rounded-xl bg-accent-soft px-4 py-3 text-sm">
      <p className="flex-1">
        {deferredPrompt ? (
          <>
            <strong>Add this to your home screen</strong> so it opens straight
            up next time, just like an app.
          </>
        ) : (
          <>
            <strong>Add this to your home screen:</strong> tap the Share
            button in Safari, then &quot;Add to Home Screen&quot;, so it opens
            straight up next time, just like an app.
          </>
        )}
      </p>
      <div className="flex shrink-0 items-center gap-2">
        {deferredPrompt && (
          <button
            type="button"
            onClick={handleInstallClick}
            className="touch-target rounded-xl border-2 border-brand bg-brand px-3 text-sm font-semibold text-brand-ink"
          >
            Add
          </button>
        )}
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="touch-target rounded-xl border-2 border-border bg-surface px-3 text-sm font-semibold"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
