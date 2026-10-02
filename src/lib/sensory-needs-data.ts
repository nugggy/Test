export interface SensoryDomain {
  id: string;
  icon: string;
  title: string;
  summary: string;
  /** Examples of "seeking" signs - actively looking for more input in this
   * sense - to help recognise the pattern, not an exhaustive or diagnostic
   * list. */
  seekingSigns: string[];
  /** Examples of "avoiding"/sensitivity signs - finding this input
   * overwhelming or uncomfortable. */
  avoidingSigns: string[];
  helpsSuggestions: string[];
  overwhelmsSuggestions: string[];
}

// Plain-language introduction to sensory processing across the senses.
// "Seeking" and "avoiding" aren't fixed types - the same person can seek
// input in one sense and avoid it in another, and it can change day to
// day. This is educational, not a diagnostic tool.
export const SENSORY_DOMAINS: SensoryDomain[] = [
  {
    id: "sound",
    icon: "🔊",
    title: "Sound",
    summary:
      "How someone responds to noise, from background hum to sudden loud sounds.",
    seekingSigns: [
      "Enjoys loud music or noisy environments",
      "Makes repetitive sounds or noises",
      "Turns the volume up higher than others expect",
    ],
    avoidingSigns: [
      "Covers ears in noisy places (assemblies, shopping centres, hand dryers)",
      "Distressed by sudden or unexpected sounds",
      "Notices background noise (fridge hum, fluorescent lights) that others tune out",
    ],
    helpsSuggestions: [
      "Noise-cancelling headphones or ear defenders",
      "A quiet space to retreat to",
      "Warning before a loud sound is about to happen (e.g. a hand dryer, a fire alarm test)",
      "Music or white noise to block out unpredictable sounds",
    ],
    overwhelmsSuggestions: [
      "Crowded, echoey spaces (shopping centres, assemblies, gyms)",
      "Sudden loud sounds (alarms, dogs barking, hand dryers)",
      "Multiple people talking at once",
    ],
  },
  {
    id: "light-visual",
    icon: "💡",
    title: "Light & visual",
    summary: "How someone responds to brightness, visual clutter and movement in their field of view.",
    seekingSigns: [
      "Drawn to bright lights, spinning objects, or shiny things",
      "Likes watching things move (fans, wheels, water)",
      "Seeks out bright colours or visually busy spaces",
    ],
    avoidingSigns: [
      "Squints or looks away in bright/fluorescent light",
      "Overwhelmed by visually busy or cluttered spaces",
      "Prefers dim lighting or sunglasses indoors",
    ],
    helpsSuggestions: [
      "Sunglasses or a cap, even indoors",
      "Dimmer switches or natural light instead of fluorescent lighting",
      "A visually calm, uncluttered space",
      "Warning before entering a bright or visually busy environment",
    ],
    overwhelmsSuggestions: [
      "Fluorescent or flickering lights",
      "Visually cluttered or crowded spaces",
      "Bright sunlight without shade",
    ],
  },
  {
    id: "touch",
    icon: "✋",
    title: "Touch",
    summary: "How someone responds to being touched, textures, and clothing.",
    seekingSigns: [
      "Seeks out hugs, deep pressure, or firm touch",
      "Enjoys textured materials, fidgeting or messy play",
      "Touches objects or people frequently to explore them",
    ],
    avoidingSigns: [
      "Uncomfortable with light or unexpected touch",
      "Sensitive to clothing tags, seams, or certain fabrics",
      "Avoids messy textures (sand, glue, certain foods)",
    ],
    helpsSuggestions: [
      "Deep pressure (a firm hug, a weighted blanket, a tight hoodie)",
      "Choosing their own clothing textures, and removing tags",
      "A warning before being touched, and asking first rather than surprising them",
      "Fidget tools for hands that want tactile input",
    ],
    overwhelmsSuggestions: [
      "Unexpected or light touch (a tap on the shoulder from behind)",
      "Scratchy fabric, tags, or seams",
      "Messy textures without warning",
    ],
  },
  {
    id: "taste-smell",
    icon: "👃",
    title: "Taste & smell",
    summary: "How someone responds to food textures/flavours and strong smells.",
    seekingSigns: [
      "Seeks out strong flavours or smells",
      "Chews or mouths objects beyond a typical age",
      "Enjoys sniffing food, objects, or people",
    ],
    avoidingSigns: [
      "Very selective eating, often about texture more than taste",
      "Gags or is distressed by certain smells (perfume, cleaning products, some foods)",
      "Avoids mixed textures in food",
    ],
    helpsSuggestions: [
      "Respecting food preferences rather than pushing new textures",
      "Fragrance-free products where possible",
      "Warning before a strong smell (e.g. cleaning, cooking) is likely",
      "Safe, preferred foods always available",
    ],
    overwhelmsSuggestions: [
      "Strong perfumes, cleaning products, or cooking smells",
      "Mixed or unexpected food textures",
      "Crowded food halls with many smells at once",
    ],
  },
  {
    id: "movement",
    icon: "🌀",
    title: "Movement (vestibular)",
    summary: "How someone responds to motion - spinning, swinging, being off-balance.",
    seekingSigns: [
      "Seeks spinning, swinging, rocking, or fast movement",
      "Enjoys being upside down or off-balance",
      "Constantly on the move, fidgety, or restless",
    ],
    avoidingSigns: [
      "Avoids swings, escalators, or being off the ground",
      "Gets motion sick easily",
      "Cautious on stairs, uneven ground, or moving vehicles",
    ],
    helpsSuggestions: [
      "Swinging, rocking, spinning, trampolining, or other movement breaks",
      "A wobble cushion or rocking chair for movement while seated",
      "Plenty of notice and time when facing unfamiliar movement (escalators, boats)",
    ],
    overwhelmsSuggestions: [
      "Unexpected loss of balance (being tipped or spun without warning)",
      "Escalators, boats, or turbulence",
      "Long car trips without breaks",
    ],
  },
  {
    id: "body-awareness",
    icon: "🧍",
    title: "Body awareness (proprioception)",
    summary: "A sense of where the body is in space and how much force to use.",
    seekingSigns: [
      "Seeks heavy work - pushing, pulling, carrying, crashing into things",
      "Uses more force than needed (heavy footsteps, slamming doors)",
      "Enjoys being squeezed, squashed, or in tight spaces",
    ],
    avoidingSigns: [
      "Seems clumsy, or unsure how much force to use",
      "Fatigues quickly with physical activity",
      "Avoids activities that involve a lot of body coordination",
    ],
    helpsSuggestions: [
      "Heavy work: carrying bags, pushing a trolley, wall push-ups",
      "A weighted blanket or lap pad",
      "Regular movement breaks through the day",
      "Tight spaces or being squeezed (a cushion fort, a firm hug)",
    ],
    overwhelmsSuggestions: [
      "Long periods of sitting still without a movement break",
      "Activities demanding fine motor precision without support",
      "Unstructured time with no clear physical outlet",
    ],
  },
];

