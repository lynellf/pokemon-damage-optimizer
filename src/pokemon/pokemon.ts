import dataSource from "../data/output.json";
import Variable from "../solver/variable/variable";
import { performDamageCalculation } from "../battle/battle";
import { optimizeMon } from "../main";

const multiTurnMoveList: string[] = [
  "blast burn",
  "bounce",
  "dig",
  "dive",
  "eternabeam",
  "fly",
  "freeze shock",
  "frenzy plant",
  "geomancy",
  "giga impact",
  "hydro cannon",
  "hyper beam",
  "ice burn",
  "meteor assault",
  "phantom force",
  "prismatic laser",
  "razor wind",
  "roar of time",
  "rock wrecker",
  "shadow force",
  "shadow half",
  "skull bash",
  "sky attack",
  "sky drop",
  "solar beam",
  "solar blade"
];

export type MonsterTypes =
  | "Normal-Type"
  | "Fire-Type"
  | "Fighting-Type"
  | "Water-Type"
  | "Flying-Type"
  | "Grass-Type"
  | "Poison-Type"
  | "Electric-Type"
  | "Ground-Type"
  | "Psychic-Type"
  | "Rock-Type"
  | "Ice-Type"
  | "Bug-Type"
  | "Dragon-Type"
  | "Ghost-Type"
  | "Dark-Type"
  | "Steel-Type"
  | "Fairy-Type";

export type CleanTypes =
  | "normal"
  | "fighting"
  | "flying"
  | "poison"
  | "ground"
  | "rock"
  | "bug"
  | "ghost"
  | "steel"
  | "fire"
  | "water"
  | "grass"
  | "electric"
  | "psychic"
  | "ice"
  | "dragon"
  | "dark"
  | "fairy";

type Moves = typeof dataSource["moves"];
type MoveKeys = keyof Moves;
type Name = keyof typeof dataSource["pokemon"];
type Forms = "alolan" | "normal" | "galarian";
type TOptimizeArg = {
  [key in keyof Name]: {
    wins: any[];
    losses: any[];
    evs: number[];
  };
};
type TBaseStats = {
  [key: string]: string;
};
type TCalculateStat = (
  iv: number,
  baseStat: number,
  ev: number,
  level: number
) => number;

type TMoveFormatted = {
  name: string;
  power: number;
  type: string;
  category: string | undefined;
};

