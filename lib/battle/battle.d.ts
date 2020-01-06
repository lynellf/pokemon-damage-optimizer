import dataSource from "../data/output.json";
import Monster from "../pokemon/pokemon";
declare type MonsterKeys = keyof typeof dataSource["pokemon"];
declare type TMoveFormatted = {
    name: string;
    power: number;
    type: string;
    category: string | undefined;
};
declare type TGetAttacks = {
    mon: MonsterKeys;
    maxMoves?: boolean;
    multiTurnMoves?: boolean;
};
export declare function getAttacks({ mon, maxMoves, multiTurnMoves }: TGetAttacks): {
    name: string;
    power: number;
    type: string;
    category: string | undefined;
}[];
declare type TDamageCalc = {
    move: TMoveFormatted;
    attacker: Monster;
    defender: Monster;
    cse: "best" | "worst";
};
export declare function performDamageCalculation({ attacker, defender, move, cse }: TDamageCalc): {
    category: string | undefined;
    defenderName: string;
    defenderHp: number;
    movePct: number;
    name: string;
    totalDmg: number;
};
export {};
//# sourceMappingURL=battle.d.ts.map