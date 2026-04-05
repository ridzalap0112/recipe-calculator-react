import { recipes, ingredientsData } from "../data";

export function calculateRecipeWithPrices(recipeName, portion, effectivePrices) {
    const recipeData = recipes[recipeName];
    if (!recipeData || portion < 1) return { ingredients: [], totalCost: 0, totalCalories: 0 };

    const prices = effectivePrices || ingredientsData;

    const ingredients = recipeData.ingredients.map((item) => {
        const totalAmount = item.amount * portion;
        const data = prices[item.name];
        if (!data) return { name: item.name, amount: totalAmount, cost: 0, calories: 0 };
        return {
            name: item.name,
            amount: totalAmount,
            cost: totalAmount * data.pricePerGram,
            calories: totalAmount * data.caloriesPerGram,
        };
    });

    return {
        ingredients,
        totalCost: ingredients.reduce((a, b) => a + b.cost, 0),
        totalCalories: ingredients.reduce((a, b) => a + b.calories, 0),
    };
}

// Keep old export for backwards compatibility
export function calculateRecipe(recipeName, portion) {
    return calculateRecipeWithPrices(recipeName, portion, ingredientsData);
}