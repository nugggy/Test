import { KEYWORD_EMOJI_MAP, SIMPLE_WORD_MAP } from "@/lib/easy-read-data";

export interface EasyReadPoint {
  text: string;
  emoji: string | null;
}

const MAX_WORDS_PER_POINT = 12;
const SPLIT_CONNECTORS = [" because ", " which ", " although ", " however ", " and ", " but ", " so "];

function splitIntoSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function splitLongSentence(sentence: string): string[] {
  const wordCount = sentence.split(/\s+/).filter(Boolean).length;
  if (wordCount <= MAX_WORDS_PER_POINT) return [sentence];

  for (const connector of SPLIT_CONNECTORS) {
    const index = sentence.toLowerCase().indexOf(connector);
    if (index > 0) {
      const first = sentence.slice(0, index).trim();
      const second = sentence.slice(index + connector.length).trim();
      if (first && second) {
        return [...splitLongSentence(first), ...splitLongSentence(second)];
      }
    }
  }

  // No good connector found - fall back to splitting on commas.
  const commaParts = sentence.split(",").map((p) => p.trim()).filter(Boolean);
  if (commaParts.length > 1) {
    return commaParts.flatMap((part) => splitLongSentence(part));
  }

  return [sentence];
}

function simplifyWords(text: string): string {
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

function findEmoji(text: string): string | null {
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
  return /[.!?]$/.test(text) ? text : `${text}.`;
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
