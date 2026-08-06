export interface FeelingTag {
  id: string;
  label: string;
}

export const FEELING_TAGS: FeelingTag[] = [
  { id: "crisis", label: "In crisis right now" },
  { id: "medical", label: "Health or medication question" },
  { id: "anxious", label: "Anxious or overwhelmed" },
  { id: "lonely", label: "Lonely or isolated" },
  { id: "family-violence", label: "Unsafe at home" },
  { id: "just-talk", label: "Just want to talk to someone" },
  { id: "carer", label: "Supporting someone else" },
  { id: "ndis-complaint", label: "Problem with an NDIS provider" },
  { id: "abuse-neglect", label: "Abuse or neglect" },
  { id: "lgbtiq", label: "LGBTIQ+ support" },
  { id: "men", label: "Men's support" },
];

export interface Service {
  id: string;
  name: string;
  phone: string;
  hours: string;
  description: string;
  tags: string[];
  /** True for entries without a confirmed direct phone/URL - shown with a
   * note to verify locally rather than a number, so nothing unverified is
   * presented as if it were as solid as the crisis lines above it. */
  needsVerification?: boolean;
}

export const SERVICES: Service[] = [
  {
    id: "emergency",
    name: "Emergency services",
    phone: "000",
    hours: "24/7",
    description: "If you or someone else is in immediate danger, or it's a medical emergency.",
    tags: ["crisis", "family-violence", "abuse-neglect"],
  },
  {
    id: "lifeline",
    name: "Lifeline",
    phone: "13 11 14",
    hours: "24/7",
    description: "Crisis support and suicide prevention, for any kind of personal crisis.",
    tags: ["crisis", "just-talk", "anxious"],
  },
  {
    id: "poisons-information-centre",
    name: "Poisons Information Centre",
    phone: "13 11 26",
    hours: "24/7",
    description:
      "For poisoning or suspected poisoning - including medication taken by mistake, too much medication, or swallowing something harmful.",
    tags: ["crisis", "medical"],
  },
  {
    id: "healthdirect",
    name: "healthdirect",
    phone: "1800 022 222",
    hours: "24/7",
    description:
      "Speak to a registered nurse for health advice, or help deciding whether you need a GP, hospital or pharmacy.",
    tags: ["medical", "just-talk"],
  },
  {
    id: "suicide-call-back",
    name: "Suicide Call Back Service",
    phone: "1300 659 467",
    hours: "24/7",
    description: "Free phone and online counselling for people affected by suicide.",
    tags: ["crisis"],
  },
  {
    id: "kids-helpline",
    name: "Kids Helpline",
    phone: "1800 55 1800",
    hours: "24/7",
    description: "Free, confidential support for anyone aged 5 to 25.",
    tags: ["crisis", "anxious", "lonely", "just-talk"],
  },
  {
    id: "13yarn",
    name: "13YARN",
    phone: "13 92 76",
    hours: "24/7",
    description: "Crisis support line for Aboriginal and Torres Strait Islander peoples.",
    tags: ["crisis", "just-talk"],
  },
  {
    id: "beyond-blue",
    name: "Beyond Blue",
    phone: "1300 22 4636",
    hours: "24/7",
    description: "Support for anxiety, depression and general mental health.",
    tags: ["anxious", "just-talk"],
  },
  {
    id: "1800respect",
    name: "1800RESPECT",
    phone: "1800 737 732",
    hours: "24/7",
    description: "Counselling and support for domestic, family and sexual violence.",
    tags: ["family-violence", "crisis"],
  },
  {
    id: "mensline",
    name: "MensLine Australia",
    phone: "1300 78 99 78",
    hours: "24/7",
    description: "Support and counselling for men, on relationships and life challenges.",
    tags: ["men", "just-talk"],
  },
  {
    id: "qlife",
    name: "QLife",
    phone: "1800 184 527",
    hours: "3pm–9pm, every day",
    description: "Peer support and referral for LGBTIQ+ people.",
    tags: ["lgbtiq", "lonely", "just-talk"],
  },
  {
    id: "carer-gateway",
    name: "Carer Gateway",
    phone: "1800 422 737",
    hours: "Mon–Fri, 8am–5pm",
    description: "Free services and support for carers, including counselling and respite.",
    tags: ["carer"],
  },
  {
    id: "disability-abuse-neglect",
    name: "National Disability Abuse and Neglect Hotline",
    phone: "1800 880 052",
    hours: "Mon–Fri, 9am–7pm AEST/AEDT",
    description:
      "For reporting abuse, neglect or exploitation of a person with disability, and getting help.",
    tags: ["abuse-neglect", "ndis-complaint"],
  },
  {
    id: "ndis-commission",
    name: "NDIS Quality and Safeguards Commission",
    phone: "1800 035 544",
    hours: "Mon–Fri, 9am–5pm (7:30am–3:30pm in WA)",
    description: "To make a complaint about an NDIS provider or the support you've received.",
    tags: ["ndis-complaint", "abuse-neglect"],
  },
  {
    id: "ndis-contact-centre",
    name: "NDIS National Contact Centre",
    phone: "1800 800 110",
    hours: "Mon–Fri, 8am–8pm",
    description: "General questions about your NDIS plan, funding or providers.",
    tags: ["ndis-complaint", "carer"],
  },
  {
    id: "disability-advocacy",
    name: "Disability Gateway - Advocacy Finder",
    phone: "1800 643 787",
    hours: "Mon–Fri, 8am–8pm",
    description:
      "A free, independent advocate can support you to sort out a problem with a provider or the NDIS. Call the Disability Gateway, or search \"Disability Advocacy Finder\" on Ask Izzy to find one near you.",
    tags: ["ndis-complaint", "abuse-neglect"],
  },
];
