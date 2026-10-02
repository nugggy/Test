"use client";

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

export default function ContactDirectory({
  directory,
  categories,
  clearLabel,
  showPrintButton = true,
}: ContactDirectoryProps) {
  const { contacts, addContact, updateContact, removeContact, clearAll } = directory;

  return (
    <div className="flex flex-col gap-4">
      <div className="no-print flex justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            if (window.confirm(`${clearLabel}? This can't be undone.`)) {
              clearAll();
            }
          }}
          className="touch-target rounded-xl border-2 border-border bg-surface px-3 text-sm font-semibold"
        >
          Clear all
        </button>
        {showPrintButton && <PrintButton />}
      </div>

      {categories.map((category) => {
        const categoryContacts = contacts.filter((c) => c.category === category);
        return (
          <div
            key={category}
            className="print-avoid-break rounded-2xl border-2 border-border bg-surface p-4"
          >
            <h2 className="font-display mb-3 text-lg font-bold">{category}</h2>

            {categoryContacts.length > 0 && (
              <div className="mb-3 flex flex-col gap-3">
                {categoryContacts.map((contact) => (
                  <ContactEntryEditor
                    key={contact.id}
                    contact={contact}
                    categories={categories}
                    onChange={(patch) => updateContact(contact.id, patch)}
                    onRemove={() => removeContact(contact.id)}
                  />
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => addContact(category)}
              className="no-print touch-target rounded-xl border-2 border-border bg-background px-4 text-sm font-semibold hover:border-brand"
            >
              + Add to {category}
            </button>
          </div>
        );
      })}
    </div>
  );
}
