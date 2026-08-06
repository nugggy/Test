// Combines matching ingredient lines from multiple recipes into single
// shopping-list entries with summed quantities - e.g. three meals that
// each call for "500g beef mince" become one line reading "1.5kg beef
// mince" instead of three separate "500g beef mince" lines.
//
// This is a best-effort parser for free-text recipe ingredient lines, not
// a full NLP system: anything it can't confidently parse (no leading
// quantity, e.g. "Salt and pepper, to taste") falls back to the previous
// behaviour of grouping by exact text and showing "× N" for repeats.

export interface ShoppingLine {
  key: string;
  text: string;
  /** Set on lines that couldn't be quantity-parsed and are instead grouped
   * by exact repeated text (the old behaviour). */
  repeatCount?: number;
}

type Dimension = "weight" | "volume" | "each";

interface UnitInfo {
  canonical: string;
  toBase: number;
  dimension: Dimension;
}

// Weight/volume units convert to a common base (grams or millilitres) so
// mixed units of the same ingredient (e.g. 500g + 1kg) combine correctly.
const UNIT_ALIASES: Record<string, UnitInfo> = {
  g: { canonical: "g", toBase: 1, dimension: "weight" },
  gram: { canonical: "g", toBase: 1, dimension: "weight" },
  grams: { canonical: "g", toBase: 1, dimension: "weight" },
  kg: { canonical: "kg", toBase: 1000, dimension: "weight" },
  kilogram: { canonical: "kg", toBase: 1000, dimension: "weight" },
  kilograms: { canonical: "kg", toBase: 1000, dimension: "weight" },
  ml: { canonical: "ml", toBase: 1, dimension: "volume" },
  millilitre: { canonical: "ml", toBase: 1, dimension: "volume" },
  millilitres: { canonical: "ml", toBase: 1, dimension: "volume" },
  milliliter: { canonical: "ml", toBase: 1, dimension: "volume" },
  milliliters: { canonical: "ml", toBase: 1, dimension: "volume" },
  l: { canonical: "l", toBase: 1000, dimension: "volume" },
  litre: { canonical: "l", toBase: 1000, dimension: "volume" },
  litres: { canonical: "l", toBase: 1000, dimension: "volume" },
  liter: { canonical: "l", toBase: 1000, dimension: "volume" },
  liters: { canonical: "l", toBase: 1000, dimension: "volume" },
  tsp: { canonical: "tsp", toBase: 5, dimension: "volume" },
  teaspoon: { canonical: "tsp", toBase: 5, dimension: "volume" },
  teaspoons: { canonical: "tsp", toBase: 5, dimension: "volume" },
  tbsp: { canonical: "tbsp", toBase: 15, dimension: "volume" },
  tablespoon: { canonical: "tbsp", toBase: 15, dimension: "volume" },
  tablespoons: { canonical: "tbsp", toBase: 15, dimension: "volume" },
  cup: { canonical: "cup", toBase: 250, dimension: "volume" },
  cups: { canonical: "cup", toBase: 250, dimension: "volume" },
};

// Countable "each"-style units - these don't convert to one another, but
// matching units of the same item still sum (e.g. "2 cloves garlic" + "1
// clove garlic" -> "3 cloves garlic").
const COUNT_UNITS = new Set([
  "can", "cans", "tin", "tins", "clove", "cloves", "slice", "slices",
  "piece", "pieces", "pinch", "pinches", "bunch", "bunches", "packet",
  "packets", "rasher", "rashers", "sprig", "sprigs", "stick", "sticks",
]);

const UNICODE_FRACTIONS: Record<string, number> = {
  "½": 1 / 2, "¼": 1 / 4, "¾": 3 / 4, "⅓": 1 / 3, "⅔": 2 / 3,
  "⅕": 1 / 5, "⅖": 2 / 5, "⅗": 3 / 5, "⅘": 4 / 5, "⅙": 1 / 6,
  "⅚": 5 / 6, "⅛": 1 / 8, "⅜": 3 / 8, "⅝": 5 / 8, "⅞": 7 / 8,
};

