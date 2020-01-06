"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Solver {
    constructor({ constraints, maxAttempts = 500, objective, type = "min", variables }) {
        this.constraints = [];
        this.currentOutput = 0;
        this.successVars = [];
        this.type = "min";
        this.variables = [];
        this.solve = () => {
            const { maxAttempts, objective, type, variables } = this;
            let metObjective = false;
            let currentAttempts = 0;
            while (currentAttempts < maxAttempts) {
                variables.forEach(v => v.next());
                let test = this.constraints.reduce((output, con) => {
                    return output && con(...this.variables);
                }, true);
                let output = objective(...variables);
                if (type === "min" && test && output <= this.currentOutput) {
                    this.currentOutput = output;
                    metObjective = true;
                    this.successVars = variables.map(v => v.currentVal);
                }
                if (type === "max" && test && output >= this.currentOutput) {
                    this.currentOutput = output;
                    metObjective = true;
                    this.successVars = variables.map(v => v.currentVal);
                }
                currentAttempts += 1;
            }
            return {
                type: this.type,
                solution: this.currentOutput,
                metObjective,
                variables: this.successVars
            };
        };
        this.variables = variables;
        this.objective = objective;
        this.constraints = constraints;
        this.maxAttempts = maxAttempts;
        this.type = type;
        this.currentOutput = type === "min" ? 1000000 : -1;
    }
}
exports.default = Solver;
//# sourceMappingURL=solver.js.map