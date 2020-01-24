import { TItem } from "./pokemon";
import evioliteList from "./eviolite";
type TArgs = { name: string; statTotals: number[] };
type Cal = (args: TArgs) => number[] | undefined;
const table = new Map<TItem, Cal>();

function choiceBand({ statTotals }: TArgs) {
  const { 0: hp, 1: atk, 2: def, 3: spa, 4: spd, 5: speed } = statTotals;
  return [hp, Math.floor(atk + atk * 0.5), def, spa, spd, speed];
}

function choiceScarf({ statTotals }: TArgs) {
  const { 0: hp, 1: atk, 2: def, 3: spa, 4: spd, 5: speed } = statTotals;
  return [hp, atk, def, spa, spd, Math.floor(speed + speed * 0.5)];
}

function choiceSpecs({ statTotals }: TArgs) {
  const { 0: hp, 1: atk, 2: def, 3: spa, 4: spd, 5: speed } = statTotals;
  return [hp, atk, def, Math.floor(spa + spa * 0.5), spd, speed];
}

function eviolite({ name, statTotals }: TArgs) {
  const hasName = evioliteList.find(n => name.includes(n))
  if (!hasName) {
    return statTotals;
  }
  const { 0: hp, 1: atk, 2: def, 3: spa, 4: spd, 5: speed } = statTotals;
  return [
    hp,
    atk,
    Math.floor(def + def * 0.5),
    spa,
    Math.floor(spd + spd * 0.5),
    speed
  ];
}

function lightBall({ name, statTotals }: TArgs) {
  const isPikachu = name.toLowerCase() === "pikachu";
  if (!isPikachu) {
    return statTotals;
  }
  const { 0: hp, 1: atk, 2: def, 3: spa, 4: spd, 5: speed } = statTotals;
  return [hp, Math.floor(atk * 2), def, Math.floor(spa * 2), spd, speed];
}

table.set("Choice Band", choiceBand);
table.set("Light Ball", lightBall);
table.set("Choice Scarf", choiceScarf);
table.set("Choice Specs", choiceSpecs);
table.set("Eviolite", eviolite);

export default table;
