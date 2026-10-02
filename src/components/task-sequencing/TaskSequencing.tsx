"use client";

import { useState } from "react";
import { useTaskSequences } from "@/lib/task-sequencing-storage";
import TaskSequenceEditor from "./TaskSequenceEditor";

export default function TaskSequencing() {
  const {
    sequences,
    addSequence,
    removeSequence,
    addStep,
    removeStep,
    moveStep,
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

  if (selected) {
    return (
      <TaskSequenceEditor
        sequence={selected}
        onAddStep={(label, emoji) => addStep(selected.id, { label, emoji })}
        onRemoveStep={(stepId) => removeStep(selected.id, stepId)}
        onMoveStep={(stepId, direction) => moveStep(selected.id, stepId, direction)}
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
            No sequences yet - create your first one below, e.g. &quot;Brushing
            teeth&quot; or &quot;Making toast&quot;.
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
                    <span className="font-semibold">{seq.name}</span>
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

        <form onSubmit={handleCreate} className="flex gap-2">
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
            className="touch-target flex-1 rounded-xl border-2 border-border bg-background px-4"
          />
          <button
            type="submit"
            className="touch-target shrink-0 rounded-xl border-2 border-brand bg-brand px-4 font-semibold text-brand-ink"
          >
            + New sequence
          </button>
        </form>
      </div>
    </div>
  );
}
