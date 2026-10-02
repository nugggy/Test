"use client";

import { useState } from "react";
import { useTaskSequences } from "@/lib/task-sequencing-storage";
import { SEQUENCE_TEMPLATES } from "@/lib/task-sequencing-templates";
import TaskSequenceEditor from "./TaskSequenceEditor";

export default function TaskSequencing() {
  const {
    sequences,
    addSequence,
    renameSequence,
    removeSequence,
    addStep,
    removeStep,
    moveStep,
    updateStep,
    toggleStepDone,
    resetSequence,
  } = useTaskSequences();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  const selected = sequences.find((seq) => seq.id === selectedId) ?? null;

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const id = addSequence(newName);
    if (id) {
      setSelectedId(id);
      setNewName("");
    }
  }

  function handleFromTemplate(templateId: string) {
    const template = SEQUENCE_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;
    const id = addSequence(template.name, template.steps);
    if (id) setSelectedId(id);
  }

  if (selected) {
    return (
      <TaskSequenceEditor
        // Re-mount per sequence so its view (run or edit) starts fresh.
        key={selected.id}
        sequence={selected}
        onRename={(name) => renameSequence(selected.id, name)}
        onAddStep={(label, emoji) => addStep(selected.id, { label, emoji })}
        onRemoveStep={(stepId) => removeStep(selected.id, stepId)}
        onMoveStep={(stepId, direction) => moveStep(selected.id, stepId, direction)}
        onUpdateStep={(stepId, changes) => updateStep(selected.id, stepId, changes)}
        onToggleStepDone={(stepId) => toggleStepDone(selected.id, stepId)}
        onResetSequence={() => resetSequence(selected.id)}
        onRemoveSequence={() => {
          removeSequence(selected.id);
          setSelectedId(null);
        }}
        onClose={() => setSelectedId(null)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border-2 border-border bg-surface p-4">
        <h2 className="font-display mb-3 text-lg font-bold">My sequences</h2>
        {sequences.length === 0 ? (
          <p className="mb-3 rounded-xl border-2 border-dashed border-border p-6 text-center text-muted">
            No sequences yet. Start from an example below, or make your own.
          </p>
        ) : (
          <ul className="mb-3 flex flex-col gap-2">
            {sequences.map((seq) => {
              const doneCount = seq.steps.filter((s) => s.done).length;
              return (
                <li key={seq.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(seq.id)}
                    className="touch-target flex w-full items-center justify-between gap-2 rounded-xl border-2 border-border bg-background px-4 text-left hover:border-brand"
                  >
                    <span className="flex items-center gap-3 font-semibold">
                      <span aria-hidden="true" className="text-2xl">
                        {seq.steps[0]?.emoji ?? "📋"}
                      </span>
                      {seq.name}
                    </span>
                    <span className="text-sm text-muted">
                      {seq.steps.length === 0
                        ? "No steps yet"
                        : `${doneCount} of ${seq.steps.length} done`}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <form onSubmit={handleCreate} className="flex flex-wrap gap-2">
          <label htmlFor="new-sequence-name" className="sr-only">
            New sequence name
          </label>
          <input
            id="new-sequence-name"
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Getting ready for bed"
            maxLength={60}
            className="touch-target min-w-0 flex-1 rounded-xl border-2 border-border bg-background px-4"
          />
          <button
            type="submit"
            disabled={!newName.trim()}
            className="touch-target shrink-0 rounded-xl border-2 border-brand bg-brand px-4 font-semibold text-brand-ink disabled:opacity-40"
          >
            + New sequence
          </button>
        </form>
      </div>

      <section
        aria-labelledby="sequence-templates-heading"
        className="rounded-2xl border-2 border-border bg-surface p-4"
      >
        <h2 id="sequence-templates-heading" className="font-display text-lg font-bold">
          Start from an example
        </h2>
        <p className="mb-3 text-sm text-muted">
          Each example makes your own copy. Change, add or remove steps so it matches how the
          task is done at home.
        </p>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {SEQUENCE_TEMPLATES.map((template) => (
            <li key={template.id}>
              <button
                type="button"
                onClick={() => handleFromTemplate(template.id)}
                className="touch-target flex w-full items-center gap-3 rounded-xl border-2 border-border bg-background px-4 text-left font-semibold hover:border-brand"
              >
                <span aria-hidden="true" className="text-3xl">
                  {template.emoji}
                </span>
                <span>
                  {template.name}
                  <span className="block text-sm font-normal text-muted">
                    {template.steps.length} steps
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
