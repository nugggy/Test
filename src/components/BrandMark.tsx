interface BrandMarkProps {
  /** Extra classes for sizing, e.g. "h-9 w-9". */
  className?: string;
}

/**
 * The My Support Buddy mark: a friendly smiling face on a teal rounded
 * square. The same artwork is used for the site favicon/PWA icon
 * (`public/icon.svg`) and the Android launcher icon (`mobile/assets/`), so
 * keep all three in step if the design changes. Decorative only: callers
 * put the product name in text next to it.
 */
export default function BrandMark({ className = "h-9 w-9" }: BrandMarkProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 128 128"
      className={`shrink-0 ${className}`}
    >
      <rect width="128" height="128" rx="28" fill="var(--brand)" />
      <circle cx="64" cy="64" r="42" fill="#ffffff" />
      <circle cx="49" cy="56" r="4.5" fill="var(--brand)" />
      <circle cx="79" cy="56" r="4.5" fill="var(--brand)" />
      <path
        d="M47 74 Q64 88 81 74"
        fill="none"
        stroke="var(--brand)"
        strokeWidth="7"
        strokeLinecap="round"
      />
    </svg>
  );
}
