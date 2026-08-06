"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "dt:cookie-notice:v1";

/**
 * Tracks whether the person has dismissed the cookie/local storage notice.
 * There's nothing to opt in or out of here (no ads, no tracking or
 * analytics cookies) - this is a one-time acknowledgement, not a consent
 * management platform, because there are no optional categories to choose
 * between. See CookieConsentBanner for what's actually disclosed.
 */
export function useCookieNotice() {
  const [dismissed, setDismissed] = useState(true); // default true avoids a flash before hydration
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDismissed(window.localStorage.getItem(STORAGE_KEY) === "1");
    setHydrated(true);
  }, []);

  function dismiss() {
    setDismissed(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // If storage is unavailable, the banner will just reappear next
      // visit - not a functional problem, nothing depends on this value.
    }
  }

  return { showBanner: hydrated && !dismissed, dismiss };
}
