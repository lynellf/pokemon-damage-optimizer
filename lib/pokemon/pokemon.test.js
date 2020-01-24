"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pokemon_1 = __importDefault(require("./pokemon"));
describe("a pokemon object", () => {
    it("returns a charizard with correct type and stat totals", () => {
        const charizard = new pokemon_1.default({ name: "Charizard" });
        const { hp, atk, def, spa, spd, speed } = charizard.stats;
        const hasHp = hp === 153;
        const hasatk = atk === 104;
        const hasDef = def === 98;
        const hasSpa = spa === 129;
        const hasSpd = spd === 105;
        const hasSpeed = speed === 120;
        const hasStatTotals = hasHp && hasatk && hasDef && hasSpa && hasSpd && hasSpeed;
        const isFlyingType = charizard.types.find(t => t.toLowerCase() === "flying") !== undefined;
        const isFireType = charizard.types.find(t => t.toLowerCase() === "fire") !== undefined;
        const isValid = hasStatTotals && isFlyingType && isFireType;
        expect(isValid).toBe(true);
    });
    it("returns a Alolan Raichu with correct type and stat totals", () => {
        const alolanRaichu = new pokemon_1.default({ name: "Raichu-Alola" });
        const { hp, atk, def, spa, spd, speed } = alolanRaichu.stats;
        const hasHp = hp === 135;
        const hasatk = atk === 105;
        const hasDef = def === 70;
        const hasSpa = spa === 115;
        const hasSpd = spd === 105;
        const hasSpeed = speed === 130;
        const hasStatTotals = hasHp && hasatk && hasDef && hasSpa && hasSpd && hasSpeed;
        const isElectricType = alolanRaichu.types.find(t => t.toLowerCase() === "electric") !==
            undefined;
        const isPsychicType = alolanRaichu.types.find(t => t.toLowerCase() === "psychic") !== undefined;
        const isValid = hasStatTotals && isElectricType && isPsychicType;
        expect(isValid).toBe(true);
    });
    it("returns a normal Raichu without the move magic coat", () => {
        const raichu = new pokemon_1.default({ name: "Raichu" });
        const moveList = raichu.moveList;
        const hasMagicCoat = moveList.find(move => move === "Magic Coat");
        expect(hasMagicCoat).toBe(undefined);
    });
    it("returns a choice-banded Charizard with boosted attack", () => {
        const charizard = new pokemon_1.default({
            name: "Charizard",
            nature: "Bashful",
            item: "Choice Band"
        });
        const { atk } = charizard.stats;
        const hasatk = atk === 156;
        const hasStatTotals = hasatk;
        const isValid = hasStatTotals;
        expect(isValid).toBe(true);
    });
    it("returns a Pikachu with double attack and special attack stats", () => {
        const pikachu = new pokemon_1.default({
            name: "Pikachu",
            nature: "Bashful",
            item: "Light Ball"
        });
        const { atk, spa } = pikachu.stats;
        const hasatk = atk === 150;
        const hasSpa = spa === 140;
        const hasStatTotals = hasatk && hasSpa;
        const isValid = hasStatTotals;
        expect(isValid).toBe(true);
    });
    it("returns a choice-scarfed Excadrill with boosted speed", () => {
        const excadrill = new pokemon_1.default({
            name: "Excadrill",
            nature: "Bashful",
            item: "Choice Scarf"
        });
        const { speed } = excadrill.stats;
        const hasSpeed = speed === 162;
        const hasStatTotals = hasSpeed;
        const isValid = hasStatTotals;
        expect(isValid).toBe(true);
    });
    it("returns a choice-specs Gengar with boosted special attack", () => {
        const gengar = new pokemon_1.default({
            name: "Gengar",
            nature: "Bashful",
            item: "Choice Specs"
        });
        const { spa } = gengar.stats;
        const hasSpa = spa === 225;
        const hasStatTotals = hasSpa;
        const isValid = hasStatTotals;
        expect(isValid).toBe(true);
    });
    it("returns an adamant natured Machamp with boosted attack", () => {
        const machamp = new pokemon_1.default({
            name: "Machamp",
            nature: "Adamant"
        });
        const { atk, spa } = machamp.stats;
        const hasAtk = atk === 165;
        const hasSpa = spa === 76;
        const hasStatTotals = hasAtk && hasSpa;
        const isValid = hasStatTotals;
        expect(isValid).toBe(true);
    });
    it("returns a jolly natured Durant with boosted speed", () => {
        const durant = new pokemon_1.default({
            name: "Durant",
            nature: "Jolly",
        });
        const { speed, spa } = durant.stats;
        const hasSpeed = speed === 141;
        const hasSpa = spa === 61;
        const hasStatTotals = hasSpeed && hasSpa;
        const isValid = hasStatTotals;
        expect(isValid).toBe(true);
    });
    it("returns an eviolite Galarian Corsola with boosted defense and special defense", () => {
        const corsola = new pokemon_1.default({
            name: "Corsola-Galar",
            nature: "Bashful",
            item: "Eviolite"
        });
        const { def, spd } = corsola.stats;
        const hasDef = def === 180;
        const hasSpd = spd === 180;
        const hasStatTotals = hasSpd && hasDef;
        const isValid = hasStatTotals;
        expect(isValid).toBe(true);
    });
    it("returns a list of moves for Charizard", () => {
        const charizard = new pokemon_1.default({ name: "Charizard" });
        const moves = charizard.moveList;
        expect(moves.length).toBeGreaterThan(0);
    });
    it("returns a list of attacks for Charizard", () => {
        const charizard = new pokemon_1.default({ name: "Charizard" });
        const attacks = charizard.attackList;
        expect(attacks.length).toBeGreaterThan(0);
    });
});
//# sourceMappingURL=pokemon.test.js.map