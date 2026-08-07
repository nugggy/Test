"use client";

import { SENSORY_DOMAINS } from "@/lib/sensory-needs-data";
import { useSensoryNeedsNotes } from "@/lib/sensory-needs-storage";
import InfoSection from "@/components/InfoSection";
import EditableListSection from "@/components/EditableListSection";
import PrintButton from "@/components/PrintButton";

export default function SensoryNeeds() {
  const { notes, updateHelps, updateOverwhelms } = useSensoryNeedsNotes();

  return (
    <div className="flex flex-col gap-4">
      <div className="no-print flex justify-end">
        <PrintButton />
      </div>

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
          and what tends to overwhelm - a personal sensory profile you can
          build up, print, or share with someone supporting you.
        </p>
      </InfoSection>

      {SENSORY_DOMAINS.map((domain) => (
        <InfoSection key={domain.id} title={domain.title} icon={domain.icon}>
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
            title="What helps"
            placeholder="e.g. Noise-cancelling headphones"
            items={notes.helps[domain.id] ?? []}
            suggestions={domain.helpsSuggestions}
            onChange={(items) => updateHelps(domain.id, items)}
          />

          <EditableListSection
            title="What overwhelms"
            placeholder="e.g. Hand dryers in public toilets"
            items={notes.overwhelms[domain.id] ?? []}
            suggestions={domain.overwhelmsSuggestions}
            onChange={(items) => updateOverwhelms(domain.id, items)}
          />
        </InfoSection>
      ))}
    </div>
  );
}
