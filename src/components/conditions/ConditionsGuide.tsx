"use client";

import { useState } from "react";
import Link from "next/link";
import { CONDITIONS, type ConditionInfo } from "@/lib/conditions-data";
import { fuzzyIncludes } from "@/lib/fuzzy-match";
import { useScrollIntoViewOnce } from "@/lib/use-scroll-into-view-once";
import PrintButton from "@/components/PrintButton";

export default function ConditionsGuide() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const resultsRef = useScrollIntoViewOnce<HTMLDivElement>(selectedId !== null);

  const filtered = CONDITIONS.filter(
    (c) =>
      fuzzyIncludes(c.name, query) || c.aliases.some((a) => fuzzyIncludes(a, query))
  );
  const selected: ConditionInfo | undefined = CONDITIONS.find((c) => c.id === selectedId);

  return (
    <div className="flex flex-col gap-4">
      <div className="no-print flex flex-wrap items-center justify-end gap-2">
        {!selected && (
          <p className="text-sm text-muted">Choose a condition to print its page.</p>
        )}
        <PrintButton disabled={!selected} />
      </div>

      <div className="no-print rounded-2xl border-2 border-border bg-surface p-4">
        <label htmlFor="condition-search" className="mb-1 block font-semibold">
          Search a condition
        </label>
        <input
          id="condition-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. autism, ADHD, epilepsy"
          className="mb-4 w-full touch-target rounded-xl border-2 border-border bg-background px-4 py-3 text-base"
        />

        <div role="group" aria-label="Choose a condition" className="flex flex-wrap gap-2">
          {filtered.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedId(c.id)}
              aria-pressed={selectedId === c.id}
              className={`touch-target rounded-full border-2 px-4 text-sm font-semibold ${
                selectedId === c.id
                  ? "border-brand bg-brand text-brand-ink"
                  : "border-border bg-background text-muted hover:border-brand"
              }`}
            >
              {c.name}
            </button>
          ))}
          <p aria-live="polite" className="sr-only">
            {query.trim() ? `${filtered.length} conditions match` : ""}
          </p>
          {filtered.length === 0 && (
            <p className="text-sm text-muted">No conditions match &quot;{query}&quot;.</p>
          )}
        </div>
      </div>

      {selected && (
        <div
          ref={resultsRef}
          className="print-avoid-break scroll-mt-20 rounded-2xl border-2 border-brand bg-brand/5 p-4"
        >
          <span className="mb-1 inline-block rounded-full bg-background px-2.5 py-0.5 text-xs font-semibold text-muted">
            {selected.category}
          </span>
          <h2 className="font-display mb-2 text-xl font-bold">{selected.name}</h2>
          <p className="mb-3">{selected.summary}</p>

          <p className="mb-1 font-semibold text-muted">Worth knowing:</p>
          <ul className="mb-4 list-disc space-y-1 pl-5">
            {selected.keyPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>

          <p className="mb-1 font-semibold text-muted">Learn more:</p>
          <ul className="flex flex-wrap gap-2">
            {selected.resources.map((r) => (
              <li key={r.url}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-target inline-flex items-center rounded-xl border-2 border-border bg-surface px-4 text-sm font-semibold text-brand hover:border-brand"
                >
                  {r.name} ↗
                </a>
              </li>
            ))}
          </ul>

          <p className="no-print mt-4 text-sm">
            Getting ready for an NDIS meeting? Write down how this affects
            your daily life in{" "}
            <Link href="/tools/ndis-meeting-prep" className="font-semibold underline">
              NDIS Meeting Prep
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
}
