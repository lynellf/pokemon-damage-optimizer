import Monster, { TItem } from "../pokemon/pokemon";
type TAttack = typeof Monster.prototype.attackList[0];
type TArgs = { attacker: Monster; move: TAttack; typeBonus: number };
const modifiers: Map<TItem, Function> = new Map();

function returnBase(args: TArgs) {
  const power = args.move.power;
  return power;
}

function expertBelt(args: TArgs) {
  return Math.round(args.move.power + args.move.power * 0.2);
}

function lifeOrb(args: TArgs) {
  const ineligible = [
    "Bide",
    "Counter",
    "Endeavor",
    "Final Gambit",
    "Guardian of Alola",
    "Metal Burst",
    "Mirror Coat",
    "Nature's Madness",
    "Night Shade",
    "Psywave",
    "Seismic Toss",
    "Super Fang",
    "Shell Trap",
    "Fissure",
    "Guillotine",
    "Horn Drill",
    "Sheer Cold",
    "Dragon Rage",
    "Sonic Boom"
  ];
  const isEligible = !ineligible.includes(args.move.name);
  if (!isEligible) {
    return args.move.power;
  } else {
    return Math.round(args.move.power + args.move.power * 0.3);
  }
}

function muscleBand(args: TArgs) {
  const isPhysical = args.move.category.toLowerCase().includes("physical");
  if (!isPhysical) {
    return args.move.power;
  } else {
    return Math.round(args.move.power + args.move.power * 0.1);
  }
}

function wiseGlasses(args: TArgs) {
  const isPhysical = args.move.category.toLowerCase().includes("special");
  if (!isPhysical) {
    return args.move.power;
  } else {
    return Math.round(args.move.power + args.move.power * 0.1);
  }
}

function charcoal(args: TArgs) {
  const isFireType = args.move.type.toLowerCase().includes("fire");
  if (!isFireType) {
    return args.move.power;
  } else {
    return Math.round(args.move.power + args.move.power * 0.2);
  }
}

function oddIncense({ move: { type, power } }: TArgs) {
  const isPsychic = type.toLowerCase().includes("psychic");
  if (!isPsychic) {
    return power;
  } else {
    return Math.round(power + power * 0.2);
  }
}

function registerModifier(item: [TItem, Function]) {
  const { 0: name, 1: func } = item;
  modifiers.set(name, func);
}

const mods: [TItem, Function][] = [
  ["Expert Belt", expertBelt],
  ["Life Orb", lifeOrb],
  ["Muscle Band", muscleBand],
  ["Wise Glasses", wiseGlasses],
  ["Charcoal", charcoal],
  ["Odd Incense", oddIncense],
];

function setMods() {
  mods.forEach(registerModifier);
}

export function modifyPower({
  attacker,
  move,
  typeBonus
}: {
  attacker: Monster;
  move: TAttack;
  typeBonus: number;
}) {
  const heldItem = attacker.item;
  const modifier = modifiers.get(heldItem) ?? returnBase;
  const output = modifier({ attacker, move, typeBonus });
  return output;
}

setMods();
