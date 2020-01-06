/**
 * EV Optimizer
 * 1. Determine objective function based on match-up
 *   a. Am I faster than my opponent?
 *   b. Can I withstand multiple attacks from my opponent?
 *   c. Can I defeat my opponent within 2 turns?
 * 2. If the answer is yes, pass.
 * 3. If the answer is no, solve to make the answer a yes.
 * 4. If I fail, pass.
 * 5. Resulting EV values are starting values for next evaluation.
 */
import dataSource from "./data/output.json";
import { getAttacks, performDamageCalculation } from "./battle/battle";
import Monster from "./pokemon/pokemon";
import Variable from "./solver/variable/variable";
import { optimizer } from "./pokeEvaluator/pokeEvaluator";

type Moves = typeof dataSource["moves"];
type MoveKeys = keyof Moves;
type MonsterKeys = keyof typeof dataSource["pokemon"];

type TBST = {
  baseHP: string;
  baseAtk: string;
  baseDef: string;
  baseSpa: string;
  baseSpd: string;
  baseSpeed: string;
};

type TBaseStats = {
  normal: TBST;
  alolan: TBST | null;
  galarian: TBST | null;
};

export type TMove = {
  moveName: string;
  moveAccuracy: string;
  moveEffectPct: string;
  movePower: string;
  movePowerPoints: string;
  moveType: string;
};

type TMoveFormatted = {
  name: string;
  power: number;
  type: string;
  category: string | undefined;
};

export type TPokemon = {
  abilities: string[];
  baseStats: TBaseStats;
  dexNumber: string;
  forms: { form: string; types: string[] }[];
  moves: { [key: string]: string[] };
  name: string;
};

export type TOutput = {
  pokemon: { [key: string]: TPokemon };
  moves: { [key: string]: TMove };
  abilities: string[];
  _tempMoves?: { [key: string]: string[] };
};

type OptimizeMon = {
  canKo: boolean;
  canOutlast: boolean;
  canOutspeed: boolean;
};

type OptimizePower = {
  stat: "atk" | "spa";
  move: TMoveFormatted;
  query: Monster;
  opponent: Monster;
};

type OptimizeDef = {
  stat: "def" | "spd";
  move: TMoveFormatted;
  query: Monster;
  opponent: Monster;
};

type TBattle = {
  category: string;
  defenderName: string;
  defenderHp: number;
  movePct: number;
  name: string;
  totalDmg: number;
  evs: number[];
};

const compare = (a: any, b: any) => (a.movePct > b.movePct ? -1 : 1);

function getMonsterList() {
  const { pokemon: rawData } = dataSource;
  const pokemonNames = Object.keys(rawData) as MonsterKeys[];
  return pokemonNames
    .map(n => new Monster({ name: n }))
    .filter(m => m.attackList.length !== 0);
}

export function optimizePwr({ stat, move, query, opponent }: OptimizePower) {
  const powerConst = (...evs: Variable[]) => {
    query.effortValues = [...evs];
    const output = performDamageCalculation({
      attacker: query,
      defender: opponent,
      move,
      cse: "worst"
    });
    const didWin = output.movePct >= 0.5;
    return didWin;
  };

  const output = optimizer({
    baseMonster: query,
    query: stat,
    cons: [powerConst]
  });
  return output;
}

function optimizeDef({ stat, move, query, opponent }: OptimizeDef) {
  const defConst = (...evs: Variable[]) => {
    query.effortValues = [...evs];
    const output = performDamageCalculation({
      attacker: opponent,
      defender: query,
      move,
      cse: "best"
    });
    return output.movePct < 0.5;
  };

  return optimizer({
    baseMonster: query,
    query: stat,
    cons: [defConst]
  });
}

function optimizeSpeed(query: Monster, opponent: Monster) {
  const speedConst = (...evs: Variable[]) => {
    query.effortValues = [...evs];
    const output = query.stats.speed > opponent.stats.speed;
    return output;
  };

  return optimizer({
    baseMonster: query,
    query: "speed",
    cons: [speedConst]
  });
}

export function optimizeMon(query: Monster, opponent: Monster) {
  query.battleOpponent(opponent, "worst");
  opponent.battleOpponent(query, "best");
  const attackResults = query.lastBattle;
  const defResults = opponent.lastBattle;
  const isValid = attackResults !== undefined && defResults !== undefined;
  if (isValid) {
    const isFaster =
      query.stats.speed > opponent.stats.speed
        ? true
        : optimizeSpeed(query, opponent);
    const canOHKO = attackResults.movePct >= 1;
    const canKo =
      attackResults.movePct >= 0.5
        ? true
        : optimizePwr({
            stat: attackResults.category === "physical move" ? "atk" : "spa",
            move: query.attackList.find(m => m.name === attackResults.name)!,
            opponent,
            query
          });
    const canOutlast =
      defResults.movePct < 0.5
        ? true
        : optimizeDef({
            query,
            opponent,
            stat: defResults.category === "physical move" ? "def" : "spd",
            move: opponent.attackList.find(m => m.name === defResults.name)!
          });
    const canSweep = isFaster && canOHKO;
    const canOutPace = isFaster && canOutlast && canKo;
    const canBully = canOutlast && canKo;
    const canWin = canSweep || canBully || canOutPace;
    if (canWin) {
      query.lastWinEvs = [...query.evs];
      query.wins.push({
        opponent: opponent.name,
        move: attackResults,
        evs: query.evs.map(ev => ev.currentVal)
      });
    } else {
      query.losses.push({
        opponent: opponent.name,
        move: defResults,
        evs: query.evs.map(ev => ev.currentVal)
      });
    }
  } else {
    console.error("Undefined battle result data");
  }
}

export function Main(monsters: Monster[] = getMonsterList()) {
  let canContinue = true;
  let index = 0;
  const results = monsters.reduce((o, m) => {
    o[m.name] = m.lastBattle;
    return o;
  }, {} as any);

  const limit = monsters.length;

  while (canContinue && index < limit) {
    const query = monsters[index];
    const equalState =
      JSON.stringify(query.lastBattle) === JSON.stringify(results[query.name]);

    if (!equalState || index === 0) {
      const opponents = monsters.filter(m => m.name !== query.name);
      opponents.forEach(o => {
        const opponent = o;
        optimizeMon(query, opponent);
        results[query.name] = {
          wins: query.wins,
          losses: query.losses
        };
      });
      index += 1;
    }
  }
  return results;
}
