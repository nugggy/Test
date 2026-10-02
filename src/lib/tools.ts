export interface ToolEntry {
  slug: string;
  name: string;
  description: string;
  icon: string;
  status: "live" | "soon";
  category: string;
  /**
   * Whether the tool keeps working with no internet connection, once its
   * page has been opened at least once while online (the service worker at
   * public/sw.js then caches its assets). All current tools are
   * localStorage-only with no live network calls, so this is true across
   * the board today - set to false only for a tool whose core function
   * requires a live network call (e.g. a future Supabase-backed sync).
   */
  worksOffline: boolean;
}

export const tools: ToolEntry[] = [
  {
    slug: "who-can-help-me",
    name: "Who Can Help Me?",
    description:
      "Find the right support service for how you're feeling right now - crisis lines, mental health support, family violence support, and NDIS complaints and advocacy.",
    icon: "🛟",
    status: "live",
    category: "Emotional regulation",
    worksOffline: true,
  },
  {
    slug: "communication-board",
    name: "Visual Communication Board",
    description:
      "Tap pictures to speak wants, needs and feelings out loud. Works offline.",
    icon: "🗣️",
    status: "live",
    category: "Communication",
    worksOffline: true,
  },
  {
    slug: "visual-schedule",
    name: "Visual Schedule Builder",
    description:
      "Build a picture timeline of the day so routines feel predictable - drag to reorder, and set a countdown timer per step.",
    icon: "🗓️",
    status: "live",
    category: "Routines",
    worksOffline: true,
  },
  {
    slug: "social-story",
    name: "Social Story Creator",
    description: "Create a simple, illustrated story to prepare for a new place or event.",
    icon: "📖",
    status: "live",
    category: "Preparation",
    worksOffline: true,
  },
  {
    slug: "behaviour-tracking",
    name: "Behaviour Tracking Tool",
    description: "Quick ABC (antecedent-behaviour-consequence) data collection with trend charts.",
    icon: "📊",
    status: "live",
    category: "Allied health",
    worksOffline: true,
  },
  {
    slug: "emotion-tracker",
    name: "Emotion Tracker",
    description: "Daily emotion check-ins to build self-awareness and spot patterns over time.",
    icon: "🙂",
    status: "live",
    category: "Wellbeing",
    worksOffline: true,
  },
  {
    slug: "weekly-schedule",
    name: "Weekly Schedule",
    description: "Plan the whole week at a glance with picture activities for each day.",
    icon: "📅",
    status: "live",
    category: "Routines",
    worksOffline: true,
  },
  {
    slug: "budget-tracker",
    name: "Budget Tracker",
    description: "Log income and expenses and see where the money goes, category by category.",
    icon: "💰",
    status: "live",
    category: "Independent living",
    worksOffline: true,
  },
  {
    slug: "emotional-regulation-plan",
    name: "Emotional Regulation Plan",
    description: "A step-by-step calm-down, grounding and crisis plan: warning signs, calming strategies, grounding techniques, people to go to, and when to get urgent help.",
    icon: "🧭",
    status: "live",
    category: "Emotional regulation",
    worksOffline: true,
  },
  {
    slug: "traffic-light-checkin",
    name: "Traffic Light Check-In",
    description: "A quick tap-in: green, amber or red, with a suggested strategy for each.",
    icon: "🚦",
    status: "live",
    category: "Emotional regulation",
    worksOffline: true,
  },
  {
    slug: "sensory-needs",
    name: "Sensory Needs",
    description:
      "Understand sensory seeking and avoiding across sound, light, touch, taste/smell, movement and body awareness, and build a personal profile of what helps and what overwhelms.",
    icon: "🧠",
    status: "live",
    category: "Emotional regulation",
    worksOffline: true,
  },
  {
    slug: "meal-planner",
    name: "Meal Planner & Shopping List",
    description: "Build recipes, plan meals for the week, get an automatic shopping list, and export a shareable cookbook PDF.",
    icon: "🍲",
    status: "live",
    category: "Independent living",
    worksOffline: true,
  },
  {
    slug: "support-plan",
    name: "Support Plan",
    description: "A one-page, person-centred plan: goals, supports, health & safety info, communication tips and emergency contacts.",
    icon: "📋",
    status: "live",
    category: "Preparation",
    worksOffline: true,
  },
  {
    slug: "decision-helper",
    name: "Decision Helper",
    description:
      "Work through a decision step by step: list your options, weigh up the for and against and likely consequences, note who to talk to, and log your choice.",
    icon: "⚖️",
    status: "live",
    category: "Independent living",
    worksOffline: true,
  },
  {
    slug: "what-next",
    name: "What Should I Do Next?",
    description:
      "Pick how you're feeling and get suggested strategies to help - plus a place to save your own strategies recommended just for you.",
    icon: "🧩",
    status: "live",
    category: "Emotional regulation",
    worksOffline: true,
  },
  {
    slug: "goal-tracker",
    name: "Goal Tracker",
    description:
      "Set goals, break them into steps, and tick them off as you go - with an optional target date and notes for each one.",
    icon: "🎯",
    status: "live",
    category: "Goals & planning",
    worksOffline: true,
  },
  {
    slug: "visual-labels",
    name: "Visual Labels Maker",
    description:
      "Create simple picture-and-word labels to print, cut out, and stick up around the house - doors, drawers, routines and reminders.",
    icon: "🏷️",
    status: "live",
    category: "Independent living",
    worksOffline: true,
  },
  {
    slug: "friendship-goals",
    name: "Friendship Goal Planner",
    description:
      "Set goals around meeting people, maintaining friendships, and community inclusion - with steps to break each one down.",
    icon: "🧑‍🤝‍🧑",
    status: "live",
    category: "Goals & planning",
    worksOffline: true,
  },
  {
    slug: "ndis-meeting-prep",
    name: "NDIS Meeting Preparation",
    description:
      "Get ready for an NDIS planning or review meeting: what's working, what isn't, your support needs, future goals, and questions for your planner.",
    icon: "🗂️",
    status: "live",
    category: "Preparation",
    worksOffline: true,
  },
  {
    slug: "support-team",
    name: "My Support Team Directory",
    description:
      "Keep every support contact in one place: Plan Manager, Support Coordinator, therapists, medical specialists and emergency contacts.",
    icon: "📇",
    status: "live",
    category: "Preparation",
    worksOffline: true,
  },
  {
    slug: "friends-directory",
    name: "My Friends Directory",
    description:
      "Keep family, friends and community contacts in one place, with phone, email and notes for each.",
    icon: "👨‍👩‍👧‍👦",
    status: "live",
    category: "Preparation",
    worksOffline: true,
  },
  {
    slug: "daily-life-assistant",
    name: "Daily Life Assistant",
    description:
      "Create your own step-by-step instructions for everyday tasks - fully customisable, tick off each step, and reset for next time.",
    icon: "🪜",
    status: "live",
    category: "Independent living",
    worksOffline: true,
  },
  {
    slug: "medication-reminder",
    name: "Medication Reminder",
    description:
      "Keep a list of medications and doses, tick off today's checklist, see an adherence dashboard, and export a CSV or PDF for a doctor or pharmacist review.",
    icon: "💊",
    status: "live",
    category: "Independent living",
    worksOffline: true,
  },
  {
    slug: "seizure-log",
    name: "Seizure Observation Log",
    description:
      "Record seizure type, duration, severity and triggers, see the patterns on a visual dashboard, and export a CSV or PDF for a specialist review.",
    icon: "🧠",
    status: "live",
    category: "Allied health",
    worksOffline: true,
  },
  {
    slug: "sleep-tracker",
    name: "Sleep Tracker",
    description:
      "Log bedtime, wake time and sleep quality each night, see hours slept over time on a chart, and export your log as a CSV.",
    icon: "🌙",
    status: "live",
    category: "Wellbeing",
    worksOffline: true,
  },
  {
    slug: "easy-read-converter",
    name: "Easy Read Converter",
    description:
      "Paste in text and get a simplified, Easy Read version - short sentences, plain words, and a picture for key ideas. Works fully offline.",
    icon: "📝",
    status: "live",
    category: "Communication",
    worksOffline: true,
  },
  {
    slug: "holiday-planner",
    name: "Holiday Planner",
    description:
      "Plan a trip step by step: destination and dates, accommodation and transport, a day-by-day itinerary, packing and documents checklists, budget, and emergency contacts.",
    icon: "🧳",
    status: "live",
    category: "Preparation",
    worksOffline: true,
  },
  {
    slug: "diabetes-tracker",
    name: "Diabetes BGL & Insulin Tracker",
    description:
      "Log blood glucose readings and insulin doses, see the trend over time on a chart, build a visual management plan from your doctor's recommendations, and export or print to share with your diabetes care team.",
    icon: "🩸",
    status: "live",
    category: "Allied health",
    worksOffline: true,
  },
  {
    slug: "healthy-relationships",
    name: "Healthy Relationships",
    description:
      "Plain-language education on healthy relationships, consent, warning signs, communication and staying safe - plus a private, personal space to write down what matters to you.",
    icon: "💜",
    status: "live",
    category: "Wellbeing",
    worksOffline: true,
  },
  {
    slug: "know-your-rights",
    name: "Know Your Rights",
    description:
      "Plain-language guide to your rights as an NDIS participant and your human rights, supported decision-making, how to make a complaint, and where to get help exercising your rights.",
    icon: "📜",
    status: "live",
    category: "Preparation",
    worksOffline: true,
  },
  {
    slug: "conditions-guide",
    name: "Understanding Conditions",
    description:
      "Plain-language information on 20 common disabilities and conditions - autism, ADHD, intellectual disability, cerebral palsy, Down syndrome and more - with links to reputable Australian organisations for each.",
    icon: "🔬",
    status: "live",
    category: "Preparation",
    worksOffline: true,
  },
  {
    slug: "ndis-compliance",
    name: "NDIS Compliance & Provider Obligations",
    description:
      "What your NDIS provider is required to do - the Code of Conduct, service agreements, cancellations, worker screening, incidents and restrictive practices, and complaints - with a self-check and how to raise a concern.",
    icon: "🛡️",
    status: "live",
    category: "Preparation",
    worksOffline: true,
  },
  {
    slug: "active-support",
    name: "Active Support for Support Workers",
    description:
      "A plain-language breakdown of the five core elements of Active Support, with practical examples and a self-reflection checklist.",
    icon: "🌱",
    status: "live",
    category: "Allied health",
    worksOffline: true,
  },
  {
    slug: "fitness-plan",
    name: "Exercise & Fitness Plan",
    description:
      "Set fitness goals with steps to break them down, log each exercise session, and see your progress on a chart over time.",
    icon: "🏋️",
    status: "live",
    category: "Goals & planning",
    worksOffline: true,
  },
  {
    slug: "savings-plan",
    name: "Savings Plan",
    description:
      "Set one or more savings goals with a target amount, log every contribution, and watch a progress bar build up towards each goal.",
    icon: "🐷",
    status: "live",
    category: "Independent living",
    worksOffline: true,
  },
  {
    slug: "money-counter",
    name: "Money Counter",
    description:
      "Learn to recognise Australian coins and notes and practise counting money - tap to build a pile and watch the total add up.",
    icon: "💰",
    status: "live",
    category: "Independent living",
    worksOffline: true,
  },
  {
    slug: "easy-read-clock",
    name: "Easy-Read Clock",
    description:
      "A big, clear digital or analog clock with numbers, hand styles and a speak-the-time button - choose any timezone, and customise the colours, size and format to suit you.",
    icon: "🕐",
    status: "live",
    category: "Independent living",
    worksOffline: true,
  },
  {
    slug: "weather",
    name: "Weather",
    description:
      "A simple, customisable weather display - search any location, see today's conditions and a short forecast, and customise the colours and text size.",
    icon: "⛅",
    status: "live",
    category: "Independent living",
    worksOffline: false,
  },
  {
    slug: "first-then-board",
    name: "First-Then Board & Choice Board",
    description:
      "A First-Then board for what's happening now and next, plus a Choice Board for offering options - tap-to-speak pictures, ready to use straight away.",
    icon: "🔜",
    status: "live",
    category: "Communication",
    worksOffline: true,
  },
  {
    slug: "visual-timer",
    name: "Visual Timer",
    description:
      "A big, simple countdown that shows time passing - a shrinking pie or bar, not just numbers. Great for transitions, sensory breaks and turn-taking.",
    icon: "⏳",
    status: "live",
    category: "Routines",
    worksOffline: true,
  },
  {
    slug: "emergency-info-card",
    name: "Emergency / About Me Card",
    description:
      "A printable, phone-ready card with conditions, allergies, medications, communication needs and emergency contacts - to hand to first responders or new support staff.",
    icon: "🆘",
    status: "live",
    category: "Preparation",
    worksOffline: true,
  },
  {
    slug: "conversation-starter-cards",
    name: "Conversation Starter Cards",
    description:
      "A deck of conversation-starter prompts, grouped by category, for anyone who finds small talk hard - especially useful in group or day programs.",
    icon: "💬",
    status: "live",
    category: "Communication",
    worksOffline: true,
  },
  {
    slug: "memory-aid-board",
    name: "Memory Aid / Reminder Board",
    description:
      "Visual daily prompts for memory or executive-function difficulties - a checklist of recurring reminders grouped by time of day that resets automatically each morning.",
    icon: "🧠",
    status: "live",
    category: "Independent living",
    worksOffline: true,
  },
  {
    slug: "core-word-board",
    name: "Core Word Board",
    description:
      "A fixed, colour-coded core-vocabulary AAC board of high-frequency words, arranged by part of speech. Tap to speak, or build a short sentence.",
    icon: "🔤",
    status: "live",
    category: "Communication",
    worksOffline: true,
  },
  {
    slug: "change-preparation",
    name: "Change Preparation Toolkit",
    description:
      "Prepare for an upcoming change - moving house, a new school, a new support worker - with what's changing, what's staying the same, a countdown, and things that might help.",
    icon: "🧭",
    status: "live",
    category: "Preparation",
    worksOffline: true,
  },
  {
    slug: "task-sequencing",
    name: "Task Sequencing Tool",
    description:
      "Break a task down into ordered picture steps, then run through it one step at a time and tick each one off as it's done.",
    icon: "🪜",
    status: "live",
    category: "Independent living",
    worksOffline: true,
  },
  {
    slug: "ndis-budget-tracker",
    name: "NDIS Plan Budget Tracker",
    description:
      "See spend vs. plan allocation for each NDIS support category - Core Supports, Capacity Building and Capital Supports.",
    icon: "🧾",
    status: "live",
    category: "Independent living",
    worksOffline: true,
  },
];
