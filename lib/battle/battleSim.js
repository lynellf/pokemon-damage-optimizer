"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeCharts_1 = __importDefault(require("./typeCharts"));
class Battle {
    constructor({ monsters, weather, terrain }) {
        this.monsters = [];
        this.weather = "none";
        this.terrain = "none";
        this.monAHP = 0;
        this.monBHP = 0;
        this.turn = () => {
            const monATypes = this.monsters[0].types;
            const monBTypes = this.monsters[1].types;
        };
        this.main = () => {
            const { turn } = this;
            const monAHP = this.monAHP;
            const monBHP = this.monBHP;
            while (monAHP > 0 || monBHP > 0) {
                turn();
            }
        };
        const { main } = this;
        this.monsters = monsters;
        this.weather = weather;
        this.terrain = terrain;
        this.monAHP = monsters[0].statTotals[0];
        this.monBHP = monsters[1].statTotals[1];
        main();
    }
}
exports.default = Battle;
function getImmunities(mon) {
    const types = mon.types.map(t => t.toLowerCase());
    const immunities = types
        .flatMap(t => typeCharts_1.default.immunities.get(t))
        .filter(t => t !== undefined);
    return immunities;
}
exports.getImmunities = getImmunities;
function getWeaknesses(mon) {
    const types = mon.types.map(t => t.toLowerCase());
    const weaknesses = types.flatMap(t => typeCharts_1.default.weaknesses.get(t));
    return weaknesses;
}
exports.getWeaknesses = getWeaknesses;
function getResistances(mon) {
    const types = mon.types.map(t => t.toLowerCase());
    const resistances = types.flatMap(t => typeCharts_1.default.resistances.get(t));
    return resistances;
}
exports.getResistances = getResistances;
function weaknessCheck(attack, weaknesses) {
    return weaknesses.includes(attack.type);
}
function immunityCheck(attack, immunities) {
    return !immunities.includes(attack.type);
}
function resistanceCheck(attack, resistances) {
    return !resistances.includes(attack.type);
}
function getEffectiveAtks({ mon, oppWeaknesses, oppImmunities, oppResistances }) {
    const superEff = mon.attackList.filter(a => weaknessCheck(a, oppWeaknesses));
    const avoid = mon.attackList.filter(a => immunityCheck(a, oppImmunities));
    const neutral = avoid.filter(a => resistanceCheck(a, oppResistances));
    return [...superEff, ...neutral];
}
exports.getEffectiveAtks = getEffectiveAtks;
//# sourceMappingURL=battleSim.js.map