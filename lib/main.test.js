"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { Main, optimizePwr } from "./main";
// import { Worker } from "worker_threads";
const pokemon_1 = __importDefault(require("./pokemon/pokemon"));
describe("the app", () => {
    // it('ev trains up two pokemon in battle against one another', () => {
    //    const charizard = new Monster({ name: 'Charizard' })
    //    const blastoise = new Monster({ name: 'Blastoise' })
    //    const venusaur = new Monster({ name: 'Venusaur' })
    //    const results = Main([charizard, blastoise, venusaur]);
    //    console.log(results)
    //    expect(Object.keys(results).length > 0).toBe(true)
    // }, 500000)
    // it("optimizes power", () => {
    //   const charizard = new Monster("Charizard");
    //   const blastoise = new Monster("Blastoise");
    //   const move = charizard.attackList.find(a => a.name === "Hurricane")!;
    //   const isFeasible = optimizePwr({
    //     stat: "spa",
    //     move,
    //     query: charizard,
    //     opponent: blastoise
    //   });
    //   console.log(charizard.evs.map(ev => ev.currentVal))
    //   expect(isFeasible).toBe(true)
    // }, 50000);
    // it("can work with another thread", () => {
    //   const worker = new Worker("./pokemon/pokeworker.ts", {
    //     workerData: {
    //       value: 15,
    //       path: "./pokemon/pokeworker.ts"
    //     }
    //   });
    //   worker.on("message", (result: any) => {
    //     console.log(result);
    //   });
    // });
    it("simulates charizard against everyone", () => {
        const testData = {
            'Venusaur': {
                wins: [],
                losses: [],
                evs: []
            },
            'Blastoise': {
                wins: [],
                losses: [],
                evs: []
            }
        };
        const charizard = new pokemon_1.default({
            name: "Charizard",
            form: "normal",
            evs: []
        });
        const output = charizard.optimizeEVs(testData);
        console.log({
            evs: output["Charizard"].evs,
            wins: output["Charizard"].wins.length,
            losses: output['Charizard'].losses.length
        });
    });
});
//# sourceMappingURL=main.test.js.map