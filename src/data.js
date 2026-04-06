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
    sago_flour: { pricePerGram: 12, caloriesPerGram: 3.5 },
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
            { name: "egg_yolk", amount: 5 * 18 },
        ],
        steps: {
            en: [
                "Cream butter, wisman, and powdered sugar until smooth",
                "Add egg yolks and mix well",
                "Add flour, cornstarch, and milk powder gradually",
                "Mix until soft dough forms",
                "Shape dough and fill with pineapple jam",
                "Arrange on baking tray",
                "Bake at 150°C for 25-30 minutes until golden",
            ],
            id: [
                "Kocok mentega, wisman, dan gula halus hingga lembut",
                "Masukkan kuning telur, aduk rata",
                "Tambahkan tepung, maizena, dan susu bubuk secara bertahap",
                "Uleni hingga adonan lembut dan bisa dibentuk",
                "Bentuk bulat, isi dengan selai nanas, bulatkan kembali",
                "Susun di loyang yang sudah diolesi mentega",
                "Panggang 150°C selama 25-30 menit hingga keemasan",
            ],
        },
    },

    kastengel: {
        ingredients: [
            { name: "flour", amount: 700 },
            { name: "cornstarch", amount: 100 },
            { name: "wisman", amount: 200 },
            { name: "butter", amount: 300 },
            { name: "cheese_edam", amount: 200 },
            { name: "cheese_cheddar", amount: 150 },
            { name: "egg_yolk", amount: 4 * 18 },
        ],
        steps: {
            en: [
                "Beat butter, wisman, and egg yolks until combined",
                "Add grated cheese and mix evenly",
                "Add flour and cornstarch gradually",
                "Knead until a firm, shapeable dough forms",
                "Roll dough to about 1 cm thickness",
                "Cut into stick shapes",
                "Brush with egg yolk and sprinkle grated cheese",
                "Bake at 150°C for 25 minutes",
            ],
            id: [
                "Kocok mentega, wisman, dan kuning telur hingga rata",
                "Masukkan keju parut, aduk merata",
                "Tambahkan tepung dan maizena secara bertahap",
                "Uleni hingga adonan padat dan bisa dibentuk",
                "Gilas adonan dengan ketebalan sekitar 1 cm",
                "Potong memanjang seperti batang",
                "Olesi dengan kuning telur dan taburi keju parut",
                "Panggang 150°C selama 25 menit",
            ],
        },
    },

    putri: {
        ingredients: [
            { name: "flour", amount: 1500 },
            { name: "wisman", amount: 300 },
            { name: "butter", amount: 700 },
            { name: "powdered_sugar", amount: 150 },
            { name: "cashew", amount: 300 },
            { name: "egg_yolk", amount: 4 * 18 },
        ],
        steps: {
            en: [
                "Cream butter, wisman, and powdered sugar",
                "Add egg yolks and mix evenly",
                "Add flour and ground cashew nuts gradually",
                "Knead until dough is shapeable",
                "Shape into crescents or desired form",
                "Bake at 150°C for 25 minutes",
                "Coat with powdered sugar while still warm",
            ],
            id: [
                "Kocok mentega, wisman, dan gula halus",
                "Masukkan kuning telur, aduk merata",
                "Tambahkan tepung dan kacang mete halus secara bertahap",
                "Uleni hingga adonan bisa dibentuk",
                "Bentuk bulan sabit atau sesuai selera",
                "Panggang 150°C selama 25 menit",
                "Balurkan gula halus selagi masih hangat",
            ],
        },
    },

    sagu: {
        ingredients: [
            { name: "sago_flour", amount: 900 },
            { name: "cheese_cheddar", amount: 300 },
            { name: "butter", amount: 300 },
            { name: "wisman", amount: 150 },
            { name: "powdered_sugar", amount: 450 },
            { name: "coconut_milk", amount: 65 },
        ],
        steps: {
            en: [
                "Toast sago flour until dry, then let it cool",
                "Cream butter, wisman, and powdered sugar until pale",
                "Add coconut milk and mix well",
                "Add grated cheese and mix evenly",
                "Add sago flour gradually and mix gently",
                "Transfer dough into a piping bag",
                "Pipe onto baking tray in desired shapes",
                "Bake at 150°C for 25-30 minutes",
            ],
            id: [
                "Sangrai tepung sagu hingga kering, dinginkan",
                "Kocok mentega, wisman, dan gula halus hingga pucat",
                "Masukkan santan, aduk rata",
                "Tambahkan keju parut, aduk merata",
                "Masukkan tepung sagu secara bertahap, uleni lembut",
                "Masukkan adonan ke dalam piping bag",
                "Semprotkan ke loyang sesuai selera",
                "Panggang 150°C selama 25-30 menit",
            ],
        },
    },

    kompies: {
        ingredients: [
            { name: "powdered_sugar", amount: 300 },
            { name: "cashew", amount: 300 },
            { name: "chocolate_block", amount: 300 },
            { name: "cream_of_tartar", amount: 30 },
            { name: "lemon_juice", amount: 15 },
            { name: "cocoa_powder", amount: 30 },
            { name: "egg_yolk", amount: 8 * 18 },
        ],
        steps: null, // 🚧 Under development
    },
};