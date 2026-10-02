"use client";

import { SENSORY_DOMAINS, sensoryNotesHaveContent } from "@/lib/sensory-needs-data";
import { useSensoryNeedsNotes } from "@/lib/sensory-needs-storage";
import InfoSection from "@/components/InfoSection";
import EditableListSection from "@/components/EditableListSection";
import PrintButton from "@/components/PrintButton";
import SensoryProfileSummary from "./SensoryProfileSummary";

export default function SensoryNeeds() {
  const { notes, updateHelps, updateOverwhelms, updateName } = useSensoryNeedsNotes();
  const hasContent = sensoryNotesHaveContent(notes);
  // Once there's a profile, print just the profile summary (a short,
  // shareable page). Before that, print the guide so it's still useful.
  const guidePrintClass = hasContent ? "no-print" : "";

  return (
    <div className="flex flex-col gap-4">
      <div className="no-print flex justify-end">
        <PrintButton label={hasContent ? "Print my profile" : undefined} />
      </div>

      <div className="no-print rounded-2xl border-2 border-border bg-surface p-4">
        <label htmlFor="sensory-owner-name" className="mb-1 block font-semibold">
          Who is this profile for? (optional)
        </label>
        <p className="mb-2 text-sm text-muted">Shown at the top when you print it.</p>
        <input
          id="sensory-owner-name"
          type="text"
          value={notes.name}
          onChange={(e) => updateName(e.target.value)}
          maxLength={80}
          placeholder="e.g. Alex"
          className="touch-target w-full rounded-xl border-2 border-border bg-background px-4 text-base"
        />
      </div>

      {hasContent && <SensoryProfileSummary notes={notes} />}

      <div className={guidePrintClass}>
        <InfoSection title="Seeking vs avoiding" icon="🧩" defaultOpen>
          <p>
            Everyone processes sensory input differently. Someone might{" "}
            <strong>seek out</strong> more input in one sense (like loving
            loud music or spinning) while <strong>avoiding</strong> it in
            another (like being overwhelmed by certain textures) - and this
            can change day to day, or with tiredness and stress.
          </p>
          <p>
            This page works through each sense, with examples to help
            recognise patterns, and a place to record what actually helps
            and what tends to overwhelm. Tap a sense below to open it.
          </p>
        </InfoSection>
      </div>

      {SENSORY_DOMAINS.map((domain) => {
        const count =
          (notes.helps[domain.id]?.length ?? 0) + (notes.overwhelms[domain.id]?.length ?? 0);
        return (
          <div key={domain.id} className={guidePrintClass}>
            <InfoSection
              title={count > 0 ? `${domain.title} (${count} added)` : domain.title}
              icon={domain.icon}
            >
              <p>{domain.summary}</p>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="mb-1 font-semibold text-muted">Signs of seeking more input:</p>
                  <ul className="list-disc space-y-1 pl-5">
                    {domain.seekingSigns.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-1 font-semibold text-muted">Signs of feeling overwhelmed:</p>
                  <ul className="list-disc space-y-1 pl-5">
                    {domain.avoidingSigns.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <EditableListSection
                title={`${domain.title}: what helps`}
                placeholder="e.g. Noise-cancelling headphones"
                items={notes.helps[domain.id] ?? []}
                suggestions={domain.helpsSuggestions}
                onChange={(items) => updateHelps(domain.id, items)}
              />

              <EditableListSection
                title={`${domain.title}: what overwhelms`}
                placeholder="e.g. Hand dryers in public toilets"
                items={notes.overwhelms[domain.id] ?? []}
                suggestions={domain.overwhelmsSuggestions}
                onChange={(items) => updateOverwhelms(domain.id, items)}
              />
            </InfoSection>
          </div>
        );
      })}
    </div>
  );
}
