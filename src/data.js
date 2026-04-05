export const ingredientsData = {
    flour: { pricePerGram: 13, caloriesPerGram: 3.5 },
    butter: { pricePerGram: 39, caloriesPerGram: 7.0 },
    wisman: { pricePerGram: 450, caloriesPerGram: 7.17 },
    powdered_sugar: { pricePerGram: 18, caloriesPerGram: 3.85 },
    cornstarch: { pricePerGram: 15, caloriesPerGram: 3.8 },
    milk_powder: { pricePerGram: 20, caloriesPerGram: 4.9 },
    cheese_edam: { pricePerGram: 180, caloriesPerGram: 4.2 },
    cheese_cheddar: { pricePerGram: 120, caloriesPerGram: 4.0 },
    cashew: { pricePerGram: 160, caloriesPerGram: 5.5 },
    chocolate_block: { pricePerGram: 100, caloriesPerGram: 5.4 },
    cocoa_powder: { pricePerGram: 90, caloriesPerGram: 2.3 },
    cream_of_tartar: { pricePerGram: 50, caloriesPerGram: 0 },
    lemon_juice: { pricePerGram: 30, caloriesPerGram: 0.3 },
    coconut_milk: { pricePerGram: 25, caloriesPerGram: 2.3 },
    egg_yolk: { pricePerGram: 28, caloriesPerGram: 3.2 },
    sago_flour: { pricePerGram: 12, caloriesPerGram: 3.5 }
};

import nastarIcon from "./assets/nastar-icon.png";
import kastengelIcon from "./assets/kastengel-icon.png";
import kompiesIcon from "./assets/kompies-icon.png";
import putriIcon from "./assets/putri-icon.png";
import saguIcon from "./assets/sagu-icon.png";

export const recipeIcons = {
    nastar: nastarIcon,
    kastengel: kastengelIcon,
    kompies: kompiesIcon,
    putri: putriIcon,
    sagu: saguIcon,
};

import nastar from "./assets/nastar.jpg";
import kastengel from "./assets/kastengel.jpg";
import sagu from "./assets/sagu.jpg";
import putri from "./assets/putri.jpg";
import kompies from "./assets/kompies.jpg";

export const recipeImages = {
    nastar,
    kastengel,
    sagu,
    putri,
    kompies,
};

export const recipes = {

    nastar: {
        ingredients: [
            { name: "flour", amount: 700 },
            { name: "wisman", amount: 200 },
            { name: "butter", amount: 300 },
            { name: "powdered_sugar", amount: 100 },
            { name: "cornstarch", amount: 100 },
            { name: "milk_powder", amount: 100 },
            { name: "egg_yolk", amount: 5 * 18 }
        ],
        steps: [
            "Cream butter, wisman, and powdered sugar until smooth",
            "Add egg yolks and mix well",
            "Add flour, cornstarch, and milk powder gradually",
            "Mix until soft dough forms",
            "Shape dough and fill with pineapple jam",
            "Arrange on baking tray",
            "Bake at 150°C for 25–30 minutes until golden"
        ]
    },

    kastengel: {
        ingredients: [
            { name: "flour", amount: 700 },
            { name: "cornstarch", amount: 100 },
            { name: "wisman", amount: 200 },
            { name: "butter", amount: 300 },
            { name: "cheese_edam", amount: 200 },
            { name: "cheese_cheddar", amount: 150 },
            { name: "egg_yolk", amount: 4 * 18 }
        ],
        steps: [
            "Cream butter, wisman, and egg yolks",
            "Add grated cheese and mix evenly",
            "Add flour and cornstarch gradually",
            "Mix into firm dough",
            "Roll and flatten the dough",
            "Cut into stick shapes",
            "Brush with egg yolk and sprinkle cheese",
            "Bake at 150°C for 25 minutes"
        ]
    },

    putri: {
        ingredients: [
            { name: "flour", amount: 1500 },
            { name: "wisman", amount: 300 },
            { name: "butter", amount: 700 },
            { name: "powdered_sugar", amount: 150 },
            { name: "cashew", amount: 300 },
            { name: "egg_yolk", amount: 4 * 18 }
        ],
        steps: [
            "Cream butter, wisman, and powdered sugar",
            "Add egg yolks and mix evenly",
            "Add flour and ground cashew gradually",
            "Mix until dough forms",
            "Shape into crescent or desired shape",
            "Bake at 150°C for 25 minutes",
            "Coat with powdered sugar while warm"
        ]
    },

    sagu: {
        ingredients: [
            { name: "sago_flour", amount: 900 },
            { name: "cheese_cheddar", amount: 300 },
            { name: "butter", amount: 300 },
            { name: "wisman", amount: 150 },
            { name: "powdered_sugar", amount: 450 },
            { name: "coconut_milk", amount: 65 }
        ],
        steps: [
            "Roast sago flour and let it cool",
            "Cream butter, wisman, and powdered sugar",
            "Add coconut milk and mix well",
            "Add cheese and mix evenly",
            "Add sago flour gradually",
            "Put dough into piping bag",
            "Pipe onto baking tray",
            "Bake at 150°C for 25–30 minutes"
        ]
    },

    kompies: {
        ingredients: [
            { name: "powdered_sugar", amount: 300 },
            { name: "cashew", amount: 300 },
            { name: "chocolate_block", amount: 300 },
            { name: "cream_of_tartar", amount: 30 },
            { name: "lemon_juice", amount: 15 },
            { name: "cocoa_powder", amount: 30 },
            { name: "egg_yolk", amount: 8 * 18 }
        ],
        steps: null // ⛔ ONLY THIS ONE UNDER DEVELOPMENT
    }
};