"use client";

import type { ContactEntry } from "@/lib/contact-directory-storage";

interface ContactEntryEditorProps {
  contact: ContactEntry;
  categories: string[];
  onChange: (patch: Partial<ContactEntry>) => void;
  onRemove: () => void;
}

export default function ContactEntryEditor({
  contact,
  categories,
  onChange,
  onRemove,
}: ContactEntryEditorProps) {
  return (
    <div className="print-avoid-break rounded-xl border-2 border-border bg-background p-3">
      <div className="mb-2 flex items-start gap-2">
        <input
          type="text"
          value={contact.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Name"
          maxLength={120}
          className="touch-target flex-1 rounded-lg border-2 border-border bg-surface px-3 text-base font-bold"
          aria-label="Name"
        />
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove "${contact.name || "contact"}"`}
          className="no-print touch-target shrink-0 rounded-lg border-2 border-border bg-surface px-3"
        >
          <span aria-hidden="true">🗑️</span>
        </button>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block font-semibold text-muted">Category</span>
          <select
            value={contact.category}
            onChange={(e) => onChange({ category: e.target.value })}
            className="touch-target w-full rounded-lg border-2 border-border bg-surface px-3"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-semibold text-muted">Organisation</span>
          <input
            type="text"
            value={contact.organisation}
            onChange={(e) => onChange({ organisation: e.target.value })}
            placeholder="e.g. Dundaloo"
            maxLength={120}
            className="touch-target w-full rounded-lg border-2 border-border bg-surface px-3"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-semibold text-muted">Phone</span>
          <input
            type="tel"
            value={contact.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="e.g. 0412 345 678"
            maxLength={40}
            className="touch-target w-full rounded-lg border-2 border-border bg-surface px-3"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-semibold text-muted">Email</span>
          <input
            type="email"
            value={contact.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="e.g. name@example.com"
            maxLength={200}
            className="touch-target w-full rounded-lg border-2 border-border bg-surface px-3"
          />
        </label>
      </div>

      <label className="mt-2 block text-sm">
        <span className="mb-1 block font-semibold text-muted">Notes</span>
        <textarea
          value={contact.notes}
          onChange={(e) => onChange({ notes: e.target.value })}
          rows={2}
          maxLength={300}
          placeholder="e.g. Best reached Tuesday to Thursday"
          className="w-full rounded-lg border-2 border-border bg-surface px-3 py-2"
        />
      </label>
    </div>
  );
}
