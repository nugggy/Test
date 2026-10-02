"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";

/**
 * The "← All tools" link shown at the top of every tool page. A plain
 * `<Link href="/">` always pushes a fresh navigation, which scrolls the
 * homepage to the top - losing your place in the tool list even if you'd
 * scrolled down to find the tool in the first place. When we can tell the
 * homepage really is the previous entry in this tab's history (same-origin
 * referrer, and there's somewhere to go back to), we use the browser's own
 * back navigation instead, so the homepage restores the scroll position you
 * left it at. Anything else (a bookmark, a shared link, a new tab) falls
 * back to the normal forward navigation to "/".
 */
export default function BackToToolsLink() {
  const router = useRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (typeof window === "undefined" || window.history.length <= 1) return;
    try {
      const referrer = new URL(document.referrer);
      if (referrer.origin === window.location.origin && referrer.pathname === "/") {
        event.preventDefault();
        router.back();
      }
    } catch {
      // Malformed or missing referrer - fall through to the normal link.
    }
  };

  return (
    <nav className="no-print mb-4">
      <Link
        href="/"
        onClick={handleClick}
        className="touch-target inline-flex items-center gap-1.5 rounded-xl border-2 border-border bg-surface px-4 text-base font-semibold text-brand hover:border-brand"
      >
        ← All tools
      </Link>
    </nav>
  );
}
