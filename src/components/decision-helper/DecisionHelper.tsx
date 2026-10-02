"use client";

import { useState } from "react";
import { useDecisionHelper, useDecisionLog } from "@/lib/decision-helper-storage";
import { downloadCsv } from "@/lib/csv-export";
import EditableListSection from "@/components/EditableListSection";
import OptionCard from "./OptionCard";
import PrintButton from "@/components/PrintButton";
import { formatDate } from "@/lib/datetime";
import { useTimezone } from "@/lib/timezone-context";

const PEOPLE_SUGGESTIONS = [
  "Family member",
  "Support worker",
  "Support coordinator",
  "GP",
  "Someone I trust",
];

export default function DecisionHelper() {
  const {
    decision,
    updateField,
    addOption,
    removeOption,
    renameOption,
    updateOptionList,
    clearDecision,
  } = useDecisionHelper();
  const { entries: logEntries, addEntry: addLogEntry, removeEntry: removeLogEntry } =
    useDecisionLog();
  const [newOption, setNewOption] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const { timezone } = useTimezone();

  function handleAddOption(e: React.FormEvent) {
    e.preventDefault();
    if (!newOption.trim()) return;
    addOption(newOption);
    setAnnouncement(`Added option: ${newOption.trim()}`);
    setNewOption("");
  }

  function handleSaveToLog() {
    if (!decision.question.trim() || !decision.finalChoice.trim()) return;
    if (
      !window.confirm(
        "Save this decision to your log and start a new one? You can review saved decisions below."
      )
    ) {
      return;
    }
    addLogEntry(decision);
    clearDecision();
    setAnnouncement("Saved to your decision log. You can start a new decision now.");
  }

  function handleExportCsv() {
    const headers = [
      "Date",
      "Question",
      "Chosen option",
      "Reasoning",
      "All options considered",
      "Pros of chosen option",
      "Cons of chosen option",
      "Likely consequences of chosen option",
    ];
    const rows = logEntries.map((entry) => {
      const chosen = entry.options.find((o) => o.name === entry.finalChoice);
      return [
        new Date(entry.decidedAt).toLocaleDateString("en-AU", { timeZone: timezone }),
        entry.question,
        entry.finalChoice,
        entry.reasoning,
        entry.options.map((o) => o.name).join("; "),
        chosen ? chosen.pros.join("; ") : "",
        chosen ? chosen.cons.join("; ") : "",
        chosen ? chosen.consequences.join("; ") : "",
      ];
    });
    downloadCsv("decision-log", headers, rows);
  }

  const canSaveToLog = decision.question.trim() !== "" && decision.finalChoice.trim() !== "";

  return (
    <div className="flex flex-col gap-4">
      <div className="no-print flex justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Clear this whole decision? This can't be undone.")) {
              clearDecision();
            }
          }}
          className="touch-target rounded-xl border-2 border-border bg-surface px-3 text-sm font-semibold"
        >
          Start over
        </button>
        <PrintButton />
      </div>

      <div className="rounded-2xl border-2 border-border bg-surface p-4">
        <h2 className="font-display text-lg font-bold">What am I deciding?</h2>
        <p className="mb-3 text-sm text-muted">
          Write the decision as a question, in your own words
        </p>
        <textarea
          value={decision.question}
          onChange={(e) => updateField("question", e.target.value)}
          rows={2}
          maxLength={300}
          placeholder="e.g. Should I move into a new share house?"
          className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-base"
        />
      </div>

      <div className="rounded-2xl border-2 border-border bg-surface p-4">
        <h2 className="font-display text-lg font-bold">My options</h2>
        <p className="mb-3 text-sm text-muted">
          Add as many choices as you&apos;re considering - there&apos;s no
          limit - then list what&apos;s for and against each one, and what
          would likely happen next
        </p>

        {decision.options.length > 0 && (
          <div className="mb-3 flex flex-col gap-3">
            {decision.options.map((option) => (
              <OptionCard
                key={option.id}
                option={option}
                onRename={(name) => renameOption(option.id, name)}
                onRemove={() => removeOption(option.id)}
                onChangeList={(key, items) => updateOptionList(option.id, key, items)}
              />
            ))}
          </div>
        )}

        <form onSubmit={handleAddOption} className="no-print flex gap-2">
          <label htmlFor="new-option" className="sr-only">
            Add an option
          </label>
          <input
            id="new-option"
            type="text"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            placeholder="e.g. Stay where I am"
            maxLength={120}
            className="flex-1 rounded-xl border-2 border-border bg-background px-4 py-3 touch-target"
          />
          <button
            type="submit"
            className="touch-target shrink-0 rounded-xl border-2 border-brand bg-brand px-4 font-semibold text-brand-ink"
          >
            Add option
          </button>
        </form>
      </div>

      <EditableListSection
        title="People I can talk to about this"
        description="Anyone whose advice or perspective might help"
        placeholder="e.g. My support coordinator"
        items={decision.peopleToTalkTo}
        suggestions={PEOPLE_SUGGESTIONS}
        onChange={(items) => updateField("peopleToTalkTo", items)}
      />

      <EditableListSection
        title="Questions I want answered first"
        description="Anything you need to find out before you can decide"
        placeholder="e.g. How much will it cost each week?"
        items={decision.questionsToAsk}
        onChange={(items) => updateField("questionsToAsk", items)}
      />

      <div className="rounded-2xl border-2 border-border bg-surface p-4">
        <h2 className="font-display text-lg font-bold">My decision</h2>
        <p className="mb-3 text-sm text-muted">
          There&apos;s no rush - come back to this any time. When you&apos;re
          ready, choose which option you&apos;ve gone with and write down why
        </p>

        {decision.options.length > 0 && (
          <div className="no-print mb-3 flex flex-wrap gap-2">
            {decision.options.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => updateField("finalChoice", o.name)}
                aria-pressed={decision.finalChoice === o.name}
                className={`touch-target rounded-xl border-2 px-4 text-sm font-semibold ${
                  decision.finalChoice === o.name
                    ? "border-brand bg-brand text-brand-ink"
                    : "border-border bg-background"
                }`}
              >
                <span className="flex flex-col items-start">
                  <span>{o.name || "Untitled option"}</span>
                  <span className="text-xs font-normal">
                    {o.pros.length} for, {o.cons.length} against
                  </span>
                </span>
              </button>
            ))}
          </div>
        )}

        <label htmlFor="final-choice" className="mb-1 block text-sm font-semibold">
          What I&apos;ve decided
        </label>
        <input
          id="final-choice"
          type="text"
          value={decision.finalChoice}
          onChange={(e) => updateField("finalChoice", e.target.value)}
          maxLength={120}
          placeholder="e.g. Stay where I am, for now"
          className="mb-3 w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-base touch-target"
        />
        <label htmlFor="reasoning" className="mb-1 block text-sm font-semibold">
          Why
        </label>
        <textarea
          id="reasoning"
          value={decision.reasoning}
          onChange={(e) => updateField("reasoning", e.target.value)}
          rows={3}
          maxLength={500}
          placeholder="e.g. It feels safer and I can revisit this in 6 months"
          className="mb-3 w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-base"
        />

        <button
          type="button"
          onClick={handleSaveToLog}
          disabled={!canSaveToLog}
          className="no-print touch-target rounded-xl border-2 border-brand bg-brand px-4 text-sm font-semibold text-brand-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          Save to my decision log & start a new decision
        </button>
      </div>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      {logEntries.length > 0 && (
        <div className="rounded-2xl border-2 border-border bg-surface p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-lg font-bold">My decision log</h2>
            <button
              type="button"
              onClick={handleExportCsv}
              className="no-print touch-target rounded-xl border-2 border-border bg-background px-3 text-sm font-semibold hover:border-brand"
            >
              ⬇️ Download CSV
            </button>
          </div>
          <p className="mb-3 text-sm text-muted">
            Past decisions you&apos;ve saved, with the options you weighed up
            and the outcome - printed with this page, or downloadable as a
            CSV file
          </p>
          <div className="flex flex-col gap-3">
            {logEntries.map((entry) => (
              <div
                key={entry.id}
                className="print-avoid-break rounded-xl border-2 border-border bg-background p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold text-muted">
                      {formatDate(entry.decidedAt, timezone)}
                    </p>
                    <p className="font-semibold">{entry.question}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("Remove this decision from your log?")) {
                        removeLogEntry(entry.id);
                      }
                    }}
                    aria-label={`Remove "${entry.question}" from your log`}
                    className="no-print touch-target grid shrink-0 place-items-center rounded-xl border-2 border-border bg-surface"
                  >
                    <span aria-hidden="true">🗑️</span>
                  </button>
                </div>
                <p className="mt-2 text-sm">
                  <span className="font-semibold">Chosen: </span>
                  {entry.finalChoice}
                </p>
                {entry.reasoning && (
                  <p className="text-sm text-muted">{entry.reasoning}</p>
                )}
                {entry.options.length > 1 && (
                  <p className="mt-1 text-xs text-muted">
                    Other options considered:{" "}
                    {entry.options
                      .filter((o) => o.name !== entry.finalChoice)
                      .map((o) => o.name)
                      .join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
