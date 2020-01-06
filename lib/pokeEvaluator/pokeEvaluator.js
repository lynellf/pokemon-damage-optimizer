"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const variable_1 = __importDefault(require("../solver/variable/variable"));
const solver_1 = __importDefault(require("../solver/solver/solver"));
function calcTotals(key, monster) {
    const { calculateStatTotals, stats } = monster;
    calculateStatTotals();
    return stats[key];
}
const evConstraint = (hp, atk, def, spa, spd, speed) => {
    return (hp.currentVal +
        atk.currentVal +
        def.currentVal +
        spa.currentVal +
        spd.currentVal +
        speed.currentVal ===
        510);
};
const statToIndex = (stat) => {
    return {
        hp: 0,
        atk: 1,
        def: 2,
        spa: 3,
        spd: 4,
        speed: 5
    }[stat];
};
const numbersToEVs = (evs) => {
    return evs.map(ev => new variable_1.default({ currentVal: ev, max: 252 }));
};
const setEVs = (evs, monster) => {
    // console.log(evs.map(ev => ev.currentVal));
    monster.effortValues = [...evs];
};
const setWinEVs = (evs, monster) => {
    // console.log(evs.map(ev => ev.currentVal));
    monster.effortValues = [...evs];
    monster.lastBattle.evs = evs.map(ev => ev.currentVal);
};
// const setNewEVs = ({ newEvs, evs, monster, stat }: TSetValues) => {
//   const index = statToIndex(stat);
//   monster.lastWinEvs = [...evs];
//   monster.lastWinEvs[index] = newEvs[index];
//   monster.lastBattle.evs = monster.lastWinEvs.map(ev => ev.currentVal);
// };
// const sumEvs = (
//   evs: Variable[],
//   exclude: 0 | 1 | 2 | 3 | 4 | 5,
//   newVal: number
// ) => {
//   const output = evs.reduce((o, val, index) => {
//     if (index !== exclude) {
//       return o + val.currentVal;
//     }
//     return o + newVal;
//   }, 0);
//   return output;
// };
function optimizer({ baseMonster, query, cons }) {
    const maximizeHp = (..._evs) => calcTotals("hp", baseMonster);
    const maximizeAtk = (..._evs) => calcTotals("atk", baseMonster);
    const maximizeDef = (..._evs) => calcTotals("def", baseMonster);
    const maximizeSpa = (..._evs) => calcTotals("spa", baseMonster);
    const maximizeSpd = (..._evs) => calcTotals("spd", baseMonster);
    const maximizeSpeed = (..._evs) => calcTotals("speed", baseMonster);
    const variables = baseMonster.evs;
    const previousEVs = baseMonster.evs.map(_ev => new variable_1.default({ currentVal: 0, max: 252 }));
    const startingHpConstraint = hp => {
        return hp.currentVal >= previousEVs[0].currentVal;
    };
    const startingAtkConstraint = (_hp, atk) => {
        return atk.currentVal >= previousEVs[1].currentVal;
    };
    const startingDefConstraint = (_hp, _atk, def) => {
        return def.currentVal >= previousEVs[2].currentVal;
    };
    const startingSpaConstraint = (_hp, _atk, _def, spa) => {
        return spa.currentVal >= previousEVs[3].currentVal;
    };
    const startingSpdConstraint = (_hp, _atk, _def, _spa, spd) => {
        return spd.currentVal >= previousEVs[4].currentVal;
    };
    const startingSpeedConstraint = (_hp, _atk, _def, _spa, _spd, speed) => {
        return speed.currentVal >= previousEVs[5].currentVal;
    };
    const objectives = {
        atk: maximizeAtk,
        def: maximizeDef,
        hp: maximizeHp,
        spa: maximizeSpa,
        spd: maximizeSpd,
        speed: maximizeSpeed
    };
    const objective = objectives[query];
    const constraints = [
        evConstraint,
        startingHpConstraint,
        startingAtkConstraint,
        startingDefConstraint,
        startingSpaConstraint,
        startingSpdConstraint,
        startingSpeedConstraint,
        ...cons
    ];
    const model = {
        type: "max",
        maxAttempts: 2000,
        objective,
        constraints,
        variables
    };
    const solver = new solver_1.default(model);
    const { solution, metObjective: isFeasible, variables: solutionVars } = solver.solve();
    const newEVs = numbersToEVs(solutionVars);
    const decisions = new Map();
    decisions.set(true, () => setWinEVs(newEVs, baseMonster));
    decisions.set(false, () => setEVs(previousEVs, baseMonster));
    decisions.get(isFeasible)();
    return isFeasible;
}
exports.optimizer = optimizer;
//# sourceMappingURL=pokeEvaluator.js.map