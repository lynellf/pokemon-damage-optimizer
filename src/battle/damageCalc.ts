import { CleanTypes } from "../pokemon/pokemon";
import * as typeData from "./typeCharts";

function productOf() {
  const a: number = arguments[0];
  const b: number = arguments[1];
  return a * b;
}

export function multiply(nums: number[]) {
  return nums.reduce(productOf);
}

function subEquationOne(level = 50) {
  return Math.round((2 * level) / 5 + 2);
}

function subEquationTwo({
  subOneOutput,
  movePower,
  attackerAtk,
  defenderDef
}: {
  subOneOutput: number;
  movePower: number;
  attackerAtk: number;
  defenderDef: number;
}) {
  return (
    Math.round(
      Math.round((subOneOutput * movePower * attackerAtk) / defenderDef) / 50
    ) + 2
  );
}

export function getDamage({
  attackerLevel = 50,
  movePower,
  attackerAtk,
  defenderDef,
  multipliers
}: {
  attackerLevel: number;
  movePower: number;
  attackerAtk: number;
  defenderDef: number;
  multipliers: number[];
}) {
  const subOneOutput = subEquationOne(attackerLevel);
  const subTwoOutput = subEquationTwo({
    subOneOutput,
    movePower,
    attackerAtk,
    defenderDef
  });
  const modifier = multiply([...multipliers, 1, 1, 1, 1, 1, 1]);
  return Math.round(subTwoOutput * modifier);
}

function addTypeBonuses({
  output,
  moveType,
  defType
}: {
  output: number;
  moveType: CleanTypes;
  defType: CleanTypes;
}) {
  const value = typeData.applyTypeBonus(moveType, defType);
  return value + output;
}

export function getTypeMultiplier(
  moveType: CleanTypes,
  defTypes: CleanTypes[]
) {
  const multiplier = defTypes.reduce(
    (output, defType) => addTypeBonuses({ output, defType, moveType }),
    0
  );
  return multiplier;
}

export function getStabMultiplier(
  moveType: CleanTypes,
  atkTypes: CleanTypes[]
) {
  const cases: Map<boolean, 1 | 1.5> = new Map();
  cases.set(true, 1.5);
  cases.set(false, 1);
  return cases.get(atkTypes.includes(moveType)) ?? 1;
}