export interface SensoryNeedsNotes {
  /** Who the profile is about, shown at the top when printed. Added later,
   * so older saved profiles load with "". */
  name: string;
  /** What helps, keyed by sensory domain id (see SENSORY_DOMAINS). */
  helps: Record<string, string[]>;
  /** What overwhelms/triggers, keyed by sensory domain id. */
  overwhelms: Record<string, string[]>;
}

export const EMPTY_SENSORY_NOTES: SensoryNeedsNotes = { name: "", helps: {}, overwhelms: {} };

function listRecord(value: unknown): Record<string, string[]> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const out: Record<string, string[]> = {};
  for (const [key, list] of Object.entries(value as Record<string, unknown>)) {
    if (Array.isArray(list)) out[key] = list.filter((v): v is string => typeof v === "string");
  }
  return out;
}

/** Load a saved profile from any earlier version safely, keeping everything
 * valid (including entries for senses no longer listed) and defaulting the rest. */
export function normaliseSensoryNotes(raw: unknown): SensoryNeedsNotes {
  if (!raw || typeof raw !== "object") return { ...EMPTY_SENSORY_NOTES };
  const r = raw as Record<string, unknown>;
  return {
    name: typeof r.name === "string" ? r.name : "",
    helps: listRecord(r.helps),
    overwhelms: listRecord(r.overwhelms),
  };
}

export function sensoryNotesHaveContent(notes: SensoryNeedsNotes): boolean {
  return [...Object.values(notes.helps), ...Object.values(notes.overwhelms)].some(
    (list) => list.length > 0
  );
}
