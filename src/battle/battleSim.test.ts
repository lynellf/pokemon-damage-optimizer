// import * as simFuncs from "./battleSim";
import Monster from "../pokemon/pokemon";
import * as calc from "./damageCalc";
import * as typeChart from "./typeCharts";
import * as attack from "./attack";
// import { performDamageCalculation } from "./battle";

describe("a simple battle simulator", () => {
  // it("returns a value of 168", () => {
  //   const multipliers = [1.5, 4, 0.85];
  //   const movePower = 65;
  //   const attackerLevel = 75;
  //   const attackerAtk = 123;
  //   const defenderDef = 163;
  //   const output = calc.getDamage({
  //     attackerLevel,
  //     defenderDef,
  //     attackerAtk,
  //     multipliers,
  //     movePower
  //   });
  //   expect(output).toEqual(168);
  // });
  // it("multiplies numbers", () => {
  //   const fivePointTen = calc.multiply([1, 1, 1, 1, 0.85, 1.5, 4, 1, 1]);
  //   expect(fivePointTen).toEqual(5.1);
  // });
  // it("returns a list of charizard's weaknesses", () => {
  //   const charizard = new Monster({ name: "Charizard" });
  //   const weaknesses = typeChart.getWeaknesses(charizard);
  //   expect(weaknesses.length).toBeGreaterThan(0);
  // });

  // it("returns a list of charizard's immunities", () => {
  //   const charizard = new Monster({ name: "Charizard" });
  //   const immunities = typeChart.getImmunities(charizard);
  //   expect(immunities.length).toBeGreaterThan(0);
  // });

  // it("returns a list of effective attacks against blastoise", () => {
  //   const charizard = new Monster({ name: "Charizard" });
  //   const blastoise = new Monster({ name: "Blastoise" });
  //   const resistances = typeChart.getResistances(blastoise);
  //   const immunities = typeChart.getImmunities(blastoise);
  //   const weaknesses = typeChart.getWeaknesses(blastoise);

  //   const attacks = attack.getEffectiveAtks({
  //     mon: charizard,
  //     oppImmunities: immunities,
  //     oppResistances: resistances,
  //     oppWeaknesses: weaknesses
  //   });
  //   expect(attacks.length).toBeGreaterThan(0);
  // });

  // it("returns a multiplier of 4", () => {
  //   const multiplier = calc.getTypeMultiplier("ice", ["dragon", "ground"]);
  //   expect(multiplier).toEqual(4);
  // });

  // it("returns damage calculation", () => {
  //   const charizard = new Monster({ name: "Charizard" });
  //   const blastoise = new Monster({ name: "Blastoise" });
  //   const resistances = typeChart.getResistances(blastoise);
  //   const immunities = typeChart.getImmunities(blastoise);
  //   const weaknesses = typeChart.getWeaknesses(blastoise);

  //   const attacks = attack.getEffectiveAtks({
  //     mon: charizard,
  //     oppImmunities: immunities,
  //     oppResistances: resistances,
  //     oppWeaknesses: weaknesses
  //   });
  //   const thunderPunch = attacks[0];
  //   const output = attack.attack({
  //     attacker: charizard,
  //     defender: blastoise,
  //     move: thunderPunch
  //   });
  //   expect(output).toBeGreaterThanOrEqual(53);
  // });

  // it("returns boosted damage via a held expert belt", () => {
  //   const charizard = new Monster({ name: "Charizard" });
  //   const blastoise = new Monster({ name: "Blastoise" });
  //   charizard.setItem = "Expert Belt";
  //   const resistances = typeChart.getResistances(blastoise);
  //   const immunities = typeChart.getImmunities(blastoise);
  //   const weaknesses = typeChart.getWeaknesses(blastoise);

  //   const attacks = attack.getEffectiveAtks({
  //     mon: charizard,
  //     oppImmunities: immunities,
  //     oppResistances: resistances,
  //     oppWeaknesses: weaknesses
  //   });
  //   const thunderPunch = attacks[0];
  //   const output = attack.attack({
  //     attacker: charizard,
  //     defender: blastoise,
  //     move: thunderPunch
  //   });
  //   expect(output).toEqual(61);
  // });

  // it("returns boosted damage via a held life orb", () => {
  //   const charizard = new Monster({ name: "Charizard" });
  //   const blastoise = new Monster({ name: "Blastoise" });
  //   charizard.setItem = "Life Orb";
  //   const resistances = typeChart.getResistances(blastoise);
  //   const immunities = typeChart.getImmunities(blastoise);
  //   const weaknesses = typeChart.getWeaknesses(blastoise);

  //   const attacks = attack.getEffectiveAtks({
  //     mon: charizard,
  //     oppImmunities: immunities,
  //     oppResistances: resistances,
  //     oppWeaknesses: weaknesses
  //   });
  //   const thunderPunch = attacks[0];
  //   const output = attack.attack({
  //     attacker: charizard,
  //     defender: blastoise,
  //     move: thunderPunch
  //   });
  //   expect(output).toEqual(66);
  // });

  // it("returns boosted damage via a held muscle band", () => {
  //   const charizard = new Monster({ name: "Charizard" });
  //   const blastoise = new Monster({ name: "Blastoise" });
  //   charizard.setItem = "Muscle Band";
  //   const resistances = typeChart.getResistances(blastoise);
  //   const immunities = typeChart.getImmunities(blastoise);
  //   const weaknesses = typeChart.getWeaknesses(blastoise);

  //   const attacks = attack.getEffectiveAtks({
  //     mon: charizard,
  //     oppImmunities: immunities,
  //     oppResistances: resistances,
  //     oppWeaknesses: weaknesses
  //   });
  //   const thunderPunch = attacks[0];
  //   const output = attack.attack({
  //     attacker: charizard,
  //     defender: blastoise,
  //     move: thunderPunch
  //   });
  //   expect(output).toEqual(58);
  // });

  it("returns boosted damage via wise glasses", () => {
    const charizard = new Monster({ name: "Charizard" });
    const venusaur = new Monster({ name: "Venusaur" });
    // charizard.setItem = "Wise Glasses";
    const resistances = typeChart.getResistances(venusaur);
    const immunities = typeChart.getImmunities(venusaur);
    const weaknesses = typeChart.getWeaknesses(venusaur);

    const attacks = attack.getEffectiveAtks({
      mon: charizard,
      oppImmunities: immunities,
      oppResistances: resistances,
      oppWeaknesses: weaknesses
    });
    const heatWave = attacks[2];
    const output = attack.attack({
      attacker: charizard,
      defender: venusaur,
      move: heatWave
    });
    expect(output).toEqual(97);
  });

  // it("returns boosted damage via charcoal", () => {
  //   const charizard = new Monster({ name: "Charizard" });
  //   const venusaur = new Monster({ name: "Venusaur" });
  //   charizard.setItem = "Charcoal";
  //   const resistances = typeChart.getResistances(venusaur);
  //   const immunities = typeChart.getImmunities(venusaur);
  //   const weaknesses = typeChart.getWeaknesses(venusaur);

  //   const attacks = attack.getEffectiveAtks({
  //     mon: charizard,
  //     oppImmunities: immunities,
  //     oppResistances: resistances,
  //     oppWeaknesses: weaknesses
  //   });
  //   const heatWave = attacks[2];
  //   const output = attack.attack({
  //     attacker: charizard,
  //     defender: venusaur,
  //     move: heatWave
  //   });
  //   expect(output).toEqual(103);
  // });

  // it("returns boosted damage via odd incense", () => {
  //   const indeedee = new Monster({ name: "Indeedee-M" });
  //   const venusaur = new Monster({ name: "Venusaur" });
  //   indeedee.setItem = "Odd Incense";
  //   const resistances = typeChart.getResistances(venusaur);
  //   const immunities = typeChart.getImmunities(venusaur);
  //   const weaknesses = typeChart.getWeaknesses(venusaur);

  //   const attacks = attack.getEffectiveAtks({
  //     mon: indeedee,
  //     oppImmunities: immunities,
  //     oppResistances: resistances,
  //     oppWeaknesses: weaknesses
  //   });
  //   const extrasensory = attacks[0];
  //   console.log({ extrasensory })
  //   const output = attack.attack({
  //     attacker: indeedee,
  //     defender: venusaur,
  //     move: extrasensory
  //   });
  //   expect(output).toEqual(151);
  // });
});
