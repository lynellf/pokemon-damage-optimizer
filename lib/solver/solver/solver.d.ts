import Variable from "../variable/variable";
declare type TSolverModel = {
    constraints: ((...args: Variable[]) => boolean)[];
    maxAttempts?: number;
    objective: (...variables: Variable[]) => number;
    type: "min" | "max";
    variables: Variable[];
};
export default class Solver {
    constraints: ((...args: Variable[]) => boolean)[];
    currentOutput: number;
    maxAttempts: number;
    objective: (...variables: Variable[]) => number;
    successVars: number[];
    type: "min" | "max";
    variables: Variable[];
    constructor({ constraints, maxAttempts, objective, type, variables }: TSolverModel);
    solve: () => {
        type: "max" | "min";
        solution: number;
        metObjective: boolean;
        variables: number[];
    };
}
export {};
