"use client";

import { useState } from "react";

interface HowToUseProps {
  steps: string[];
}

export default function HowToUse({ steps }: HowToUseProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="no-print mb-6 rounded-2xl border-2 border-border bg-surface p-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 text-left"
      >
        <span className="font-display flex items-center gap-2 text-lg font-bold">
          <span aria-hidden="true">💡</span> How to use this tool
        </span>
        <span aria-hidden="true" className="text-2xl leading-none text-muted">
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <ol className="mt-3 list-decimal space-y-2 pl-6 text-sm">
          {steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      )}
    </div>
  );
}
