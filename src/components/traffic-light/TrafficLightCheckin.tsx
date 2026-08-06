"use client";

import { useState } from "react";
import {
  TRAFFIC_LIGHT_STATES,
  ZONE_GUIDE_SUGGESTIONS,
  type TrafficLightState,
} from "@/lib/traffic-light-data";
import { useTrafficLightLog, useZoneGuide } from "@/lib/traffic-light-storage";
import { downloadCsv } from "@/lib/csv-export";
import TrafficLightHistory from "@/components/traffic-light/TrafficLightHistory";
import EditableListSection from "@/components/EditableListSection";
import PrintButton from "@/components/PrintButton";

export default function TrafficLightCheckin() {
  const { entries, addEntry, removeEntry, clearAll } = useTrafficLightLog();
  const { guide, setZoneItems } = useZoneGuide();
  const [selectedId, setSelectedId] = useState<TrafficLightState["id"] | null>(
    null
  );
  const [note, setNote] = useState("");
  const [confirmation, setConfirmation] = useState("");

  const selected = TRAFFIC_LIGHT_STATES.find((s) => s.id === selectedId);
  const selectedZoneGuide = selectedId ? guide[selectedId] : [];

  function handleSave() {
    if (!selected) return;
    addEntry({ state: selected.id, note: note.trim() || undefined });
    setConfirmation(`Logged: ${selected.label}`);
    setSelectedId(null);
    setNote("");
  }

  function handleExportCsv() {
    downloadCsv(
      "traffic-light-history",
      ["Date", "Zone", "Note"],
      entries.map((e) => [
        new Date(e.timestamp).toLocaleString("en-AU"),
        TRAFFIC_LIGHT_STATES.find((s) => s.id === e.state)?.label ?? e.state,
        e.note ?? "",
      ])
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border-2 border-border bg-surface p-4">
        <h2 className="font-display mb-3 text-lg font-bold">
          How are you doing right now?
        </h2>
        <div
          role="group"
          aria-label="Choose a colour"
          className="grid grid-cols-1 gap-3 sm:grid-cols-3"
        >
          {TRAFFIC_LIGHT_STATES.map((state) => (
            <button
              key={state.id}
              type="button"
              onClick={() => setSelectedId(state.id)}
              aria-pressed={selectedId === state.id}
              className="touch-target flex flex-col items-center justify-center gap-2 rounded-2xl border-4 p-6 text-center shadow-sm transition-transform active:scale-95"
              style={{
                background: `var(--${state.colorVar})`,
                borderColor:
                  selectedId === state.id
                    ? "var(--foreground)"
                    : "rgba(0,0,0,0.1)",
              }}
            >
              <span aria-hidden="true" className="text-5xl leading-none">
                {state.emoji}
              </span>
              <span className="font-display text-xl font-bold">
                {state.label}
              </span>
              <span className="text-sm">{state.description}</span>
            </button>
          ))}
        </div>

        {selected && (
          <div className="mt-5 border-t-2 border-border pt-5">
            <p className="mb-3 rounded-xl border-2 border-border bg-background p-3 text-sm">
              <strong>Try this:</strong> {selected.suggestion}
            </p>
            {selectedZoneGuide.length > 0 && (
              <div className="mb-3 rounded-xl border-2 border-border bg-background p-3 text-sm">
                <strong>What this looks like for you:</strong>
                <ul className="mt-1 list-disc pl-5">
                  {selectedZoneGuide.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            <label htmlFor="traffic-note" className="block font-semibold mb-1">
              Anything you want to add? (optional)
            </label>
            <textarea
              id="traffic-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              maxLength={200}
              placeholder="e.g. Loud classroom"
              className="mb-4 w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-base"
            />
            <button
              type="button"
              onClick={handleSave}
              className="touch-target w-full rounded-xl border-2 border-brand bg-brand font-semibold text-brand-ink sm:w-auto sm:px-8"
            >
              Save check-in
            </button>
          </div>
        )}

        <p aria-live="polite" className="sr-only">
          {confirmation}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-display text-lg font-bold">
          What each zone looks like for you
        </h2>
        <p className="-mt-2 text-sm text-muted">
          Everyone shows warning signs differently — write down what each
          colour actually looks like so it&apos;s easier for you and the
          people around you to notice early.
        </p>
        <EditableListSection
          title="🟢 Green looks like…"
          placeholder="e.g. Smiling and telling jokes"
          items={guide.green}
          suggestions={ZONE_GUIDE_SUGGESTIONS.green}
          onChange={(items) => setZoneItems("green", items)}
        />
        <EditableListSection
          title="🟡 Amber looks like…"
          placeholder="e.g. Going quiet, short answers"
          items={guide.amber}
          suggestions={ZONE_GUIDE_SUGGESTIONS.amber}
          onChange={(items) => setZoneItems("amber", items)}
        />
        <EditableListSection
          title="🔴 Red looks like…"
          placeholder="e.g. Shouting, swearing"
          items={guide.red}
          suggestions={ZONE_GUIDE_SUGGESTIONS.red}
          onChange={(items) => setZoneItems("red", items)}
        />
      </div>

      <div className="rounded-2xl border-2 border-border bg-surface p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-bold">History</h2>
          {entries.length > 0 && (
            <div className="no-print flex items-center gap-3">
              <button
                type="button"
                onClick={handleExportCsv}
                className="touch-target rounded-xl border-2 border-border bg-background px-3 text-sm font-semibold hover:border-brand"
              >
                ⬇️ Download CSV
              </button>
              <PrintButton label="Print" />
              <button
                type="button"
                onClick={() => {
                  if (
                    window.confirm("Clear all check-ins? This can't be undone.")
                  ) {
                    clearAll();
                  }
                }}
                className="text-sm font-semibold text-muted hover:text-foreground"
              >
                Clear history
              </button>
            </div>
          )}
        </div>
        <TrafficLightHistory entries={entries} onRemove={removeEntry} />
      </div>
    </div>
  );
}
