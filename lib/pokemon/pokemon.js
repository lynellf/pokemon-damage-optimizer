"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pokedex_json_1 = __importDefault(require("../data/pokedex.json"));
const output_json_1 = __importDefault(require("../data/output.json"));
const variable_1 = __importDefault(require("../solver/variable/variable"));
const itemCalcs_1 = __importDefault(require("./itemCalcs"));
const natures_1 = require("./natures");
const multiTurnMoveList = [
    "blast burn",
    "bounce",
    "dig",
    "dive",
    "eternabeam",
    "fly",
    "freeze shock",
    "frenzy plant",
    "geomancy",
    "giga impact",
    "hydro cannon",
    "hyper beam",
    "ice burn",
    "meteor assault",
    "phantom force",
    "prismatic laser",
    "razor wind",
    "roar of time",
    "rock wrecker",
    "shadow force",
    "shadow half",
    "skull bash",
    "sky attack",
    "sky drop",
    "solar beam",
    "solar blade"
];
class Monster {
    constructor({ name, level = 50, evs = [], nature = "Hardy", item = "Lum Berry" }) {
        this.baseStats = [0, 0, 0, 0, 0, 0];
        this.ivs = [31, 31, 31, 31, 31, 31];
        this.evs = [
            new variable_1.default({ currentVal: 0, max: 252 }),
            new variable_1.default({ currentVal: 0, max: 252 }),
            new variable_1.default({ currentVal: 0, max: 252 }),
            new variable_1.default({ currentVal: 0, max: 252 }),
            new variable_1.default({ currentVal: 0, max: 252 }),
            new variable_1.default({ currentVal: 0, max: 252 })
        ];
        this.lastWinEvs = [];
        this.statTotals = [0, 0, 0, 0, 0, 0];
        this.level = 50;
        this.item = "Lum Berry";
        this.types = [];
        this.name = "Abomasnow";
        this.form = "normal";
        this.moveList = [];
        this.attackList = [];
        this.lastBattle = {
            category: "",
            defenderName: "",
            defenderHp: 0,
            movePct: 0,
            name: "string",
            totalDmg: 0,
            evs: []
        };
        this.nature = "Hardy";
        this.wins = [];
        this.losses = [];
        this.stats = {
            hp: this.statTotals[0],
            atk: this.statTotals[1],
            def: this.statTotals[2],
            spa: this.statTotals[3],
            spd: this.statTotals[4],
            speed: this.statTotals[5]
        };
        this.getTypes = () => {
            const { name } = this;
            const queryResult = pokedex_json_1.default[name];
            const typeOne = queryResult.t1;
            const typeTwo = queryResult.t2;
            const types = [typeOne, typeTwo].filter(t => typeof t === "string");
            this.types = types;
        };
        this.getMoves = () => {
            const keys = pokedex_json_1.default[this.name].moves;
            const moveList = output_json_1.default.moves;
            const moves = keys.map(m => moveList[m]);
            return moves;
        };
        this.getBaseStats = () => {
            const { bs: { hp, at: atk, df: def, sa: spa, sd: spd, sp: speed } } = pokedex_json_1.default[this.name];
            this.baseStats = [hp, atk, def, spa, spd, speed];
        };
        this.maxMoveFilter = (maxMoves, names) => {
            return maxMoves
                ? names
                : names.filter(i => !i.toLowerCase().includes("max"));
        };
        this.multiTurnFilter = (multiturn, names) => {
            return multiturn
                ? names
                : names.filter(i => !multiTurnMoveList.includes(i.toLowerCase()));
        };
        this.noDamageFilter = (moveList) => {
            return moveList.filter(m => !isNaN(m.power));
        };
        this.calculateStatTotals = () => {
            const { applyItem } = this;
            const evs = this.evs;
            const ivs = this.ivs;
            const level = this.level;
            const nature = this.nature;
            const baseStats = this.baseStats;
            const newTotals = natures_1.getStatTotals({
                baseStats,
                level,
                evs,
                ivs,
                nature
            });
            const actualTotals = applyItem(newTotals);
            this.statTotals = actualTotals;
            this.stats = {
                hp: actualTotals[0],
                atk: actualTotals[1],
                def: actualTotals[2],
                spa: actualTotals[3],
                spd: actualTotals[4],
                speed: actualTotals[5]
            };
        };
        this.getMove = (i) => {
            var _a;
            const move = output_json_1.default.moves[i];
            return {
                name: move.moveName,
                power: Number(move.movePower),
                type: move.moveType.trim().toLowerCase(),
                category: (_a = move.moveCategory) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase()
            };
        };
        this.getAttacks = (maxMoves = false, multiTurnMoves = false) => {
            const { moveList, noDamageFilter, multiTurnFilter, maxMoveFilter, getMove } = this;
            let moveIndex = moveList;
            moveIndex = maxMoveFilter(maxMoves, moveIndex);
            moveIndex = multiTurnFilter(multiTurnMoves, moveIndex);
            let attacks = moveIndex.map(getMove);
            attacks = noDamageFilter(attacks);
            attacks = attacks.filter(a => a.category !== null && a.category !== undefined);
            attacks = attacks.filter(a => a.category !== undefined);
            this.attackList = attacks;
        };
        this.applyItem = (statTotals) => {
            const item = this.item;
            const name = this.name;
            const table = itemCalcs_1.default;
            const func = table.get(item);
            if (func) {
                return func({ statTotals, name });
            }
            return statTotals;
        };
        this.main = () => {
            const { calculateStatTotals, getAttacks, getBaseStats, getMoves, getTypes } = this;
            getBaseStats();
            calculateStatTotals();
            getMoves();
            getTypes();
            getAttacks();
        };
        this.item = item;
        this.nature = nature;
        this.name = name;
        this.level = level;
        this.baseEffortValues = evs;
        const keys = pokedex_json_1.default[this.name].moves;
        this.moveList = keys;
        this.main();
    }
    set baseEffortValues(evs) {
        const { numberToVariable, getNewEVs } = this;
        const hasEvs = evs.length === 6;
        this.effortValues = hasEvs ? evs.map(numberToVariable) : getNewEVs();
    }
    set setItem(item) {
        const { calculateStatTotals } = this;
        this.item = item;
        calculateStatTotals();
    }
    set setNature(nature) {
        const { calculateStatTotals } = this;
        this.nature = nature;
        calculateStatTotals();
    }
    set effortValues(evs) {
        const { calculateStatTotals } = this;
        this.evs = [...evs];
        calculateStatTotals();
    }
    getNewEVs() {
        return [
            new variable_1.default({ currentVal: 0, max: 252 }),
            new variable_1.default({ currentVal: 0, max: 252 }),
            new variable_1.default({ currentVal: 0, max: 252 }),
            new variable_1.default({ currentVal: 0, max: 252 }),
            new variable_1.default({ currentVal: 0, max: 252 }),
            new variable_1.default({ currentVal: 0, max: 252 })
        ];
    }
    numberToVariable(ev) {
        return new variable_1.default({ currentVal: ev, max: 252 });
    }
}
exports.default = Monster;
//# sourceMappingURL=pokemon.js.map