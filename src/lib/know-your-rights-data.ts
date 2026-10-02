export interface RightsContact {
  name: string;
  /** Display form, e.g. "1800 035 544". The tel: link strips spaces. */
  phone?: string;
  website?: string;
  /** What this contact is for, in this situation. */
  note: string;
}

export interface RightsScenario {
  id: string;
  icon: string;
  /** Written as the person would say it. */
  label: string;
  steps: string[];
  contacts: RightsContact[];
}

// General information only, not legal advice. Phone numbers match the ones
// used elsewhere on the site (see who-can-help-data.ts) except the
// Commonwealth Ombudsman and Australian Human Rights Commission, which are
// their long-standing national numbers. If any of these change, update
// who-can-help-data.ts at the same time.
const NDIS_COMMISSION: RightsContact = {
  name: "NDIS Quality and Safeguards Commission",
  phone: "1800 035 544",
  website: "https://www.ndiscommission.gov.au",
  note: "Complaints about an NDIS provider or worker. You can complain without giving your name.",
};

const ADVOCACY: RightsContact = {
  name: "Disability Gateway (to find a free advocate)",
  phone: "1800 643 787",
  website: "https://www.disabilitygateway.gov.au",
  note: "A free, independent disability advocate can help you speak up, or speak up for you.",
};

const NDIA: RightsContact = {
  name: "NDIS National Contact Centre (NDIA)",
  phone: "1800 800 110",
  website: "https://www.ndis.gov.au",
  note: "Questions, feedback and complaints about the NDIA, your plan or your access.",
};

export const RIGHTS_SCENARIOS: RightsScenario[] = [
  {
    id: "provider",
    icon: "🏢",
    label: "I have a problem with my NDIS provider or support worker",
    steps: [
      "If it feels safe, tell the provider first. Ask how they handle complaints.",
      "Write down what happened, with dates.",
      "If it is not fixed, or it is serious, contact the NDIS Commission.",
    ],
    contacts: [NDIS_COMMISSION, ADVOCACY],
  },
  {
    id: "unsafe",
    icon: "🚨",
    label: "Someone is hurting me, or I don't feel safe",
    steps: [
      "If you are in danger right now, call 000.",
      "Tell someone you trust.",
      "You can report abuse, neglect or exploitation to the hotline below.",
      "If it involves an NDIS provider or worker, you can also tell the NDIS Commission.",
    ],
    contacts: [
      {
        name: "Emergency services",
        phone: "000",
        note: "If you or someone else is in danger right now.",
      },
      {
        name: "National Disability Abuse and Neglect Hotline",
        phone: "1800 880 052",
        note: "To report abuse, neglect or exploitation of a person with disability.",
      },
      NDIS_COMMISSION,
    ],
  },
  {
    id: "ndia-decision",
    icon: "📄",
    label: "I don't agree with an NDIA decision about my plan or access",
    steps: [
      "Ask the NDIA to look at the decision again. This is called an internal review.",
      "You need to ask within 3 months of getting the decision. You can ask by phone or ask your planner or local area coordinator.",
      "If you still don't agree after the internal review, you can ask the Administrative Review Tribunal (ART) to look at it. There is a time limit, so act quickly.",
      "A free disability advocate can help you through each step.",
    ],
    contacts: [NDIA, ADVOCACY],
  },
  {
    id: "ndia-service",
    icon: "☎️",
    label: "I'm unhappy with how the NDIA treated me",
    steps: [
      "Make a complaint to the NDIA first. Say what happened and what you want them to do.",
      "If the NDIA doesn't fix it, you can complain to the Commonwealth Ombudsman. It is free and independent.",
    ],
    contacts: [
      NDIA,
      {
        name: "Commonwealth Ombudsman",
        phone: "1300 362 072",
        website: "https://www.ombudsman.gov.au",
        note: "Complaints about Australian Government agencies, including the NDIA, if they haven't fixed the problem.",
      },
    ],
  },
  {
    id: "discrimination",
    icon: "⚖️",
    label: "I was treated unfairly because of my disability",
    steps: [
      "This could be at work, school, a shop, on transport, or anywhere else.",
      "Write down what happened, when, and who was there.",
      "The Australian Human Rights Commission can give you information and take complaints about disability discrimination.",
    ],
    contacts: [
      {
        name: "Australian Human Rights Commission",
        phone: "1300 656 419",
        website: "https://humanrights.gov.au",
        note: "Information and complaints about discrimination.",
      },
      ADVOCACY,
    ],
  },
  {
    id: "advocate",
    icon: "🤝",
    label: "I want someone on my side",
    steps: [
      "An advocate is free and independent. They work for you, not for the NDIS or your provider.",
      "They can come to meetings, help you understand letters, and help you make a complaint.",
    ],
    contacts: [ADVOCACY],
  },
];

export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
