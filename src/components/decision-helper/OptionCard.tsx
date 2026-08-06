"use client";

import { useState } from "react";
import type { DecisionOption } from "@/lib/decision-helper-storage";
import EditableListSection from "@/components/EditableListSection";

interface OptionCardProps {
  option: DecisionOption;
  onRename: (name: string) => void;
  onRemove: () => void;
  onChangeList: (key: "pros" | "cons" | "consequences", items: string[]) => void;
}

export default function OptionCard({
  option,
  onRename,
  onRemove,
  onChangeList,
}: OptionCardProps) {
  const [name, setName] = useState(option.name);

  return (
    <div className="rounded-2xl border-2 border-brand/40 bg-background p-4">
      <div className="mb-3 flex items-center gap-2">
        <label className="sr-only" htmlFor={`option-name-${option.id}`}>
          Option name
        </label>
        <input
          id={`option-name-${option.id}`}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => onRename(name.trim() || option.name)}
          maxLength={120}
          className="touch-target flex-1 rounded-xl border-2 border-border bg-surface px-4 text-base font-bold"
        />
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove option "${option.name}"`}
          className="no-print touch-target shrink-0 rounded-xl border-2 border-border bg-surface px-3"
        >
          <span aria-hidden="true">🗑️</span>
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <EditableListSection
          title="👍 For"
          placeholder="e.g. Closer to home"
          items={option.pros}
          onChange={(items) => onChangeList("pros", items)}
        />
        <EditableListSection
          title="👎 Against"
          placeholder="e.g. Costs more"
          items={option.cons}
          onChange={(items) => onChangeList("cons", items)}
        />
      </div>

      <div className="mt-3">
        <EditableListSection
          title="🔮 What would likely happen next"
          description="The natural, realistic consequences if you picked this option"
          placeholder="e.g. I'd need to give 4 weeks' notice"
          items={option.consequences}
          onChange={(items) => onChangeList("consequences", items)}
        />
      </div>
    </div>
  );
}
