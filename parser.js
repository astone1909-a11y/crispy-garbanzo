// Parses free-text food entries like "2 eggs", "150g chicken breast", or
// "a slice of pizza" into a macro entry — matching FOOD_DB when possible,
// falling back to a rough keyword-based estimate otherwise.

const WEIGHT_UNITS = {
  g: 1, gram: 1, grams: 1,
  kg: 1000, kilogram: 1000, kilograms: 1000,
  oz: 28.3495, ounce: 28.3495, ounces: 28.3495,
};

const COUNT_UNITS = new Set([
  "cup", "cups", "scoop", "scoops", "tbsp", "tablespoon", "tablespoons",
  "tsp", "teaspoon", "teaspoons", "slice", "slices", "piece", "pieces",
  "serving", "servings",
]);

const STOPWORDS = new Set(["a", "an", "the", "of", "some"]);

// Rough per-serving estimates for common items not in FOOD_DB, checked in
// order (first keyword match wins). Values are approximate averages.
const ESTIMATE_TABLE = [
  { keywords: ["pizza"], cal: 285, protein: 12, carbs: 36, fat: 10 },
  { keywords: ["cheeseburger", "burger"], cal: 550, protein: 25, carbs: 40, fat: 30 },
  { keywords: ["burrito"], cal: 600, protein: 25, carbs: 70, fat: 22 },
  { keywords: ["taco"], cal: 220, protein: 10, carbs: 20, fat: 11 },
  { keywords: ["sushi"], cal: 300, protein: 10, carbs: 50, fat: 6 },
  { keywords: ["fries"], cal: 365, protein: 4, carbs: 48, fat: 17 },
  { keywords: ["ice cream"], cal: 270, protein: 5, carbs: 32, fat: 14 },
  { keywords: ["donut", "doughnut"], cal: 260, protein: 3, carbs: 31, fat: 14 },
  { keywords: ["muffin"], cal: 340, protein: 6, carbs: 48, fat: 14 },
  { keywords: ["bagel"], cal: 289, protein: 11, carbs: 56, fat: 1.6 },
  { keywords: ["cookie"], cal: 160, protein: 2, carbs: 22, fat: 8 },
  { keywords: ["cake"], cal: 350, protein: 4, carbs: 50, fat: 15 },
  { keywords: ["chips"], cal: 150, protein: 2, carbs: 15, fat: 10 },
  { keywords: ["popcorn"], cal: 90, protein: 3, carbs: 19, fat: 1 },
  { keywords: ["hummus"], cal: 70, protein: 2, carbs: 6, fat: 5 },
  { keywords: ["smoothie"], cal: 250, protein: 8, carbs: 45, fat: 4 },
  { keywords: ["protein bar"], cal: 200, protein: 15, carbs: 22, fat: 7 },
  { keywords: ["soda", "cola", "pop"], cal: 150, protein: 0, carbs: 39, fat: 0 },
  { keywords: ["beer"], cal: 150, protein: 1.6, carbs: 13, fat: 0 },
  { keywords: ["wine"], cal: 125, protein: 0.1, carbs: 4, fat: 0 },
  { keywords: ["coffee", "latte"], cal: 40, protein: 2, carbs: 4, fat: 1.5 },
  { keywords: ["sandwich"], cal: 350, protein: 18, carbs: 35, fat: 14 },
  { keywords: ["salad"], cal: 250, protein: 8, carbs: 15, fat: 16 },
  { keywords: ["pasta", "spaghetti"], cal: 450, protein: 15, carbs: 65, fat: 12 },
];

const DEFAULT_ESTIMATE = { cal: 400, protein: 20, carbs: 40, fat: 15 };

function normalizeWord(w) {
  return w.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function tokenize(str) {
  return str
    .split(/\s+/)
    .map(normalizeWord)
    .filter((w) => w && !STOPWORDS.has(w));
}

// Splits "150g chicken breast" into { qty: 150, unit: "g", name: "chicken breast" }
// or "2 eggs" into { qty: 2, unit: null, name: "eggs" }, or "pizza" into
// { qty: 1, unit: null, name: "pizza" } when no leading number is found.
function splitQuantity(text) {
  const match = text.trim().match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)?\s+(.+)$/);
  if (!match) {
    return { qty: 1, unit: null, name: text.trim() };
  }
  const [, qtyStr, unitRaw, name] = match;
  const unit = unitRaw ? unitRaw.toLowerCase() : null;
  return { qty: Number(qtyStr), unit, name: name.trim() };
}

function getServingGrams(food) {
  const match = food.serving.match(/(\d+(?:\.\d+)?)\s*g\b/i);
  if (match) return Number(match[1]);
  return food.gramsEquivalent || null;
}

// Finds the best FOOD_DB match for a typed name. Returns null if nothing
// scores well enough to be trustworthy.
function findBestFoodMatch(name) {
  const typedWords = tokenize(name);
  if (typedWords.length === 0) return null;

  let best = null;
  let bestScore = 0;
  for (const food of FOOD_DB) {
    const foodWords = tokenize(food.name);
    let hits = 0;
    for (const tw of typedWords) {
      if (foodWords.some((fw) => fw === tw || fw.startsWith(tw) || tw.startsWith(fw))) {
        hits++;
      }
    }
    const score = hits / typedWords.length;
    if (score > bestScore) {
      bestScore = score;
      best = food;
    }
  }
  return bestScore >= 0.5 ? best : null;
}

function estimateFromKeywords(name) {
  const lower = name.toLowerCase();
  for (const entry of ESTIMATE_TABLE) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return entry;
    }
  }
  return DEFAULT_ESTIMATE;
}

// Main entry point: takes raw typed text, returns a macro entry ready for
// addEntry(), or null if the text is empty.
function parseFoodInput(rawText) {
  const text = rawText.trim();
  if (!text) return null;

  const { qty, unit, name } = splitQuantity(text);
  const match = findBestFoodMatch(name);

  if (match) {
    let multiplier = qty;
    if (unit && WEIGHT_UNITS[unit]) {
      const servingGrams = getServingGrams(match);
      // If we can't tell how many grams one serving is, a raw gram count
      // can't safely become a multiplier (e.g. "50g banana" is not 50
      // bananas) — fall back to a single serving rather than guessing wrong.
      multiplier = servingGrams ? (qty * WEIGHT_UNITS[unit]) / servingGrams : 1;
    }
    // unit-less or count-ish units (cup, slice, scoop, ...) scale the food's
    // own serving directly, same as the quick-add cards.
    return {
      name: multiplier === 1 ? match.name : `${match.name} x${round1(multiplier)}`,
      cal: match.cal * multiplier,
      protein: match.protein * multiplier,
      carbs: match.carbs * multiplier,
      fat: match.fat * multiplier,
      estimated: false,
    };
  }

  const estimate = estimateFromKeywords(name);
  const multiplier = qty || 1;
  return {
    name: `${text} (estimated)`,
    cal: estimate.cal * multiplier,
    protein: estimate.protein * multiplier,
    carbs: estimate.carbs * multiplier,
    fat: estimate.fat * multiplier,
    estimated: true,
  };
}

function round1(n) {
  return Math.round(n * 10) / 10;
}
