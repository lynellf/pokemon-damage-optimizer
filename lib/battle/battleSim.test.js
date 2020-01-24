"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const simFuncs = __importStar(require("./battleSim"));
const pokemon_1 = __importDefault(require("../pokemon/pokemon"));
describe("a simple battle simulator", () => {
    it("returns a list of charizard's weaknesses", () => {
        const charizard = new pokemon_1.default({ name: "Charizard" });
        const weaknesses = simFuncs.getWeaknesses(charizard);
        expect(weaknesses.length).toBeGreaterThan(0);
    });
    it("returns a list of charizard's immunities", () => {
        const charizard = new pokemon_1.default({ name: "Charizard" });
        const immunities = simFuncs.getImmunities(charizard);
        expect(immunities.length).toBeGreaterThan(0);
    });
    it('returns a list of effective attacks against blastoise', () => {
        const charizard = new pokemon_1.default({ name: 'Charizard' });
        const blastoise = new pokemon_1.default({ name: 'Blastoise' });
        const resistances = simFuncs.getResistances(blastoise);
        const immunities = simFuncs.getImmunities(blastoise);
        const weaknesses = simFuncs.getWeaknesses(blastoise);
        const attacks = simFuncs.getEffectiveAtks({
            mon: charizard,
            oppImmunities: immunities,
            oppResistances: resistances,
            oppWeaknesses: weaknesses
        });
        expect(attacks.length).toBeGreaterThan(0);
    });
});
//# sourceMappingURL=battleSim.test.js.map