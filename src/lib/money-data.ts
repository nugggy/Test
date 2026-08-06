export type MoneyKind = "coin" | "note";

export interface MoneyPieceDef {
  id: string;
  kind: MoneyKind;
  valueCents: number;
  /** Full accessible label, e.g. "50 cent coin", "$20 note". */
  label: string;
  /** Short label drawn on the piece itself, e.g. "50c", "$20". */
  shortLabel: string;
  /** Approximate colour of the real coin/note - silver, gold, or the
   * polymer note's dominant colour. Not an exact reproduction, just close
   * enough to support colour-based recognition. */
  color: string;
  /** Relative on-screen size. For coins, a diameter in SVG units, loosely
   * matched to real relative coin sizes (the $2 coin is genuinely smaller
   * than the $1 coin, despite being worth more - a common source of
   * confusion worth teaching). For notes, a relative width - real
   * Australian banknotes get 7mm longer for every step up in value, a
   * deliberate accessibility feature for low-vision users, reflected here. */
  size: number;
  /** Coins only: 0 = plain circle, 12 = the 50c piece's twelve-sided shape. */
  sides?: number;
}

export const COINS: MoneyPieceDef[] = [
  { id: "5c", kind: "coin", valueCents: 5, label: "5 cent coin", shortLabel: "5c", color: "#C7CCD3", size: 42, sides: 0 },
  { id: "10c", kind: "coin", valueCents: 10, label: "10 cent coin", shortLabel: "10c", color: "#C7CCD3", size: 50, sides: 0 },
  { id: "20c", kind: "coin", valueCents: 20, label: "20 cent coin", shortLabel: "20c", color: "#C7CCD3", size: 58, sides: 0 },
  { id: "50c", kind: "coin", valueCents: 50, label: "50 cent coin", shortLabel: "50c", color: "#C7CCD3", size: 66, sides: 12 },
  { id: "1d", kind: "coin", valueCents: 100, label: "1 dollar coin", shortLabel: "$1", color: "#D3AE4E", size: 56, sides: 0 },
  { id: "2d", kind: "coin", valueCents: 200, label: "2 dollar coin", shortLabel: "$2", color: "#D3AE4E", size: 46, sides: 0 },
];

export const NOTES: MoneyPieceDef[] = [
  { id: "5n", kind: "note", valueCents: 500, label: "$5 note", shortLabel: "$5", color: "#9C5FA8", size: 130 },
  { id: "10n", kind: "note", valueCents: 1000, label: "$10 note", shortLabel: "$10", color: "#1F63AE", size: 137 },
  { id: "20n", kind: "note", valueCents: 2000, label: "$20 note", shortLabel: "$20", color: "#D2481F", size: 144 },
  { id: "50n", kind: "note", valueCents: 5000, label: "$50 note", shortLabel: "$50", color: "#E3B324", size: 151 },
  { id: "100n", kind: "note", valueCents: 10000, label: "$100 note", shortLabel: "$100", color: "#1F7A48", size: 158 },
];

export const ALL_MONEY_PIECES: MoneyPieceDef[] = [...COINS, ...NOTES];

export function formatCents(cents: number): string {
  return (cents / 100).toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
  });
}
