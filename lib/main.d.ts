import Monster from "./pokemon/pokemon";
declare type TBST = {
    baseHP: string;
    baseAtk: string;
    baseDef: string;
    baseSpa: string;
    baseSpd: string;
    baseSpeed: string;
};
declare type TBaseStats = {
    normal: TBST;
    alolan: TBST | null;
    galarian: TBST | null;
};
export declare type TMove = {
    moveName: string;
    moveAccuracy: string;
    moveEffectPct: string;
    movePower: string;
    movePowerPoints: string;
    moveType: string;
};
declare type TMoveFormatted = {
    name: string;
    power: number;
    type: string;
    category: string | undefined;
};
export declare type TPokemon = {
    abilities: string[];
    baseStats: TBaseStats;
    dexNumber: string;
    forms: {
        form: string;
        types: string[];
    }[];
    moves: {
        [key: string]: string[];
    };
    name: string;
};
export declare type TOutput = {
    pokemon: {
        [key: string]: TPokemon;
    };
    moves: {
        [key: string]: TMove;
    };
    abilities: string[];
    _tempMoves?: {
        [key: string]: string[];
    };
};
declare type OptimizePower = {
    stat: "atk" | "spa";
    move: TMoveFormatted;
    query: Monster;
    opponent: Monster;
};
export declare function optimizePwr({ stat, move, query, opponent }: OptimizePower): boolean;
export declare function optimizeMon(query: Monster, opponent: Monster): void;
export declare function Main(monsters?: Monster[]): any;
export {};
//# sourceMappingURL=main.d.ts.map