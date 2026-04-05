import { create } from "zustand";
import { calculateRecipeWithPrices } from "../utils/calculator";
import { recipes, ingredientsData } from "../data";

const load = (key, fallback) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch { return fallback; }
};
const save = (key, val) => {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { }
};

export const useRecipeStore = create((set, get) => ({

  // RECIPE & PORTION
  recipe: load("recipe", "nastar"),
  portion: load("portion", 1),

  setRecipe: (recipe) => {
    save("recipe", recipe);
    const saved = load(`steps-${recipe}`, []);
    set({ recipe, activeStep: 0, completedSteps: saved });
  },
  setPortion: (portion) => {
    const val = portion > 0 ? portion : 1;
    save("portion", val);
    set({ portion: val });
  },

  // STEPS
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
    const steps = recipes[recipe]?.steps ?? [];
    const next = steps.findIndex((_, i) => !updated.includes(i));
    set({ completedSteps: updated, activeStep: next === -1 ? steps.length - 1 : next });
  },

  resetSteps: () => {
    save(`steps-${get().recipe}`, []);
    set({ completedSteps: [], activeStep: 0 });
  },

  // EDITABLE PRICES
  customPrices: load("customPrices", {}),

  updatePrice: (ingredient, price) => {
    const updated = { ...get().customPrices, [ingredient]: Number(price) };
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

  // BUSINESS
  sellingPrice: load("sellingPrice", 0),
  yieldAmount: load("yieldAmount", 100),

  setSellingPrice: (price) => { save("sellingPrice", Number(price)); set({ sellingPrice: Number(price) }); },
  setYieldAmount: (amount) => { save("yieldAmount", Number(amount) || 1); set({ yieldAmount: Number(amount) || 1 }); },

  // UI
  darkMode: load("darkMode", false),
  showPriceEditor: false,

  toggleDarkMode: () => {
    const next = !get().darkMode;
    save("darkMode", next);
    set({ darkMode: next });
  },
  togglePriceEditor: () => set((s) => ({ showPriceEditor: !s.showPriceEditor })),

  // DERIVED
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