"use client";

import { useState } from "react";
import Link from "next/link";
import { EMOTIONS } from "@/lib/emotion-tracker-data";
import { DEFAULT_STRATEGIES, SUPPORT_NOW_MOODS } from "@/lib/what-next-data";
import { useCustomStrategies } from "@/lib/what-next-storage";
import { downloadCsv } from "@/lib/csv-export";
import { useSpeech } from "@/lib/use-speech";
import EditableListSection from "@/components/EditableListSection";
import PrintButton from "@/components/PrintButton";
import { useScrollIntoViewOnce } from "@/lib/use-scroll-into-view-once";

export default function WhatNext() {
  const [selectedMoodId, setSelectedMoodId] = useState<string | null>(null);
  const { custom, updateMoodStrategies } = useCustomStrategies();
  const resultsRef = useScrollIntoViewOnce<HTMLDivElement>(selectedMoodId !== null);
  const { speak, stop, speaking, supported: speechSupported } = useSpeech();

  const selectedMood = EMOTIONS.find((e) => e.id === selectedMoodId);
  const hasAnyCustomStrategies = Object.values(custom).some((list) => list.length > 0);
  const mine = selectedMood ? custom[selectedMood.id] ?? [] : [];
  const ideas = selectedMood ? DEFAULT_STRATEGIES[selectedMood.id] ?? [] : [];

  function handleExportCsv() {
    const rows: [string, string][] = [];
    for (const mood of EMOTIONS) {
      for (const strategy of custom[mood.id] ?? []) {
        rows.push([mood.label, strategy]);
      }
    }
    downloadCsv("my-strategies", ["Mood", "My strategy"], rows);
  }

  function readOut() {
    if (speaking) {
      stop();
      return;
    }
    if (!selectedMood) return;
    // The person's own strategies come first - they are the ones chosen
    // for them, so they matter most.
    const list = [...mine, ...ideas];
    speak(
      `When you're feeling ${selectedMood.label.toLowerCase()}, you could try: ${list.join(". ")}.`
    );
  }

  const myStrategiesSection = selectedMood && (
    <EditableListSection
      title={`My own strategies for feeling ${selectedMood.label.toLowerCase()}`}
      description="Add anything that's worked for you before, or that's been recommended to you by someone who supports you"
      placeholder="e.g. Call my support worker"
      items={mine}
      onChange={(items) => updateMoodStrategies(selectedMood.id, items)}
    />
  );

  return (
    <div className="flex flex-col gap-4">
      {hasAnyCustomStrategies && (
        <div className="no-print flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            className="touch-target rounded-xl border-2 border-border bg-surface px-3 text-sm font-semibold hover:border-brand"
          >
            ⬇️ Download my strategies (CSV)
          </button>
          <PrintButton label="Print" />
        </div>
      )}

      <div className="rounded-2xl border-2 border-border bg-surface p-4">
        <h2 className="font-display mb-3 text-lg font-bold">
          How are you feeling right now?
        </h2>
        <div
          role="group"
          aria-label="Choose a mood"
          className="grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {EMOTIONS.map((mood) => (
            <button
              key={mood.id}
              type="button"
              onClick={() => setSelectedMoodId(mood.id)}
              aria-pressed={selectedMoodId === mood.id}
              className="touch-target flex flex-col items-center justify-center gap-1 rounded-2xl border-4 p-3 text-center shadow-sm transition-transform active:scale-95"
              style={{
                background: `var(--${mood.colorVar})`,
                color: `var(--${mood.colorVar}-ink)`,
                borderColor:
                  selectedMoodId === mood.id ? "var(--foreground)" : "transparent",
              }}
            >
              <span aria-hidden="true" className="text-4xl leading-none">
                {mood.emoji}
              </span>
              <span className="font-display text-sm font-bold sm:text-base">
                {mood.label}
              </span>
              {selectedMoodId === mood.id && (
                <span className="text-xs font-bold">Chosen</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {selectedMood && (
        <div ref={resultsRef} className="flex flex-col gap-4 scroll-mt-20">
          <p aria-live="polite" className="sr-only">
            {`Showing things that can help when you're feeling ${selectedMood.label.toLowerCase()}.`}
          </p>

          {speechSupported && (
            <div className="no-print flex justify-end">
              <button
                type="button"
                onClick={readOut}
                aria-pressed={speaking}
                className="touch-target rounded-xl border-2 border-border bg-surface px-4 font-semibold"
              >
                <span aria-hidden="true">{speaking ? "⏹️" : "🔊"}</span>{" "}
                {speaking ? "Stop" : "Read these out loud"}
              </button>
            </div>
          )}

          {/* A person's own strategies are usually the ones that work best
              for them, so once there are any they come first. */}
          {mine.length > 0 && myStrategiesSection}

          <div className="rounded-2xl border-2 border-border bg-surface p-4">
            <h2 className="font-display text-lg font-bold">
              {mine.length > 0 ? "More ideas" : "Things that can help"} when you&apos;re feeling{" "}
              {selectedMood.label.toLowerCase()}
            </h2>
            <ul className="mt-3 flex flex-col gap-2">
              {ideas.map((strategy, i) => (
                <li
                  key={i}
                  className="rounded-xl border-2 border-border bg-background p-3"
                >
                  {strategy}
                </li>
              ))}
            </ul>
          </div>

          {mine.length === 0 && myStrategiesSection}

          {SUPPORT_NOW_MOODS.includes(selectedMood.id) && (
            <div className="rounded-2xl border-2 border-accent bg-accent-soft p-4">
              <h2 className="font-display font-bold">Need help right now?</h2>
              <p className="mt-1">
                If you or someone else is not safe, call <strong>000</strong>. To talk
                to someone any time, day or night, call Lifeline on{" "}
                <strong>13 11 14</strong>.{" "}
                <Link href="/disclaimer" className="font-semibold text-brand underline">
                  More places to get help
                </Link>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
