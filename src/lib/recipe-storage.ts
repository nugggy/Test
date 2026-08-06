"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "dt:meal-planner:recipes:v1";

export interface Recipe {
  id: string;
  name: string;
  emoji: string;
  ingredients: string[];
  instructions: string;
}

// A starter cookbook of everyday meals, so the planner isn't a blank page
// the first time someone opens it - these seed in only the very first
// time (see readRecipes below); once saved, the person's own list (even
// an empty one, if they delete everything) is respected from then on.
const STARTER_RECIPES: Recipe[] = [
  {
    id: "starter-spaghetti-bolognese",
    name: "Spaghetti Bolognese",
    emoji: "🍝",
    ingredients: [
      "500g beef mince",
      "1 onion, diced",
      "2 cloves garlic",
      "1 tin tomatoes",
      "2 tbsp tomato paste",
      "400g spaghetti",
      "Salt and pepper, to taste",
    ],
    instructions:
      "1. Brown the mince in a large pan. 2. Add the onion and garlic, cook until soft. 3. Stir in the tomatoes and tomato paste, simmer 15 minutes. 4. Cook the spaghetti and serve the sauce on top.",
  },
  {
    id: "starter-chicken-stir-fry",
    name: "Chicken Stir-fry",
    emoji: "🍗",
    ingredients: [
      "500g chicken breast, sliced",
      "1 capsicum, sliced",
      "1 head broccoli",
      "3 tbsp soy sauce",
      "2 cloves garlic",
      "2 cups rice",
    ],
    instructions:
      "1. Cook the rice. 2. Stir-fry the chicken until cooked through. 3. Add the vegetables and garlic, cook until tender. 4. Stir through the soy sauce and serve over rice.",
  },
  {
    id: "starter-beef-tacos",
    name: "Beef Tacos",
    emoji: "🌮",
    ingredients: [
      "500g beef mince",
      "1 packet taco seasoning",
      "8 taco shells",
      "1 tomato, diced",
      "1 cup lettuce, shredded",
      "1 cup cheese, grated",
    ],
    instructions:
      "1. Brown the mince and stir through the taco seasoning. 2. Warm the taco shells. 3. Fill with mince and top with tomato, lettuce and cheese.",
  },
  {
    id: "starter-vegetable-fried-rice",
    name: "Vegetable Fried Rice",
    emoji: "🍚",
    ingredients: [
      "3 cups cooked rice",
      "2 eggs",
      "1 carrot, diced",
      "1 cup peas",
      "3 tbsp soy sauce",
      "2 spring onions, sliced",
    ],
    instructions:
      "1. Scramble the eggs in a large pan, then set aside. 2. Stir-fry the carrot and peas. 3. Add the rice and soy sauce, then mix through the egg and spring onion.",
  },
  {
    id: "starter-chicken-curry",
    name: "Chicken Curry",
    emoji: "🍛",
    ingredients: [
      "500g chicken thigh, diced",
      "1 onion, diced",
      "2 tbsp curry powder",
      "400ml coconut milk",
      "2 cups rice",
    ],
    instructions:
      "1. Cook the onion until soft. 2. Add the chicken and curry powder, cook until browned. 3. Pour in the coconut milk and simmer 20 minutes. 4. Serve with rice.",
  },
  {
    id: "starter-sausages-and-mash",
    name: "Sausages and Mash",
    emoji: "🌭",
    ingredients: [
      "6 sausages",
      "1kg potatoes",
      "1/2 cup milk",
      "50g butter",
      "1 cup peas",
    ],
    instructions:
      "1. Grill or pan-fry the sausages. 2. Boil the potatoes until soft, then mash with the milk and butter. 3. Steam the peas. 4. Serve together.",
  },
  {
    id: "starter-fish-and-chips",
    name: "Fish and Chips",
    emoji: "🐟",
    ingredients: [
      "4 fish fillets",
      "1kg potatoes",
      "1 cup flour",
      "1 lemon",
      "Salt and pepper, to taste",
    ],
    instructions:
      "1. Cut the potatoes into chips and bake until golden. 2. Coat the fish in flour and pan-fry until cooked through. 3. Serve with a lemon wedge.",
  },
  {
    id: "starter-vegetable-soup",
    name: "Vegetable Soup",
    emoji: "🍲",
    ingredients: [
      "2 carrots, diced",
      "2 sticks celery, diced",
      "1 onion, diced",
      "1L vegetable stock",
      "1 tin tomatoes",
      "1 cup pasta",
    ],
    instructions:
      "1. Cook the onion, carrot and celery until soft. 2. Add the stock and tomatoes, simmer 15 minutes. 3. Add the pasta and cook until tender.",
  },
  {
    id: "starter-grilled-cheese",
    name: "Grilled Cheese Sandwich",
    emoji: "🧀",
    ingredients: ["4 slices bread", "4 slices cheese", "50g butter"],
    instructions:
      "1. Butter one side of each slice of bread. 2. Put cheese between the unbuttered sides. 3. Grill or pan-fry until golden on both sides.",
  },
  {
    id: "starter-pancakes",
    name: "Pancakes",
    emoji: "🥞",
    ingredients: [
      "2 cups flour",
      "2 eggs",
      "2 cups milk",
      "2 tbsp sugar",
      "1 tsp baking powder",
    ],
    instructions:
      "1. Whisk all the ingredients together into a smooth batter. 2. Cook spoonfuls in a lightly greased pan until bubbles form, then flip. 3. Serve warm.",
  },
  {
    id: "starter-omelette",
    name: "Omelette",
    emoji: "🍳",
    ingredients: [
      "3 eggs",
      "1/2 cup cheese, grated",
      "1 tomato, diced",
      "Salt and pepper, to taste",
    ],
    instructions:
      "1. Whisk the eggs. 2. Pour into a hot, lightly greased pan. 3. Sprinkle over the cheese and tomato, fold in half once mostly set.",
  },
  {
    id: "starter-blt",
    name: "BLT Sandwich",
    emoji: "🥪",
    ingredients: [
      "6 rashers bacon",
      "4 slices bread",
      "1 tomato, sliced",
      "2 lettuce leaves",
      "2 tbsp mayonnaise",
    ],
    instructions:
      "1. Cook the bacon until crisp. 2. Toast the bread if you like. 3. Spread with mayonnaise and layer the bacon, lettuce and tomato.",
  },
  {
    id: "starter-beef-noodles",
    name: "Beef Stir-fry Noodles",
    emoji: "🍜",
    ingredients: [
      "500g beef strips",
      "400g noodles",
      "1 capsicum, sliced",
      "2 cloves garlic",
      "3 tbsp soy sauce",
    ],
    instructions:
      "1. Cook the noodles and set aside. 2. Stir-fry the beef until browned. 3. Add the capsicum and garlic, cook until tender. 4. Toss through the noodles and soy sauce.",
  },
  {
    id: "starter-roast-chicken",
    name: "Roast Chicken",
    emoji: "🍗",
    ingredients: [
      "1 whole chicken",
      "1kg potatoes",
      "2 carrots",
      "2 tbsp olive oil",
      "Salt and pepper, to taste",
    ],
    instructions:
      "1. Rub the chicken with oil, salt and pepper. 2. Roast with the potatoes and carrots at 200°C until the chicken is cooked through (about 1.5 hours for a 1.5kg bird).",
  },
  {
    id: "starter-vegetable-curry",
    name: "Vegetable Curry",
    emoji: "🥘",
    ingredients: [
      "1 onion, diced",
      "2 potatoes, diced",
      "1 cup cauliflower florets",
      "400ml coconut milk",
      "2 tbsp curry powder",
      "2 cups rice",
    ],
    instructions:
      "1. Cook the onion until soft. 2. Add the potato, cauliflower and curry powder. 3. Pour in the coconut milk and simmer until the vegetables are tender. 4. Serve with rice.",
  },
  {
    id: "starter-meatballs-pasta",
    name: "Meatballs and Pasta",
    emoji: "🍝",
    ingredients: [
      "500g beef mince",
      "1 egg",
      "1/2 cup breadcrumbs",
      "1 tin tomatoes",
      "400g pasta",
    ],
    instructions:
      "1. Mix the mince, egg and breadcrumbs, then roll into balls. 2. Brown in a pan, then simmer in the tomatoes for 15 minutes. 3. Serve over cooked pasta.",
  },
  {
    id: "starter-chicken-sandwich",
    name: "Chicken Sandwich",
    emoji: "🥪",
    ingredients: [
      "2 chicken breasts",
      "4 slices bread",
      "1 cup lettuce, shredded",
      "2 tbsp mayonnaise",
    ],
    instructions:
      "1. Cook the chicken and slice once cooled. 2. Spread the bread with mayonnaise. 3. Layer with chicken and lettuce.",
  },
  {
    id: "starter-baked-beans-toast",
    name: "Baked Beans on Toast",
    emoji: "🍞",
    ingredients: ["1 tin baked beans", "4 slices bread", "50g butter"],
    instructions:
      "1. Heat the baked beans in a saucepan. 2. Toast and butter the bread. 3. Spoon the beans over the toast.",
  },
  {
    id: "starter-vegetable-pasta-bake",
    name: "Vegetable Pasta Bake",
    emoji: "🍝",
    ingredients: [
      "400g pasta",
      "1 tin tomatoes",
      "1 zucchini, diced",
      "1 cup cheese, grated",
      "1 onion, diced",
    ],
    instructions:
      "1. Cook the pasta. 2. Cook the onion and zucchini until soft, then stir through the tomatoes. 3. Combine with the pasta, top with cheese, and bake at 180°C until golden.",
  },
  {
    id: "starter-fruit-salad",
    name: "Fruit Salad",
    emoji: "🍓",
    ingredients: [
      "2 apples, chopped",
      "2 bananas, sliced",
      "1 cup strawberries, halved",
      "1 orange, segmented",
      "1 tbsp honey",
    ],
    instructions: "1. Chop all the fruit. 2. Toss together in a bowl with the honey.",
  },
];

