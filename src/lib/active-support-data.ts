export interface ActiveSupportElement {
  icon: string;
  title: string;
  summary: string;
  practice: string[];
}

// A plain-language summary of the core ideas behind Active Support — an
// evidence-based practice model for supporting people with intellectual
// disability to participate in everyday activities and relationships,
// researched and championed in Australia by La Trobe University's Living
// with Disability Research Centre. This is an introductory summary for
// support workers, not a substitute for accredited Active Support
// training — see the note on the tool page for where to find that.
export const ACTIVE_SUPPORT_ELEMENTS: ActiveSupportElement[] = [
  {
    icon: "✨",
    title: "Every moment has potential",
    summary:
      "Every part of the day — not just planned activities — is a chance for someone to participate, make a choice, or do something for themselves. Getting dressed, making a coffee, folding washing or waiting for a bus can all be opportunities, not just tasks to get through.",
    practice: [
      "Notice the small moments in a routine, not just the 'big' activities",
      "Ask 'what could this person do here?' before doing it for them",
      "Turn waiting time or transitions into a small opportunity, not dead time",
    ],
  },
  {
    icon: "🔁",
    title: "Little and often",
    summary:
      "Frequent, brief opportunities to participate build more skill, confidence and engagement than occasional, lengthy ones. A short go at stirring the pot most days beats one long cooking lesson once a month.",
    practice: [
      "Offer small opportunities throughout the day, not just at 'activity time'",
      "Keep individual opportunities short if that suits the person — little and often, not all at once",
      "Look for the same task coming up again tomorrow, and offer it again",
    ],
  },
  {
    icon: "🤲",
    title: "Graded assistance",
    summary:
      "Give the least amount of help that lets the person succeed — no more, no less. Start with the lightest support (like being nearby, or a gesture) and only step up to more (a verbal prompt, a demonstration, hand-over-hand help) if it's genuinely needed.",
    practice: [
      "Try presence or a gesture before a verbal prompt",
      "Try a verbal prompt before physical help",
      "Step back in as soon as the person can continue on their own again",
      "Avoid doing the whole task because it's faster — the goal is participation, not speed",
    ],
  },
  {
    icon: "🧭",
    title: "Maximising choice and control",
    summary:
      "Build real choices into activities, not just 'what to do' but how, when, and in what order — and respect the choice to not participate in something, too.",
    practice: [
      "Offer options rather than a single instruction ('Would you like to start with the cups or the plates?')",
      "Ask, don't assume — check preferences even for routine tasks",
      "Respect 'no' as a valid answer, and revisit later rather than pushing through",
    ],
  },
  {
    icon: "💛",
    title: "Positive relationships",
    summary:
      "Support is delivered warmly and respectfully — through genuine interaction and relationship, not just task completion. How something is done matters as much as what gets done.",
    practice: [
      "Chat, joke, and connect while supporting a task, not just direct it",
      "Notice and acknowledge effort and success, not just the end result",
      "Treat the person as a person first, and the task second",
    ],
  },
];

export const SELF_REFLECTION_SUGGESTIONS = [
  "I looked for small opportunities to participate today, not just planned activities",
  "I offered the lightest support first, and only stepped up if needed",
  "I gave real choices, not just one option",
  "I respected it when the person said no",
  "I connected with the person warmly, not just focused on the task",
];
