export interface CodeOfConductItem {
  title: string;
  description: string;
}

// The NDIS Code of Conduct applies to every NDIS provider and worker,
// whether the provider is registered with the NDIS Quality and Safeguards
// Commission or not. This is a plain-language summary, not a legal
// quotation of the Code - see ndiscommission.gov.au for the full text.
export const CODE_OF_CONDUCT: CodeOfConductItem[] = [
  {
    title: "Respect your rights",
    description:
      "Act with respect for your right to freedom of expression, self-determination, and to make your own decisions - including decisions others might not agree with.",
  },
  {
    title: "Respect your privacy",
    description:
      "Only collect, use and share your personal information as needed to provide supports, and keep it secure.",
  },
  {
    title: "Provide supports safely and competently",
    description:
      "Deliver services with care and skill, and raise or act on any concern that could affect the quality or safety of your supports.",
  },
  {
    title: "Act with integrity, honesty and transparency",
    description:
      "Be upfront about what's being provided, what it costs, and any conflicts of interest.",
  },
  {
    title: "Prevent violence, exploitation, neglect and abuse",
    description:
      "Take all reasonable steps to prevent and respond to violence, exploitation, neglect and abuse of people with disability.",
  },
  {
    title: "Prevent and respond to sexual misconduct",
    description:
      "Take all reasonable steps to prevent sexual misconduct, and respond appropriately if it happens or is disclosed.",
  },
];

export interface ComplianceChecklistGroup {
  title: string;
  items: string[];
}

// Starter items for the self-audit checklist, grouped to match the
// InfoSection topics below. These are prompts to check for, not a
// guarantee of compliance either way.
export const COMPLIANCE_CHECKLIST_SUGGESTIONS: string[] = [
  "I have a written service agreement that explains what's provided and what it costs",
  "My service agreement explains the cancellation policy in plain language",
  "I know how to end my service agreement if I want to",
  "I was given information in a format I could understand (plain language, Easy Read, my language, etc.)",
  "I know how to make a complaint about this provider",
  "Workers supporting me have never asked me to keep something from my family/support network that made me uncomfortable",
  "I've never been charged a cancellation fee that didn't seem to match what was agreed",
  "Any restrictive practice used with me (or the person I support) is written into a behaviour support plan",
];

export const PROVIDER_QUESTION_SUGGESTIONS = [
  "Can I see a copy of your NDIS registration and what it covers?",
  "What's your cancellation policy, in plain language?",
  "How do I make a complaint if I'm not happy with something?",
  "How do you handle an incident if something goes wrong?",
  "Have the workers supporting me had an NDIS Worker Screening Check?",
];
