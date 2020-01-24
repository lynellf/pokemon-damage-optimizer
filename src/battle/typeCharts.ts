import Monster, { CleanTypes } from "../pokemon/pokemon";
type TAttack = typeof Monster.prototype.attackList[0];

export const weaknesses: Map<CleanTypes, CleanTypes[]> = new Map();
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

export const resistances: Map<CleanTypes, CleanTypes[]> = new Map();
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

export const immunities: Map<CleanTypes, CleanTypes[]> = new Map();
immunities.set("normal", ["ghost"]);
immunities.set("flying", ["ground"]);
immunities.set("ground", ["electric"]);
immunities.set("ghost", ["normal", "fighting"]);
immunities.set("steel", ["poison"]);
immunities.set("dark", ["psychic"]);
immunities.set("fairy", ["dragon"]);

export function getImmunities(mon: Monster) {
  const types = mon.types.map(t => t.toLowerCase()) as CleanTypes[];
  const imm = types
    .flatMap(t => immunities.get(t))
    .filter(t => t !== undefined);
  return imm as CleanTypes[];
}
export function getWeaknesses(mon: Monster) {
  const types = mon.types.map(t => t.toLowerCase()) as CleanTypes[];
  const wkns = types.flatMap(t => weaknesses.get(t)!);
  return wkns;
}

export function getResistances(mon: Monster) {
  const types = mon.types.map(t => t.toLowerCase()) as CleanTypes[];
  const rst = types.flatMap(t => resistances.get(t)!);
  return rst;
}

export function weaknessCheck(attack: TAttack, weaknesses: CleanTypes[]) {
  return weaknesses.includes(attack.type as CleanTypes);
}

export function immunityCheck(attack: TAttack, immunities: CleanTypes[]) {
  return !immunities.includes(attack.type as CleanTypes);
}

export function resistanceCheck(attack: TAttack, resistances: CleanTypes[]) {
  return !resistances.includes(attack.type as CleanTypes);
}

