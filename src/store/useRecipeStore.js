import { create } from "zustand";
import { calculateRecipeWithPrices } from "../utils/calculator";
import { recipes, ingredientsData } from "../data";

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
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { }
};

const VALID_RECIPES = ["nastar", "kastengel", "putri", "sagu", "kompies"];
const VALID_LANGS = ["en", "id"];

export const useRecipeStore = create((set, get) => ({

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
  yieldAmount: load("yieldAmount", 100, (v) => typeof v === "number" && v >= 1),

  setSellingPrice: (price) => {
    const val = Number(price);
    if (isNaN(val) || val < 0 || val > 10_000_000) return;
    save("sellingPrice", val); set({ sellingPrice: val });
  },
  setYieldAmount: (amount) => {
    const val = Number(amount) || 1;
    save("yieldAmount", val); set({ yieldAmount: val });
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
    const { sellingPrice, yieldAmount } = get();
    const { totalCost } = get().getCalculated();
    const costPerItem = yieldAmount > 0 ? totalCost / yieldAmount : 0;
    const revenue = sellingPrice * yieldAmount;
    const profit = revenue - totalCost;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
    return { costPerItem, revenue, profit, margin, totalCost };
  },
}));