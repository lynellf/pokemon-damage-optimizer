/**
 * EV Optimizer
 * 1. Determine objective function based on match-up
 *   a. Am I faster than my opponent?
 *   b. Can I withstand multiple attacks from my opponent?
 *   c. Can I defeat my opponent within x turns?
 * 2. If the answer is yes, pass.
 * 3. If the answer is no, solve to make the answer a yes.
 * 4. If I fail, pass.
 * 5. Resulting EV values are starting values for next evaluation.
 */
import Variable from "../solver/variable/variable";
import Monster from "../pokemon/pokemon";
declare type TStatOptions = "hp" | "atk" | "def" | "spa" | "spd" | "speed";
declare type TConstraint = (...args: Variable[]) => boolean;
declare type TOptParams = {
    baseMonster: Monster;
    query: TStatOptions;
    cons: TConstraint[];
};
export declare function optimizer({ baseMonster, query, cons }: TOptParams): boolean;
export {};
//# sourceMappingURL=pokeEvaluator.d.ts.map