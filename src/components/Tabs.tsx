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
    <div role="tablist" aria-label={label} className="no-print flex gap-2 overflow-x-auto pb-1">
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={active === t.id}
          onClick={() => onChange(t.id)}
          className="touch-target shrink-0 rounded-xl border-2 px-4 font-semibold"
          style={{
            borderColor: active === t.id ? "var(--brand)" : "var(--border)",
            background: active === t.id ? "var(--brand)" : "var(--surface)",
            color: active === t.id ? "var(--brand-ink)" : "var(--foreground)",
          }}
        >
          {t.icon ? `${t.icon} ` : ""}
          {t.label}
        </button>
      ))}
    </div>
  );
}
