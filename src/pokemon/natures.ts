import Variable from "../solver/variable/variable";
import { TNatures } from "./pokemon";

type TTypes = "positive" | "negative" | "neutral";
type TStats = "atk" | "def" | "spa" | "spd" | "speed" | "neutral";
type TQuery = [TStats, TStats];
type TGetCalcArgs = {
  baseStats: number[];
  level: number;
  evs: Variable[];
  ivs: number[];
  query: TQuery;
};

type TGetStatTotals = {
  baseStats: number[];
  level: number;
  evs: Variable[];
  ivs: number[];
  nature: TNatures;
};

type TArgs = {
  iv: number;
  baseStat: number;
  ev: number;
  level: number;
  type?: TTypes;
};

type TCheck = { query: TQuery; type: TStats };

function calculateHpTotal({ iv, baseStat, ev, level }: TArgs) {
  return Math.floor(((2 * baseStat + iv + ev / 4) * level) / 100 + level + 10);
}

function calculateNeutral({ iv, baseStat, ev, level }: TArgs) {
  return Math.floor(
    Math.floor(((2 * baseStat + iv + ev / 4) * level) / 100 + 5) * 1
  );
}

function calculatePositive({ iv, baseStat, ev, level }: TArgs) {
  return Math.floor(
    Math.floor(((2 * baseStat + iv + ev / 4) * level) / 100 + 5) * 1.1
  );
}

function calculateNegative({ iv, baseStat, ev, level }: TArgs) {
  return Math.floor(
    Math.floor(((2 * baseStat + iv + ev / 4) * level) / 100 + 5) * 0.9
  );
}

function calculateStat({ iv, baseStat, ev, level, type = "neutral" }: TArgs) {
  const cases: { [k in TTypes]: typeof calculateNeutral } = {
    neutral: calculateNeutral,
    negative: calculateNegative,
    positive: calculatePositive
  };
  return cases[type]({ iv, baseStat, ev, level });
}

function typeCheck({ query, type }: TCheck) {
  const cases: Map<number, TTypes> = new Map();
  cases.set(-1, "neutral");
  cases.set(0, "positive");
  cases.set(1, "negative");
  const testCase = query.indexOf(type);
  return cases.get(testCase);
}

const getStats = ({ baseStats, level = 50, evs, ivs, query }: TGetCalcArgs) => {
  const {
    0: hpBST,
    1: atkBST,
    2: defBST,
    3: spaBST,
    4: spdBST,
    5: speedBST
  } = baseStats;

  const {
    0: { currentVal: hpEV },
    1: { currentVal: atkEV },
    2: { currentVal: defEV },
    3: { currentVal: spaEV },
    4: { currentVal: spdEV },
    5: { currentVal: speedEV }
  } = evs;

  const { 0: hpIV, 1: atkIV, 2: defIV, 3: spaIV, 4: spdIV, 5: speedIV } = ivs;
  return [
    calculateHpTotal({ iv: hpIV, ev: hpEV, baseStat: hpBST, level }),
    calculateStat({
      iv: atkIV,
      ev: atkEV,
      baseStat: atkBST,
      level,
      type: typeCheck({ query, type: "atk" })
    }),
    calculateStat({
      iv: defIV,
      ev: defEV,
      baseStat: defBST,
      level,
      type: typeCheck({ query, type: "def" })
    }),
    calculateStat({
      iv: spaIV,
      ev: spaEV,
      baseStat: spaBST,
      level,
      type: typeCheck({ query, type: "spa" })
    }),
    calculateStat({
      iv: spdIV,
      ev: spdEV,
      baseStat: spdBST,
      level,
      type: typeCheck({ query, type: "spd" })
    }),
    calculateStat({
      iv: speedIV,
      ev: speedEV,
      baseStat: speedBST,
      level,
      type: typeCheck({ query, type: "speed" })
    })
  ];
};

function getQuery(nature: TNatures = "Hardy") {
  const cases: Map<TNatures, TQuery> = new Map();
  cases.set("Hardy", ["neutral", "neutral"]);
  cases.set("Docile", ["neutral", "neutral"]);
  cases.set("Serious", ["neutral", "neutral"]);
  cases.set("Bashful", ["neutral", "neutral"]);
  cases.set("Quirky", ["neutral", "neutral"]);
  cases.set("Lonely", ["atk", "def"]);
  cases.set("Brave", ["atk", "speed"]);
  cases.set("Adamant", ["atk", "spa"]);
  cases.set("Naughty", ["atk", "spd"]);
  cases.set("Bold", ["def", "atk"]);
  cases.set("Relaxed", ["def", "speed"]);
  cases.set("Impish", ["def", "spa"]);
  cases.set("Lax", ["def", "spd"]);
  cases.set("Timid", ["speed", "atk"]);
  cases.set("Hasty", ["speed", "def"]);
  cases.set("Jolly", ["speed", "spa"]);
  cases.set("Naive", ["speed", "spd"]);
  cases.set("Modest", ["spa", "atk"]);
  cases.set("Mild", ["spa", "def"]);
  cases.set("Quiet", ["spa", "speed"]);
  cases.set("Rash", ["spa", "spd"]);
  cases.set("Calm", ["spd", "atk"]);
  cases.set("Gentle", ["spd", "def"]);
  cases.set("Sassy", ["spd", "speed"]);
  cases.set("Careful", ["spd", "spa"]);
  return cases.get(nature) ?? (["neutral", "neutral"] as TQuery);
}

export function getStatTotals({
  baseStats,
  level = 50,
  evs,
  ivs,
  nature
}: TGetStatTotals) {
  const query = getQuery(nature);
  return getStats({ baseStats, level, evs, ivs, query });
}
