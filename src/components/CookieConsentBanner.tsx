"use client";

import Link from "next/link";
import { useCookieNotice } from "@/lib/cookie-consent-storage";

/**
 * A one-time notice, not a granular consent form - this site has no ads,
 * no analytics, and no tracking cookies to opt in or out of. It exists to
 * plainly disclose the one thing that is actually stored: your tool data,
 * in this browser's local storage on your own device.
 */
export default function CookieConsentBanner() {
  const { showBanner, dismiss } = useCookieNotice();

  if (!showBanner) return null;

  return (
    <div
      role="region"
      aria-label="Cookie and storage notice"
      className="no-print fixed inset-x-0 bottom-0 z-40 border-t-2 border-border bg-surface p-4 shadow-lg"
    >
      <div className="mx-auto flex max-w-4xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm">
          This site doesn&apos;t use ads or tracking cookies. Your tool data
          is saved in this browser&apos;s local storage, on your own
          device, and never sent to us. See our{" "}
          <Link href="/privacy" className="font-semibold text-brand hover:underline">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/terms" className="font-semibold text-brand hover:underline">
            Terms of Use
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="touch-target w-full shrink-0 rounded-xl border-2 border-brand bg-brand px-6 font-semibold text-brand-ink sm:w-auto"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
