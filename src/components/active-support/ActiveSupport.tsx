"use client";

import { useActiveSupportNotes } from "@/lib/active-support-storage";
import { ACTIVE_SUPPORT_ELEMENTS, SELF_REFLECTION_SUGGESTIONS } from "@/lib/active-support-data";
import EditableListSection from "@/components/EditableListSection";
import ChecklistSection from "@/components/ChecklistSection";
import InfoSection from "@/components/InfoSection";
import PrintButton from "@/components/PrintButton";

const IDEA_SUGGESTIONS = [
  "Small opportunity: making their own drink",
  "Small opportunity: choosing what to wear",
  "Small opportunity: helping put groceries away",
];

export default function ActiveSupport() {
  const { notes, updateField } = useActiveSupportNotes();

  return (
    <div className="flex flex-col gap-4">
      <div className="no-print flex justify-end">
        <PrintButton />
      </div>

      <InfoSection title="What is Active Support?" icon="🌱" defaultOpen>
        <p>
          Active Support is a way of supporting people with intellectual
          disability to be genuinely engaged and included in everyday life —
          in the small, ordinary moments as much as the planned activities.
          It&apos;s about how support is given, moment to moment, not just
          what&apos;s on the activity plan.
        </p>
        <p>
          Why it matters: people supported this way tend to spend more of
          their day meaningfully engaged and doing things for themselves,
          and services that practise it consistently tend to see less
          challenging behaviour — not because behaviour is being managed
          directly, but because there&apos;s simply less boredom and
          passivity for it to come from.
        </p>
        <p>
          This page is a plain-language introduction to the five core ideas
          behind it, for quick reference and reflection. It&apos;s not a
          substitute for accredited training — see the free training
          callout below for where to find that.
        </p>
      </InfoSection>

      <p className="no-print print-avoid-break rounded-2xl border-2 border-brand/30 bg-brand/5 px-4 py-3 text-sm">
        <strong>Free training available.</strong> La Trobe University&apos;s
        Living with Disability Research Centre and Greystanes Disability
        Services publish a free, self-paced Active Support training course —
        eight modules with videos and interactive activities, no
        registration required.{" "}
        <a
          href="https://www.everymomenthaspotential.com.au/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-brand hover:underline"
        >
          Start the free training at everymomenthaspotential.com.au
        </a>
        .
      </p>

      {ACTIVE_SUPPORT_ELEMENTS.map((el, i) => (
        <InfoSection key={el.title} title={`${i + 1}. ${el.title}`} icon={el.icon}>
          <p>{el.summary}</p>
          <div>
            <p className="mb-1 font-semibold text-muted">In practice:</p>
            <ul className="list-disc space-y-1 pl-5">
              {el.practice.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        </InfoSection>
      ))}

      <InfoSection title="Common pitfalls" icon="⚠️">
        <p>
          A few ways Active Support tends to slip in practice, even with
          good intentions:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Doing it for them because it&apos;s faster.</strong> Task
            completion isn&apos;t the goal — participation is, even if it
            takes longer.
          </li>
          <li>
            <strong>Treating it as one big weekly activity</strong> rather
            than lots of small moments spread through the day. Little and
            often beats occasional and lengthy.
          </li>
          <li>
            <strong>Offering a choice, then overriding it</strong> if the
            person picks something inconvenient. A choice only counts if
            &quot;no&quot; or &quot;something else&quot; is a real option.
          </li>
          <li>
            <strong>Confusing it with &quot;no support at all.&quot;</strong>{" "}
            It&apos;s not hands-off — it&apos;s giving the least help needed
            for the person to succeed, which can still mean a lot of support
            for some tasks.
          </li>
        </ul>
      </InfoSection>

      <ChecklistSection
        title="Self-reflection"
        description="A quick check-in at the end of a shift — tick what applied today"
        placeholder="Add your own reflection prompt"
        items={notes.selfReflection}
        suggestions={SELF_REFLECTION_SUGGESTIONS}
        onChange={(items) => updateField("selfReflection", items)}
      />

      <EditableListSection
        title="Ideas for this person"
        description="Small, everyday opportunities that suit the specific person you support"
        placeholder="e.g. Choosing the music while getting ready"
        items={notes.ideasForThisPerson}
        suggestions={IDEA_SUGGESTIONS}
        onChange={(items) => updateField("ideasForThisPerson", items)}
      />

      <p className="print-avoid-break rounded-xl border-2 border-border bg-surface px-4 py-3 text-sm text-muted">
        Active Support is researched and championed in Australia by La Trobe
        University&apos;s Living with Disability Research Centre, building
        on work originally developed in the UK. This page is a general
        summary for everyday reference, not accredited training — see the
        free training link near the top of this page for the full course.
      </p>
    </div>
  );
}