interface ParsedIngredient {
  quantity: number;
  unit: string | null; // canonical unit, or null for a bare count ("2 onions")
  dimension: Dimension;
  /** The descriptive part after the quantity/unit, singularised, used as
   * the grouping key (e.g. "beef mince", "onion", "garlic"). */
  singularName: string;
  /** Same, but not forced singular - used to rebuild a natural-sounding
   * line when the combined quantity doesn't need pluralising. */
  name: string;
}

function parseQuantity(token: string): number | null {
  if (token in UNICODE_FRACTIONS) return UNICODE_FRACTIONS[token];
  if (/^a$|^an$/i.test(token)) return 1;
  const mixed = token.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixed) {
    return Number(mixed[1]) + Number(mixed[2]) / Number(mixed[3]);
  }
  const fraction = token.match(/^(\d+)\/(\d+)$/);
  if (fraction) return Number(fraction[1]) / Number(fraction[2]);
  if (/^\d*\.?\d+$/.test(token)) return Number(token);
  return null;
}

function singularize(phrase: string): string {
  const words = phrase.split(" ");
  const last = words[words.length - 1];
  if (last.length <= 3) return phrase;
  let singularLast = last;
  if (/[^aeiou]ies$/i.test(last)) {
    singularLast = last.slice(0, -3) + "y";
  } else if (/(ches|shes|xes|ses)$/i.test(last)) {
    singularLast = last.slice(0, -2);
  } else if (/[^s]s$/i.test(last)) {
    singularLast = last.slice(0, -1);
  }
  words[words.length - 1] = singularLast;
  return words.join(" ");
}

function pluralize(phrase: string): string {
  const words = phrase.split(" ");
  const last = words[words.length - 1];
  let pluralLast = last;
  if (/[^aeiou]y$/i.test(last)) {
    pluralLast = last.slice(0, -1) + "ies";
  } else if (/(ch|sh|x|s)$/i.test(last)) {
    pluralLast = last + "es";
  } else {
    pluralLast = last + "s";
  }
  words[words.length - 1] = pluralLast;
  return words.join(" ");
}

function parseIngredientLine(raw: string): ParsedIngredient | null {
  const text = raw.trim();
  const quantityMatch = text.match(
    /^(\d+\s+\d+\/\d+|\d+\/\d+|\d*\.\d+|\d+|[½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]|a|an)\s+/i
  );
  if (!quantityMatch) return null;
  const quantity = parseQuantity(quantityMatch[1]);
  if (quantity === null || quantity <= 0) return null;

  let rest = text.slice(quantityMatch[0].length);
  const unitMatch = rest.match(/^([a-zA-Z]+)\b\.?\s*/);
  let unit: string | null = null;
  let dimension: Dimension = "each";

  if (unitMatch) {
    const word = unitMatch[1].toLowerCase();
    const unitInfo = UNIT_ALIASES[word];
    if (unitInfo) {
      unit = unitInfo.canonical;
      dimension = unitInfo.dimension;
      rest = rest.slice(unitMatch[0].length);
    } else if (COUNT_UNITS.has(word)) {
      unit = singularize(word) === word && word.endsWith("s") ? word.slice(0, -1) : word.replace(/s$/, "");
      dimension = "each";
      rest = rest.slice(unitMatch[0].length);
      rest = rest.replace(/^of\s+/i, "");
    }
  }

  const name = rest.trim();
  if (!name) return null;

  return {
    quantity,
    unit,
    dimension,
    name,
    singularName: singularize(name.toLowerCase()),
  };
}

/**
 * Formats a combined weight/volume total for display. Weight (and any
 * volume total that involved a metric ml/L measurement somewhere) uses
 * metric auto-scaling (g <-> kg, ml <-> L). A volume total built purely
 * from spoon/cup measures stays in that unit - converting "3 cups flour"
 * down to "750ml flour" is technically correct but not how anyone shops.
 */
function formatWeightOrVolume(
  totalBase: number,
  dimension: "weight" | "volume",
  fallbackUnit: string | null
): string {
  if (dimension === "weight") {
    if (totalBase >= 1000) {
      const kg = totalBase / 1000;
      return `${Number(kg.toFixed(2))}kg`;
    }
    return `${Number(totalBase.toFixed(1))}g`;
  }
  if (fallbackUnit) {
    const unitInfo = UNIT_ALIASES[fallbackUnit];
    const amount = Number((totalBase / unitInfo.toBase).toFixed(2));
    const label = fallbackUnit === "cup" ? (amount === 1 ? "cup" : "cups") : fallbackUnit;
    return `${amount} ${label}`;
  }
  if (totalBase >= 1000) {
    const l = totalBase / 1000;
    return `${Number(l.toFixed(2))}L`;
  }
  return `${Number(totalBase.toFixed(1))}ml`;
}

