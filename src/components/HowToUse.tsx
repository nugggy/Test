"use client";

import { useState } from "react";

interface HowToUseProps {
  steps: string[];
}

export default function HowToUse({ steps }: HowToUseProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="no-print mb-6 rounded-2xl border-2 border-border bg-surface p-5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex min-h-11 w-full items-center justify-between gap-2 text-left"
      >
        <span className="font-display flex items-center gap-3 text-lg font-semibold">
          <span aria-hidden="true" className="grid h-9 w-9 place-items-center rounded-xl bg-accent-soft text-lg">💡</span>
          How to use this tool
        </span>
        <span
          aria-hidden="true"
          className="grid h-8 w-8 place-items-center rounded-full border-2 border-border text-xl leading-none text-muted"
        >
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <ol className="mt-4 grid gap-3 sm:grid-cols-2">
          {steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3 rounded-xl bg-surface-2 p-3 text-sm">
              <span
                aria-hidden="true"
                className="font-display tabular grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand text-sm font-semibold text-brand-ink"
              >
                {i + 1}
              </span>
              <span className="pt-0.5">
                <span className="sr-only">Step {i + 1}: </span>
                {step}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
