"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const weaknesses = new Map();
weaknesses.set("normal", ["fighting"]);
weaknesses.set("fighting", ["flying", "psychic", "fairy"]);
weaknesses.set("flying", ["rock", "electric", "ice"]);
weaknesses.set("poison", ["ground", "psychic"]);
weaknesses.set("ground", ["water", "grass", "ice"]);
weaknesses.set("rock", ["fighting", "ground", "steel", "grass", "water"]);
weaknesses.set("bug", ["flying", "rock", "fire"]);
weaknesses.set("ghost", ["ghost", "dark"]);
weaknesses.set("steel", ["fighting", "ground", "fire"]);
weaknesses.set("fire", ["ground", "rock", "water"]);
weaknesses.set("water", ["grass", "electric"]);
weaknesses.set("grass", ["flying", "poison", "bug", "fire", "ice"]);
weaknesses.set("electric", ["ground"]);
weaknesses.set("psychic", ["bug", "ghost", "dark"]);
weaknesses.set("ice", ["fighting", "rock", "steel", "fire"]);
weaknesses.set("dragon", ["ice", "dragon", "fairy"]);
weaknesses.set("dark", ["fighting", "bug", "fairy"]);
weaknesses.set("fairy", ["poison", "steel"]);
const resistances = new Map();
resistances.set("normal", ["ghost"]);
resistances.set("fighting", ["rock", "bug"]);
resistances.set("flying", ["fighting", "bug", "grass"]);
resistances.set("poison", ["fighting", "poison", "bug", "grass", "fairy"]);
resistances.set("ground", ["poison", "rock"]);
resistances.set("rock", ["normal", "flying", "poison", "fire"]);
resistances.set("bug", ["fighting", "ground", "grass"]);
resistances.set("ghost", ["poison", "bug"]);
resistances.set("steel", [
    "normal",
    "flying",
    "rock",
    "bug",
    "steel",
    "grass",
    "psychic",
    "ice",
    "dragon",
    "fairy"
]);
resistances.set("fire", ["bug", "fire", "grass", "ice"]);
resistances.set("water", ["steel", "fire", "water", "ice"]);
resistances.set("grass", ["ground", "water", "grass", "electric"]);
resistances.set("electric", ["flying", "steel", "electric"]);
resistances.set("psychic", ["fighting", "psychic"]);
resistances.set("ice", ["ice"]);
resistances.set("dragon", ["fire", "water", "grass", "electric"]);
resistances.set("dark", ["ghost", "dark"]);
resistances.set("fairy", ["fighting", "bug", "dark"]);
const immunities = new Map();
immunities.set("normal", ["ghost"]);
immunities.set("flying", ["ground"]);
immunities.set("ground", ["electric"]);
immunities.set("ghost", ["normal", "fighting"]);
immunities.set("steel", ["poison"]);
immunities.set("dark", ["psychic"]);
immunities.set("fairy", ["dragon"]);
exports.default = { immunities, resistances, weaknesses };
//# sourceMappingURL=typeCharts.js.map