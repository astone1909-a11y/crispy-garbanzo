// Food picker database. Values are per the stated serving.
// cal/protein/carbs/fat are in grams (cal in kcal).
// category is used to group foods into picker tabs: "protein", "carbs", "fat", "other".
// gramsEquivalent (optional) is the approximate weight of one serving, used
// by the free-text parser to convert gram-based input (e.g. "50g banana")
// for foods whose serving isn't already stated in grams.
const FOOD_DB = [
  // Protein
  { name: "Chicken breast, cooked", serving: "100g", cal: 165, protein: 31, carbs: 0, fat: 3.6, category: "protein" },
  { name: "Turkey breast, cooked", serving: "100g", cal: 150, protein: 30, carbs: 0, fat: 2, category: "protein" },
  { name: "Tuna, canned in water", serving: "100g", cal: 116, protein: 26, carbs: 0, fat: 1, category: "protein" },
  { name: "Shrimp, cooked", serving: "100g", cal: 99, protein: 24, carbs: 0, fat: 0.3, category: "protein" },
  { name: "Salmon, cooked", serving: "100g", cal: 206, protein: 22, carbs: 0, fat: 12, category: "protein" },
  { name: "Lean ground beef 90/10, cooked", serving: "100g", cal: 183, protein: 21, carbs: 0, fat: 10.5, category: "protein" },
  { name: "Whey protein", serving: "1 scoop", cal: 120, protein: 24, carbs: 3, fat: 1.5, category: "protein", gramsEquivalent: 30 },
  { name: "Greek yogurt, plain nonfat", serving: "150g", cal: 89, protein: 15, carbs: 5.4, fat: 0.6, category: "protein" },
  { name: "Cottage cheese, low fat", serving: "150g", cal: 122, protein: 17, carbs: 4.5, fat: 3.75, category: "protein" },
  { name: "Tofu, firm", serving: "100g", cal: 145, protein: 15, carbs: 2, fat: 8, category: "protein" },
  { name: "Whole egg", serving: "1 large", cal: 70, protein: 6, carbs: 0.5, fat: 5, category: "protein", gramsEquivalent: 50 },
  { name: "Egg white", serving: "1 large", cal: 17, protein: 3.5, carbs: 0.2, fat: 0, category: "protein", gramsEquivalent: 33 },

  // Carbs
  { name: "Oats, dry", serving: "100g", cal: 370, protein: 13, carbs: 63, fat: 6.5, category: "carbs" },
  { name: "White rice, cooked", serving: "100g", cal: 130, protein: 2.7, carbs: 28, fat: 0.3, category: "carbs" },
  { name: "Quinoa, cooked", serving: "100g", cal: 120, protein: 4.4, carbs: 21, fat: 1.9, category: "carbs" },
  { name: "Pasta, cooked", serving: "100g", cal: 131, protein: 5, carbs: 25, fat: 1, category: "carbs" },
  { name: "Sweet potato, baked", serving: "100g", cal: 86, protein: 1.6, carbs: 20, fat: 0.1, category: "carbs" },
  { name: "Banana", serving: "1 medium", cal: 105, protein: 1.3, carbs: 27, fat: 0.4, category: "carbs", gramsEquivalent: 118 },
  { name: "Apple", serving: "1 medium", cal: 95, protein: 0.5, carbs: 25, fat: 0.3, category: "carbs", gramsEquivalent: 182 },
  { name: "Mixed berries", serving: "100g", cal: 57, protein: 1, carbs: 14, fat: 0.3, category: "carbs" },
  { name: "Whole wheat bread", serving: "1 slice", cal: 70, protein: 3, carbs: 13, fat: 1, category: "carbs", gramsEquivalent: 28 },
  { name: "Honey", serving: "1 tbsp", cal: 64, protein: 0, carbs: 17, fat: 0, category: "carbs", gramsEquivalent: 21 },
  { name: "Granola", serving: "50g", cal: 225, protein: 5, carbs: 34, fat: 8.75, category: "carbs" },

  // Fat
  { name: "Olive oil", serving: "1 tsp", cal: 40, protein: 0, carbs: 0, fat: 4.5, category: "fat", gramsEquivalent: 4.5 },
  { name: "Avocado", serving: "1/2 fruit", cal: 120, protein: 1.5, carbs: 6, fat: 11, category: "fat", gramsEquivalent: 100 },
  { name: "Peanut butter", serving: "1 tbsp", cal: 95, protein: 4, carbs: 3, fat: 8, category: "fat", gramsEquivalent: 16 },
  { name: "Almonds", serving: "20g", cal: 116, protein: 4, carbs: 4, fat: 10, category: "fat" },

  // Other (vegetables, dairy, mixed)
  { name: "Mixed vegetables", serving: "100g", cal: 50, protein: 2, carbs: 10, fat: 0.3, category: "other" },
  { name: "Broccoli, cooked", serving: "100g", cal: 35, protein: 2.4, carbs: 7, fat: 0.4, category: "other" },
  { name: "Milk, 2%", serving: "1 cup", cal: 122, protein: 8, carbs: 12, fat: 4.8, category: "other", gramsEquivalent: 244 },
];
