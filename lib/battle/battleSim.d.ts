import Monster, { CleanTypes } from "../pokemon/pokemon";
export declare type TWeather = "sunlight" | "rain" | "sandstorm" | "hail" | "none";
export declare type TTerrain = "electric" | "grassy" | "misty" | "psychic" | "none";
declare type TBattleArgs = {
    monsters: [Monster, Monster];
    weather: TWeather;
    terrain: TTerrain;
};
export default class Battle {
    monsters: Monster[];
    weather: string;
    terrain: string;
    monAHP: number;
    monBHP: number;
    constructor({ monsters, weather, terrain }: TBattleArgs);
    turn: () => void;
    main: () => void;
}
export declare function getImmunities(mon: Monster): CleanTypes[];
export declare function getWeaknesses(mon: Monster): CleanTypes[];
export declare function getResistances(mon: Monster): CleanTypes[];
export declare function getEffectiveAtks({ mon, oppWeaknesses, oppImmunities, oppResistances }: {
    mon: Monster;
    oppWeaknesses: CleanTypes[];
    oppImmunities: CleanTypes[];
    oppResistances: CleanTypes[];
}): {
    name: string;
    power: number;
    type: string;
    category: string;
}[];
export {};
//# sourceMappingURL=battleSim.d.ts.map