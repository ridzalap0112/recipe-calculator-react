import { create } from "zustand";
import { calculateRecipeWithPrices } from "../utils/calculator";
import { recipes, ingredientsData } from "../data";
import { packagingOptions } from "../helpers";

const load = (key, fallback, validator) => {
  try {
    const val = localStorage.getItem(key);
    if (!val) return fallback;
    const parsed = JSON.parse(val);
    if (validator && !validator(parsed)) return fallback;
    return parsed;
  } catch { return fallback; }
};
const save = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    // Ignore storage write failures so the app keeps working in restricted modes.
  }
};

const VALID_RECIPES = ["nastar", "kastengel", "putri", "sagu", "kompies"];
const VALID_LANGS = ["en", "id"];
const HISTORY_KEY = "history";
const LEGACY_HISTORY_KEY = "calc-history";
const MAX_HISTORY = 20;

const isValidHistoryEntry = (entry) =>
  entry &&
  VALID_RECIPES.includes(entry.recipe) &&
  typeof entry.portion === "number" &&
  typeof entry.totalCost === "number" &&
  typeof entry.profit === "number" &&
  typeof entry.margin === "number";

const loadHistory = () => {
  const primary = load(
    HISTORY_KEY,
    null,
    (value) => Array.isArray(value) && value.every(isValidHistoryEntry),
  );
  if (primary) return primary.slice(0, MAX_HISTORY);

  const legacy = load(
    LEGACY_HISTORY_KEY,
    [],
    (value) => Array.isArray(value) && value.every(isValidHistoryEntry),
  ).slice(0, MAX_HISTORY);

  if (legacy.length) save(HISTORY_KEY, legacy);
  return legacy;
};

