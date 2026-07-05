# Macro Tracker

A lightweight, no-build-step web app for tracking daily macros against a target. Open `index.html` in a browser, or serve the folder with any static server:

```
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

Data (targets and daily logs) is stored in the browser's `localStorage`, keyed by date, so each day keeps its own log and you can revisit past days with the date picker.

## Daily targets (bulk, 130g protein)

| Macro    | Amount | Calories | % of total |
|----------|-------:|---------:|-----------:|
| Protein  |  130 g |      520 |        19% |
| Carbs    |  380 g |     1520 |        54% |
| Fat      |   85 g |      765 |        27% |
| **Total**|        | **~2800**|            |

Rationale: 130 g protein is a solid muscle-preservation/growth target for most adults. For a bulk, calories need to sit above maintenance — 2800 kcal is a reasonable starting point for a moderately active adult; adjust up/down based on how your weight trends over 2-3 weeks. Carbs are set high (54% of calories) to fuel training and recovery, with fat filling the remainder at a healthy ~27%. All four targets are editable directly in the app.

## Sample day hitting the targets (~2770 kcal / 135 g P / 382 g C / 80 g F)

**Breakfast** — ~710 kcal, 30 g P / 94 g C / 25 g F
- 100 g dry oats
- 2 whole eggs
- 1 banana
- 1 tbsp peanut butter

**Lunch** — ~760 kcal, 44 g P / 121 g C / 9 g F
- 100 g cooked chicken breast
- 2.5 cups cooked white rice
- Mixed vegetables + 1 tsp olive oil

**Snack** — ~370 kcal, 21 g P / 53 g C / 10 g F
- 150 g plain nonfat Greek yogurt
- 50 g granola
- 100 g mixed berries

**Dinner** — ~585 kcal, 28 g P / 66 g C / 22 g F
- 100 g cooked salmon
- 300 g baked sweet potato
- Side salad + 1/2 avocado

**Evening snack** — ~345 kcal, 12 g P / 48 g C / 14 g F
- 2 slices whole wheat toast
- 1.5 tbsp peanut butter
- 1 tbsp honey

All of these foods are pre-loaded in the app's quick-add list (`foods.js`) so you can log this exact plan in a few clicks, or swap in your own foods via the custom-food form.
