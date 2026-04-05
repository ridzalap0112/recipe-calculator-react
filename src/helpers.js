import nastar_icon from "./assets/nastar-icon.png";
import kastengel_icon from "./assets/kastengel-icon.png";
import kompies_icon from "./assets/kompies-icon.png";
import putri_icon from "./assets/putri-icon.png";
import sagu_icon from "./assets/sagu-icon.png";
import nastar_img from "./assets/nastar.jpg";
import kastengel_img from "./assets/kastengel.jpg";
import kompies_img from "./assets/kompies.jpg";
import putri_img from "./assets/putri.jpg";
import sagu_img from "./assets/sagu.jpg";

export const recipeIcons = {
  nastar: nastar_icon,
  kastengel: kastengel_icon,
  putri: putri_icon,
  sagu: sagu_icon,
  kompies: kompies_icon,
};

export const recipePhotos = {
  nastar: nastar_img,
  kastengel: kastengel_img,
  putri: putri_img,
  sagu: sagu_img,
  kompies: kompies_img,
};

export const recipeLabels = {
  nastar: "Nastar",
  kastengel: "Kastengel",
  putri: "Putri Salju",
  sagu: "Sagu Keju",
  kompies: "Kompies",
};

export const ingredientNames = {
  flour: "Wheat Flour",
  butter: "Butter",
  wisman: "Wisman",
  powdered_sugar: "Powdered Sugar",
  cornstarch: "Cornstarch",
  milk_powder: "Milk Powder",
  cheese_edam: "Edam Cheese",
  cheese_cheddar: "Cheddar Cheese",
  cashew: "Cashew Nuts",
  chocolate_block: "Chocolate Block",
  cocoa_powder: "Cocoa Powder",
  cream_of_tartar: "Cream of Tartar",
  lemon_juice: "Lemon Juice",
  coconut_milk: "Coconut Milk",
  egg_yolk: "Egg Yolk",
  sago_flour: "Sago Flour",
};

export const formatRp = (num) =>
  `Rp ${Math.round(num).toLocaleString("id-ID")}`;