type TAttack = {
  name: string;
  power: number;
  type: string;
  category: string;
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

type TArgs = {
  name: Name;
  form?: Forms;
  level?: number;
  evs?: number[];
};

export default class Monster {
  private baseStats = [0, 0, 0, 0, 0, 0];
  private ivs = [31, 31, 31, 31, 31, 31];
  evs = [
    new Variable({ currentVal: 0, max: 252 }),
    new Variable({ currentVal: 0, max: 252 }),
    new Variable({ currentVal: 0, max: 252 }),
    new Variable({ currentVal: 0, max: 252 }),
    new Variable({ currentVal: 0, max: 252 }),
    new Variable({ currentVal: 0, max: 252 })
  ];
  lastWinEvs: Variable[] = [];
  statTotals = [0, 0, 0, 0, 0, 0];
  level = 50;
  types: CleanTypes[] = [];
  name: Name = "Abomasnow";
  form: Forms = "normal";
  moveList: MoveKeys[] = [];
  attackList: TAttack[] = [];
  lastBattle: TBattle = {
    category: "",
    defenderName: "",
    defenderHp: 0,
    movePct: 0,
    name: "string",
    totalDmg: 0,
    evs: []
  };
  wins: any[] = [];
  losses: any[] = [];
  stats = {
    hp: this.statTotals[0],
    atk: this.statTotals[1],
    def: this.statTotals[2],
    spa: this.statTotals[3],
    spd: this.statTotals[4],
    speed: this.statTotals[5]
  };

  constructor({ name, form = "normal", level = 50, evs = [] }: TArgs) {
    this.name = name;
    this.form = form;
    this.level = level;
    this.baseEffortValues = evs;
    this.main();
  }

  set baseEffortValues(evs: number[]) {
    if (evs.length === 0) {
      this.effortValues = [
        new Variable({ currentVal: 0, max: 252 }),
        new Variable({ currentVal: 0, max: 252 }),
        new Variable({ currentVal: 0, max: 252 }),
        new Variable({ currentVal: 0, max: 252 }),
        new Variable({ currentVal: 0, max: 252 }),
        new Variable({ currentVal: 0, max: 252 })
      ];
      return;
    }
    this.effortValues = evs.map(
      ev => new Variable({ currentVal: ev, max: 252 })
    );
  }

  set effortValues(evs: Variable[]) {
    const { calculateStatTotals } = this;
    this.evs = [...evs];
    calculateStatTotals();
  }

  private cleanType: (t: MonsterTypes) => CleanTypes = t => {
    const split = t.split("-type");
    const prefix = split[0]
      .trim()
      .toLowerCase()
      .trimStart() as CleanTypes;
    return prefix;
  };

  private getTypes = () => {
    const { form, name, cleanType } = this;
    const types = dataSource.pokemon[name].forms.find(
      f => f.form.toLowerCase() === form.toLowerCase()
    )?.types;
    this.types =
      (types as MonsterTypes[])?.map(cleanType) ?? ([] as MonsterTypes[]);
  };

  private convertForm = (form: "normal" | "alolan" | "galarian") => {
    return {
      normal: "Normal",
      alolan: "Alolan Form",
      galarian: "Galarian Form"
    }[form];
  };

  private getMoves = () => {
    const { name, convertForm: cf, form } = this;
    const baseMoves = dataSource.pokemon[name].moves;
    const allMoves = Object.keys(baseMoves) as MoveKeys[];
    const moves = allMoves.filter(key => baseMoves[key]?.includes(cf(form)));
    this.moveList = moves;
  };

  private getBaseStats = () => {
    const { name, form } = this;
    const stats: TBaseStats =
      dataSource.pokemon[name].baseStats[form] ||
      dataSource.pokemon[name].baseStats["normal"];

    const output = Object.keys(stats).reduce((output, key) => {
      return [...output, Number(stats[key])];
    }, [] as number[]);
    this.baseStats = output;
  };

  private calculateHpTotal: TCalculateStat = (iv, baseStat, ev, level) =>
    Math.floor(((2 * baseStat + iv + ev / 4) * level) / 100 + level + 10);

  private calculateStatTotal: TCalculateStat = (iv, baseStat, ev, level) =>
    Math.floor(((2 * baseStat + iv + ev / 4) * level) / 100 + 5);

  private getStat = (index: number) => {
    const { calculateHpTotal, calculateStatTotal } = this;
    const baseStat = this.baseStats[index] ?? 0;
    const iv = this.ivs[index] ?? 31;
    const ev = this.evs[index].currentVal ?? 0;
    const level = this.level;

    const decisions: Map<boolean, TCalculateStat> = new Map();
    decisions.set(true, calculateHpTotal);
    decisions.set(false, calculateStatTotal);
    const isHp = index === 0;
    return decisions.get(isHp)!(iv, baseStat, ev, level);
  };

  private maxMoveFilter = (maxMoves: boolean, names: MoveKeys[]) => {
    return maxMoves
      ? names
      : names.filter(i => !i.toLowerCase().includes("max"));
  };

  private multiTurnFilter = (multiturn: boolean, names: MoveKeys[]) => {
    return multiturn
      ? names
      : names.filter(i => !multiTurnMoveList.includes(i.toLowerCase()));
  };

  private noDamageFilter = (moveList: TMoveFormatted[]) => {
    return moveList.filter(m => !isNaN(m.power));
  };

  optimizeEVs = (opponentData: TOptimizeArg) => {
    const data = Object.entries(opponentData).filter(
      entry =>
        entry[0].toLowerCase() !== "ditto" &&
        entry[0].toLowerCase() !== "wobbuffet" &&
        entry[0].toLowerCase() !== "wynaut" &&
        entry[0].toLowerCase() !== "pyukumuku" &&
        entry[0].toLowerCase() !== "cosmog" &&
        entry[0].toLowerCase() !== "cosmoem"
    );
    data.forEach((entry: typeof data[0]) => {
      const { 0: name, 1: info } = entry;
      const opponent = new Monster({ name: name as Name, evs: info.evs });
      optimizeMon(this, opponent);
    });

    opponentData[this.name as any] = {
      evs: this.evs.map(ev => ev.currentVal),
      wins: this.wins,
      losses: this.losses
    };

    return opponentData;
  };

  battleOpponent = (opponent: Monster, cse: "best" | "worst") => {
    const results = this.attackList
      .filter(atk => atk !== undefined)
      .map(atk => {
        const result = performDamageCalculation({
          attacker: this,
          defender: opponent,
          move: atk,
          cse
        });
        return result;
      })

      .filter(r => r.category !== undefined)
      .sort((a, b) => (a.movePct > b.movePct ? -1 : 1));
    this.lastBattle = {
      ...results[0]
    } as TBattle;
  };

  calculateStatTotals = () => {
    const { getStat } = this;
    const newTotals = this.statTotals.map((_total, index) => getStat(index));
    this.statTotals = newTotals;
    this.stats = {
      hp: newTotals[0],
      atk: newTotals[1],
      def: newTotals[2],
      spa: newTotals[3],
      spd: newTotals[4],
      speed: newTotals[5]
    };
  };

  getAttacks = (maxMoves: boolean = false, multiTurnMoves: boolean = false) => {
    const { moveList, noDamageFilter, multiTurnFilter, maxMoveFilter } = this;
    let moveIndex = moveList as MoveKeys[];
    moveIndex = maxMoveFilter(maxMoves, moveIndex);
    moveIndex = multiTurnFilter(multiTurnMoves, moveIndex);

    let attacks = moveIndex.map(i => {
      const move = dataSource.moves[i];
      return {
        name: move.moveName,
        power: Number(move.movePower),
        type: move.moveType.trim().toLowerCase(),
        category: move.moveCategory?.trim().toLowerCase()
      };
    });
    attacks = noDamageFilter(attacks);
    attacks = attacks.filter(
      a => a.category !== null && a.category !== undefined
    );
    attacks = attacks.filter(a => a.category !== undefined);
    this.attackList = attacks as TAttack[];
  };

  private main = () => {
    const {
      calculateStatTotals,
      getAttacks,
      getBaseStats,
      getMoves,
      getTypes
    } = this;
    getBaseStats();
    calculateStatTotals();
    getMoves();
    getTypes();
    getAttacks();
  };
}