export const useRecipeStore = create((set, get) => ({
  // ─── HISTORY ─────────────────────────────────────────────
  history: loadHistory(),

  addHistory: (entry) => {
    if (!isValidHistoryEntry(entry)) return;

    const current = get().history;
    const deduped = current.filter(
      (item) =>
        !(
          item.recipe === entry.recipe &&
          item.portion === entry.portion &&
          Math.abs(item.totalCost - entry.totalCost) < 1
        ),
    );

    const updated = [
      {
        ...entry,
        id: Date.now(),
        date: new Date().toISOString(),
      },
      ...deduped,
    ].slice(0, MAX_HISTORY);

    save(HISTORY_KEY, updated);
    set({ history: updated });
  },

  removeHistory: (id) => {
    const updated = get().history.filter((entry) => entry.id !== id);
    save(HISTORY_KEY, updated);
    set({ history: updated });
  },

  clearHistory: () => {
    save(HISTORY_KEY, []);
    set({ history: [] });
  },

  // ─── RECIPE & PORTION ────────────────────────────────────────────────────
  recipe: load("recipe", "nastar", (v) => VALID_RECIPES.includes(v)),
  portion: load("portion", 1, (v) => typeof v === "number" && v >= 1 && v <= 1000),

  setRecipe: (recipe) => {
    if (!VALID_RECIPES.includes(recipe)) return;
    save("recipe", recipe);
    const saved = load(`steps-${recipe}`, []);
    set({ recipe, activeStep: 0, completedSteps: saved });
  },
  setPortion: (portion) => {
    const val = Number(portion);
    if (isNaN(val) || !isFinite(val) || val < 1 || val > 1000) return;
    save("portion", Math.floor(val));
    set({ portion: Math.floor(val) });
  },

  // ─── STEPS ───────────────────────────────────────────────────────────────
  activeStep: 0,
  completedSteps: load(`steps-${load("recipe", "nastar")}`, []),

  setActiveStep: (step) => set({ activeStep: step }),

  toggleStep: (index) => {
    const { activeStep, completedSteps, recipe } = get();
    if (index !== activeStep) return;
    const alreadyDone = completedSteps.includes(index);
    const updated = alreadyDone
      ? completedSteps.filter((i) => i !== index)
      : [...completedSteps, index];
    save(`steps-${recipe}`, updated);
    const rawSteps = recipes[recipe]?.steps;
    const steps = rawSteps === null ? [] :
      Array.isArray(rawSteps?.[get().lang]) ? rawSteps[get().lang] :
        Array.isArray(rawSteps?.en) ? rawSteps.en : [];
    const next = steps.findIndex((_, i) => !updated.includes(i));
    set({ completedSteps: updated, activeStep: next === -1 ? steps.length - 1 : next });
  },

  resetSteps: () => {
    save(`steps-${get().recipe}`, []);
    set({ completedSteps: [], activeStep: 0 });
  },

  // ─── NOTES (per recipe) ──────────────────────────────────────────────────
  getNotes: () => {
    const { recipe } = get();
    return load(`notes-${recipe}`, "");
  },
  saveNotes: (text) => {
    const { recipe } = get();
    save(`notes-${recipe}`, text);
  },

  // ─── EDITABLE PRICES ─────────────────────────────────────────────────────
  customPrices: load("customPrices", {}),

  updatePrice: (ingredient, price) => {
    if (!Object.keys(ingredientsData).includes(ingredient)) return;
    const val = Number(price);
    if (isNaN(val) || val < 0 || val > 1_000_000) return;
    const updated = { ...get().customPrices, [ingredient]: val };
    save("customPrices", updated);
    set({ customPrices: updated });
  },
  resetPrices: () => {
    save("customPrices", {});
    set({ customPrices: {} });
  },
  getEffectivePrices: () => {
    const { customPrices } = get();
    const result = {};
    Object.keys(ingredientsData).forEach((key) => {
      result[key] = {
        ...ingredientsData[key],
        pricePerGram: customPrices[key] ?? ingredientsData[key].pricePerGram,
      };
    });
    return result;
  },

  // ─── BUSINESS ────────────────────────────────────────────────────────────
  sellingPrice: load("sellingPrice", 0, (v) => typeof v === "number" && v >= 0),
  totalBatchWeight: load("totalBatchWeight", 1000, (v) => typeof v === "number" && v >= 1),
  jarSize: load("jarSize", 250, (v) => Object.keys(packagingOptions).includes(String(v))),

  setSellingPrice: (price) => {
    const val = Number(price);
    if (isNaN(val) || val < 0 || val > 10_000_000) return;
    save("sellingPrice", val); set({ sellingPrice: val });
  },
  setTotalBatchWeight: (amount) => {
    const val = Number(amount);
    if (isNaN(val) || !isFinite(val) || val < 1 || val > 100000) return;
    save("totalBatchWeight", val); set({ totalBatchWeight: val });
  },
  setJarSize: (size) => {
    const val = Number(size);
    if (!Object.keys(packagingOptions).includes(String(val))) return;
    save("jarSize", val); set({ jarSize: val });
  },

  // ─── LANGUAGE ────────────────────────────────────────────────────────────
  lang: load("lang", "id", (v) => VALID_LANGS.includes(v)),
  setLang: (lang) => {
    if (!VALID_LANGS.includes(lang)) return;
    save("lang", lang);
    set({ lang });
  },

  // ─── UI ──────────────────────────────────────────────────────────────────
  darkMode: load("darkMode", false),
  showPriceEditor: false,

  toggleDarkMode: () => {
    const next = !get().darkMode;
    save("darkMode", next);
    set({ darkMode: next });
  },
  togglePriceEditor: () => set((s) => ({ showPriceEditor: !s.showPriceEditor })),

  // ─── DERIVED ─────────────────────────────────────────────────────────────
  getCalculated: () => {
    const { recipe, portion, getEffectivePrices } = get();
    return calculateRecipeWithPrices(recipe, portion, getEffectivePrices());
  },
  getBusinessStats: () => {
    const { sellingPrice, totalBatchWeight, jarSize } = get();
    const { totalCost } = get().getCalculated();
    const packagingCost = packagingOptions[jarSize] ?? 0;
    const jarCount = totalBatchWeight > 0 && jarSize > 0
      ? Math.floor(totalBatchWeight / jarSize)
      : 0;
    const totalPackagingCost = jarCount * packagingCost;
    const totalCostWithPackaging = totalCost + totalPackagingCost;
    const costPerJar = jarCount > 0 ? totalCostWithPackaging / jarCount : 0;
    const revenue = sellingPrice * jarCount;
    const profit = revenue - totalCostWithPackaging;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
    return {
      jarCount,
      packagingCost,
      totalPackagingCost,
      totalBatchWeight,
      jarSize,
      totalCost,
      totalCostWithPackaging,
      costPerJar,
      revenue,
      profit,
      margin,
    };
  },
}));
