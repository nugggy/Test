"use client";

import { useEffect, useRef } from "react";

/**
 * Returns a ref to attach to a results section. The first time `trigger`
 * becomes true (e.g. someone makes their first selection in a tool where
 * tapping a choice reveals results further down the page), the element is
 * smoothly scrolled into view - so the result isn't missed just because it
 * rendered below the fold. Only fires once per mount: later changes to
 * `trigger` (picking a different option, deselecting and reselecting) don't
 * scroll again, so it doesn't fight someone who's already looking at the
 * results. Respects prefers-reduced-motion.
 */
export function useScrollIntoViewOnce<T extends HTMLElement>(trigger: boolean) {
  const ref = useRef<T | null>(null);
  const hasScrolled = useRef(false);

  useEffect(() => {
    if (!trigger || hasScrolled.current || !ref.current) return;
    hasScrolled.current = true;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    ref.current.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }, [trigger]);

  return ref;
}
