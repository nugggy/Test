// Picks a picture (emoji) for a shopping list line, so people who find
// reading hard can match items to what's on the shelf. Best-effort keyword
// matching only: anything it doesn't recognise gets a plain shopping bag.
// Unit tested in src/lib/__tests__/meal-planner-pictures.test.ts.

// Order matters: more specific words come before general ones
// (e.g. "coconut milk" before "milk", "tomato paste" before "tomato").
const PICTURES: [string[], string][] = [
  [["coconut milk"], "🥥"],
  [["peanut butter"], "🥜"],
  [["soy sauce", "sauce", "ketchup", "mayonnaise", "mayo"], "🫙"],
  [["tomato paste", "tinned tomato", "tin tomato", "tin of tomato", "can tomato"], "🥫"],
  [["baked beans", "tin", "can"], "🥫"],
  [["stock"], "🥫"],
  [["spring onion"], "🧅"],
  [["sweet potato"], "🍠"],
  [["ice cream"], "🍨"],
  [["toilet paper", "toilet roll", "tissues"], "🧻"],
  [["toothpaste", "toothbrush"], "🪥"],
  [["soap", "shampoo", "detergent", "dishwashing", "cleaner"], "🧼"],
  [["mince", "beef", "steak", "lamb"], "🥩"],
  [["chicken"], "🍗"],
  [["bacon", "ham", "pork"], "🥓"],
  [["sausage", "frankfurt", "hot dog"], "🌭"],
  [["fish", "salmon", "tuna", "prawn"], "🐟"],
  [["egg"], "🥚"],
  [["milk"], "🥛"],
  [["cheese"], "🧀"],
  [["butter", "margarine"], "🧈"],
  [["yoghurt", "yogurt"], "🥣"],
  [["bread", "roll", "wrap", "taco shell"], "🍞"],
  [["spaghetti", "pasta", "noodle", "macaroni"], "🍝"],
  [["rice"], "🍚"],
  [["flour", "baking powder", "sugar", "breadcrumb"], "🧂"],
  [["salt", "pepper", "seasoning", "spice", "curry powder", "paprika", "cumin"], "🧂"],
  [["oil"], "🫒"],
  [["honey"], "🍯"],
  [["cereal", "oats", "weet-bix", "weetbix"], "🥣"],
  [["coffee"], "☕"],
  [["tea"], "🍵"],
  [["juice"], "🧃"],
  [["water"], "💧"],
  [["chocolate"], "🍫"],
  [["biscuit", "cookie"], "🍪"],
  [["chips", "crisps"], "🥔"],
  [["potato"], "🥔"],
  [["onion"], "🧅"],
  [["garlic"], "🧄"],
  [["tomato"], "🍅"],
  [["carrot"], "🥕"],
  [["broccoli", "cauliflower"], "🥦"],
  [["lettuce", "spinach", "salad", "cabbage", "celery", "kale"], "🥬"],
  [["capsicum", "chilli", "pepper"], "🫑"],
  [["cucumber", "zucchini"], "🥒"],
  [["corn"], "🌽"],
  [["mushroom"], "🍄"],
  [["pea", "bean"], "🫛"],
  [["avocado"], "🥑"],
  [["apple"], "🍎"],
  [["banana"], "🍌"],
  [["orange", "mandarin"], "🍊"],
  [["lemon", "lime"], "🍋"],
  [["strawberry", "strawberries", "berry", "berries"], "🍓"],
  [["grape"], "🍇"],
  [["pear"], "🍐"],
  [["watermelon", "melon"], "🍉"],
  [["pineapple"], "🍍"],
  [["mango"], "🥭"],
];

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Whole words only, allowing a plural ending - so "pea" matches "peas"
// but not "pear" or "peanut", and "tea" doesn't match "steak".
const MATCHERS: [RegExp, string][] = PICTURES.map(([words, emoji]) => [
  new RegExp(`\\b(?:${words.map(escapeRegExp).join("|")})(?:s|es)?\\b`, "i"),
  emoji,
]);

export function pictureFor(text: string): string {
  for (const [pattern, emoji] of MATCHERS) {
    if (pattern.test(text)) return emoji;
  }
  return "🛍️";
}
