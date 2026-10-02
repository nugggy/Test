"use client";

import Link from "next/link";
import { useRelationshipNotes } from "@/lib/healthy-relationships-storage";
import EditableListSection from "@/components/EditableListSection";
import InfoSection from "@/components/InfoSection";
import PrintButton from "@/components/PrintButton";

const WANT_SUGGESTIONS = [
  "Someone who listens to me",
  "Someone who respects when I say no",
  "Someone who supports my other friendships and family",
  "Someone who's honest with me",
  "To make decisions together, as equals",
];

const WARNING_SUGGESTIONS = [
  "Tries to stop me seeing friends or family",
  "Checks my phone or messages without asking",
  "Gets angry if I say no",
  "Puts me down or makes me feel small",
  "Controls my money",
  "Pressures me to do things I don't want to do",
];

const PEOPLE_SUGGESTIONS = [
  "A family member",
  "A friend I trust",
  "My support worker",
  "My GP",
  "A counsellor",
];

export default function HealthyRelationships() {
  const { notes, updateField, clearAll } = useRelationshipNotes();
  const hasNotes =
    notes.whatIWant.length > 0 ||
    notes.warningSignsToWatch.length > 0 ||
    notes.peopleICanTalkTo.length > 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="no-print flex justify-end">
        <PrintButton />
      </div>

      {/* Kept outside the collapsible sections so it's always visible. */}
      <div className="print-avoid-break rounded-2xl border-2 border-accent bg-accent-soft p-4">
        <h2 className="font-display text-lg font-bold">Not safe right now?</h2>
        <p className="mb-3 text-sm">
          If you are in danger, call 000. To talk to someone about a
          relationship that worries you, call 1800RESPECT any time, day or
          night.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="tel:000"
            className="touch-target inline-flex items-center rounded-xl border-2 border-brand bg-brand px-5 text-lg font-bold text-brand-ink"
          >
            <span aria-hidden="true">📞&nbsp;</span>Call 000
          </a>
          <a
            href="tel:1800737732"
            className="touch-target inline-flex flex-col justify-center rounded-xl border-2 border-border bg-surface px-4 py-2 font-semibold hover:border-brand"
          >
            <span className="font-bold">1800RESPECT</span>
            <span>1800 737 732 (24/7)</span>
          </a>
        </div>
      </div>

      <InfoSection title="What makes a relationship healthy?" icon="💜" defaultOpen>
        <p>
          A healthy relationship - romantic, or otherwise - usually has these
          things, both ways:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li><strong>Respect</strong> - for how you feel, what you want, and your right to say no.</li>
          <li><strong>Trust and honesty</strong> - you can believe what the other person tells you, and they can believe you.</li>
          <li><strong>Equality</strong> - decisions are made together. Neither person controls the other.</li>
          <li><strong>Support</strong> - for your other friendships, family, interests and independence, not instead of them.</li>
          <li><strong>Good communication</strong> - you can talk about how you feel, and disagree without it turning into a fight.</li>
          <li><strong>Consent</strong> - every time, for everything, from both people.</li>
        </ul>
      </InfoSection>

      <InfoSection title="Consent" icon="✅">
        <p>Consent means agreeing to something freely, because you want to - not because you feel you have to.</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Consent has to be freely given - not because of pressure, guilt, fear, or being talked into it.</li>
          <li>You can change your mind at any time, even partway through, even if you&apos;ve said yes before.</li>
          <li>Saying yes to one thing isn&apos;t saying yes to everything.</li>
          <li>Being in a relationship doesn&apos;t mean automatic consent to anything.</li>
          <li>If someone can&apos;t freely say no - because they&apos;re asleep, unwell, affected by drugs or alcohol, or being pressured - they can&apos;t consent.</li>
          <li>You always have the right to say no, and a good partner will respect that without punishing you for it.</li>
        </ul>
      </InfoSection>

      <InfoSection title="Warning signs" icon="⚠️">
        <p>
          These are signs a relationship might not be healthy or safe. One on
          its own might be worth a conversation - several together, or a
          pattern that keeps happening, is worth talking to someone you trust
          about.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Trying to stop you seeing friends or family, or making it hard to</li>
          <li>Checking your phone, messages or social media without asking</li>
          <li>Getting angry, sulking, or punishing you when you say no</li>
          <li>Put-downs, criticism, or making you feel bad about yourself</li>
          <li>Controlling your money or NDIS funding</li>
          <li>Threats - to hurt you, themselves, or to end the relationship if you don&apos;t do what they want</li>
          <li>Any physical force, or fear of the other person</li>
          <li>Pressuring you into anything sexual you don&apos;t want</li>
        </ul>
        <p>
          None of these are your fault, and they&apos;re not a normal part of
          a relationship - no matter what anyone tells you.
        </p>
      </InfoSection>

      <InfoSection title="Good communication" icon="💬">
        <ul className="list-disc space-y-1 pl-5">
          <li>Say how you feel, using &quot;I feel...&quot; rather than blame</li>
          <li>Really listen when the other person is talking, not just waiting for your turn</li>
          <li>It&apos;s okay to disagree - healthy couples still argue sometimes, respectfully</li>
          <li>Take a break if a conversation gets too heated, and come back to it later</li>
          <li>Ask before assuming - check in rather than guessing what someone means</li>
        </ul>
      </InfoSection>

      <InfoSection title="Staying safe" icon="🛡️">
        <ul className="list-disc space-y-1 pl-5">
          <li>Trust your gut - if something feels wrong, it&apos;s worth talking to someone about, even if you can&apos;t explain exactly why</li>
          <li>Keep your own friends, interests, money and ID - a healthy relationship doesn&apos;t need you to give these up</li>
          <li>Tell someone you trust when you start seeing someone new</li>
          <li>Never feel pressured to share passwords, private photos, or your location</li>
          <li>If you meet someone online, get to know them for a while first, and meet in a public place with someone else knowing where you are</li>
          <li>A paid support worker or provider is never allowed to have a romantic or sexual relationship with someone they support - that&apos;s a serious breach, and reportable</li>
        </ul>
      </InfoSection>

      <InfoSection title="Where to get help" icon="🛟">
        <ul className="list-disc space-y-1 pl-5">
          <li><strong>1800RESPECT</strong>, <a href="tel:1800737732" className="font-semibold text-brand underline">1800 737 732</a>: domestic, family and sexual violence counselling and support, 24/7</li>
          <li><strong>Lifeline</strong>, <a href="tel:131114" className="font-semibold text-brand underline">13 11 14</a>: 24/7 crisis support for any kind of personal crisis</li>
          <li><strong>National Disability Abuse and Neglect Hotline</strong>, <a href="tel:1800880052" className="font-semibold text-brand underline">1800 880 052</a>: for abuse, neglect or exploitation by a support worker or provider</li>
          <li><strong>NDIS Quality and Safeguards Commission</strong>, <a href="tel:1800035544" className="font-semibold text-brand underline">1800 035 544</a>: to report a problem with an NDIS provider or worker</li>
          <li>Your GP, a counsellor, or a trusted family member or friend</li>
        </ul>
        <p>
          See the full list on{" "}
          <Link href="/tools/who-can-help-me" className="font-semibold text-brand hover:underline">
            Who Can Help Me?
          </Link>{" "}
          for more services and phone numbers.
        </p>
      </InfoSection>

      <div className="no-print rounded-2xl border-2 border-border bg-surface-2 p-4 text-sm">
        <h2 className="font-display text-lg font-bold">Your private notes</h2>
        <p className="mt-1">
          The lists below are saved on this device only. Nothing is sent to us.
          But anyone who uses or checks this phone, tablet or computer could
          open this page and see them. If that might not be safe for you,
          don&apos;t write anything here, or clear your notes when you&apos;re done.
        </p>
        {hasNotes && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Clear all your notes on this page? This can't be undone.")) {
                clearAll();
              }
            }}
            className="touch-target mt-3 rounded-xl border-2 border-border bg-surface px-4 font-semibold"
          >
            Clear my notes
          </button>
        )}
      </div>

      <EditableListSection
        title="What I want in a relationship"
        description="Things that matter to you"
        placeholder="e.g. Someone who respects my choices"
        items={notes.whatIWant}
        suggestions={WANT_SUGGESTIONS}
        onChange={(items) => updateField("whatIWant", items)}
      />

      <EditableListSection
        title="Warning signs I want to watch for"
        description="Your own personal list, for your own reference"
        placeholder="e.g. Someone getting angry when I see my friends"
        items={notes.warningSignsToWatch}
        suggestions={WARNING_SUGGESTIONS}
        onChange={(items) => updateField("warningSignsToWatch", items)}
      />

      <EditableListSection
        title="People I can talk to"
        description="Who you trust, if you ever need to talk something through"
        placeholder="e.g. My sister - 0412 345 678"
        items={notes.peopleICanTalkTo}
        suggestions={PEOPLE_SUGGESTIONS}
        onChange={(items) => updateField("peopleICanTalkTo", items)}
      />
    </div>
  );
}
