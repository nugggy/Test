"use client";

import { useId, useRef, useState } from "react";
import {
  EMERGENCY_CONTACT_CATEGORY,
  KEY_CONTACT_CATEGORY,
  useAboutMeProfile,
  useEmergencyCardContacts,
} from "@/lib/emergency-info-card-storage";
import ContactDirectory from "@/components/contacts/ContactDirectory";
import PrintButton from "@/components/PrintButton";

function Field({ label, value }: { label: string; value: string }) {
  if (!value.trim()) return null;
  return (
    <div className="print-avoid-break">
      <p className="text-sm font-bold uppercase tracking-wide text-muted">{label}</p>
      <p className="whitespace-pre-wrap">{value}</p>
    </div>
  );
}

export default function EmergencyInfoCard() {
  const { profile, updateField, clearProfile } = useAboutMeProfile();
  const contactsDirectory = useEmergencyCardContacts();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const formId = useId();

  const isEmpty =
    !profile.name.trim() &&
    !profile.conditions.trim() &&
    !profile.allergies.trim() &&
    !profile.medications.trim() &&
    !profile.communicationNeeds.trim() &&
    !profile.whatHelpsInCrisis.trim() &&
    !profile.otherInfo.trim();

  async function toggleFullscreen() {
    if (!cardRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await cardRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      // Full-screen isn't available on some browsers/devices - the card
      // still works and is readable at normal size.
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="no-print flex justify-end gap-2">
        <button
          type="button"
          onClick={toggleFullscreen}
          className="touch-target rounded-xl border-2 border-border bg-surface px-4 text-sm font-semibold hover:border-brand"
        >
          <span aria-hidden="true">{isFullscreen ? "🡼" : "⛶"}</span>{" "}
          {isFullscreen ? "Exit full screen" : "Show on phone"}
        </button>
        <PrintButton label="Print card" />
      </div>

      {/* The visual card - what gets printed or shown full-screen to a
          first responder or new support worker. */}
      <div
        ref={cardRef}
        className="print-avoid-break flex flex-col gap-3 rounded-2xl border-2 border-brand bg-surface p-6 [&:fullscreen]:h-screen [&:fullscreen]:justify-center [&:fullscreen]:overflow-y-auto [&:fullscreen]:bg-background [&:fullscreen]:p-10"
      >
        {isEmpty ? (
          <p className="rounded-xl border-2 border-dashed border-border p-6 text-center text-muted">
            Fill in the fields below to build your card.
          </p>
        ) : (
          <>
            <h2 className="font-display text-2xl font-bold">
              {profile.preferredName.trim() || profile.name.trim() || "About me"}
            </h2>
            {profile.name.trim() && profile.preferredName.trim() && (
              <p className="-mt-2 text-sm text-muted">Full name: {profile.name}</p>
            )}
            {profile.dob.trim() && <p className="text-sm text-muted">Date of birth: {profile.dob}</p>}
            <Field label="Conditions" value={profile.conditions} />
            <Field label="Allergies" value={profile.allergies} />
            <Field label="Medications" value={profile.medications} />
            <Field label="Communication needs" value={profile.communicationNeeds} />
            <Field label="What helps in a crisis" value={profile.whatHelpsInCrisis} />
            <Field label="Other important information" value={profile.otherInfo} />
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
            className="text-sm font-semibold text-muted hover:text-foreground"
          >
            Clear card
          </button>
        </div>

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
          field="conditions"
          label="Conditions / diagnoses"
          placeholder="e.g. Autism, epilepsy, type 1 diabetes"
          value={profile.conditions}
          onChange={updateField}
        />
        <TextArea
          formId={formId}
          field="allergies"
          label="Allergies"
          placeholder="e.g. Penicillin, peanuts"
          value={profile.allergies}
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

      <ContactDirectory
        directory={contactsDirectory}
        categories={[EMERGENCY_CONTACT_CATEGORY, KEY_CONTACT_CATEGORY]}
        clearLabel="Clear all emergency and key contacts"
        showPrintButton={false}
      />
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
        className="w-full rounded-xl border-2 border-border bg-background px-4 py-3"
      />
    </div>
  );
}
