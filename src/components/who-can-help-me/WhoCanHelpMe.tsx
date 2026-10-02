"use client";

import { useState } from "react";
import { FEELING_TAGS, SERVICES } from "@/lib/who-can-help-data";
import PrintButton from "@/components/PrintButton";
import { useScrollIntoViewOnce } from "@/lib/use-scroll-into-view-once";

export default function WhoCanHelpMe() {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const resultsRef = useScrollIntoViewOnce<HTMLDivElement>(activeTag !== null);

  const filtered = activeTag
    ? SERVICES.filter((s) => s.tags.includes(activeTag))
    : SERVICES;

  return (
    <div className="flex flex-col gap-4">
      <div className="no-print flex justify-end">
        <PrintButton label="Print this list" />
      </div>

      {/* Always visible, whatever filter is picked - 000 and a "not sure who
          to call" option should never be filtered out of view. */}
      <div className="print-avoid-break rounded-2xl border-2 border-accent bg-accent-soft p-4">
        <h2 className="font-display text-lg font-bold">In danger right now?</h2>
        <p className="mb-3 text-sm">
          If you or someone else might get hurt, or it&apos;s a medical
          emergency, call 000 now.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="tel:000"
            className="touch-target inline-flex items-center rounded-xl border-2 border-brand bg-brand px-5 text-lg font-bold text-brand-ink"
          >
            <span aria-hidden="true">📞&nbsp;</span>Call 000
          </a>
          <a
            href="tel:131114"
            className="touch-target inline-flex flex-col justify-center rounded-xl border-2 border-border bg-surface px-4 py-2 font-semibold hover:border-brand"
          >
            <span>Not sure who to call?</span>
            <span className="font-bold">Lifeline 13 11 14 (24/7)</span>
          </a>
        </div>
      </div>

      <div className="rounded-2xl border-2 border-border bg-surface p-4">
        <h2 className="font-display mb-3 text-lg font-bold">What&apos;s going on?</h2>
        <p className="mb-3 text-sm text-muted">
          Tap what best describes how you&apos;re feeling right now, to
          narrow the list - or leave it on &quot;All&quot; to see everyone.
        </p>
        <div role="group" aria-label="Filter by feeling" className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            aria-pressed={activeTag === null}
            className={`touch-target rounded-full border-2 px-4 text-sm font-semibold ${
              activeTag === null
                ? "border-brand bg-brand text-brand-ink"
                : "border-border bg-background text-muted"
            }`}
          >
            All
          </button>
          {FEELING_TAGS.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => setActiveTag(activeTag === tag.id ? null : tag.id)}
              aria-pressed={activeTag === tag.id}
              className={`touch-target rounded-full border-2 px-4 text-sm font-semibold ${
                activeTag === tag.id
                  ? "border-brand bg-brand text-brand-ink"
                  : "border-border bg-background text-muted"
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      <p aria-live="polite" className="text-sm font-semibold text-muted">
        {activeTag
          ? `Showing ${filtered.length} ${filtered.length === 1 ? "service" : "services"} for "${FEELING_TAGS.find((t) => t.id === activeTag)?.label ?? ""}"`
          : `Showing all ${filtered.length} services`}
      </p>

      <div ref={resultsRef} className="flex flex-col gap-3 scroll-mt-20">
        {filtered.map((service) => (
          <div
            key={service.id}
            className="print-avoid-break rounded-2xl border-2 border-border bg-surface p-4"
          >
            <h3 className="font-display text-lg font-bold">{service.name}</h3>
            <p className="mt-1 text-sm">{service.description}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              {service.needsVerification ? (
                <span className="text-sm font-semibold text-muted">
                  See description above for how to find one
                </span>
              ) : (
                <a
                  href={`tel:${service.phone.replace(/\s/g, "")}`}
                  className="touch-target inline-flex items-center rounded-xl border-2 border-brand bg-brand px-4 text-base font-bold text-brand-ink"
                >
                  📞 {service.phone}
                </a>
              )}
              {service.website && (
                <a
                  href={service.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-target inline-flex items-center rounded-xl border-2 border-border bg-background px-4 text-sm font-semibold text-brand hover:border-brand"
                >
                  🌐 Website
                </a>
              )}
              {service.hours && (
                <span className="text-sm text-muted">{service.hours}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
