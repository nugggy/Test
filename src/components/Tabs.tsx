"use client";

export interface TabDef<T extends string> {
  id: T;
  label: string;
  icon?: string;
}

interface TabsProps<T extends string> {
  tabs: TabDef<T>[];
  active: T;
  onChange: (id: T) => void;
  label: string;
}

export default function Tabs<T extends string>({ tabs, active, onChange, label }: TabsProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="no-print flex gap-1 overflow-x-auto rounded-2xl border-2 border-border bg-surface-2 p-1"
    >
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={active === t.id}
          onClick={() => onChange(t.id)}
          className={`touch-target shrink-0 rounded-xl px-4 font-semibold transition-colors ${
            active === t.id
              ? "bg-surface text-foreground shadow-md"
              : "text-muted hover:text-foreground"
          }`}
        >
          {t.icon ? `${t.icon} ` : ""}
          {t.label}
        </button>
      ))}
    </div>
  );
}
