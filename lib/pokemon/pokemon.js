"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const output_json_1 = __importDefault(require("../data/output.json"));
const variable_1 = __importDefault(require("../solver/variable/variable"));
const battle_1 = require("../battle/battle");
const main_1 = require("../main");
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
    constructor({ name, form = "normal", level = 50, evs = [] }) {
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
        this.cleanType = t => {
            const split = t.split("-type");
            const prefix = split[0]
                .trim()
                .toLowerCase()
                .trimStart();
            return prefix;
        };
        this.getTypes = () => {
            var _a, _b, _c;
            const { form, name, cleanType } = this;
            const types = (_a = output_json_1.default.pokemon[name].forms.find(f => f.form.toLowerCase() === form.toLowerCase())) === null || _a === void 0 ? void 0 : _a.types;
            this.types = (_c = (_b = types) === null || _b === void 0 ? void 0 : _b.map(cleanType), (_c !== null && _c !== void 0 ? _c : []));
        };
        this.convertForm = (form) => {
            return {
                normal: "Normal",
                alolan: "Alolan Form",
                galarian: "Galarian Form"
            }[form];
        };
        this.getMoves = () => {
            const { name, convertForm: cf, form } = this;
            const baseMoves = output_json_1.default.pokemon[name].moves;
            const allMoves = Object.keys(baseMoves);
            const moves = allMoves.filter(key => { var _a; return (_a = baseMoves[key]) === null || _a === void 0 ? void 0 : _a.includes(cf(form)); });
            this.moveList = moves;
        };
        this.getBaseStats = () => {
            const { name, form } = this;
            const stats = output_json_1.default.pokemon[name].baseStats[form] ||
                output_json_1.default.pokemon[name].baseStats["normal"];
            const output = Object.keys(stats).reduce((output, key) => {
                return [...output, Number(stats[key])];
            }, []);
            this.baseStats = output;
        };
        this.calculateHpTotal = (iv, baseStat, ev, level) => Math.floor(((2 * baseStat + iv + ev / 4) * level) / 100 + level + 10);
        this.calculateStatTotal = (iv, baseStat, ev, level) => Math.floor(((2 * baseStat + iv + ev / 4) * level) / 100 + 5);
        this.getStat = (index) => {
            var _a, _b, _c;
            const { calculateHpTotal, calculateStatTotal } = this;
            const baseStat = (_a = this.baseStats[index], (_a !== null && _a !== void 0 ? _a : 0));
            const iv = (_b = this.ivs[index], (_b !== null && _b !== void 0 ? _b : 31));
            const ev = (_c = this.evs[index].currentVal, (_c !== null && _c !== void 0 ? _c : 0));
            const level = this.level;
            const decisions = new Map();
            decisions.set(true, calculateHpTotal);
            decisions.set(false, calculateStatTotal);
            const isHp = index === 0;
            return decisions.get(isHp)(iv, baseStat, ev, level);
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
        this.optimizeEVs = (opponentData) => {
            const data = Object.entries(opponentData).filter(entry => entry[0].toLowerCase() !== "ditto" &&
                entry[0].toLowerCase() !== "wobbuffet" &&
                entry[0].toLowerCase() !== "wynaut" &&
                entry[0].toLowerCase() !== "pyukumuku" &&
                entry[0].toLowerCase() !== "cosmog" &&
                entry[0].toLowerCase() !== "cosmoem");
            data.forEach((entry) => {
                const { 0: name, 1: info } = entry;
                const opponent = new Monster({ name: name, evs: info.evs });
                main_1.optimizeMon(this, opponent);
            });
            opponentData[this.name] = {
                evs: this.evs.map(ev => ev.currentVal),
                wins: this.wins,
                losses: this.losses
            };
            return opponentData;
        };
        this.battleOpponent = (opponent, cse) => {
            const results = this.attackList
                .filter(atk => atk !== undefined)
                .map(atk => {
                const result = battle_1.performDamageCalculation({
                    attacker: this,
                    defender: opponent,
                    move: atk,
                    cse
                });
                return result;
            })
                .filter(r => r.category !== undefined)
                .sort((a, b) => (a.movePct > b.movePct ? -1 : 1));
            this.lastBattle = Object.assign({}, results[0]);
        };
        this.calculateStatTotals = () => {
            const { getStat } = this;
            const newTotals = this.statTotals.map((_total, index) => getStat(index));
            this.statTotals = newTotals;
            this.stats = {
                hp: newTotals[0],
                atk: newTotals[1],
                def: newTotals[2],
                spa: newTotals[3],
                spd: newTotals[4],
                speed: newTotals[5]
            };
        };
        this.getAttacks = (maxMoves = false, multiTurnMoves = false) => {
            const { moveList, noDamageFilter, multiTurnFilter, maxMoveFilter } = this;
            let moveIndex = moveList;
            moveIndex = maxMoveFilter(maxMoves, moveIndex);
            moveIndex = multiTurnFilter(multiTurnMoves, moveIndex);
            let attacks = moveIndex.map(i => {
                var _a;
                const move = output_json_1.default.moves[i];
                return {
                    name: move.moveName,
                    power: Number(move.movePower),
                    type: move.moveType.trim().toLowerCase(),
                    category: (_a = move.moveCategory) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase()
                };
            });
            attacks = noDamageFilter(attacks);
            attacks = attacks.filter(a => a.category !== null && a.category !== undefined);
            attacks = attacks.filter(a => a.category !== undefined);
            this.attackList = attacks;
        };
        this.main = () => {
            const { calculateStatTotals, getAttacks, getBaseStats, getMoves, getTypes } = this;
            getBaseStats();
            calculateStatTotals();
            getMoves();
            getTypes();
            getAttacks();
        };
        this.name = name;
        this.form = form;
        this.level = level;
        this.baseEffortValues = evs;
        this.main();
    }
    set baseEffortValues(evs) {
        if (evs.length === 0) {
            this.effortValues = [
                new variable_1.default({ currentVal: 0, max: 252 }),
                new variable_1.default({ currentVal: 0, max: 252 }),
                new variable_1.default({ currentVal: 0, max: 252 }),
                new variable_1.default({ currentVal: 0, max: 252 }),
                new variable_1.default({ currentVal: 0, max: 252 }),
                new variable_1.default({ currentVal: 0, max: 252 })
            ];
            return;
        }
        this.effortValues = evs.map(ev => new variable_1.default({ currentVal: ev, max: 252 }));
    }
    set effortValues(evs) {
        const { calculateStatTotals } = this;
        this.evs = [...evs];
        calculateStatTotals();
    }
}
exports.default = Monster;
//# sourceMappingURL=pokemon.js.map