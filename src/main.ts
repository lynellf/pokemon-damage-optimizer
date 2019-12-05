import { pokemon } from "./utils/mockData";
// const solver = require("javascript-lp-solver");


function getStatValue({
  iv,
  baseStat,
  ev,
  level
}: {
  iv: number;
  baseStat: number;
  ev: number;
  level: number;
}) {
  return (iv + 2) * (baseStat + ev / 4) * (level / 100) + 5;
}

function getNat(nature: TNatureOptions, stat: TStatOptions, value: number) {
  const neutral = ["hardy", "docile", "serious", "bashful", "quirky"];
  const positiveNatures = {
    atk: ["lonely", "brave", "adamant", "naughty"].includes(nature),
    def: ["bold", "relaxed", "impish", "lax"].includes(nature),
    spa: ["modest", "mild", "quiet", "rash"].includes(nature),
    spd: ["calm", "gentle", "sassy", "careful"].includes(nature),
    speed: ["timid", "hasty", "jolly", "naive"].includes(nature)
  };

  const negativeNatures = {
    atk: ["bold", "timid", "modest", "calm"].includes(nature),
    def: ["lonely", "hasty", "mild", "gentle"].includes(nature),
    spa: ["adamant", "impish", "jolly", "careful"].includes(nature),
    spd: ["naughty", "lax", "naive", "rash"].includes(nature),
    speed: ["brave", "relaxed", "quiet", "sassy"].includes(nature)
  };

  const isNeutral = neutral.find(x => x === nature) !== undefined;
  if (isNeutral) {
    return value;
  }

  const isPositive = positiveNatures[stat];
  const isNegative = negativeNatures[stat];

  if (isNegative) {
    return value * 0.9;
  }

  if (isPositive) {
    return value * 1.1;
  }

  return value;
}

function getStatTotals({ baseStats, nature, EV, IV, level }: TGetStatTotals) {
  const { baseHP, baseAtk, baseDef, baseSpa, baseSpd, baseSpeed } = baseStats;
  const { hpEV, atkEV, defEV, spaEV, spdEV, speedEV } = EV;
  const { hpIV, atkIV, defIV, spaIV, spdIV, speedIV } = IV;

  const hp = (hpIV + 2) * (baseHP + hpEV / 4) * (level / 100) + 10 + level;
  const atk = getNat(
    nature,
    "atk",
    getStatValue({ iv: atkIV, ev: atkEV, level, baseStat: baseAtk })
  );
  const def = getNat(
    nature,
    "def",
    getStatValue({ iv: defIV, ev: defEV, level, baseStat: baseDef })
  );
  const spa = getNat(
    nature,
    "spa",
    getStatValue({ iv: spaIV, ev: spaEV, level, baseStat: baseSpa })
  );
  const spd = getNat(
    nature,
    "spd",
    getStatValue({ iv: spdIV, ev: spdEV, level, baseStat: baseSpd })
  );
  const speed = getNat(
    nature,
    "speed",
    getStatValue({ iv: speedIV, ev: speedEV, level, baseStat: baseSpeed })
  );
  return {
    hp,
    atk,
    def,
    spa,
    spd,
    speed
  };
}

function getMinAtk() {
  const { 0: bulbasaur, 3: charmander } = pokemon;
  const bulbaBase = {
    baseHP: Number(bulbasaur.baseStats.baseHP),
    baseAtk: Number(bulbasaur.baseStats.baseAtk),
    baseDef: Number(bulbasaur.baseStats.baseDef),
    baseSpa: Number(bulbasaur.baseStats.baseSpa),
    baseSpd: Number(bulbasaur.baseStats.baseSpd),
    baseSpeed: Number(bulbasaur.baseStats.baseSpeed)
  };

  const bulbaEV = {
    hpEV: 0,
    atkEV: 0,
    defEV: 0,
    spaEV: 0,
    spdEV: 0,
    speedEV: 0
  };
  const bulbaIV = {
    hpIV: 0,
    atkIV: 0,
    defIV: 0,
    spaIV: 0,
    spdIV: 0,
    speedIV: 0
  };

  const bulbaTest = getStatTotals({
    baseStats: bulbaBase,
    nature: "bold",
    EV: bulbaEV,
    IV: bulbaIV,
    level: 50
  });
}

export function App() {
  return getMinAtk();
}

type TGetStatTotals = {
  baseStats: {
    baseHP: number;
    baseAtk: number;
    baseDef: number;
    baseSpa: number;
    baseSpd: number;
    baseSpeed: number;
  };
  nature: TNatureOptions;
  level: number;
  EV: {
    hpEV: number;
    atkEV: number;
    defEV: number;
    spaEV: number;
    spdEV: number;
    speedEV: number;
  };
  IV: {
    hpIV: number;
    atkIV: number;
    defIV: number;
    spaIV: number;
    spdIV: number;
    speedIV: number;
  };
};

type TNatureOptions =
  | "hardy"
  | "lonely"
  | "brave"
  | "adamant"
  | "naughty"
  | "bold"
  | "docile"
  | "relaxed"
  | "impish"
  | "lax"
  | "timid"
  | "hasty"
  | "serious"
  | "jolly"
  | "naive"
  | "modest"
  | "mild"
  | "quiet"
  | "bashful"
  | "rash"
  | "calm"
  | "gentle"
  | "sassy"
  | "careful"
  | "quirky";

type TStatOptions = "atk" | "def" | "spa" | "spd" | "speed";
