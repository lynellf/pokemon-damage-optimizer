import pokedex from "../data/pokedex.json";
import dataSource from "../data/output.json";
import Variable from "../solver/variable/variable";
import items from "../data/vgcItems";
import calculateItems from "./itemCalcs";
import { getStatTotals } from "./natures";

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
  item: TItem = "Lum Berry";
  types: string[] = [];
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
  nature: TNatures = "Hardy";
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

  constructor({
    name,
    level = 50,
    evs = [],
    nature = "Hardy",
    item = "Lum Berry"
  }: TArgs) {
    this.item = item;
    this.nature = nature;
    this.name = name;
    this.level = level;
    this.baseEffortValues = evs;
    const keys = pokedex[this.name].moves as MoveKeys[];
    this.moveList = keys
    this.main();
  }

  set baseEffortValues(evs: number[]) {
    const { numberToVariable, getNewEVs } = this;
    const hasEvs = evs.length === 6;
    this.effortValues = hasEvs ? evs.map(numberToVariable) : getNewEVs();
  }

  set setItem(item: TItem) {
    const { calculateStatTotals } = this;
    this.item = item;
    calculateStatTotals();
  }

  set setNature(nature: TNatures) {
    const { calculateStatTotals } = this;
    this.nature = nature;
    calculateStatTotals();
  }

  set effortValues(evs: Variable[]) {
    const { calculateStatTotals } = this;
    this.evs = [...evs];
    calculateStatTotals();
  }

  private getNewEVs() {
    return [
      new Variable({ currentVal: 0, max: 252 }),
      new Variable({ currentVal: 0, max: 252 }),
      new Variable({ currentVal: 0, max: 252 }),
      new Variable({ currentVal: 0, max: 252 }),
      new Variable({ currentVal: 0, max: 252 }),
      new Variable({ currentVal: 0, max: 252 })
    ];
  }

  private numberToVariable(ev: number) {
    return new Variable({ currentVal: ev, max: 252 });
  }

  private getTypes = () => {
    const { name } = this;
    const queryResult = pokedex[name];
    const typeOne = queryResult.t1;
    const typeTwo = queryResult.t2;
    const types = [typeOne, typeTwo].filter(
      t => typeof t === "string"
    ) as string[];
    this.types = types;
  };

  private getMoves = () => {
    const keys = pokedex[this.name].moves as MoveKeys[];
    const moveList = dataSource.moves;
    const moves = keys.map(m => moveList[m]);
    return moves;
  };

  private getBaseStats = () => {
    const {
      bs: { hp, at: atk, df: def, sa: spa, sd: spd, sp: speed }
    } = pokedex[this.name];
    this.baseStats = [hp, atk, def, spa, spd, speed];
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

  calculateStatTotals = () => {
    const { applyItem } = this;
    const evs = this.evs;
    const ivs = this.ivs;
    const level = this.level;
    const nature = this.nature;
    const baseStats = this.baseStats;
    const newTotals = getStatTotals({
      baseStats,
      level,
      evs,
      ivs,
      nature
    });
    const actualTotals = applyItem(newTotals)!;
    this.statTotals = actualTotals;
    this.stats = {
      hp: actualTotals[0],
      atk: actualTotals[1],
      def: actualTotals[2],
      spa: actualTotals[3],
      spd: actualTotals[4],
      speed: actualTotals[5]
    };
  };

  getMove = (i: keyof typeof dataSource["moves"]) => {
    const move = dataSource.moves[i];
    return {
      name: move.moveName,
      power: Number(move.movePower),
      type: move.moveType.trim().toLowerCase(),
      category: move.moveCategory?.trim().toLowerCase()
    };
  };

  getAttacks = (maxMoves: boolean = false, multiTurnMoves: boolean = false) => {
    const {
      moveList,
      noDamageFilter,
      multiTurnFilter,
      maxMoveFilter,
      getMove
    } = this;
    let moveIndex = moveList as MoveKeys[];
    moveIndex = maxMoveFilter(maxMoves, moveIndex);
    moveIndex = multiTurnFilter(multiTurnMoves, moveIndex);

    let attacks = moveIndex.map(getMove);
    attacks = noDamageFilter(attacks);
    attacks = attacks.filter(
      a => a.category !== null && a.category !== undefined
    );
    attacks = attacks.filter(a => a.category !== undefined);
    this.attackList = attacks as TAttack[];
  };

  applyItem = (statTotals: number[]) => {
    const item = this.item;
    const name = this.name;
    const table = calculateItems;
    const func = table.get(item);
    if (func) {
      return func({ statTotals, name });
    }
    return statTotals;
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

export type TNatures =
  | "Hardy"
  | "Docile"
  | "Serious"
  | "Bashful"
  | "Quirky"
  | "Lonely"
  | "Brave"
  | "Adamant"
  | "Naughty"
  | "Bold"
  | "Relaxed"
  | "Impish"
  | "Lax"
  | "Timid"
  | "Hasty"
  | "Jolly"
  | "Naive"
  | "Modest"
  | "Mild"
  | "Quiet"
  | "Rash"
  | "Calm"
  | "Gentle"
  | "Sassy"
  | "Careful";

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
type Name = keyof typeof pokedex;
type Forms = "alolan" | "normal" | "galarian";

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
  nature?: TNatures;
  name: Name;
  form?: Forms;
  level?: number;
  evs?: number[];
  item?: TItem;
};

type TInfer<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<
  infer ElementType
>
  ? ElementType
  : never;

export type TItem = TInfer<typeof items>;
