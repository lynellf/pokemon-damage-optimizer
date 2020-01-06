"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const output_json_1 = __importDefault(require("../data/output.json"));
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
function maxMoveFilter(maxMoves, names) {
    return maxMoves ? names : names.filter(i => !i.toLowerCase().includes("max"));
}
function multiTurnFilter(multiturn, names) {
    return multiturn
        ? names
        : names.filter(i => !multiTurnMoveList.includes(i.toLowerCase()));
}
function attackFilter(moveList) {
    return moveList.filter(m => !isNaN(m.power));
}
function getAttacks({ mon, maxMoves = false, multiTurnMoves = false }) {
    let query = output_json_1.default.pokemon[mon];
    let moveIndex = Object.keys(query.moves);
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
    attacks = attackFilter(attacks);
    attacks = attacks.filter(a => a.category !== null && a.category !== undefined);
    return attacks;
}
exports.getAttacks = getAttacks;
function applyDmgMultipliers(moveDamage, atkTypes, defTypes, moveType, cse) {
    const hasSTAB = atkTypes.includes(moveType);
    const typeBonuses = defTypes.reduce((total, defType, _index) => {
        const multiplier = applyTypeBonus(moveType, defType);
        return total * multiplier;
    }, 1);
    const randMulti = cse === "best" ? 1 : 0.85;
    const stabMultiplier = hasSTAB ? 1.5 : 1;
    return typeBonuses * randMulti * stabMultiplier * moveDamage;
}
function calculateMoveDmg({ attackerAtk, attackerTypes, cse, defenderDef, defenderHp, defenderName, defenderTypes, level, move }) {
    const { type: moveType, category, power: movePower, name } = move;
    const atkVsDef = attackerAtk / defenderDef;
    const levelModifier = (2 * level) / 5 + 2;
    const rawDmg = levelModifier * ((movePower * atkVsDef) / level) + 2;
    const totalDmg = Math.floor(applyDmgMultipliers(rawDmg, attackerTypes, defenderTypes, moveType, cse));
    const movePct = parseFloat((totalDmg / defenderHp).toFixed(2));
    return {
        category,
        defenderName,
        defenderHp,
        movePct,
        name,
        totalDmg
    };
}
function performDamageCalculation({ attacker, defender, move, cse }) {
    // console.log(`Now Battling: ${attacker.name} vs ${defender.name}`)
    if (move !== undefined) {
        const { category } = move;
        const { stats: attackerTotals, types: attackerTypes, level } = attacker;
        const { stats: defenderTotals, types: defenderTypes } = defender;
        const isSpecial = category === "special move";
        const attackerAtk = isSpecial ? attackerTotals.spa : attackerTotals.atk;
        const defenderDef = isSpecial ? defenderTotals.spd : defenderTotals.def;
        const defenderHp = defenderTotals.hp;
        const defenderName = defender.name;
        return calculateMoveDmg({
            attackerAtk,
            attackerTypes,
            cse,
            defenderDef,
            defenderHp,
            defenderName,
            defenderTypes,
            level,
            move
        });
    }
    else {
        throw new Error(`Battle between ${attacker.name} and ${defender.name} has an undefined move!`);
    }
}
exports.performDamageCalculation = performDamageCalculation;
function applyTypeBonus(moveType, defType) {
    const normalTable = {
        normal: 1,
        fighting: 1,
        flying: 1,
        poison: 1,
        ground: 1,
        rock: 0.5,
        bug: 1,
        ghost: 0,
        steel: 0.5,
        fire: 1,
        water: 1,
        grass: 1,
        electric: 1,
        psychic: 1,
        ice: 1,
        dragon: 1,
        dark: 1,
        fairy: 1
    };
    const fightingTable = {
        normal: 2,
        fighting: 1,
        flying: 0.5,
        poison: 0.5,
        ground: 1,
        rock: 2,
        bug: 0.5,
        ghost: 0,
        steel: 2,
        fire: 1,
        water: 1,
        grass: 1,
        electric: 1,
        psychic: 0.5,
        ice: 2,
        dragon: 1,
        dark: 2,
        fairy: 0.5
    };
    const flyingTable = {
        normal: 1,
        fighting: 2,
        flying: 1,
        poison: 1,
        ground: 1,
        rock: 0.5,
        bug: 2,
        ghost: 1,
        steel: 0.5,
        fire: 1,
        water: 1,
        grass: 2,
        electric: 0.5,
        psychic: 1,
        ice: 1,
        dragon: 1,
        dark: 1,
        fairy: 1
    };
    const poisonTable = {
        normal: 1,
        fighting: 1,
        flying: 1,
        poison: 0.5,
        ground: 0.5,
        rock: 0.5,
        bug: 1,
        ghost: 0.5,
        steel: 0,
        fire: 1,
        water: 1,
        grass: 2,
        electric: 1,
        psychic: 1,
        ice: 1,
        dragon: 1,
        dark: 1,
        fairy: 2
    };
    const groundTable = {
        normal: 1,
        fighting: 1,
        flying: 0,
        poison: 2,
        ground: 1,
        rock: 2,
        bug: 0.5,
        ghost: 1,
        steel: 2,
        fire: 2,
        water: 1,
        grass: 0.5,
        electric: 2,
        psychic: 1,
        ice: 1,
        dragon: 1,
        dark: 1,
        fairy: 1
    };
    const rockTable = {
        normal: 1,
        fighting: 0.5,
        flying: 2,
        poison: 1,
        ground: 0.5,
        rock: 1,
        bug: 2,
        ghost: 1,
        steel: 0.5,
        fire: 2,
        water: 1,
        grass: 1,
        electric: 1,
        psychic: 1,
        ice: 2,
        dragon: 1,
        dark: 1,
        fairy: 1
    };
    const bugTable = {
        normal: 1,
        fighting: 0.5,
        flying: 0.5,
        poison: 0.5,
        ground: 1,
        rock: 1,
        bug: 1,
        ghost: 0.5,
        steel: 0.5,
        fire: 0.5,
        water: 1,
        grass: 2,
        electric: 1,
        psychic: 2,
        ice: 1,
        dragon: 1,
        dark: 2,
        fairy: 0.5
    };
    const ghostTable = {
        normal: 0,
        fighting: 1,
        flying: 1,
        poison: 1,
        ground: 1,
        rock: 1,
        bug: 1,
        ghost: 2,
        steel: 1,
        fire: 1,
        water: 1,
        grass: 1,
        electric: 1,
        psychic: 2,
        ice: 1,
        dragon: 1,
        dark: 0.5,
        fairy: 0
    };
    const steelTable = {
        normal: 1,
        fighting: 1,
        flying: 1,
        poison: 1,
        ground: 1,
        rock: 2,
        bug: 1,
        ghost: 1,
        steel: 0.5,
        fire: 0.5,
        water: 0.5,
        grass: 1,
        electric: 0.5,
        psychic: 1,
        ice: 2,
        dragon: 1,
        dark: 1,
        fairy: 2
    };
    const fireTable = {
        normal: 1,
        fighting: 1,
        flying: 1,
        poison: 1,
        ground: 1,
        rock: 0.5,
        bug: 2,
        ghost: 1,
        steel: 2,
        fire: 0.5,
        water: 0.5,
        grass: 2,
        electric: 1,
        psychic: 1,
        ice: 2,
        dragon: 0.5,
        dark: 1,
        fairy: 1
    };
    const waterTable = {
        normal: 1,
        fighting: 1,
        flying: 1,
        poison: 1,
        ground: 2,
        rock: 2,
        bug: 1,
        ghost: 1,
        steel: 1,
        fire: 2,
        water: 0.5,
        grass: 0.5,
        electric: 1,
        psychic: 1,
        ice: 1,
        dragon: 0.5,
        dark: 1,
        fairy: 1
    };
    const grassTable = {
        normal: 1,
        fighting: 1,
        flying: 0.5,
        poison: 0.5,
        ground: 2,
        rock: 2,
        bug: 0.5,
        ghost: 1,
        steel: 0.5,
        fire: 0.5,
        water: 2,
        grass: 0.5,
        electric: 1,
        psychic: 1,
        ice: 1,
        dragon: 0.5,
        dark: 1,
        fairy: 1
    };
    const electricTable = {
        normal: 1,
        fighting: 2,
        flying: 1,
        poison: 1,
        ground: 0,
        rock: 1,
        bug: 1,
        ghost: 1,
        steel: 1,
        fire: 1,
        water: 2,
        grass: 0.5,
        electric: 0.5,
        psychic: 1,
        ice: 1,
        dragon: 0.5,
        dark: 1,
        fairy: 1
    };
    const psychicTable = {
        normal: 1,
        fighting: 2,
        flying: 1,
        poison: 2,
        ground: 1,
        rock: 1,
        bug: 1,
        ghost: 1,
        steel: 0.5,
        fire: 1,
        water: 1,
        grass: 1,
        electric: 1,
        psychic: 0.5,
        ice: 1,
        dragon: 1,
        dark: 0,
        fairy: 1
    };
    const iceTable = {
        normal: 1,
        fighting: 1,
        flying: 2,
        poison: 1,
        ground: 2,
        rock: 1,
        bug: 1,
        ghost: 1,
        steel: 0.5,
        fire: 0.5,
        water: 0.5,
        grass: 2,
        electric: 1,
        psychic: 1,
        ice: 0.5,
        dragon: 2,
        dark: 1,
        fairy: 1
    };
    const dragonTable = {
        normal: 1,
        fighting: 1,
        flying: 1,
        poison: 1,
        ground: 1,
        rock: 1,
        bug: 1,
        ghost: 1,
        steel: 0.5,
        fire: 1,
        water: 1,
        grass: 1,
        electric: 1,
        psychic: 1,
        ice: 1,
        dragon: 2,
        dark: 1,
        fairy: 0
    };
    const darkTable = {
        normal: 1,
        fighting: 0.5,
        flying: 1,
        poison: 1,
        ground: 1,
        rock: 1,
        bug: 1,
        ghost: 2,
        steel: 1,
        fire: 1,
        water: 1,
        grass: 1,
        electric: 1,
        psychic: 2,
        ice: 1,
        dragon: 1,
        dark: 0.5,
        fairy: 0.5
    };
    const fairyTable = {
        normal: 1,
        fighting: 2,
        flying: 1,
        poison: 0.5,
        ground: 1,
        rock: 1,
        bug: 1,
        ghost: 1,
        steel: 0.5,
        fire: 0.5,
        water: 1,
        grass: 1,
        electric: 1,
        psychic: 1,
        ice: 1,
        dragon: 2,
        dark: 2,
        fairy: 1
    };
    return {
        normal: normalTable[defType] * 1,
        fighting: fightingTable[defType] * 1,
        flying: flyingTable[defType] * 1,
        poison: poisonTable[defType] * 1,
        ground: groundTable[defType] * 1,
        rock: rockTable[defType] * 1,
        bug: bugTable[defType] * 1,
        ghost: ghostTable[defType] * 1,
        steel: steelTable[defType] * 1,
        fire: fireTable[defType] * 1,
        water: waterTable[defType] * 1,
        grass: grassTable[defType] * 1,
        electric: electricTable[defType] * 1,
        psychic: psychicTable[defType] * 1,
        ice: iceTable[defType] * 1,
        dragon: dragonTable[defType] * 1,
        dark: darkTable[defType] * 1,
        fairy: fairyTable[defType] * 1
    }[moveType];
}
//# sourceMappingURL=battle.js.map