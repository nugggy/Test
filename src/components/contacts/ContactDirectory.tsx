"use client";

import { useId, useState } from "react";
import type { UseContactDirectory } from "@/lib/contact-directory-storage";
import ContactEntryEditor from "./ContactEntryEditor";
import PrintButton from "@/components/PrintButton";

interface ContactDirectoryProps {
  directory: ReturnType<UseContactDirectory>;
  categories: string[];
  clearLabel: string;
  /** Set to false when a page already has its own Print button covering
   * this section (e.g. printing it together with other content above it),
   * so the page doesn't end up with two Print buttons. Defaults to true. */
  showPrintButton?: boolean;
}

/** Show a search box once the list is long enough to need one. */
const SEARCH_THRESHOLD = 6;

export default function ContactDirectory({
  directory,
  categories,
  clearLabel,
  showPrintButton = true,
}: ContactDirectoryProps) {
  const { contacts, addContact, updateContact, removeContact, clearAll } = directory;
  const [editingIds, setEditingIds] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const searchId = useId();

  const q = query.trim().toLowerCase();
  const matches = (c: (typeof contacts)[number]) =>
    !q ||
    [c.name, c.organisation, c.phone, c.email, c.notes].some((v) => v.toLowerCase().includes(q));
  const matchCount = contacts.filter(matches).length;

  // Any saved contact whose group isn't in this tool's list still shows.
  const extraCategories = [...new Set(contacts.map((c) => c.category))].filter(
    (c) => !categories.includes(c)
  );
  const allCategories = [...categories, ...extraCategories];

  function startEditing(id: string) {
    setEditingIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }

  function stopEditing(id: string) {
    setEditingIds((prev) => prev.filter((x) => x !== id));
  }

  return (
    <div className="flex flex-col gap-4">
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
      <div className="no-print flex flex-wrap items-end justify-end gap-2">
        {contacts.length >= SEARCH_THRESHOLD && (
          <div className="min-w-0 flex-1">
            <label htmlFor={searchId} className="mb-1 block text-sm font-semibold">
              Search contacts
            </label>
            <input
              id={searchId}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Name, organisation or number"
              className="touch-target w-full rounded-xl border-2 border-border bg-surface px-3"
            />
          </div>
        )}
        {contacts.length > 0 && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`${clearLabel}? This can't be undone.`)) {
                clearAll();
                setEditingIds([]);
                setAnnouncement("All contacts cleared.");
              }
            }}
            className="touch-target rounded-xl border-2 border-border bg-surface px-3 text-sm font-semibold"
          >
            Clear all
          </button>
        )}
        {showPrintButton && <PrintButton />}
      </div>
      {q && (
        <p className="no-print text-sm text-muted" aria-live="polite">
          {matchCount} {matchCount === 1 ? "contact matches" : "contacts match"} your search.
        </p>
      )}

      {allCategories.map((category) => {
        const categoryContacts = contacts.filter((c) => c.category === category && matches(c));
        if (q && categoryContacts.length === 0) return null;
        if (!categories.includes(category) && categoryContacts.length === 0) return null;
        return (
          <section
            key={category}
            aria-label={category}
            className={`rounded-2xl border-2 border-border bg-surface p-4 ${
              categoryContacts.length === 0 ? "print:hidden" : ""
            }`}
          >
            <h2 className="font-display mb-3 text-lg font-bold">{category}</h2>

            {categoryContacts.length > 0 ? (
              <div className="mb-3 flex flex-col gap-3">
                {categoryContacts.map((contact) => (
                  <ContactEntryEditor
                    key={contact.id}
                    contact={contact}
                    categories={categories}
                    editing={editingIds.includes(contact.id)}
                    onEdit={() => startEditing(contact.id)}
                    onDone={() => {
                      stopEditing(contact.id);
                      setAnnouncement(`${contact.name.trim() || "Contact"} saved.`);
                    }}
                    onChange={(patch) => updateContact(contact.id, patch)}
                    onRemove={() => {
                      if (
                        window.confirm(
                          `Remove ${contact.name.trim() || "this contact"}? This can't be undone.`
                        )
                      ) {
                        removeContact(contact.id);
                        stopEditing(contact.id);
                        setAnnouncement(`${contact.name.trim() || "Contact"} removed.`);
                      }
                    }}
                  />
                ))}
              </div>
            ) : (
              <p className="mb-3 text-sm text-muted">No contacts here yet.</p>
            )}

            {categories.includes(category) && (
              <button
                type="button"
                onClick={() => {
                  const id = addContact(category);
                  startEditing(id);
                  setQuery("");
                  setAnnouncement(`New contact added to ${category}. Fill in the details below.`);
                }}
                className="no-print touch-target rounded-xl border-2 border-border bg-background px-4 text-sm font-semibold hover:border-brand"
              >
                + Add to {category}
              </button>
            )}
          </section>
        );
      })}
    </div>
  );
}
