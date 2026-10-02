"use client";

import Link from "next/link";
import { useRightsNotes } from "@/lib/know-your-rights-storage";
import EditableListSection from "@/components/EditableListSection";
import InfoSection from "@/components/InfoSection";
import PrintButton from "@/components/PrintButton";
import RightsContactFinder from "./RightsContactFinder";
import { telHref } from "@/lib/know-your-rights-data";

const HELP_LINES = [
  {
    name: "NDIS Quality and Safeguards Commission",
    phone: "1800 035 544",
    what: "to make a complaint about an NDIS provider or worker",
  },
  {
    name: "National Disability Abuse and Neglect Hotline",
    phone: "1800 880 052",
    what: "for abuse, neglect or exploitation",
  },
  {
    name: "Disability Gateway - Advocacy Finder",
    phone: "1800 643 787",
    what: "a free, independent advocate to support you",
  },
  {
    name: "NDIS National Contact Centre",
    phone: "1800 800 110",
    what: "general questions about your plan or funding",
  },
];

const QUESTION_SUGGESTIONS = [
  "Can I choose or change my provider?",
  "How do I make a complaint?",
  "Can I bring a support person or advocate to meetings?",
  "How do I get information in Easy Read or my language?",
];

const RIGHTS_TO_LEARN_SUGGESTIONS = [
  "Making a complaint",
  "Choosing my own supports",
  "Supported decision-making",
  "Access to an advocate",
];

const PEOPLE_SUGGESTIONS = [
  "My advocate",
  "My support coordinator",
  "A family member",
  "My support worker",
];

export default function KnowYourRights() {
  const { notes, updateField } = useRightsNotes();

  return (
    <div className="flex flex-col gap-4">
      <div className="no-print flex justify-end">
        <PrintButton />
      </div>

      <RightsContactFinder />

      <InfoSection title="Your rights as an NDIS participant" icon="📜" defaultOpen>
        <p>As an NDIS participant, you have the right to:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Be treated with respect and dignity, and have your culture, identity, beliefs and relationships respected</li>
          <li>Make your own decisions, and get the support you need to make them - including support to understand your options</li>
          <li>Choose and change your own providers and supports</li>
          <li>Have your privacy respected, and know how your information is used</li>
          <li>Receive safe, quality supports free from abuse, neglect, violence and exploitation</li>
          <li>Get information in a way you can understand - Easy Read, your language, or another accessible format</li>
          <li>Make a complaint about a provider or your supports, without being punished or losing services for doing so</li>
          <li>Have an advocate, family member or friend support you at any meeting</li>
        </ul>
      </InfoSection>

      <InfoSection title="Your human rights" icon="🌍">
        <p>
          People with disability have the same human rights as everyone
          else. Australia has agreed to the United Nations Convention on the
          Rights of Persons with Disabilities, which recognises the right
          to:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Equality, and freedom from discrimination</li>
          <li>Live independently and be included in the community</li>
          <li>Freedom from abuse, violence and exploitation</li>
          <li>Make your own decisions about your own life (&quot;legal capacity&quot;)</li>
          <li>Accessible information, buildings, transport and technology</li>
          <li>Work, education, health care, and an adequate standard of living, on an equal basis with others</li>
        </ul>
      </InfoSection>

      <InfoSection title="Supported decision-making" icon="🤝">
        <p>
          You have the right to make your own decisions. Supported
          decision-making means getting help to understand your options and
          work out what you want - not someone else deciding for you.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>A supporter can explain information in a way that makes sense to you</li>
          <li>They can help you think through options and what might happen</li>
          <li>The final decision is still yours</li>
          <li>This is different to a substitute decision-maker (like a guardian), who can legally make some decisions for you - that should only ever be used when truly necessary, and for the smallest scope possible</li>
        </ul>
      </InfoSection>

      <InfoSection title="How to make a complaint" icon="📢">
        <ol className="list-decimal space-y-1 pl-5">
          <li>If it feels safe to, talk to the provider or worker directly first - sometimes it&apos;s a misunderstanding that can be sorted out quickly.</li>
          <li>If that doesn&apos;t work, or doesn&apos;t feel safe, put your complaint in writing (email or letter) with dates and details.</li>
          <li>If it&apos;s still not resolved, or it&apos;s serious (abuse, neglect, a safety risk), contact the NDIS Quality and Safeguards Commission.</li>
          <li>You can ask an advocate to help you make a complaint, or make it on your behalf.</li>
          <li>A provider must not stop your services or treat you worse because you made a complaint.</li>
          <li>If your complaint is about an NDIA decision (like your plan or funding), that is a different process. Use &quot;Who do I contact?&quot; above and choose the NDIA decision option.</li>
        </ol>
      </InfoSection>

      <InfoSection title="Where to get help" icon="🛟">
        <ul className="list-disc space-y-1 pl-5">
          {HELP_LINES.map((line) => (
            <li key={line.phone}>
              <strong>{line.name}</strong> -{" "}
              <a href={telHref(line.phone)} className="font-semibold underline">
                {line.phone}
              </a>{" "}
              - {line.what}
            </li>
          ))}
        </ul>
        <p>
          See the full list on{" "}
          <Link href="/tools/who-can-help-me" className="font-semibold text-brand hover:underline">
            Who Can Help Me?
          </Link>{" "}
          for more services and phone numbers.
        </p>
      </InfoSection>

      <EditableListSection
        title="Questions I want to ask"
        description="Save these to bring to your next meeting"
        placeholder="e.g. How do I change providers?"
        items={notes.questionsToAsk}
        suggestions={QUESTION_SUGGESTIONS}
        onChange={(items) => updateField("questionsToAsk", items)}
      />

      <EditableListSection
        title="Rights I want to know more about"
        description="Anything from above you want to look into further"
        placeholder="e.g. Supported decision-making"
        items={notes.rightsToLearnMore}
        suggestions={RIGHTS_TO_LEARN_SUGGESTIONS}
        onChange={(items) => updateField("rightsToLearnMore", items)}
      />

      <EditableListSection
        title="My advocates and support people"
        description="Who can help you exercise your rights"
        placeholder="e.g. My advocate - 0412 345 678"
        items={notes.myAdvocatesAndSupportPeople}
        suggestions={PEOPLE_SUGGESTIONS}
        onChange={(items) => updateField("myAdvocatesAndSupportPeople", items)}
      />
    </div>
  );
}
