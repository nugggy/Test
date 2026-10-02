import { KEYWORD_EMOJI_MAP, SIMPLE_WORD_MAP } from "@/lib/easy-read-data";

export interface EasyReadPoint {
  text: string;
  emoji: string | null;
}

const MAX_WORDS_PER_POINT = 12;
/** Lines longer than this are flagged to the person editing the result. */
export const LONG_LINE_WORDS = 15;

// Connectors we can split a long sentence on, with the smallest number of
// words each half must have for the split to be worth it. "and", "but" and
// "so" only split when a new clause clearly starts after them (e.g. "and you
// will..."), otherwise "fish and chips" style phrases get chopped into
// meaningless fragments.
const CLAUSE_STARTERS = new Set([
  "i", "you", "we", "they", "he", "she", "it", "there", "then", "this",
  "that", "these", "your", "our", "my", "their", "please",
]);

const SPLIT_CONNECTORS: { text: string; minWords: number; needsClause?: boolean }[] = [
  { text: " because ", minWords: 3 },
  { text: " although ", minWords: 3 },
  { text: " however ", minWords: 3 },
  { text: " which ", minWords: 4 },
  { text: " but ", minWords: 3, needsClause: true },
  { text: " and ", minWords: 3, needsClause: true },
  { text: " so ", minWords: 3, needsClause: true },
];

// Common abbreviations whose full stop should NOT end a sentence.
const ABBREVIATIONS = ["e.g.", "i.e.", "etc.", "Dr.", "Mr.", "Mrs.", "Ms.", "St.", "No.", "approx."];
const PLACEHOLDER = "\u0000";

export function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function protectAbbreviations(text: string): string {
  let out = text;
  for (const abbr of ABBREVIATIONS) {
    const escaped = abbr.replace(/\./g, "\\.");
    out = out.replace(new RegExp(`(^|\\s)${escaped}`, "gi"), (match) =>
      match.replace(/\./g, PLACEHOLDER)
    );
  }
  return out;
}

function restoreAbbreviations(text: string): string {
  return text.split(PLACEHOLDER).join(".");
}

/** Strip list markers like "-", "*", "•" or "1." / "2)" from the start of a line. */
function stripListMarker(line: string): string {
  return line.replace(/^\s*(?:[-*•‣◦]+|\d{1,3}[.)])\s+/, "");
}

export function splitIntoSentences(text: string): string[] {
  return text
    .split(/\r?\n+/) // every line (and every bullet point) is its own idea
    .map(stripListMarker)
    .flatMap((line) => protectAbbreviations(line).split(/(?<=[.!?])\s+/))
    .map((s) => restoreAbbreviations(s).trim())
    .filter(Boolean);
}

function splitLongSentence(sentence: string): string[] {
  if (countWords(sentence) <= MAX_WORDS_PER_POINT) return [sentence];

  const lower = sentence.toLowerCase();
  for (const connector of SPLIT_CONNECTORS) {
    const index = lower.indexOf(connector.text);
    if (index > 0) {
      const first = sentence.slice(0, index).trim().replace(/,$/, "");
      const second = sentence.slice(index + connector.text.length).trim();
      const nextWord = second.split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, "") ?? "";
      const clauseOk = !connector.needsClause || CLAUSE_STARTERS.has(nextWord);
      if (
        clauseOk &&
        countWords(first) >= connector.minWords &&
        countWords(second) >= connector.minWords
      ) {
        return [...splitLongSentence(first), ...splitLongSentence(second)];
      }
    }
  }

  // No good connector found - fall back to splitting on commas, as long as
  // each part is still a meaningful chunk.
  const commaParts = sentence.split(",").map((p) => p.trim()).filter(Boolean);
  if (commaParts.length > 1 && commaParts.every((p) => countWords(p) >= 3)) {
    return commaParts.flatMap((part) => splitLongSentence(part));
  }

  return [sentence];
}

export function simplifyWords(text: string): string {
  return text.replace(/[A-Za-z]+/g, (word) => {
    const lower = word.toLowerCase();
    const replacement = SIMPLE_WORD_MAP[lower];
    if (!replacement) return word;
    const isCapitalised = word[0] === word[0].toUpperCase();
    return isCapitalised
      ? replacement[0].toUpperCase() + replacement.slice(1)
      : replacement;
  });
}

export function findEmoji(text: string): string | null {
  const lower = text.toLowerCase();
  for (const { keyword, emoji } of KEYWORD_EMOJI_MAP) {
    if (new RegExp(`\\b${keyword}\\b`).test(lower)) {
      return emoji;
    }
  }
  return null;
}

function capitaliseFirst(text: string): string {
  if (!text) return text;
  return text[0].toUpperCase() + text.slice(1);
}

function ensureFullStop(text: string): string {
  return /[.!?:]$/.test(text) ? text : `${text}.`;
}

export function convertToEasyRead(input: string): EasyReadPoint[] {
  const points: EasyReadPoint[] = [];
  for (const sentence of splitIntoSentences(input)) {
    for (const chunk of splitLongSentence(sentence)) {
      const simplified = simplifyWords(chunk).trim();
      if (!simplified) continue;
      points.push({
        text: ensureFullStop(capitaliseFirst(simplified)),
        emoji: findEmoji(simplified),
      });
    }
  }
  return points;
}