function readRecipes(): Recipe[] {
  if (typeof window === "undefined") return STARTER_RECIPES;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    // No key at all means this person has never saved a recipe list yet -
    // seed the starter cookbook. Once anything is saved (even an emptied
    // list, after they've deleted every starter recipe) this branch is
    // never hit again, so their own choices are always respected after that.
    if (raw === null) return STARTER_RECIPES;
    return JSON.parse(raw) as Recipe[];
  } catch {
    return STARTER_RECIPES;
  }
}

function writeJSON<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // If storage is full or unavailable, changes just won't persist across
    // reloads - the tool still works for the current session.
  }
}

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // localStorage only exists client-side, so recipes are synced in after
    // mount rather than during the (server) initial render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRecipes(readRecipes());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEY, recipes);
  }, [recipes, hydrated]);

  const createRecipe = useCallback((data: { name: string; emoji: string }) => {
    const id = `recipe-${Date.now()}`;
    setRecipes((prev) => [
      ...prev,
      { id, name: data.name, emoji: data.emoji, ingredients: [], instructions: "" },
    ]);
    return id;
  }, []);

  const updateRecipe = useCallback(
    (id: string, updates: Partial<Omit<Recipe, "id">>) => {
      setRecipes((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
      );
    },
    []
  );

  const deleteRecipe = useCallback((id: string) => {
    setRecipes((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return { recipes, createRecipe, updateRecipe, deleteRecipe, hydrated };
}
