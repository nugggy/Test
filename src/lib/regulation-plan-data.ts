// Pure (non-React) parts of the Emotional Regulation Plan: the stored data
// shape, loading older saved plans safely, and splitting phone numbers out
// of free text so they can be tapped to call.

export interface RegulationPlan {
  /** Whose plan this is, shown at the top when printed. Added in a later
   * version, so older saved plans load with "". */
  name: string;
  warningSigns: string[];
  strategies: string[];
  groundingTechniques: string[];
  /** What other people (family, support staff) can do to help. Added in a
   * later version, so older saved plans load with []. */
  othersCanHelp: string[];
  avoid: string[];
  supportPeople: string[];
  urgentHelpNotes: string;
  /** ISO timestamp of the last change, shown on the printed plan so support
   * staff can tell how current it is. */
  updatedAt?: string;
}

export const EMPTY_PLAN: RegulationPlan = {
  name: "",
  warningSigns: [],
  strategies: [],
  groundingTechniques: [],
  othersCanHelp: [],
  avoid: [],
  supportPeople: [],
  urgentHelpNotes: "",
};

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string");
}

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/** Turn whatever was saved (any earlier version, or partly corrupted) into a
 * complete plan. Unknown or wrong-typed fields fall back to empty values;
 * nothing that is valid is dropped. */
export function normalisePlan(raw: unknown): RegulationPlan {
  if (!raw || typeof raw !== "object") return { ...EMPTY_PLAN };
  const r = raw as Record<string, unknown>;
  const updatedAt = typeof r.updatedAt === "string" ? r.updatedAt : undefined;
  return {
    name: text(r.name),
    warningSigns: stringList(r.warningSigns),
    strategies: stringList(r.strategies),
    groundingTechniques: stringList(r.groundingTechniques),
    othersCanHelp: stringList(r.othersCanHelp),
    avoid: stringList(r.avoid),
    supportPeople: stringList(r.supportPeople),
    urgentHelpNotes: text(r.urgentHelpNotes),
    ...(updatedAt ? { updatedAt } : {}),
  };
}

/** True once anything at all has been written in the plan. */
export function planHasContent(plan: RegulationPlan): boolean {
  return (
    plan.warningSigns.length > 0 ||
    plan.strategies.length > 0 ||
    plan.groundingTechniques.length > 0 ||
    plan.othersCanHelp.length > 0 ||
    plan.avoid.length > 0 ||
    plan.supportPeople.length > 0 ||
    plan.urgentHelpNotes.trim() !== ""
  );
}

export interface TextSegment {
  text: string;
  /** Digits (and a leading +) to put in a tel: link, when this segment is a
   * phone number. */
  tel?: string;
}

// A run of digits, spaces and hyphens, optionally starting with + or a
// bracketed area code such as (02).
const PHONE_LIKE = /(?:\+?\d|\(\d{2}\))[\d\s-]{4,}\d/g;

/** Split free text such as "Mum - 0412 345 678" into plain text and phone
 * number parts. Only runs of 6 to 12 digits count as a phone number, so
 * things like "5 minutes" or "2026" are left alone. */
export function splitPhoneNumbers(input: string): TextSegment[] {
  const segments: TextSegment[] = [];
  let lastIndex = 0;
  for (const match of input.matchAll(PHONE_LIKE)) {
    const value = match[0];
    const start = match.index ?? 0;
    const digits = value.replace(/[^\d]/g, "");
    if (digits.length < 6 || digits.length > 12) continue;
    if (start > lastIndex) segments.push({ text: input.slice(lastIndex, start) });
    segments.push({ text: value, tel: (value.trim().startsWith("+") ? "+" : "") + digits });
    lastIndex = start + value.length;
  }
  if (lastIndex < input.length) segments.push({ text: input.slice(lastIndex) });
  return segments.length > 0 ? segments : [{ text: input }];
}
