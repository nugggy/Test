import type { ReactNode } from "react";

interface InfoSectionProps {
  title: string;
  icon?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

/**
 * An expand/collapse info card for education-style tools (built on the
 * native <details>/<summary> elements, so it's keyboard- and screen-reader-
 * accessible with no extra JS). Always prints fully expanded - see the
 * `details > *:not(summary)` rule in globals.css.
 */
export default function InfoSection({ title, icon, defaultOpen, children }: InfoSectionProps) {
  return (
    <details
      open={defaultOpen}
      className="print-avoid-break group rounded-2xl border-2 border-border bg-surface p-4 sm:p-5"
    >
      <summary className="font-display flex cursor-pointer items-center justify-between gap-2 text-lg font-semibold touch-target">
        <span className="flex items-center gap-2">
          {icon && <span aria-hidden="true">{icon}</span>}
          {title}
        </span>
        <span
          aria-hidden="true"
          className="shrink-0 text-muted transition-transform group-open:rotate-180"
        >
          ▾
        </span>
      </summary>
      <div className="mt-3 flex flex-col gap-3 text-sm leading-relaxed">{children}</div>
    </details>
  );
}
