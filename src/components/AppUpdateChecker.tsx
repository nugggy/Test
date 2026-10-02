"use client";

import { useEffect, useState } from "react";
import {
  type AndroidRelease,
  isCheckDue,
  parseInstalledVersion,
  pickLatestAndroidRelease,
  RELEASES_API_URL,
  shouldOfferUpdate,
} from "@/lib/app-update";

const LAST_CHECK_KEY = "toolkit-android-update-last-check";
const LATEST_KEY = "toolkit-android-update-latest";
const DISMISSED_KEY = "toolkit-android-update-dismissed";

function readJson<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage may be unavailable (private mode, full). The check simply runs again next launch.
  }
}

/**
 * Update channel for the Android app shell. Renders nothing in a normal
 * browser. Inside the app it checks GitHub Releases (at most once an hour)
 * for a newer "android-v*" release and offers the APK download. Any network
 * or parsing problem is silent: an update prompt is never worth an error.
 */
export default function AppUpdateChecker() {
  const [installedVersion, setInstalledVersion] = useState<string | null>(null);
  const [latest, setLatest] = useState<AndroidRelease | null>(null);
  const [dismissedVersion, setDismissedVersion] = useState<string | null>(null);

  useEffect(() => {
    const installed = parseInstalledVersion(navigator.userAgent);
    if (!installed) return;
    // Hydration-safe read of browser-only state, same pattern as the
    // localStorage hooks in src/lib/*-storage.ts.
    /* eslint-disable react-hooks/set-state-in-effect */
    setInstalledVersion(installed);
    setDismissedVersion(readJson<string>(DISMISSED_KEY));
    const cached = readJson<AndroidRelease>(LATEST_KEY);
    if (cached && typeof cached.version === "string") setLatest(cached);
    /* eslint-enable react-hooks/set-state-in-effect */

    if (!isCheckDue(readJson<number>(LAST_CHECK_KEY), Date.now())) return;

    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(RELEASES_API_URL, {
          signal: controller.signal,
          headers: { Accept: "application/vnd.github+json" },
        });
        if (!res.ok) return;
        const picked = pickLatestAndroidRelease(await res.json());
        writeJson(LAST_CHECK_KEY, Date.now());
        if (picked) {
          writeJson(LATEST_KEY, picked);
          setLatest(picked);
        }
      } catch {
        // Offline or rate limited: try again next launch.
      }
    })();
    return () => controller.abort();
  }, []);

  if (!installedVersion || !shouldOfferUpdate({ installedVersion, latest, dismissedVersion })) {
    return null;
  }
  const release = latest as AndroidRelease;

  const dismiss = () => {
    writeJson(DISMISSED_KEY, release.version);
    setDismissedVersion(release.version);
  };

  return (
    <section
      role="status"
      aria-live="polite"
      aria-labelledby="app-update-title"
      className="no-print border-b-2 border-brand/40 bg-brand/10 px-4 py-3"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p id="app-update-title" className="font-display text-lg font-bold">
            A new version of the My Support Buddy app is ready (v{release.version})
          </p>
          <p className="text-sm text-muted">
            You have v{installedVersion}. Download the update, then open the file to install it.
          </p>
          {release.notes && (
            <details className="mt-1 text-sm">
              <summary className="cursor-pointer font-semibold text-brand">What&apos;s new</summary>
              <p className="mt-1 whitespace-pre-line">{release.notes}</p>
            </details>
          )}
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <a
            href={release.apkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="touch-target inline-flex items-center justify-center rounded-xl bg-brand px-5 font-bold text-brand-ink"
          >
            Download update
          </a>
          <button
            type="button"
            onClick={dismiss}
            className="touch-target inline-flex items-center justify-center rounded-xl border-2 border-border bg-surface px-5 font-semibold"
          >
            Not now
          </button>
        </div>
      </div>
    </section>
  );
}
