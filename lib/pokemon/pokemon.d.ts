import pokedex from "../data/pokedex.json";
import dataSource from "../data/output.json";
import Variable from "../solver/variable/variable";
import items from "../data/vgcItems";
export default class Monster {
    private baseStats;
    private ivs;
    evs: Variable[];
    lastWinEvs: Variable[];
    statTotals: number[];
    level: number;
    item: TItem;
    types: string[];
    name: Name;
    form: Forms;
    moveList: MoveKeys[];
    attackList: TAttack[];
    lastBattle: TBattle;
    nature: TNatures;
    wins: any[];
    losses: any[];
    stats: {
        hp: number;
        atk: number;
        def: number;
        spa: number;
        spd: number;
        speed: number;
    };
    constructor({ name, level, evs, nature, item }: TArgs);
    set baseEffortValues(evs: number[]);
    set setItem(item: TItem);
    set setNature(nature: TNatures);
    set effortValues(evs: Variable[]);
    private getNewEVs;
    private numberToVariable;
    private getTypes;
    private getMoves;
    private getBaseStats;
    private maxMoveFilter;
    private multiTurnFilter;
    private noDamageFilter;
    calculateStatTotals: () => void;
    getMove: (i: "Thrash" | "Double-Edge" | "Morning Sun" | "Covet" | "Double Kick" | "Max Flare" | "Max Lightning" | "Max Strike" | "Max Knuckle" | "Max Starfall" | "Max Wyrmwind" | "Max Mindstorm" | "Max Quake" | "Max Darkness" | "Max Overgrowth" | "Max Steelspike" | "Max Guard" | "Extreme Speed" | "Burn Up" | "Flame Wheel" | "Helping Hand" | "Agility" | "Fire Fang" | "Retaliate" | "Crunch" | "Take Down" | "Flamethrower" | "Roar" | "Play Rough" | "Reversal" | "Flare Blitz" | "Ember" | "Leer" | "Howl" | "Bite" | "Hyper Beam" | "Giga Impact" | "Solar Beam" | "Fire Spin" | "Dig" | "Safeguard" | "Rest" | "Thief" | "Snore" | "Protect" | "Scary Face" | "Attract" | "Sunny Day" | "Will-O-Wisp" | "Facade" | "Swift" | "Thunder Fang" | "Round" | "Bulldoze" | "Snarl" | "Body Slam" | "Fire Blast" | "Substitute" | "Outrage" | "Endure" | "Sleep Talk" | "Iron Tail" | "Heat Wave" | "Hyper Voice" | "Overheat" | "Close Combat" | "Dragon Pulse" | "Iron Head" | "Wild Charge" | "Psychic Fangs" | "Mirror Coat" | "Haze" | "Mist" | "Flail" | "Yawn" | "Fake Out" | "Aqua Ring" | "Aqua Jet" | "Water Spout" | "Life Dew" | "Max Hailstorm" | "Max Geyser" | "Max Rockfall" | "Flash Cannon" | "Tackle" | "Tail Whip" | "Water Gun" | "Withdraw" | "Rapid Spin" | "Water Pulse" | "Rain Dance" | "Aqua Tail" | "Shell Smash" | "Iron Defense" | "Hydro Pump" | "Skull Bash" | "Mega Punch" | "Mega Kick" | "Ice Punch" | "Rock Slide" | "Icy Wind" | "Hail" | "Whirlpool" | "Brick Break" | "Dive" | "Weather Ball" | "Rock Tomb" | "Brine" | "Fling" | "Avalanche" | "False Swipe" | "Surf" | "Ice Beam" | "Blizzard" | "Earthquake" | "Waterfall" | "Muddy Water" | "Gyro Ball" | "Aura Sphere" | "Dark Pulse" | "Focus Blast" | "Zen Headbutt" | "Scald" | "Work Up" | "Liquidation" | "Body Press" | "Petal Dance" | "Curse" | "Ingrain" | "Nature Power" | "Toxic" | "Max Ooze" | "Growl" | "Vine Whip" | "Growth" | "Leech Seed" | "Razor Leaf" | "Poison Powder" | "Sleep Powder" | "Seed Bomb" | "Sweet Scent" | "Synthesis" | "Worry Seed" | "Magical Leaf" | "Light Screen" | "Giga Drain" | "Charm" | "Bullet Seed" | "Venoshock" | "Grassy Terrain" | "Swords Dance" | "Amnesia" | "Sludge Bomb" | "Energy Ball" | "Leaf Storm" | "Power Whip" | "Grass Knot" | "Gust" | "Harden" | "String Shot" | "Bug Bite" | "Supersonic" | "Confusion" | "Stun Spore" | "Psybeam" | "Whirlwind" | "Air Slash" | "Bug Buzz" | "Tailwind" | "Rage Powder" | "Quiver Dance" | "U-turn" | "Acrobatics" | "Electroweb" | "Draining Kiss" | "Psychic" | "Baton Pass" | "Shadow Ball" | "Skill Swap" | "Hurricane" | "Pollen Puff" | "Max Flutterby" | "Belly Drum" | "Ancient Power" | "Dragon Rush" | "Metal Claw" | "Counter" | "Wing Attack" | "Dragon Tail" | "Dragon Claw" | "Scratch" | "Smokescreen" | "Dragon Breath" | "Slash" | "Inferno" | "Fire Punch" | "Thunder Punch" | "Fly" | "Steel Wing" | "Beat Up" | "Shadow Claw" | "Mystical Fire" | "Brutal Swing" | "Breaking Swipe" | "Blaze Kick" | "Dragon Dance" | "Heat Crash" | "Max Phantasm" | "Max Airstream" | "Present" | "Wish" | "Aromatherapy" | "Tickle" | "Heal Pulse" | "Sing" | "Sweet Kiss" | "Disarming Voice" | "Encore" | "Stored Power" | "Minimize" | "After You" | "Metronome" | "Moonlight" | "Gravity" | "Meteor Mash" | "Follow Me" | "Cosmic Power" | "Moonblast" | "Healing Wish" | "Splash" | "Pound" | "Copycat" | "Defense Curl" | "Thunder Wave" | "Reflect" | "Imprison" | "Fake Tears" | "Bounce" | "Drain Punch" | "Wonder Room" | "Misty Terrain" | "Thunderbolt" | "Thunder" | "Tri Attack" | "Psyshock" | "Uproar" | "Trick" | "Calm Mind" | "Stealth Rock" | "Ally Switch" | "Dazzling Gleam" | "Bubble Beam" | "Icicle Spear" | "Icicle Crash" | "Toxic Spikes" | "Spikes" | "Aurora Beam" | "Razor Shell" | "Ice Shard" | "Pin Missile" | "Screech" | "Self-Destruct" | "Mud Shot" | "Rock Blast" | "Payback" | "Smart Strike" | "Poison Jab" | "Sand Attack" | "Astonish" | "Mud-Slap" | "Sucker Punch" | "Sandstorm" | "Earth Power" | "Fissure" | "Headbutt" | "Final Gambit" | "Memento" | "Hone Claws" | "Metal Sound" | "Assurance" | "Stomping Tantrum" | "Transform" | "Sand Tomb" | "Night Slash" | "Stone Edge" | "Sludge Wave" | "High Horsepower" | "Detect" | "Quick Attack" | "Baby-Doll Eyes" | "Last Resort" | "Pay Day" | "Focus Energy" | "Feather Dance" | "Roost" | "Simple Beam" | "First Impression" | "Feint" | "Sky Attack" | "Quick Guard" | "Peck" | "Fury Cutter" | "Rock Smash" | "Knock Off" | "Defog" | "Slam" | "Leaf Blade" | "Brave Bird" | "Cut" | "Aerial Ace" | "Air Cutter" | "Solar Blade" | "Revenge" | "Throat Chop" | "Smog" | "Lava Plume" | "Superpower" | "Perish Song" | "Grudge" | "Disable" | "Clear Smog" | "Reflect Type" | "Lick" | "Confuse Ray" | "Hypnosis" | "Mean Look" | "Spite" | "Hex" | "Night Shade" | "Destiny Bond" | "Dream Eater" | "Trick Room" | "Taunt" | "Foul Play" | "Shadow Punch" | "Phantom Force" | "Nasty Plot" | "Teeter Dance" | "Strength Sap" | "Absorb" | "Acid" | "Mega Drain" | "Acupressure" | "Horn Attack" | "Soak" | "Megahorn" | "Horn Drill" | "Drill Run" | "Twister" | "Ice Fang" | "High Jump Kick" | "Mach Punch" | "Mind Reader" | "Vacuum Wave" | "Bullet Punch" | "Power-Up Punch" | "Focus Punch" | "Low Sweep" | "Low Kick" | "Bulk Up" | "Wide Guard" | "Thunder Shock" | "Discharge" | "Volt Switch" | "Electro Ball" | "Hammer Arm" | "Stomp" | "Crabhammer" | "Guillotine" | "X-Scissor" | "Pain Split" | "Stockpile" | "Swallow" | "Spit Up" | "Poison Gas" | "Sludge" | "Belch" | "Explosion" | "Venom Drench" | "Freeze-Dry" | "Sparkling Aria" | "Sheer Cold" | "Future Sight" | "Submission" | "Vital Throw" | "Strength" | "Dual Chop" | "Seismic Toss" | "Dynamic Punch" | "Cross Chop" | "Cross Poison" | "Heavy Slam" | "Darkest Lariat" | "Fury Swipes" | "Parting Shot" | "Flatter" | "Swagger" | "Gunk Shot" | "Power Swap" | "Guard Swap" | "Speed Swap" | "Psycho Cut" | "Magic Room" | "Tail Slap" | "Electric Terrain" | "Psychic Terrain" | "Eerie Impulse" | "Leech Life" | "Power Gem" | "Laser Focus" | "Psystrike" | "Recover" | "Power Split" | "Role Play" | "Recycle" | "Mimic" | "Extrasensory" | "Aurora Veil" | "Powder Snow" | "Flame Charge" | "Incinerate" | "Block" | "Rollout" | "Head Smash" | "Bind" | "Rock Throw" | "Smack Down" | "Rock Polish" | "Quash" | "Switcheroo" | "Charge" | "Volt Tackle" | "G-Max Volt Crash" | "Play Nice" | "Nuzzle" | "Double Team" | "Spark" | "Fairy Wind" | "Metal Burst" | "Guard Split" | "Gastro Acid" | "Acid Armor" | "Petal Blizzard" | "Double Hit" | "Strange Steam" | "Aromatic Mist" | "Heal Bell" | "Drill Peck" | "Psych Up" | "Triple Kick" | "Endeavor" | "Echoed Voice" | "Psycho Shift" | "Teleport" | "Octazooka" | "Acid Spray" | "Wrap" | "Lock-On" | "Poison Sting" | "Fell Stinger" | "Infestation" | "Struggle Bug" | "Sticky Web" | "Power Trick" | "Autotomize" | "Magnet Rise" | "Wood Hammer" | "Tearful Look" | "Shadow Sneak" | "Shock Wave" | "Boomburst" | "Frost Breath" | "Doom Desire" | "Coil" | "Torment" | "Cotton Spore" | "Leaf Tornado" | "Eruption" | "Noble Roar" | "Leafage" | "Flower Shield" | "Poison Fang" | "Slack Off" | "Circle Throw" | "Force Palm" | "Bone Rush" | "Rock Wrecker" | "Attack Order" | "Defend Order" | "Water Shuriken" | "Crush Claw" | "Sacred Sword" | "Crafty Shield" | "Cotton Guard" | "Vise Grip" | "Entrainment" | "Lunge" | "Fire Lash" | "Secret Sword" | "Charge Beam" | "Gear Grind" | "Shift Gear" | "Zap Cannon" | "Glaciate" | "Pluck" | "Spiky Shield" | "Magic Coat" | "Fusion Flare" | "Blue Flare" | "Snap Trap" | "Storm Throw" | "Fusion Bolt" | "Bolt Strike" | "King's Shield" | "Super Fang" | "Poison Tail" | "Trick-or-Treat" | "Flying Press" | "Glare" | "Parabolic Charge" | "Electrify" | "Topsy-Turvy" | "Power Trip" | "Arm Thrust" | "Branch Poke" | "Horn Leech" | "Forest's Curse" | "Spirit Shackle" | "Baneful Bunker" | "Spore" | "Trop Kick" | "Instruct" | "Purify" | "Multi-Attack" | "Shell Trap" | "Zing Zap" | "Anchor Shot" | "Clanging Scales" | "Clangorous Soul" | "Sunsteel Strike" | "Moongeist Beam" | "Night Daze" | "Photon Geyser" | "Prismatic Laser" | "Spectral Thief" | "Plasma Fists" | "Double Iron Bash" | "Drum Beating" | "Pyro Ball" | "Court Change" | "Snipe Shot" | "Fury Attack" | "Stuff Cheeks" | "Jaw Lock" | "Tar Shot" | "Grav Apple" | "Apple Acid" | "Overdrive" | "Octolock" | "Teatime" | "Magic Powder" | "Confide" | "False Surrender" | "Spirit Break" | "Obstruct" | "Meteor Assault" | "Decorate" | "No Retreat" | "Aura Wheel" | "Bolt Beak" | "Fishious Rend" | "Dragon Darts" | "G-Max Wildfire" | "G-Max Befuddle" | "G-Max Gold Rush" | "G-Max Chi Strike" | "G-Max Terror" | "G-Max Foam Burst" | "G-Max Resonance" | "G-Max Cuddle" | "G-Max Replenish" | "G-Max Malodor" | "Gear Up" | "Magnetic Flux" | "G-Max Meltdown" | "G-Max Wind Rage" | "G-Max Gravitas" | "G-Max Stonesurge" | "G-Max Volcalith" | "G-Max Tartness" | "G-Max Sweetness" | "G-Max Sandblast" | "G-Max Stun Shock" | "G-Max Centiferno" | "G-Max Smite" | "G-Max Snooze" | "G-Max Finale" | "G-Max Steelsurge" | "G-Max Depletion" | "Dynamax Cannon" | "Eternabeam") => {
        name: string;
        power: number;
        type: string;
        category: string | undefined;
    };
    getAttacks: (maxMoves?: boolean, multiTurnMoves?: boolean) => void;
    applyItem: (statTotals: number[]) => number[] | undefined;
    private main;
}
export declare type TNatures = "Hardy" | "Docile" | "Serious" | "Bashful" | "Quirky" | "Lonely" | "Brave" | "Adamant" | "Naughty" | "Bold" | "Relaxed" | "Impish" | "Lax" | "Timid" | "Hasty" | "Jolly" | "Naive" | "Modest" | "Mild" | "Quiet" | "Rash" | "Calm" | "Gentle" | "Sassy" | "Careful";
export declare type MonsterTypes = "Normal-Type" | "Fire-Type" | "Fighting-Type" | "Water-Type" | "Flying-Type" | "Grass-Type" | "Poison-Type" | "Electric-Type" | "Ground-Type" | "Psychic-Type" | "Rock-Type" | "Ice-Type" | "Bug-Type" | "Dragon-Type" | "Ghost-Type" | "Dark-Type" | "Steel-Type" | "Fairy-Type";
export declare type CleanTypes = "normal" | "fighting" | "flying" | "poison" | "ground" | "rock" | "bug" | "ghost" | "steel" | "fire" | "water" | "grass" | "electric" | "psychic" | "ice" | "dragon" | "dark" | "fairy";
declare type Moves = typeof dataSource["moves"];
declare type MoveKeys = keyof Moves;
declare type Name = keyof typeof pokedex;
declare type Forms = "alolan" | "normal" | "galarian";
declare type TAttack = {
    name: string;
    power: number;
    type: string;
    category: string;
};
declare type TBattle = {
    category: string;
    defenderName: string;
    defenderHp: number;
    movePct: number;
    name: string;
    totalDmg: number;
    evs: number[];
};
declare type TArgs = {
    nature?: TNatures;
    name: Name;
    form?: Forms;
    level?: number;
    evs?: number[];
    item?: TItem;
};
declare type TInfer<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<infer ElementType> ? ElementType : never;
export declare type TItem = TInfer<typeof items>;
export {};
//# sourceMappingURL=pokemon.d.ts.map