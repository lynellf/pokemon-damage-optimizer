"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pokemon_1 = __importDefault(require("./pokemon"));
describe("a pokemon object", () => {
    it("returns a charizard with correct stat totals", () => {
        const charizard = new pokemon_1.default({ name: "Charizard", form: 'normal' });
        const { hp, atk, def, spa, spd, speed } = charizard.stats;
        const hasHp = hp === 153;
        const hasatk = atk === 104;
        const hasDef = def === 98;
        const hasSpa = spa === 129;
        const hasSpd = spd === 105;
        const hasSpeed = speed === 120;
        const hasStatTotals = hasHp && hasatk && hasDef && hasSpa && hasSpd && hasSpeed;
        expect(hasStatTotals).toBe(true);
    });
    it("returns a Alolan Raichu with correct stat totals", () => {
        const alolanRaichu = new pokemon_1.default({ name: 'Raichu', form: 'alolan' });
        const { hp, atk, def, spa, spd, speed } = alolanRaichu.stats;
        const hasHp = hp === 135;
        const hasatk = atk === 105;
        const hasDef = def === 70;
        const hasSpa = spa === 115;
        const hasSpd = spd === 105;
        const hasSpeed = speed === 130;
        const hasStatTotals = hasHp && hasatk && hasDef && hasSpa && hasSpd && hasSpeed;
        expect(hasStatTotals).toBe(true);
    });
    it('returns a normal Raichu without the move magic coat', () => {
        const raichu = new pokemon_1.default({ name: 'Raichu', form: 'normal' });
        const moveList = raichu.moveList;
        const hasMagicCoat = moveList.find(move => move === 'Magic Coat');
        const types = raichu.types;
        expect(hasMagicCoat).toBe(undefined);
    });
    // it('returns battle results between two pokemon', () => {
    //   const charizard = new Monster('Charizard')
    //   const mewtwo = new Monster('Mewtwo')
    //   charizard.battleOpponent(mewtwo, 'best')
    //   expect(charizard.attackList.length > 0).toBe(true)
    // })
});
//# sourceMappingURL=pokemon.test.js.map