"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface Countdown {
  remainingSeconds: number;
  running: boolean;
  finished: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

/**
 * A pausable countdown from `totalSeconds`, driven by wall-clock timestamps
 * (not a naive setInterval decrement) so it stays accurate even if the tab
 * is backgrounded and timers get throttled - the next tick just catches up.
 * Shared by the Visual Timer and the Visual Schedule Builder's per-step
 * countdown.
 */
export function useCountdown(totalSeconds: number, onFinish?: () => void): Countdown {
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const endAtRef = useRef<number | null>(null);
  const onFinishRef = useRef(onFinish);

  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  // Follow prop changes (e.g. a new duration picked) while stopped.
  useEffect(() => {
    if (!running) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRemainingSeconds(totalSeconds);
      setFinished(false);
    }
  }, [totalSeconds, running]);

  // Polls every 200ms rather than a single setTimeout(totalMs) so a paused/
  // resumed timer, or the tab being backgrounded, can't drift the display -
  // each tick just re-reads the true end timestamp.
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      if (endAtRef.current == null) return;
      const msLeft = endAtRef.current - Date.now();
      const secLeft = Math.max(0, Math.ceil(msLeft / 1000));
      setRemainingSeconds(secLeft);
      if (msLeft <= 0) {
        endAtRef.current = null;
        setRunning(false);
        setFinished(true);
        onFinishRef.current?.();
      }
    }, 200);
    return () => clearInterval(id);
  }, [running]);

  const start = useCallback(() => {
    setRemainingSeconds((current) => {
      const seconds = current > 0 ? current : totalSeconds;
      endAtRef.current = Date.now() + seconds * 1000;
      return seconds;
    });
    setFinished(false);
    setRunning(true);
  }, [totalSeconds]);

  const pause = useCallback(() => {
    endAtRef.current = null;
    setRunning(false);
  }, []);

  const reset = useCallback(() => {
    endAtRef.current = null;
    setRunning(false);
    setFinished(false);
    setRemainingSeconds(totalSeconds);
  }, [totalSeconds]);

  return { remainingSeconds, running, finished, start, pause, reset };
}
