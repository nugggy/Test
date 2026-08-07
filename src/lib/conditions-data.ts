export interface ConditionResource {
  name: string;
  url: string;
}

export interface ConditionInfo {
  id: string;
  name: string;
  /** Other names/terms people might search for. */
  aliases: string[];
  category: string;
  summary: string;
  keyPoints: string[];
  resources: ConditionResource[];
}

// Plain-language, general information only - not a diagnosis or medical
// advice (see the disclaimer on the tool page). Written in a
// strengths-aware, person-first-or-identity-first-as-the-community-
// prefers tone. Resource links are to established Australian peak bodies
// or the Australian Government's healthdirect service where a
// condition-specific national body wasn't confidently available - all
// were checked at the time of writing, but organisations do change URLs,
// so if a link doesn't work, search the organisation's name directly.
export const CONDITIONS: ConditionInfo[] = [
  {
    id: "autism",
    name: "Autism Spectrum Disorder",
    aliases: ["autism", "asd", "aspergers"],
    category: "Neurodevelopmental",
    summary:
      "A lifelong neurodevelopmental difference affecting how someone communicates, interacts socially, and experiences the world - including how they process sensory information. \"Spectrum\" reflects how differently it shows up from person to person, not a scale from mild to severe.",
    keyPoints: [
      "Often includes differences in social communication, a preference for routine/predictability, focused interests, and sensory sensitivities",
      "Strengths commonly include deep focus, pattern recognition, honesty and directness, and strong knowledge in areas of interest",
      "Diagnosed and understood differently across a person's life - many autistic adults are diagnosed later in life",
    ],
    resources: [
      { name: "Amaze", url: "https://www.amaze.org.au" },
      { name: "Autism Spectrum Australia (Aspect)", url: "https://www.aspect.org.au" },
    ],
  },
  {
    id: "adhd",
    name: "ADHD (Attention-Deficit/Hyperactivity Disorder)",
    aliases: ["adhd", "add"],
    category: "Neurodevelopmental",
    summary:
      "A neurodevelopmental condition affecting attention regulation, impulse control, and activity levels. It shows up differently in different people - some are more visibly hyperactive, others mainly experience inattention (sometimes still called \"ADD\").",
    keyPoints: [
      "Not about effort or willpower - it's a difference in how the brain regulates attention, motivation and impulses",
      "Often comes with strengths like creativity, hyperfocus on interesting tasks, and quick thinking",
      "Commonly diagnosed in childhood, but many people (especially women) are diagnosed as adults",
    ],
    resources: [{ name: "ADHD Australia", url: "https://www.adhdaustralia.org.au" }],
  },
  {
    id: "intellectual-disability",
    name: "Intellectual Disability",
    aliases: ["intellectual disability", "cognitive disability"],
    category: "Intellectual",
    summary:
      "Affects a person's intellectual functioning (learning, reasoning, problem-solving) and adaptive behaviour (everyday practical and social skills), starting before adulthood. Support needs vary widely from person to person.",
    keyPoints: [
      "Not the same as a mental illness or an acquired brain injury",
      "With the right support, people with intellectual disability can and do work, live independently, and take part fully in community life",
      "Communication and decision-making should always be as supported as possible, respecting the person's own choices",
    ],
    resources: [{ name: "Inclusion Australia", url: "https://www.inclusionaustralia.org.au" }],
  },
  {
    id: "cerebral-palsy",
    name: "Cerebral Palsy",
    aliases: ["cerebral palsy", "cp"],
    category: "Physical",
    summary:
      "A group of conditions affecting movement and posture, caused by a disruption to the developing brain, usually before or around birth. It's not progressive (it doesn't get worse over time) but how it affects someone can change as they grow.",
    keyPoints: [
      "Affects people very differently - from mild coordination differences to needing full-time mobility and communication support",
      "Often involves muscle tone, movement and posture, but doesn't necessarily affect intellectual ability",
      "May come with related conditions like epilepsy or communication differences, but not always",
    ],
    resources: [{ name: "Cerebral Palsy Alliance", url: "https://www.cerebralpalsy.org.au" }],
  },
  {
    id: "down-syndrome",
    name: "Down Syndrome",
    aliases: ["down syndrome", "downs syndrome", "trisomy 21"],
    category: "Intellectual",
    summary:
      "A genetic condition caused by an extra copy of chromosome 21, associated with some degree of intellectual disability and characteristic physical features. It's the most common chromosomal condition, and support needs and abilities vary widely.",
    keyPoints: [
      "People with Down syndrome can and do learn, work, form relationships, and live fulfilling, independent lives",
      "May come with associated health considerations (like heart or hearing differences) worth monitoring, especially early in life",
      "Early intervention (speech, physio, occupational therapy) makes a real difference to development",
    ],
    resources: [{ name: "Down Syndrome Australia", url: "https://www.downsyndrome.org.au" }],
  },
  {
    id: "epilepsy",
    name: "Epilepsy",
    aliases: ["epilepsy", "seizures", "seizure disorder"],
    category: "Neurological",
    summary:
      "A neurological condition causing recurring seizures - sudden bursts of electrical activity in the brain that can affect movement, awareness, or sensation. Seizures vary hugely in type and severity, from brief lapses in awareness to convulsive episodes.",
    keyPoints: [
      "Many people with epilepsy manage it well with medication and have few or no seizures",
      "Knowing someone's seizure first aid plan (and what NOT to do, like restraining someone or putting something in their mouth) matters",
      "Triggers can include lack of sleep, stress, flashing lights, or missed medication, though this varies by person",
    ],
    resources: [{ name: "Epilepsy Foundation", url: "https://www.epilepsyfoundation.org.au" }],
  },
  {
    id: "vision-impairment",
    name: "Vision Impairment / Blindness",
    aliases: ["blind", "blindness", "low vision", "vision impairment"],
    category: "Sensory",
    summary:
      "A reduction in vision, from low vision (some usable sight) through to total blindness, that can't be fully corrected with glasses or contact lenses. Causes and the amount/type of vision affected vary widely.",
    keyPoints: [
      "Many people with vision impairment use a combination of strategies: assistive technology, a cane, a guide dog, Braille, or magnification",
      "Describe things specifically rather than pointing or saying \"over there\"",
      "Always identify yourself when approaching, and ask before guiding someone rather than grabbing their arm",
    ],
    resources: [{ name: "Vision Australia", url: "https://www.visionaustralia.org" }],
  },
  {
    id: "deafness",
    name: "Deafness / Hearing Loss",
    aliases: ["deaf", "deafness", "hearing loss", "hard of hearing"],
    category: "Sensory",
    summary:
      "Ranges from mild hearing loss through to profound deafness. Some people identify culturally as Deaf (capital D) and use Auslan as their primary language; others are hard of hearing and rely on hearing aids, cochlear implants, lip-reading, or captions.",
    keyPoints: [
      "Ask the person their preferred way to communicate - don't assume everyone lip-reads or signs",
      "Face the person and keep your mouth visible when speaking; a hand over your mouth blocks lip-reading and facial cues",
      "Auslan is a distinct language, not just English on the hands - an interpreter may be needed for important conversations",
    ],
    resources: [{ name: "Deaf Australia", url: "https://www.deafaustralia.org.au" }],
  },
  {
    id: "spinal-cord-injury",
    name: "Spinal Cord Injury",
    aliases: ["spinal cord injury", "sci", "paraplegia", "quadriplegia", "tetraplegia"],
    category: "Physical",
    summary:
      "Damage to the spinal cord, usually from an accident, that affects movement and sensation below the point of injury. The effects depend heavily on where the injury is and how complete it is - from some loss of function through to full paralysis.",
    keyPoints: [
      "Someone's wheelchair is part of their personal space - don't lean, push, or hold onto it without asking",
      "Speak at eye level where possible rather than standing over someone in a wheelchair for a long conversation",
      "Effects can include changes to bladder/bowel function and temperature regulation, not just movement",
    ],
    resources: [{ name: "Spinal Cord Injuries Australia", url: "https://scia.org.au" }],
  },
  {
    id: "acquired-brain-injury",
    name: "Acquired Brain Injury",
    aliases: ["abi", "brain injury", "traumatic brain injury", "tbi"],
    category: "Neurological",
    summary:
      "Damage to the brain that happens after birth - from an accident, stroke, infection, lack of oxygen, or other causes. Effects vary enormously depending on which part of the brain is affected, and can include physical, cognitive, and personality/behavioural changes.",
    keyPoints: [
      "Effects are often invisible - fatigue, memory difficulties, or slower processing speed may not be obvious from the outside",
      "The person's personality or emotional responses may have changed since the injury, which can be hard for both them and people around them",
      "Recovery can continue for a long time after the injury, though progress often slows over the first couple of years",
    ],
    resources: [{ name: "Brain Injury Australia", url: "https://www.braininjuryaustralia.org.au" }],
  },
  {
    id: "multiple-sclerosis",
    name: "Multiple Sclerosis",
    aliases: ["multiple sclerosis", "ms"],
    category: "Neurological",
    summary:
      "An autoimmune condition where the immune system attacks the protective coating of nerve fibres in the brain and spinal cord, disrupting the signals between the brain and body. It's unpredictable - symptoms and their severity vary a lot between people and can change over time.",
    keyPoints: [
      "Common symptoms include fatigue, mobility changes, vision changes, and cognitive effects - fatigue especially is often invisible but very real",
      "Symptoms can flare (relapse) and settle (remit), or progress gradually, depending on the type of MS",
      "Heat can temporarily worsen symptoms for some people (Uhthoff's phenomenon) - it usually passes once they cool down",
    ],
    resources: [{ name: "MS Australia", url: "https://www.msaustralia.org.au" }],
  },
  {
    id: "muscular-dystrophy",
    name: "Muscular Dystrophy",
    aliases: ["muscular dystrophy", "md", "duchenne"],
    category: "Physical",
    summary:
      "A group of genetic conditions that cause progressive weakening and loss of muscle mass over time. There are many types (Duchenne being the most common), with different ages of onset and rates of progression.",
    keyPoints: [
      "Progressive means mobility and support needs may change over time, which support/care plans need to anticipate",
      "Respiratory and cardiac health are often monitored closely, since muscles involved in breathing and heart function can be affected",
      "Assistive technology (mobility aids, communication devices, breathing support) plays a big role in maintaining independence",
    ],
    resources: [{ name: "Muscular Dystrophy Australia", url: "https://www.mda.org.au" }],
  },
  {
    id: "spina-bifida",
    name: "Spina Bifida",
    aliases: ["spina bifida"],
    category: "Physical",
    summary:
      "A condition where the spine and spinal cord don't develop fully during early pregnancy, leaving a gap. Severity ranges from a mild form with no visible effects through to significant impacts on mobility and bladder/bowel function.",
    keyPoints: [
      "Often associated with hydrocephalus (fluid build-up around the brain), which may need a shunt to manage",
      "Mobility support ranges from none needed through to wheelchair use, depending on severity",
      "Taking folic acid before and during early pregnancy significantly reduces the risk - a well-established prevention message",
    ],
    resources: [{ name: "Healthdirect: Spina bifida", url: "https://www.healthdirect.gov.au/spina-bifida" }],
  },
  {
    id: "fasd",
    name: "Fetal Alcohol Spectrum Disorder (FASD)",
    aliases: ["fasd", "fetal alcohol syndrome", "fas"],
    category: "Neurodevelopmental",
    summary:
      "A lifelong condition caused by alcohol exposure before birth, affecting brain development. It can affect learning, memory, attention, impulse control, and social understanding - often described as an invisible disability, since there may be no distinctive physical features.",
    keyPoints: [
      "Difficulties are often with cause-and-effect thinking, memory, and translating understanding into action - not intelligence itself",
      "Behaviour that looks like defiance is very often a genuine capacity difficulty, not a choice",
      "Structured routines, concrete language, and external supports (reminders, visual schedules) tend to help a lot",
    ],
    resources: [{ name: "NOFASD Australia", url: "https://www.nofasd.org.au" }],
  },
  {
    id: "dyslexia",
    name: "Dyslexia",
    aliases: ["dyslexia", "specific learning disorder", "reading difficulty"],
    category: "Learning",
    summary:
      "A specific learning disorder that primarily affects reading accuracy and fluency, and often spelling - unrelated to intelligence. It's thought to involve differences in how the brain processes the sounds within words.",
    keyPoints: [
      "Common signs include difficulty matching letters to sounds, slow/effortful reading, and trouble with spelling that persists despite good teaching",
      "Often comes with real strengths in areas like verbal reasoning, big-picture thinking, and problem-solving",
      "Structured, explicit, multisensory literacy instruction is the most evidence-based support approach",
    ],
    resources: [{ name: "Australian Dyslexia Association", url: "https://dyslexiaassociation.org.au" }],
  },
  {
    id: "dyspraxia",
    name: "Developmental Coordination Disorder (Dyspraxia)",
    aliases: ["dyspraxia", "dcd", "developmental coordination disorder"],
    category: "Learning",
    summary:
      "A condition affecting motor coordination - planning and carrying out physical movements - without an underlying medical or neurological explanation. It can affect handwriting, sport, and everyday tasks like using cutlery or getting dressed.",
    keyPoints: [
      "Not about laziness or lack of trying - the brain has to work harder to plan and sequence movements",
      "Can also affect organisation, time management, and sometimes speech (motor planning for speech sounds)",
      "Occupational therapy is a common and effective support, focusing on specific functional skills",
    ],
    resources: [{ name: "Healthdirect: Dyspraxia/DCD", url: "https://www.healthdirect.gov.au/dyspraxia" }],
  },
  {
    id: "speech-language",
    name: "Speech and Language Disorders",
    aliases: ["speech disorder", "language disorder", "stuttering", "apraxia of speech"],
    category: "Communication",
    summary:
      "A broad group of conditions affecting the ability to produce speech sounds clearly, use and understand language, or communicate fluently (like stuttering). They can occur on their own or alongside other conditions.",
    keyPoints: [
      "Understanding and expressing language are two different skills - someone may understand far more than they can say",
      "Give extra time to respond rather than finishing sentences for someone, unless they've asked you to",
      "Speech pathologists support a huge range of communication needs, not just \"speech\" in the narrow sense",
    ],
    resources: [{ name: "Speech Pathology Australia", url: "https://www.speechpathologyaustralia.org.au" }],
  },
  {
    id: "psychosocial-disability",
    name: "Psychosocial Disability",
    aliases: ["psychosocial disability", "mental illness", "mental health condition"],
    category: "Psychosocial",
    summary:
      "Disability that results from the ongoing impact of a mental health condition on someone's ability to participate fully in everyday life - it's the disability arising from the condition, not the mental health condition itself. It can come from conditions like schizophrenia, bipolar disorder, severe anxiety or depression, among others.",
    keyPoints: [
      "Recovery-oriented support focuses on what helps someone live the life they want, not just symptom management",
      "Psychosocial disability can fluctuate significantly - someone might need a lot of support some periods and much less at others",
      "Language matters: many people prefer to be seen as a person first, not defined by a diagnosis",
    ],
    resources: [{ name: "SANE Australia", url: "https://www.sane.org" }],
  },
  {
    id: "tourette-syndrome",
    name: "Tourette Syndrome",
    aliases: ["tourette syndrome", "tourettes", "tic disorder"],
    category: "Neurological",
    summary:
      "A condition causing tics - sudden, repetitive movements or sounds a person can't fully control. Tics usually start in childhood, often change over time, and can be made temporarily worse by stress, tiredness or excitement.",
    keyPoints: [
      "Tics aren't done on purpose and generally can't just be \"stopped\" by asking - suppressing them takes real effort and is tiring",
      "Contrary to the stereotype, involuntary swearing (coprolalia) is actually uncommon",
      "Often occurs alongside ADHD or OCD, which can affect support needs as much as the tics themselves",
    ],
    resources: [{ name: "Healthdirect: Tourette syndrome", url: "https://www.healthdirect.gov.au/tourette-syndrome" }],
  },
  {
    id: "fragile-x",
    name: "Fragile X Syndrome",
    aliases: ["fragile x", "fragile x syndrome", "fxs"],
    category: "Intellectual",
    summary:
      "A genetic condition and the most common inherited cause of intellectual disability, caused by a change in the FMR1 gene. Effects range from mild learning difficulties to more significant intellectual disability, and it can also involve social anxiety and sensory sensitivities.",
    keyPoints: [
      "Affects males more severely on average than females, though both can be affected",
      "Often comes with sensory sensitivities and anxiety in social or unfamiliar situations",
      "Genetic counselling is often relevant for families, since it can run in families and be passed on",
    ],
    resources: [{ name: "Fragile X Association of Australia", url: "https://www.fragilex.org.au" }],
  },
];
