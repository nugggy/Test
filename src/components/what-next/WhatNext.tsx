"use client";

import { useState } from "react";
import { EMOTIONS } from "@/lib/emotion-tracker-data";
import { DEFAULT_STRATEGIES } from "@/lib/what-next-data";
import { useCustomStrategies } from "@/lib/what-next-storage";
import { downloadCsv } from "@/lib/csv-export";
import EditableListSection from "@/components/EditableListSection";
import PrintButton from "@/components/PrintButton";

export default function WhatNext() {
  const [selectedMoodId, setSelectedMoodId] = useState<string | null>(null);
  const { custom, updateMoodStrategies } = useCustomStrategies();

  const selectedMood = EMOTIONS.find((e) => e.id === selectedMoodId);
  const hasAnyCustomStrategies = Object.values(custom).some((list) => list.length > 0);

  function handleExportCsv() {
    const rows: [string, string][] = [];
    for (const mood of EMOTIONS) {
      for (const strategy of custom[mood.id] ?? []) {
        rows.push([mood.label, strategy]);
      }
    }
    downloadCsv("my-strategies", ["Mood", "My strategy"], rows);
  }

  return (
    <div className="flex flex-col gap-4">
      {hasAnyCustomStrategies && (
        <div className="no-print flex justify-end gap-2">
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
              className="touch-target flex flex-col items-center justify-center gap-1 rounded-2xl border-2 p-3 text-center shadow-sm transition-transform active:scale-95"
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
            </button>
          ))}
        </div>
      </div>

      {selectedMood && (
        <>
          <div className="rounded-2xl border-2 border-border bg-surface p-4">
            <h2 className="font-display text-lg font-bold">
              Things that can help when you&apos;re feeling {selectedMood.label.toLowerCase()}
            </h2>
            <ul className="mt-3 flex flex-col gap-2">
              {DEFAULT_STRATEGIES[selectedMood.id]?.map((strategy, i) => (
                <li
                  key={i}
                  className="rounded-xl border-2 border-border bg-background p-3 text-sm"
                >
                  {strategy}
                </li>
              ))}
            </ul>
          </div>

          <EditableListSection
            title={`My own strategies for feeling ${selectedMood.label.toLowerCase()}`}
            description="Add anything that's worked for you before, or that's been recommended to you by someone who supports you"
            placeholder="e.g. Call my support worker"
            items={custom[selectedMood.id] ?? []}
            onChange={(items) => updateMoodStrategies(selectedMood.id, items)}
          />
        </>
      )}
    </div>
  );
}
