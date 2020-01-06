"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * EV Optimizer
 * 1. Determine objective function based on match-up
 *   a. Am I faster than my opponent?
 *   b. Can I withstand multiple attacks from my opponent?
 *   c. Can I defeat my opponent within 2 turns?
 * 2. If the answer is yes, pass.
 * 3. If the answer is no, solve to make the answer a yes.
 * 4. If I fail, pass.
 * 5. Resulting EV values are starting values for next evaluation.
 */
const output_json_1 = __importDefault(require("./data/output.json"));
const battle_1 = require("./battle/battle");
const pokemon_1 = __importDefault(require("./pokemon/pokemon"));
const pokeEvaluator_1 = require("./pokeEvaluator/pokeEvaluator");
const compare = (a, b) => (a.movePct > b.movePct ? -1 : 1);
function getMonsterList() {
    const { pokemon: rawData } = output_json_1.default;
    const pokemonNames = Object.keys(rawData);
    return pokemonNames
        .map(n => new pokemon_1.default({ name: n }))
        .filter(m => m.attackList.length !== 0);
}
function optimizePwr({ stat, move, query, opponent }) {
    const powerConst = (...evs) => {
        query.effortValues = [...evs];
        const output = battle_1.performDamageCalculation({
            attacker: query,
            defender: opponent,
            move,
            cse: "worst"
        });
        const didWin = output.movePct >= 0.5;
        return didWin;
    };
    const output = pokeEvaluator_1.optimizer({
        baseMonster: query,
        query: stat,
        cons: [powerConst]
    });
    return output;
}
exports.optimizePwr = optimizePwr;
function optimizeDef({ stat, move, query, opponent }) {
    const defConst = (...evs) => {
        query.effortValues = [...evs];
        const output = battle_1.performDamageCalculation({
            attacker: opponent,
            defender: query,
            move,
            cse: "best"
        });
        return output.movePct < 0.5;
    };
    return pokeEvaluator_1.optimizer({
        baseMonster: query,
        query: stat,
        cons: [defConst]
    });
}
function optimizeSpeed(query, opponent) {
    const speedConst = (...evs) => {
        query.effortValues = [...evs];
        const output = query.stats.speed > opponent.stats.speed;
        return output;
    };
    return pokeEvaluator_1.optimizer({
        baseMonster: query,
        query: "speed",
        cons: [speedConst]
    });
}
function optimizeMon(query, opponent) {
    query.battleOpponent(opponent, "worst");
    opponent.battleOpponent(query, "best");
    const attackResults = query.lastBattle;
    const defResults = opponent.lastBattle;
    const isValid = attackResults !== undefined && defResults !== undefined;
    if (isValid) {
        const isFaster = query.stats.speed > opponent.stats.speed
            ? true
            : optimizeSpeed(query, opponent);
        const canOHKO = attackResults.movePct >= 1;
        const canKo = attackResults.movePct >= 0.5
            ? true
            : optimizePwr({
                stat: attackResults.category === "physical move" ? "atk" : "spa",
                move: query.attackList.find(m => m.name === attackResults.name),
                opponent,
                query
            });
        const canOutlast = defResults.movePct < 0.5
            ? true
            : optimizeDef({
                query,
                opponent,
                stat: defResults.category === "physical move" ? "def" : "spd",
                move: opponent.attackList.find(m => m.name === defResults.name)
            });
        const canSweep = isFaster && canOHKO;
        const canOutPace = isFaster && canOutlast && canKo;
        const canBully = canOutlast && canKo;
        const canWin = canSweep || canBully || canOutPace;
        if (canWin) {
            query.lastWinEvs = [...query.evs];
            query.wins.push({
                opponent: opponent.name,
                move: attackResults,
                evs: query.evs.map(ev => ev.currentVal)
            });
        }
        else {
            query.losses.push({
                opponent: opponent.name,
                move: defResults,
                evs: query.evs.map(ev => ev.currentVal)
            });
        }
    }
    else {
        console.error("Undefined battle result data");
    }
}
exports.optimizeMon = optimizeMon;
function Main(monsters = getMonsterList()) {
    let canContinue = true;
    let index = 0;
    const results = monsters.reduce((o, m) => {
        o[m.name] = m.lastBattle;
        return o;
    }, {});
    const limit = monsters.length;
    while (canContinue && index < limit) {
        const query = monsters[index];
        const equalState = JSON.stringify(query.lastBattle) === JSON.stringify(results[query.name]);
        if (!equalState || index === 0) {
            const opponents = monsters.filter(m => m.name !== query.name);
            opponents.forEach(o => {
                const opponent = o;
                optimizeMon(query, opponent);
                results[query.name] = {
                    wins: query.wins,
                    losses: query.losses
                };
            });
            index += 1;
        }
    }
    return results;
}
exports.Main = Main;
//# sourceMappingURL=main.js.map