function formatQuantity(q: number): string {
  return Number(q.toFixed(2)).toString();
}

/**
 * Combine ingredient lines gathered from one or more recipes into a
 * deduplicated, quantity-summed shopping list.
 */
export function aggregateIngredients(ingredientLines: string[]): ShoppingLine[] {
  interface WeightVolumeGroup {
    kind: "weight-volume";
    dimension: "weight" | "volume";
    name: string;
    totalBase: number;
    /** Non-metric unit (cup/tsp/tbsp) to fall back to for display, unless
     * a metric unit (g/kg/ml/L) ever contributes - see formatWeightOrVolume. */
    fallbackUnit: string | null;
    sawMetric: boolean;
  }
  interface EachGroup {
    kind: "each";
    unit: string | null;
    name: string;
    total: number;
  }
  interface RawGroup {
    kind: "raw";
    text: string;
    count: number;
  }

  const groups = new Map<string, WeightVolumeGroup | EachGroup | RawGroup>();

  for (const line of ingredientLines) {
    const text = line.trim();
    if (!text) continue;

    const parsed = parseIngredientLine(text);
    if (!parsed) {
      const key = `raw:${text.toLowerCase()}`;
      const existing = groups.get(key);
      if (existing && existing.kind === "raw") {
        existing.count += 1;
      } else {
        groups.set(key, { kind: "raw", text, count: 1 });
      }
      continue;
    }

    if (parsed.dimension === "weight" || parsed.dimension === "volume") {
      const unit = parsed.unit as string;
      const unitInfo = UNIT_ALIASES[unit];
      const isMetric = unit === "g" || unit === "kg" || unit === "ml" || unit === "l";
      const key = `${parsed.dimension}:${parsed.singularName}`;
      const existing = groups.get(key);
      const baseAmount = parsed.quantity * unitInfo.toBase;
      if (existing && existing.kind === "weight-volume") {
        existing.totalBase += baseAmount;
        if (isMetric) existing.sawMetric = true;
        else if (!existing.fallbackUnit) existing.fallbackUnit = unit;
      } else {
        groups.set(key, {
          kind: "weight-volume",
          dimension: parsed.dimension,
          name: parsed.name,
          totalBase: baseAmount,
          fallbackUnit: isMetric ? null : unit,
          sawMetric: isMetric,
        });
      }
    } else {
      const key = `each:${parsed.unit ?? ""}:${parsed.singularName}`;
      const existing = groups.get(key);
      if (existing && existing.kind === "each") {
        existing.total += parsed.quantity;
      } else {
        groups.set(key, {
          kind: "each",
          unit: parsed.unit,
          name: parsed.singularName,
          total: parsed.quantity,
        });
      }
    }
  }

  const lines: ShoppingLine[] = [];
  for (const [key, group] of groups) {
    if (group.kind === "raw") {
      lines.push({
        key,
        text: group.text,
        repeatCount: group.count > 1 ? group.count : undefined,
      });
    } else if (group.kind === "weight-volume") {
      const amount = formatWeightOrVolume(
        group.totalBase,
        group.dimension,
        group.sawMetric ? null : group.fallbackUnit
      );
      lines.push({ key, text: `${amount} ${group.name}` });
    } else {
      const isWhole = Math.abs(group.total - Math.round(group.total)) < 1e-9;
      const qtyText = isWhole ? String(Math.round(group.total)) : formatQuantity(group.total);
      const displayName = group.total === 1 ? group.name : pluralize(group.name);
      const unitText = group.unit
        ? group.total === 1
          ? ` ${group.unit}`
          : ` ${pluralize(group.unit)}`
        : "";
      lines.push({ key, text: `${qtyText}${unitText} ${displayName}`.replace(/\s+/g, " ").trim() });
    }
  }

  return lines.sort((a, b) => a.text.localeCompare(b.text));
}
