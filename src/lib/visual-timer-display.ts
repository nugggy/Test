"use client";

import { useCallback, useEffect, useState, type RefObject } from "react";

/**
 * Full-screen display, shared by the Visual Timer, Easy-Read Clock,
 * Communication Board and Core Word Board.
 *
 * Uses the browser Fullscreen API where it exists. Where it doesn't (iPhone
 * Safari, some Android WebViews including the app shell) it falls back to a
 * fixed overlay that covers the page, so "Full screen" always does
 * something visible instead of silently failing.
 *
 * Also listens for `fullscreenchange`, so leaving full screen with the Esc
 * key or a system gesture keeps the button label in sync.
 */
export function useFullscreenDisplay(ref: RefObject<HTMLElement | null>) {
  const [nativeFullscreen, setNativeFullscreen] = useState(false);
  const [overlay, setOverlay] = useState(false);

  useEffect(() => {
    function handleChange() {
      setNativeFullscreen(
        !!document.fullscreenElement && document.fullscreenElement === ref.current
      );
    }
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, [ref]);

  // Esc closes the overlay fallback, matching native full screen.
  useEffect(() => {
    if (!overlay) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOverlay(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [overlay]);

  const exit = useCallback(async () => {
    setOverlay(false);
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch {
        // Already left full screen - nothing to do.
      }
    }
  }, []);

  const toggle = useCallback(async () => {
    if (nativeFullscreen || overlay) {
      await exit();
      return;
    }
    const el = ref.current;
    if (el && typeof el.requestFullscreen === "function" && document.fullscreenEnabled) {
      try {
        await el.requestFullscreen();
        return;
      } catch {
        // Fall through to the overlay below.
      }
    }
    setOverlay(true);
  }, [nativeFullscreen, overlay, exit, ref]);

  return { isFullscreen: nativeFullscreen || overlay, isOverlay: overlay, toggle, exit };
}

/** Size (in px) for a large display face that fits the current window,
 * used while full screen so the timer or clock fills the room's view. */
export function useViewportFaceSize(active: boolean, fallback: number): number {
  const [size, setSize] = useState(fallback);

  useEffect(() => {
    if (!active) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSize(fallback);
      return;
    }
    function measure() {
      // Leave room for the buttons and labels under the face.
      const s = Math.min(window.innerWidth * 0.85, (window.innerHeight - 260) * 0.95);
      setSize(Math.max(fallback, Math.floor(s)));
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active, fallback]);

  return size;
}

interface WakeLockSentinelLike {
  release: () => Promise<void>;
}

/** Keeps the screen awake while `active` is true (a running timer, or a
 * clock on the wall), where the Screen Wake Lock API is supported. Silently
 * does nothing elsewhere. The lock is re-requested when the page becomes
 * visible again, because browsers drop it whenever the tab is hidden. */
export function useWakeLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const nav = navigator as Navigator & {
      wakeLock?: { request: (type: "screen") => Promise<WakeLockSentinelLike> };
    };
    if (!nav.wakeLock) return;
    let sentinel: WakeLockSentinelLike | null = null;
    let cancelled = false;

    async function request() {
      try {
        const lock = await nav.wakeLock!.request("screen");
        if (cancelled) {
          lock.release().catch(() => {});
        } else {
          sentinel = lock;
        }
      } catch {
        // Denied (battery saver, not visible, etc) - the screen may sleep.
      }
    }

    function handleVisibility() {
      if (document.visibilityState === "visible") request();
    }

    request();
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", handleVisibility);
      sentinel?.release().catch(() => {});
    };
  }, [active]);
}

/** A single soft chime - a gentle "heads up" that is clearly different from
 * the three-beep "time's up" alert. Generated with Web Audio, so it works
 * offline. Silently does nothing where audio is blocked or unsupported. */
export function playSoftChime() {
  try {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    const ctx = new Ctor();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 660;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.85);
    setTimeout(() => ctx.close().catch(() => {}), 1200);
  } catch {
    // Audio blocked - the on-screen warning still shows.
  }
}

/** Plain-words version of a number of seconds, for spoken and on-screen
 * warnings, e.g. "1 minute", "2 minutes", "30 seconds". */
export function describeSeconds(seconds: number): string {
  if (seconds >= 60 && seconds % 60 === 0) {
    const m = seconds / 60;
    return m === 1 ? "1 minute" : `${m} minutes`;
  }
  if (seconds < 60) return seconds === 1 ? "1 second" : `${seconds} seconds`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m} min ${s} sec`;
}
