export interface ActiveSupportElement {
  id: string;
  icon: string;
  title: string;
  summary: string;
  practice: string[];
  /** Prompt shown above the "what this looks like for this person"
   * editable list, tailored to this specific element. */
  personalPrompt: string;
  /** Starter suggestion chips for the personalised list - generic enough
   * to apply broadly, specific enough to show what kind of thing to write. */
  personalSuggestions: string[];
}

// A plain-language summary of the core ideas behind Active Support - an
// evidence-based practice model for supporting people with intellectual
// disability to participate in everyday activities and relationships,
// researched and championed in Australia by La Trobe University's Living
// with Disability Research Centre. This is an introductory summary for
// support workers, not a substitute for accredited Active Support
// training - see the note on the tool page for where to find that.
export const ACTIVE_SUPPORT_ELEMENTS: ActiveSupportElement[] = [
  {
    id: "every-moment",
    icon: "✨",
    title: "Every moment has potential",
    summary:
      "Every part of the day - not just planned activities - is a chance for someone to participate, make a choice, or do something for themselves. Getting dressed, making a coffee, folding washing or waiting for a bus can all be opportunities, not just tasks to get through.",
    practice: [
      "Notice the small moments in a routine, not just the 'big' activities",
      "Ask 'what could this person do here?' before doing it for them",
      "Turn waiting time or transitions into a small opportunity, not dead time",
    ],
    personalPrompt:
      "What are the signs this person is ready for an opportunity, and what does meaningful engagement actually look like for them?",
    personalSuggestions: [
      "Sign to look for: lying in bed with eyes open, looking disengaged",
      "Sign to look for: sitting alone in a room with the TV off",
      "Meaningful engagement looks like: watching a movie together",
      "Meaningful engagement looks like: playing Uno or another game",
    ],
  },
  {
    id: "little-and-often",
    icon: "🔁",
    title: "Little and often",
    summary:
      "Frequent, brief opportunities to participate build more skill, confidence and engagement than occasional, lengthy ones. A short go at stirring the pot most days beats one long cooking lesson once a month.",
    practice: [
      "Offer small opportunities throughout the day, not just at 'activity time'",
      "Keep individual opportunities short if that suits the person - little and often, not all at once",
      "Look for the same task coming up again tomorrow, and offer it again",
    ],
    personalPrompt:
      "How long or how often does this person tend to engage well, before it's time to step back?",
    personalSuggestions: [
      "I engage best in short bursts of 5–10 minutes at a time",
      "I lose interest if a task or game goes on too long",
      "I do better with the same small activity repeated daily than a big one occasionally",
    ],
  },
  {
    id: "graded-assistance",
    icon: "🤲",
    title: "Graded assistance",
    summary:
      "Give the least amount of help that lets the person succeed - no more, no less. Start with the lightest support (like being nearby, or a gesture) and only step up to more (a verbal prompt, a demonstration, hand-over-hand help) if it's genuinely needed.",
    practice: [
      "Try presence or a gesture before a verbal prompt",
      "Try a verbal prompt before physical help",
      "Step back in as soon as the person can continue on their own again",
      "Avoid doing the whole task because it's faster - the goal is participation, not speed",
    ],
    personalPrompt:
      "What's the lightest kind of help that actually works for this person, and what does too much help look like?",
    personalSuggestions: [
      "A hand on my shoulder is usually enough of a prompt",
      "I need step-by-step verbal instructions, not just a demonstration",
      "I get frustrated and disengage if someone takes over too soon",
    ],
  },
  {
    id: "choice-and-control",
    icon: "🧭",
    title: "Maximising choice and control",
    summary:
      "Build real choices into activities, not just 'what to do' but how, when, and in what order - and respect the choice to not participate in something, too.",
    practice: [
      "Offer options rather than a single instruction ('Would you like to start with the cups or the plates?')",
      "Ask, don't assume - check preferences even for routine tasks",
      "Respect 'no' as a valid answer, and revisit later rather than pushing through",
    ],
    personalPrompt:
      "How does this person actually show a choice, or show 'no' - especially if it isn't always in words?",
    personalSuggestions: [
      "I show 'no' by turning away or going quiet, not always saying it out loud",
      "Give me two options with pictures or objects, not an open-ended question",
      "I need extra time to respond - don't assume silence means no answer",
    ],
  },
  {
    id: "positive-relationships",
    icon: "💛",
    title: "Positive relationships",
    summary:
      "Support is delivered warmly and respectfully - through genuine interaction and relationship, not just task completion. How something is done matters as much as what gets done.",
    practice: [
      "Chat, joke, and connect while supporting a task, not just direct it",
      "Notice and acknowledge effort and success, not just the end result",
      "Treat the person as a person first, and the task second",
    ],
    personalPrompt:
      "What helps this person feel genuinely connected to, rather than just 'managed' by, whoever is supporting them?",
    personalSuggestions: [
      "I respond well to humour and being teased gently",
      "I like to be greeted by name before anything else happens",
      "Small talk about my interests matters more to me than getting straight to the task",
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
