import Monster, { CleanTypes } from "../pokemon/pokemon";
import * as typeChart from "./typeCharts";
import * as calc from "./damageCalc";
import * as items from "./items";
type TAttack = typeof Monster.prototype.attackList[0];

export function getDefStat(mon: Monster, category: string) {
  const cases: { [key: string]: number } = {
    "special move": mon.stats.spd,
    "physical move": mon.stats.def
  };
  return cases[category] ?? mon.stats.def;
}

export function getAtkStat(mon: Monster, category: string) {
  const cases: { [key: string]: number } = {
    "special move": mon.stats.spa,
    "physical move": mon.stats.atk
  };
  return cases[category] ?? mon.stats.atk;
}

function lower(input: string) {
  return input.toLowerCase() as CleanTypes;
}

export function getEffectiveAtks({
  mon,
  oppWeaknesses,
  oppImmunities,
  oppResistances
}: {
  mon: Monster;
  oppWeaknesses: CleanTypes[];
  oppImmunities: CleanTypes[];
  oppResistances: CleanTypes[];
}) {
  const superEff = mon.attackList.filter(a =>
    typeChart.weaknessCheck(a, oppWeaknesses)
  );
  const avoid = mon.attackList.filter(a =>
    typeChart.immunityCheck(a, oppImmunities)
  );
  const neutral = avoid.filter(a =>
    typeChart.resistanceCheck(a, oppResistances)
  );
  return [...superEff, ...neutral];
}

export function attack({
  attacker,
  defender,
  move,
  rand = 0.85
}: {
  attacker: Monster;
  defender: Monster;
  move: TAttack;
  rand?: 1 | 0.85;
}) {
  const { category, type: baseType } = move;
  const { types: baseAtkTypes, level: attackerLevel } = attacker;
  const { types: baseDefTypes } = defender;

  const moveType = lower(baseType);
  const atkTypes = baseAtkTypes.map(lower);
  const defTypes = baseDefTypes.map(lower);
  const typeBonus = calc.getTypeMultiplier(moveType, defTypes);
  const stabBonus = calc.getStabMultiplier(moveType, atkTypes);
  // Item modifier here
  const movePower = items.modifyPower({
    attacker,
    move,
    typeBonus
  });
  const attackerAtk = getAtkStat(attacker, category);
  const defenderDef = getDefStat(defender, category);
  const multipliers = [rand, typeBonus, stabBonus];
  const damage = calc.getDamage({
    attackerAtk,
    attackerLevel,
    defenderDef,
    movePower,
    multipliers
  });
  return damage;
}
