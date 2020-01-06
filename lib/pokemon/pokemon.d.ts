import dataSource from "../data/output.json";
import Variable from "../solver/variable/variable";
export declare type MonsterTypes = "Normal-Type" | "Fire-Type" | "Fighting-Type" | "Water-Type" | "Flying-Type" | "Grass-Type" | "Poison-Type" | "Electric-Type" | "Ground-Type" | "Psychic-Type" | "Rock-Type" | "Ice-Type" | "Bug-Type" | "Dragon-Type" | "Ghost-Type" | "Dark-Type" | "Steel-Type" | "Fairy-Type";
export declare type CleanTypes = "normal" | "fighting" | "flying" | "poison" | "ground" | "rock" | "bug" | "ghost" | "steel" | "fire" | "water" | "grass" | "electric" | "psychic" | "ice" | "dragon" | "dark" | "fairy";
declare type Moves = typeof dataSource["moves"];
declare type MoveKeys = keyof Moves;
declare type Name = keyof typeof dataSource["pokemon"];
declare type Forms = "alolan" | "normal" | "galarian";
declare type TOptimizeArg = {
    [key in keyof Name]: {
        wins: any[];
        losses: any[];
        evs: number[];
    };
};
declare type TAttack = {
    name: string;
    power: number;
    type: string;
    category: string;
};
declare type TBattle = {
    category: string;
    defenderName: string;
    defenderHp: number;
    movePct: number;
    name: string;
    totalDmg: number;
    evs: number[];
};
declare type TArgs = {
    name: Name;
    form?: Forms;
    level?: number;
    evs?: number[];
};
export default class Monster {
    private baseStats;
    private ivs;
    evs: Variable[];
    lastWinEvs: Variable[];
    statTotals: number[];
    level: number;
    types: CleanTypes[];
    name: Name;
    form: Forms;
    moveList: MoveKeys[];
    attackList: TAttack[];
    lastBattle: TBattle;
    wins: any[];
    losses: any[];
    stats: {
        hp: number;
        atk: number;
        def: number;
        spa: number;
        spd: number;
        speed: number;
    };
    constructor({ name, form, level, evs }: TArgs);
    set baseEffortValues(evs: number[]);
    set effortValues(evs: Variable[]);
    private cleanType;
    private getTypes;
    private convertForm;
    private getMoves;
    private getBaseStats;
    private calculateHpTotal;
    private calculateStatTotal;
    private getStat;
    private maxMoveFilter;
    private multiTurnFilter;
    private noDamageFilter;
    optimizeEVs: (opponentData: TOptimizeArg) => TOptimizeArg;
    battleOpponent: (opponent: Monster, cse: "best" | "worst") => void;
    calculateStatTotals: () => void;
    getAttacks: (maxMoves?: boolean, multiTurnMoves?: boolean) => void;
    private main;
}
export {};
//# sourceMappingURL=pokemon.d.ts.map