export function applyTypeBonus(moveType: CleanTypes, defType: CleanTypes) {
  const normalTable = {
    normal: 1,
    fighting: 1,
    flying: 1,
    poison: 1,
    ground: 1,
    rock: 0.5,
    bug: 1,
    ghost: 0,
    steel: 0.5,
    fire: 1,
    water: 1,
    grass: 1,
    electric: 1,
    psychic: 1,
    ice: 1,
    dragon: 1,
    dark: 1,
    fairy: 1
  };
  const fightingTable = {
    normal: 2,
    fighting: 1,
    flying: 0.5,
    poison: 0.5,
    ground: 1,
    rock: 2,
    bug: 0.5,
    ghost: 0,
    steel: 2,
    fire: 1,
    water: 1,
    grass: 1,
    electric: 1,
    psychic: 0.5,
    ice: 2,
    dragon: 1,
    dark: 2,
    fairy: 0.5
  };
  const flyingTable = {
    normal: 1,
    fighting: 2,
    flying: 1,
    poison: 1,
    ground: 1,
    rock: 0.5,
    bug: 2,
    ghost: 1,
    steel: 0.5,
    fire: 1,
    water: 1,
    grass: 2,
    electric: 0.5,
    psychic: 1,
    ice: 1,
    dragon: 1,
    dark: 1,
    fairy: 1
  };
  const poisonTable = {
    normal: 1,
    fighting: 1,
    flying: 1,
    poison: 0.5,
    ground: 0.5,
    rock: 0.5,
    bug: 1,
    ghost: 0.5,
    steel: 0,
    fire: 1,
    water: 1,
    grass: 2,
    electric: 1,
    psychic: 1,
    ice: 1,
    dragon: 1,
    dark: 1,
    fairy: 2
  };
  const groundTable = {
    normal: 1,
    fighting: 1,
    flying: 0,
    poison: 2,
    ground: 1,
    rock: 2,
    bug: 0.5,
    ghost: 1,
    steel: 2,
    fire: 2,
    water: 1,
    grass: 0.5,
    electric: 2,
    psychic: 1,
    ice: 1,
    dragon: 1,
    dark: 1,
    fairy: 1
  };
  const rockTable = {
    normal: 1,
    fighting: 0.5,
    flying: 2,
    poison: 1,
    ground: 0.5,
    rock: 1,
    bug: 2,
    ghost: 1,
    steel: 0.5,
    fire: 2,
    water: 1,
    grass: 1,
    electric: 1,
    psychic: 1,
    ice: 2,
    dragon: 1,
    dark: 1,
    fairy: 1
  };
  const bugTable = {
    normal: 1,
    fighting: 0.5,
    flying: 0.5,
    poison: 0.5,
    ground: 1,
    rock: 1,
    bug: 1,
    ghost: 0.5,
    steel: 0.5,
    fire: 0.5,
    water: 1,
    grass: 2,
    electric: 1,
    psychic: 2,
    ice: 1,
    dragon: 1,
    dark: 2,
    fairy: 0.5
  };
  const ghostTable = {
    normal: 0,
    fighting: 1,
    flying: 1,
    poison: 1,
    ground: 1,
    rock: 1,
    bug: 1,
    ghost: 2,
    steel: 1,
    fire: 1,
    water: 1,
    grass: 1,
    electric: 1,
    psychic: 2,
    ice: 1,
    dragon: 1,
    dark: 0.5,
    fairy: 0
  };
  const steelTable = {
    normal: 1,
    fighting: 1,
    flying: 1,
    poison: 1,
    ground: 1,
    rock: 2,
    bug: 1,
    ghost: 1,
    steel: 0.5,
    fire: 0.5,
    water: 0.5,
    grass: 1,
    electric: 0.5,
    psychic: 1,
    ice: 2,
    dragon: 1,
    dark: 1,
    fairy: 2
  };
  const fireTable = {
    normal: 1,
    fighting: 1,
    flying: 1,
    poison: 1,
    ground: 1,
    rock: 0.5,
    bug: 2,
    ghost: 1,
    steel: 2,
    fire: 0.5,
    water: 0.5,
    grass: 2,
    electric: 1,
    psychic: 1,
    ice: 2,
    dragon: 0.5,
    dark: 1,
    fairy: 1
  };
  const waterTable = {
    normal: 1,
    fighting: 1,
    flying: 1,
    poison: 1,
    ground: 2,
    rock: 2,
    bug: 1,
    ghost: 1,
    steel: 1,
    fire: 2,
    water: 0.5,
    grass: 0.5,
    electric: 1,
    psychic: 1,
    ice: 1,
    dragon: 0.5,
    dark: 1,
    fairy: 1
  };
  const grassTable = {
    normal: 1,
    fighting: 1,
    flying: 0.5,
    poison: 0.5,
    ground: 2,
    rock: 2,
    bug: 0.5,
    ghost: 1,
    steel: 0.5,
    fire: 0.5,
    water: 2,
    grass: 0.5,
    electric: 1,
    psychic: 1,
    ice: 1,
    dragon: 0.5,
    dark: 1,
    fairy: 1
  };
  const electricTable = {
    normal: 1,
    fighting: 2,
    flying: 1,
    poison: 1,
    ground: 0,
    rock: 1,
    bug: 1,
    ghost: 1,
    steel: 1,
    fire: 1,
    water: 2,
    grass: 0.5,
    electric: 0.5,
    psychic: 1,
    ice: 1,
    dragon: 0.5,
    dark: 1,
    fairy: 1
  };
  const psychicTable = {
    normal: 1,
    fighting: 2,
    flying: 1,
    poison: 2,
    ground: 1,
    rock: 1,
    bug: 1,
    ghost: 1,
    steel: 0.5,
    fire: 1,
    water: 1,
    grass: 1,
    electric: 1,
    psychic: 0.5,
    ice: 1,
    dragon: 1,
    dark: 0,
    fairy: 1
  };
  const iceTable = {
    normal: 1,
    fighting: 1,
    flying: 2,
    poison: 1,
    ground: 2,
    rock: 1,
    bug: 1,
    ghost: 1,
    steel: 0.5,
    fire: 0.5,
    water: 0.5,
    grass: 2,
    electric: 1,
    psychic: 1,
    ice: 0.5,
    dragon: 2,
    dark: 1,
    fairy: 1
  };
  const dragonTable = {
    normal: 1,
    fighting: 1,
    flying: 1,
    poison: 1,
    ground: 1,
    rock: 1,
    bug: 1,
    ghost: 1,
    steel: 0.5,
    fire: 1,
    water: 1,
    grass: 1,
    electric: 1,
    psychic: 1,
    ice: 1,
    dragon: 2,
    dark: 1,
    fairy: 0
  };
  const darkTable = {
    normal: 1,
    fighting: 0.5,
    flying: 1,
    poison: 1,
    ground: 1,
    rock: 1,
    bug: 1,
    ghost: 2,
    steel: 1,
    fire: 1,
    water: 1,
    grass: 1,
    electric: 1,
    psychic: 2,
    ice: 1,
    dragon: 1,
    dark: 0.5,
    fairy: 0.5
  };
  const fairyTable = {
    normal: 1,
    fighting: 2,
    flying: 1,
    poison: 0.5,
    ground: 1,
    rock: 1,
    bug: 1,
    ghost: 1,
    steel: 0.5,
    fire: 0.5,
    water: 1,
    grass: 1,
    electric: 1,
    psychic: 1,
    ice: 1,
    dragon: 2,
    dark: 2,
    fairy: 1
  };

  return {
    normal: normalTable[defType] * 1,
    fighting: fightingTable[defType] * 1,
    flying: flyingTable[defType] * 1,
    poison: poisonTable[defType] * 1,
    ground: groundTable[defType] * 1,
    rock: rockTable[defType] * 1,
    bug: bugTable[defType] * 1,
    ghost: ghostTable[defType] * 1,
    steel: steelTable[defType] * 1,
    fire: fireTable[defType] * 1,
    water: waterTable[defType] * 1,
    grass: grassTable[defType] * 1,
    electric: electricTable[defType] * 1,
    psychic: psychicTable[defType] * 1,
    ice: iceTable[defType] * 1,
    dragon: dragonTable[defType] * 1,
    dark: darkTable[defType] * 1,
    fairy: fairyTable[defType] * 1
  }[moveType];
}
