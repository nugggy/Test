"use client";

import { useId } from "react";
import {
  mailtoHref,
  smsHref,
  telHref,
  type ContactEntry,
} from "@/lib/contact-directory-storage";

interface ContactEntryEditorProps {
  contact: ContactEntry;
  categories: string[];
  editing: boolean;
  onEdit: () => void;
  onDone: () => void;
  onChange: (patch: Partial<ContactEntry>) => void;
  onRemove: () => void;
}

/** Read-only view with tap-to-call / text / email buttons. Also used for printing. */
export function ContactView({
  contact,
  showActions = true,
}: {
  contact: ContactEntry;
  showActions?: boolean;
}) {
  const tel = telHref(contact.phone);
  const sms = smsHref(contact.phone);
  const mail = mailtoHref(contact.email);
  const name = contact.name.trim() || "(no name yet)";

  return (
    <div>
      <p className="font-display text-lg font-bold">{name}</p>
      {contact.organisation.trim() && <p className="text-sm text-muted">{contact.organisation}</p>}
      {contact.phone.trim() && (
        <p className="mt-1 text-lg font-semibold">
          <span className="sr-only">Phone: </span>
          {contact.phone}
        </p>
      )}
      {contact.email.trim() && (
        <p className="break-all text-sm">
          <span className="sr-only">Email: </span>
          {contact.email}
        </p>
      )}
      {contact.notes.trim() && <p className="mt-1 whitespace-pre-wrap text-sm">{contact.notes}</p>}
      {showActions && (tel || mail) && (
        <div className="no-print mt-2 flex flex-wrap gap-2">
          {tel && (
            <a
              href={tel}
              aria-label={`Call ${name}`}
              className="touch-target inline-flex items-center justify-center gap-1 rounded-xl border-2 border-brand bg-brand px-4 font-semibold text-brand-ink"
            >
              <span aria-hidden="true">📞</span> Call
            </a>
          )}
          {sms && (
            <a
              href={sms}
              aria-label={`Send a text message to ${name}`}
              className="touch-target inline-flex items-center justify-center gap-1 rounded-xl border-2 border-border bg-surface px-4 font-semibold"
            >
              <span aria-hidden="true">💬</span> Text
            </a>
          )}
          {mail && (
            <a
              href={mail}
              aria-label={`Email ${name}`}
              className="touch-target inline-flex items-center justify-center gap-1 rounded-xl border-2 border-border bg-surface px-4 font-semibold"
            >
              <span aria-hidden="true">✉️</span> Email
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function ContactEntryEditor({
  contact,
  categories,
  editing,
  onEdit,
  onDone,
  onChange,
  onRemove,
}: ContactEntryEditorProps) {
  const id = useId();
  const name = contact.name.trim() || "contact";

  if (!editing) {
    return (
      <div className="print-avoid-break rounded-xl border-2 border-border bg-background p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <ContactView contact={contact} />
          </div>
          <button
            type="button"
            onClick={onEdit}
            aria-label={`Edit ${name}`}
            className="no-print touch-target shrink-0 rounded-xl border-2 border-border bg-surface px-3 text-sm font-semibold"
          >
            <span aria-hidden="true">✏️</span> Edit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="print-avoid-break rounded-xl border-2 border-brand bg-background p-3">
      {/* Printing shows the clean view, not the form. */}
      <div className="hidden print:block">
        <ContactView contact={contact} showActions={false} />
      </div>

      <div className="no-print">
        <label htmlFor={`${id}-name`} className="mb-1 block text-sm font-semibold text-muted">
          Name
        </label>
        <input
          id={`${id}-name`}
          type="text"
          value={contact.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Name"
          maxLength={120}
          className="touch-target mb-2 w-full rounded-lg border-2 border-border bg-surface px-3 text-base font-bold"
        />

        <div className="grid gap-2 sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block font-semibold text-muted">Group</span>
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
              {!categories.includes(contact.category) && (
                <option value={contact.category}>{contact.category}</option>
              )}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-semibold text-muted">Organisation or role</span>
            <input
              type="text"
              value={contact.organisation}
              onChange={(e) => onChange({ organisation: e.target.value })}
              placeholder="e.g. Sunrise Support Services"
              maxLength={120}
              className="touch-target w-full rounded-lg border-2 border-border bg-surface px-3"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-semibold text-muted">Phone</span>
            <input
              type="tel"
              inputMode="tel"
              autoComplete="off"
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
              autoComplete="off"
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
            className="touch-target w-full rounded-lg border-2 border-border bg-surface px-3 py-2"
          />
        </label>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onDone}
            className="touch-target rounded-xl border-2 border-brand bg-brand px-5 font-semibold text-brand-ink"
          >
            Done
          </button>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${name}`}
            className="touch-target rounded-xl border-2 border-border bg-surface px-4 text-sm font-semibold"
          >
            <span aria-hidden="true">🗑️</span> Remove
          </button>
        </div>
      </div>
    </div>
  );
}
