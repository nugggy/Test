"use client";

import { useNdisComplianceNotes } from "@/lib/ndis-compliance-storage";
import {
  CODE_OF_CONDUCT,
  COMPLIANCE_CHECKLIST_SUGGESTIONS,
  PROVIDER_QUESTION_SUGGESTIONS,
} from "@/lib/ndis-compliance-data";
import InfoSection from "@/components/InfoSection";
import ChecklistSection from "@/components/ChecklistSection";
import EditableListSection from "@/components/EditableListSection";
import PrintButton from "@/components/PrintButton";

export default function NdisCompliance() {
  const { notes, updateField } = useNdisComplianceNotes();

  return (
    <div className="flex flex-col gap-4">
      <div className="no-print flex justify-end">
        <PrintButton />
      </div>

      <InfoSection title="What providers are required to do" icon="📋" defaultOpen>
        <p>
          Every NDIS provider and worker - registered with the NDIS Quality
          and Safeguards Commission or not - has to follow the{" "}
          <strong>NDIS Code of Conduct</strong>. Providers registered with
          the Commission also have to meet the <strong>NDIS Practice
          Standards</strong>, which the Commission audits them against.
          This page is a plain-language summary to help you recognise what
          good practice looks like, and what to do if something seems off
          - it isn&apos;t legal advice, and the rules can change, so check{" "}
          <a
            href="https://www.ndiscommission.gov.au"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand hover:underline"
          >
            ndiscommission.gov.au
          </a>{" "}
          for the current detail.
        </p>
      </InfoSection>

      <InfoSection title="The NDIS Code of Conduct" icon="⚖️">
        <p>Applies to every provider and worker, no matter how they&apos;re engaged:</p>
        <ul className="flex flex-col gap-2">
          {CODE_OF_CONDUCT.map((item) => (
            <li key={item.title} className="rounded-xl border-2 border-border bg-background p-3">
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-muted">{item.description}</p>
            </li>
          ))}
        </ul>
      </InfoSection>

      <InfoSection title="Service agreements" icon="📝">
        <p>A proper service agreement should set out, in a format you can understand:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>What supports will be provided, and how often</li>
          <li>What everything costs</li>
          <li>The cancellation policy, in plain language</li>
          <li>How either side can end the agreement</li>
        </ul>
        <p>
          You&apos;re entitled to ask for this in an accessible format -
          Easy Read, another language, or read aloud to you - and to take
          your time deciding before you sign anything.
        </p>
      </InfoSection>

      <InfoSection title="Cancellations and charges" icon="💵">
        <p>
          Registered providers can only charge within the current NDIS
          Pricing Arrangements, and can only charge a short-notice
          cancellation fee in limited circumstances set out in those
          rules. If a cancellation charge doesn&apos;t match what&apos;s in
          your service agreement, or seems to happen every time regardless
          of notice given, it&apos;s worth asking about it directly.
        </p>
      </InfoSection>

      <InfoSection title="Worker screening" icon="🪪">
        <p>
          Anyone in a &quot;risk-assessed role&quot; at a registered
          provider - working alone with you, or with more than incidental
          contact - is required to hold a valid NDIS Worker Screening
          Check. You can ask a provider whether a worker holds one.
        </p>
      </InfoSection>

      <InfoSection title="Incidents and restrictive practices" icon="🚨">
        <p>
          Registered providers must have a system for managing incidents,
          and must report certain serious incidents (like abuse, neglect,
          serious injury, or an unauthorised restrictive practice) to the
          NDIS Commission as a &quot;reportable incident.&quot;
        </p>
        <p>
          A regulated restrictive practice (like restraint or seclusion)
          should only ever be used as a last resort, be authorised under
          your state or territory&apos;s process, be written into a
          behaviour support plan, and be reported to the NDIS Commission.
          If a restrictive practice is being used that isn&apos;t
          authorised or in a plan, that&apos;s worth raising as a concern.
        </p>
      </InfoSection>

      <InfoSection title="Complaints handling" icon="📢">
        <p>
          Registered providers must have an accessible way for you to make
          a complaint, and can&apos;t retaliate against you (for example,
          by withdrawing supports) for making one.
        </p>
      </InfoSection>

      <div className="print-avoid-break rounded-xl border-2 border-brand/30 bg-brand/5 p-4">
        <h2 className="font-display mb-2 text-lg font-bold">
          Raising a concern or making a complaint
        </h2>
        <ol className="list-decimal space-y-1 pl-5 text-sm">
          <li>
            If it feels safe and comfortable, raise it with the provider
            directly first - many issues get resolved this way.
          </li>
          <li>
            If it&apos;s not resolved, is serious, or you&apos;d rather not
            go to the provider first, contact the{" "}
            <strong>NDIS Quality and Safeguards Commission</strong> on{" "}
            <a href="tel:1800035544" className="font-semibold text-brand hover:underline">
              1800 035 544
            </a>{" "}
            or{" "}
            <a
              href="https://www.ndiscommission.gov.au"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand hover:underline"
            >
              ndiscommission.gov.au
            </a>
            .
          </li>
          <li>Complaints can be made anonymously, and an interpreter can be arranged.</li>
          <li>
            In an emergency, or if someone is in immediate danger, call{" "}
            <a href="tel:000" className="font-semibold text-brand hover:underline">000</a> first.
          </li>
        </ol>
      </div>

      <ChecklistSection
        title="Checking your provider"
        description="A self-check, not a guarantee either way - tick what applies, or use it as a conversation starter"
        placeholder="Add your own check"
        items={notes.checklist}
        suggestions={COMPLIANCE_CHECKLIST_SUGGESTIONS}
        onChange={(items) => updateField("checklist", items)}
      />

      <EditableListSection
        title="Questions for my provider"
        description="Things worth asking directly"
        placeholder="e.g. What's your cancellation policy?"
        items={notes.questionsForProvider}
        suggestions={PROVIDER_QUESTION_SUGGESTIONS}
        onChange={(items) => updateField("questionsForProvider", items)}
      />

      <EditableListSection
        title="Things I've noticed"
        description="A private, dated record for yourself of anything that concerned you - useful if you decide to raise it later"
        placeholder="e.g. Charged a cancellation fee with no notice given"
        items={notes.thingsIveNoticed}
        onChange={(items) => updateField("thingsIveNoticed", items)}
      />
    </div>
  );
}
