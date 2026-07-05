const DEFAULT_TARGETS = { cal: 2800, protein: 130, carbs: 380, fat: 85 };
const TARGETS_KEY = "macro-tracker-targets";
const logKeyFor = (date) => `macro-tracker-log-${date}`;

const todayStr = () => new Date().toISOString().slice(0, 10);

function loadTargets() {
  const raw = localStorage.getItem(TARGETS_KEY);
  return raw ? JSON.parse(raw) : { ...DEFAULT_TARGETS };
}

function saveTargets(targets) {
  localStorage.setItem(TARGETS_KEY, JSON.stringify(targets));
}

function loadLog(date) {
  const raw = localStorage.getItem(logKeyFor(date));
  return raw ? JSON.parse(raw) : [];
}

function saveLog(date, entries) {
  localStorage.setItem(logKeyFor(date), JSON.stringify(entries));
}

let state = {
  date: todayStr(),
  targets: loadTargets(),
  entries: [],
};
state.entries = loadLog(state.date);

const datePicker = document.getElementById("date-picker");
const targetCal = document.getElementById("target-cal");
const targetProtein = document.getElementById("target-protein");
const targetCarbs = document.getElementById("target-carbs");
const targetFat = document.getElementById("target-fat");
const progressPanel = document.getElementById("progress-panel");
const foodTabs = document.getElementById("food-tabs");
const foodGrid = document.getElementById("food-grid");
const mealSelect = document.getElementById("meal-select");
const addFoodForm = document.getElementById("add-food-form");
const logContainer = document.getElementById("log-container");
const clearDayBtn = document.getElementById("clear-day-btn");

let activeCategory = "protein";

function init() {
  datePicker.value = state.date;
  targetCal.value = state.targets.cal;
  targetProtein.value = state.targets.protein;
  targetCarbs.value = state.targets.carbs;
  targetFat.value = state.targets.fat;

  renderFoodGrid();
  render();
}

foodTabs.addEventListener("click", (evt) => {
  const btn = evt.target.closest(".tab-btn");
  if (!btn) return;
  activeCategory = btn.dataset.category;
  foodTabs.querySelectorAll(".tab-btn").forEach((b) => b.classList.toggle("active", b === btn));
  renderFoodGrid();
});

function renderFoodGrid() {
  const foods = FOOD_DB.filter((f) => f.category === activeCategory);
  foodGrid.innerHTML = foods
    .map(
      (food, i) => `
      <div class="food-card cat-${food.category}">
        <div class="food-card-name">${escapeHtml(food.name)}</div>
        <div class="food-card-serving">${food.serving} · ${food.cal} kcal</div>
        <div class="food-card-macros">P${food.protein} C${food.carbs} F${food.fat}</div>
        <div class="food-card-actions">
          <input type="number" class="food-card-qty" value="1" min="0.1" step="0.1" data-idx="${i}">
          <button type="button" class="food-card-add" data-idx="${i}">Add</button>
        </div>
      </div>
    `
    )
    .join("");

  foodGrid.querySelectorAll(".food-card-add").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.idx);
      const food = foods[idx];
      const qtyInput = foodGrid.querySelector(`.food-card-qty[data-idx="${idx}"]`);
      const qty = Number(qtyInput.value) || 1;
      addEntry({
        name: qty === 1 ? food.name : `${food.name} x${qty}`,
        cal: food.cal * qty,
        protein: food.protein * qty,
        carbs: food.carbs * qty,
        fat: food.fat * qty,
      });
    });
  });
}

function render() {
  renderProgress();
  renderLog();
}

