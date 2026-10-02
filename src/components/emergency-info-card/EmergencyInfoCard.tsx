"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  EMERGENCY_CONTACT_CATEGORY,
  KEY_CONTACT_CATEGORY,
  formatDob,
  useAboutMeProfile,
  useEmergencyCardContacts,
  type AboutMeProfile,
} from "@/lib/emergency-info-card-storage";
import { telHref, type ContactEntry } from "@/lib/contact-directory-storage";
import { formatDate } from "@/lib/datetime";
import { useTimezone } from "@/lib/timezone-context";
import ContactDirectory from "@/components/contacts/ContactDirectory";
import PrintButton from "@/components/PrintButton";

function Field({ label, value, large }: { label: string; value: string; large: boolean }) {
  if (!value.trim()) return null;
  return (
    <div className="print-avoid-break">
      <p className="text-sm font-bold uppercase tracking-wide text-muted">{label}</p>
      <p className={`whitespace-pre-wrap ${large ? "text-xl" : ""}`}>{value}</p>
    </div>
  );
}

function CardContact({ contact, large }: { contact: ContactEntry; large: boolean }) {
  const tel = telHref(contact.phone);
  const name = contact.name.trim() || "(no name)";
  return (
    <li className="print-avoid-break flex flex-wrap items-center justify-between gap-2 rounded-xl border-2 border-border bg-background p-3">
      <div className="min-w-0">
        <p className={`font-bold ${large ? "text-xl" : ""}`}>
          {name}
          {contact.organisation.trim() && (
            <span className="font-normal text-muted"> ({contact.organisation})</span>
          )}
        </p>
        {contact.phone.trim() && (
          <p className={`font-semibold ${large ? "text-2xl" : "text-lg"}`}>{contact.phone}</p>
        )}
        {contact.notes.trim() && <p className="text-sm">{contact.notes}</p>}
      </div>
      {tel && (
        <a
          href={tel}
          aria-label={`Call ${name}`}
          className="no-print touch-target inline-flex items-center justify-center gap-1 rounded-xl border-2 border-brand bg-brand px-4 font-semibold text-brand-ink"
        >
          <span aria-hidden="true">📞</span> Call
        </a>
      )}
    </li>
  );
}

function isProfileEmpty(profile: AboutMeProfile) {
  return (
    !profile.name.trim() &&
    !profile.preferredName.trim() &&
    !profile.conditions.trim() &&
    !profile.allergies.trim() &&
    !profile.medications.trim() &&
    !profile.communicationNeeds.trim() &&
    !profile.whatHelpsInCrisis.trim() &&
    !profile.otherInfo.trim()
  );
}

