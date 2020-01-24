import Variable from "../solver/variable/variable";
import { TNatures } from "./pokemon";
declare type TGetStatTotals = {
    baseStats: number[];
    level: number;
    evs: Variable[];
    ivs: number[];
    nature: TNatures;
};
export declare function getStatTotals({ baseStats, level, evs, ivs, nature }: TGetStatTotals): number[];
export {};
//# sourceMappingURL=natures.d.ts.map