function totals() {
  return state.entries.reduce(
    (acc, e) => {
      acc.cal += e.cal;
      acc.protein += e.protein;
      acc.carbs += e.carbs;
      acc.fat += e.fat;
      return acc;
    },
    { cal: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

function renderProgress() {
  const t = totals();
  const targets = state.targets;
  const items = [
    { key: "cal", cls: "cal", label: "🔥 Calories", unit: "kcal", value: t.cal, target: targets.cal },
    { key: "protein", cls: "protein", label: "🍗 Protein", unit: "g", value: t.protein, target: targets.protein },
    { key: "carbs", cls: "carbs", label: "🍞 Carbs", unit: "g", value: t.carbs, target: targets.carbs },
    { key: "fat", cls: "fat", label: "🥑 Fat", unit: "g", value: t.fat, target: targets.fat },
  ];

  progressPanel.innerHTML = items
    .map((item) => {
      const pct = item.target > 0 ? (item.value / item.target) * 100 : 0;
      const over = pct > 100;
      const nailedIt = pct >= 95 && pct <= 105;
      const clampedPct = Math.min(pct, 100);
      const remaining = item.target - item.value;
      return `
        <div class="progress-item ${item.cls}${over ? " over" : ""}${nailedIt ? " nailed" : ""}">
          <div class="label-row">
            <span class="name">${item.label}${nailedIt ? " 🎉" : ""}</span>
            <span>${round(item.value)} / ${round(item.target)}</span>
          </div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill" style="width:${clampedPct}%"></div>
          </div>
          <div class="label-row">
            <span>${over ? `${round(-remaining)} ${item.unit} over` : `${round(remaining)} ${item.unit} left`}</span>
          </div>
        </div>
      `;
    })
    .join("");
}

function round(n) {
  return Math.round(n * 10) / 10;
}

function renderLog() {
  if (state.entries.length === 0) {
    logContainer.innerHTML = `<p class="empty-state">No food logged yet today.</p>`;
    return;
  }

  const meals = ["Breakfast", "Lunch", "Dinner", "Snack"];
  logContainer.innerHTML = meals
    .map((meal) => {
      const entries = state.entries.filter((e) => e.meal === meal);
      if (entries.length === 0) return "";
      const rows = entries
        .map(
          (e) => `
        <div class="log-entry" data-id="${e.id}">
          <span class="entry-name">${escapeHtml(e.name)}</span>
          <span class="entry-macros">${round(e.cal)} kcal · P${round(e.protein)} C${round(e.carbs)} F${round(e.fat)}</span>
          <button data-delete="${e.id}">✕</button>
        </div>
      `
        )
        .join("");
      return `<div class="meal-group"><h3>${meal}</h3>${rows}</div>`;
    })
    .join("");

  logContainer.querySelectorAll("[data-delete]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-delete");
      state.entries = state.entries.filter((e) => e.id !== id);
      saveLog(state.date, state.entries);
      render();
    });
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function addEntry(entry) {
  state.entries.push({ id: crypto.randomUUID(), meal: mealSelect.value, ...entry });
  saveLog(state.date, state.entries);
  render();
}

datePicker.addEventListener("change", () => {
  state.date = datePicker.value || todayStr();
  state.entries = loadLog(state.date);
  render();
});

[targetCal, targetProtein, targetCarbs, targetFat].forEach((input) => {
  input.addEventListener("change", () => {
    state.targets = {
      cal: Number(targetCal.value) || 0,
      protein: Number(targetProtein.value) || 0,
      carbs: Number(targetCarbs.value) || 0,
      fat: Number(targetFat.value) || 0,
    };
    saveTargets(state.targets);
    renderProgress();
  });
});

addFoodForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const name = document.getElementById("custom-name").value.trim();
  if (!name) return;
  addEntry({
    name,
    cal: Number(document.getElementById("custom-cal").value) || 0,
    protein: Number(document.getElementById("custom-protein").value) || 0,
    carbs: Number(document.getElementById("custom-carbs").value) || 0,
    fat: Number(document.getElementById("custom-fat").value) || 0,
  });
  addFoodForm.reset();
  mealSelect.value = mealSelect.value; // keep meal selection
});

clearDayBtn.addEventListener("click", () => {
  if (!confirm("Clear all entries for this day?")) return;
  state.entries = [];
  saveLog(state.date, state.entries);
  render();
});

init();