export default function EmergencyInfoCard() {
  const { profile, updateField, clearProfile } = useAboutMeProfile();
  const contactsDirectory = useEmergencyCardContacts();
  const { timezone } = useTimezone();
  // "native" = browser full screen, "overlay" = fallback for browsers
  // (e.g. iPhone Safari) that can't make an element full screen.
  const [fullscreenMode, setFullscreenMode] = useState<"off" | "native" | "overlay">("off");
  const cardRef = useRef<HTMLDivElement>(null);
  const formId = useId();
  const isFullscreen = fullscreenMode !== "off";

  const emergencyContacts = contactsDirectory.contacts.filter(
    (c) => c.category === EMERGENCY_CONTACT_CATEGORY && (c.name.trim() || c.phone.trim())
  );
  const keyContacts = contactsDirectory.contacts.filter(
    (c) => c.category === KEY_CONTACT_CATEGORY && (c.name.trim() || c.phone.trim())
  );
  const isEmpty =
    isProfileEmpty(profile) && emergencyContacts.length === 0 && keyContacts.length === 0;

  useEffect(() => {
    function onChange() {
      if (!document.fullscreenElement) {
        setFullscreenMode((mode) => (mode === "native" ? "off" : mode));
      }
    }
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  useEffect(() => {
    if (fullscreenMode !== "overlay") return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setFullscreenMode("off");
    }
    document.addEventListener("keydown", onKey);
    cardRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [fullscreenMode]);

  async function openFullscreen() {
    const el = cardRef.current;
    if (!el) return;
    if (typeof el.requestFullscreen === "function") {
      try {
        await el.requestFullscreen();
        setFullscreenMode("native");
        return;
      } catch {
        // Fall through to the overlay below.
      }
    }
    setFullscreenMode("overlay");
  }

  async function closeFullscreen() {
    if (fullscreenMode === "native" && document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch {
        // Ignore - state is reset below either way.
      }
    }
    setFullscreenMode("off");
  }

  const displayName = profile.preferredName.trim() || profile.name.trim() || "About me";
  const large = isFullscreen;

  return (
    <div className="flex flex-col gap-6">
      <div className="no-print flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => void openFullscreen()}
          className="touch-target rounded-xl border-2 border-border bg-surface px-4 text-sm font-semibold hover:border-brand"
        >
          <span aria-hidden="true">⛶</span> Show on phone (full screen)
        </button>
        <PrintButton label="Print card" />
      </div>

      {/* The visual card - what gets printed or shown full-screen to a
          first responder or new support worker. */}
      <div
        ref={cardRef}
        tabIndex={-1}
        role={fullscreenMode === "overlay" ? "dialog" : undefined}
        aria-modal={fullscreenMode === "overlay" ? true : undefined}
        aria-label={fullscreenMode === "overlay" ? `Emergency card for ${displayName}` : undefined}
        className={`print-avoid-break flex flex-col gap-3 border-2 border-brand p-6 [&:fullscreen]:overflow-y-auto [&:fullscreen]:bg-background [&:fullscreen]:p-8 ${
          fullscreenMode === "overlay"
            ? "fixed inset-0 z-50 overflow-y-auto bg-background"
            : "rounded-2xl bg-surface"
        }`}
      >
        {isFullscreen && (
          <button
            type="button"
            onClick={() => void closeFullscreen()}
            className="no-print touch-target self-end rounded-xl border-2 border-border bg-surface px-4 font-semibold"
          >
            Close full screen
          </button>
        )}
        {isEmpty ? (
          <p className="rounded-xl border-2 border-dashed border-border p-6 text-center text-muted">
            Fill in the fields below to build your card.
          </p>
        ) : (
          <>
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-muted">
                Emergency information
              </p>
              <h2 className={`font-display font-bold ${large ? "text-4xl" : "text-2xl"}`}>
                {displayName}
              </h2>
              {profile.name.trim() && profile.preferredName.trim() && (
                <p className={large ? "text-lg" : "text-sm text-muted"}>Full name: {profile.name}</p>
              )}
              {profile.dob.trim() && (
                <p className={large ? "text-lg" : "text-sm text-muted"}>
                  Date of birth: {formatDob(profile.dob)}
                </p>
              )}
            </div>

            {profile.allergies.trim() && (
              <div className="print-avoid-break rounded-xl border-4 border-[var(--sev-5)] bg-background p-3">
                <p className="text-sm font-bold uppercase tracking-wide">
                  <span aria-hidden="true">⚠️</span> Allergies
                </p>
                <p className={`whitespace-pre-wrap font-bold ${large ? "text-2xl" : "text-lg"}`}>
                  {profile.allergies}
                </p>
              </div>
            )}
            <Field label="Conditions" value={profile.conditions} large={large} />
            <Field label="Medications" value={profile.medications} large={large} />
            <Field label="Communication needs" value={profile.communicationNeeds} large={large} />
            <Field label="What helps in a crisis" value={profile.whatHelpsInCrisis} large={large} />
            <Field label="Other important information" value={profile.otherInfo} large={large} />

            {emergencyContacts.length > 0 && (
              <div>
                <p className="mb-1 text-sm font-bold uppercase tracking-wide text-muted">
                  Emergency contacts
                </p>
                <ul className="flex flex-col gap-2">
                  {emergencyContacts.map((c) => (
                    <CardContact key={c.id} contact={c} large={large} />
                  ))}
                </ul>
              </div>
            )}
            {keyContacts.length > 0 && (
              <div>
                <p className="mb-1 text-sm font-bold uppercase tracking-wide text-muted">
                  Doctor and key contacts
                </p>
                <ul className="flex flex-col gap-2">
                  {keyContacts.map((c) => (
                    <CardContact key={c.id} contact={c} large={large} />
                  ))}
                </ul>
              </div>
            )}

            <p className="text-sm font-semibold">In an emergency, call 000.</p>
            {profile.updatedAt && (
              <p className="text-xs text-muted">
                Card last updated {formatDate(profile.updatedAt, timezone)}
              </p>
            )}
          </>
        )}
      </div>

      <div className="no-print flex flex-col gap-4 rounded-2xl border-2 border-border bg-surface p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-bold">Edit my card</h2>
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Clear the whole card? This can't be undone.")) {
                clearProfile();
              }
            }}
            className="touch-target rounded-xl border-2 border-border bg-background px-3 text-sm font-semibold text-muted hover:text-foreground"
          >
            Clear card
          </button>
        </div>
        <p className="text-sm text-muted">
          Changes save on this device as you type and show on the card above.
          Keep it up to date, and check medications and allergies with your
          doctor or pharmacist.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${formId}-name`} className="mb-1 block font-semibold">
              Full name
            </label>
            <input
              id={`${formId}-name`}
              type="text"
              value={profile.name}
              onChange={(e) => updateField("name", e.target.value)}
              maxLength={100}
              className="touch-target w-full rounded-xl border-2 border-border bg-background px-4 py-3"
            />
          </div>
          <div>
            <label htmlFor={`${formId}-preferred`} className="mb-1 block font-semibold">
              Preferred name (optional)
            </label>
            <input
              id={`${formId}-preferred`}
              type="text"
              value={profile.preferredName}
              onChange={(e) => updateField("preferredName", e.target.value)}
              maxLength={100}
              className="touch-target w-full rounded-xl border-2 border-border bg-background px-4 py-3"
            />
          </div>
        </div>

        <div>
          <label htmlFor={`${formId}-dob`} className="mb-1 block font-semibold">
            Date of birth
          </label>
          <input
            id={`${formId}-dob`}
            type="date"
            value={profile.dob}
            onChange={(e) => updateField("dob", e.target.value)}
            className="touch-target w-full max-w-xs rounded-xl border-2 border-border bg-background px-4 py-3"
          />
        </div>

        <TextArea
          formId={formId}
          field="allergies"
          label="Allergies"
          placeholder="e.g. Penicillin, peanuts. Write 'No known allergies' if that is the case."
          value={profile.allergies}
          onChange={updateField}
        />
        <TextArea
          formId={formId}
          field="conditions"
          label="Conditions / diagnoses"
          placeholder="e.g. Autism, epilepsy, type 1 diabetes"
          value={profile.conditions}
          onChange={updateField}
        />
        <TextArea
          formId={formId}
          field="medications"
          label="Medications"
          placeholder="Name, dose and what it's for"
          value={profile.medications}
          onChange={updateField}
        />
        <TextArea
          formId={formId}
          field="communicationNeeds"
          label="Communication needs"
          placeholder="e.g. Uses AAC device, may not respond to their name, prefers short simple sentences"
          value={profile.communicationNeeds}
          onChange={updateField}
        />
        <TextArea
          formId={formId}
          field="whatHelpsInCrisis"
          label="What helps in a crisis"
          placeholder="e.g. Stay calm and quiet, give space, avoid touching without asking"
          value={profile.whatHelpsInCrisis}
          onChange={updateField}
        />
        <TextArea
          formId={formId}
          field="otherInfo"
          label="Other important information"
          placeholder="Anything else a first responder or new support worker should know"
          value={profile.otherInfo}
          onChange={updateField}
        />
      </div>

      <div className="no-print flex flex-col gap-2">
        <h2 className="font-display text-lg font-bold">Contacts on the card</h2>
        <p className="text-sm text-muted">
          Contacts you add here appear on the card above, with a Call button.
        </p>
        <ContactDirectory
          directory={contactsDirectory}
          categories={[EMERGENCY_CONTACT_CATEGORY, KEY_CONTACT_CATEGORY]}
          clearLabel="Clear all emergency and key contacts"
          showPrintButton={false}
        />
      </div>
    </div>
  );
}

interface TextAreaProps {
  formId: string;
  field:
    | "conditions"
    | "allergies"
    | "medications"
    | "communicationNeeds"
    | "whatHelpsInCrisis"
    | "otherInfo";
  label: string;
  placeholder: string;
  value: string;
  onChange: (field: TextAreaProps["field"], value: string) => void;
}

function TextArea({ formId, field, label, placeholder, value, onChange }: TextAreaProps) {
  const id = `${formId}-${field}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1 block font-semibold">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        placeholder={placeholder}
        rows={2}
        maxLength={500}
        className="touch-target w-full rounded-xl border-2 border-border bg-background px-4 py-3"
      />
    </div>
  );
}
