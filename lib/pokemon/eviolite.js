"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compatible = [
    "Abra",
    "Aipom",
    "Amaura",
    "Anorith",
    "Applin",
    "Archen",
    "Aron",
    "Arrokuda",
    "Axew",
    "Azurill",
    "Bagon",
    "Baltoy",
    "Barboach",
    "Bayleef",
    "Beldum",
    "Bellsprout",
    "Bergmite",
    "Bidoof",
    "Binacle",
    "Blipbug",
    "Blitzle",
    "Boldore",
    "Bonsly",
    "Bounsweet",
    "Braixen",
    "Brionne",
    "Bronzor",
    "Budew",
    "Buizel",
    "Bulbasaur",
    "Buneary",
    "Bunnelby",
    "Burmy",
    "Cacnea",
    "Carkol",
    "Carvanha",
    "Caterpie",
    "Chansey",
    "Charjabug",
    "Charmander",
    "Charmeleon",
    "Cherubi",
    "Chespin",
    "Chewtle",
    "Chikorita",
    "Chimchar",
    "Chinchou",
    "Chingling",
    "Clamperl",
    "Clauncher",
    "Clefairy",
    "Cleffa",
    "Clobbopus",
    "Combee",
    "Combusken",
    "Corphish",
    "Corsola",
    "Corvisquire",
    "Cosmoem",
    "Cosmog",
    "Cottonee",
    "Crabrawler",
    "Cranidos",
    "Croagunk",
    "Croconaw",
    "Cubchoo",
    "Cubone",
    "Cufant",
    "Cutiefly",
    "Cyndaquil",
    "Dartrix",
    "Darumaka",
    "Deerling",
    "Deino",
    "Dewott",
    "Dewpider",
    "Diglett",
    "Doduo",
    "Dottler",
    "Doublade",
    "Dragonair",
    "Drakloak",
    "Dratini",
    "Dreepy",
    "Drifloon",
    "Drilbur",
    "Drizzile",
    "Drowzee",
    "Ducklett",
    "Duosion",
    "Dusclops",
    "Duskull",
    "Dwebble",
    "Eelektrik",
    "Eevee",
    "Ekans",
    "Electabuzz",
    "Electrike",
    "Elekid",
    "Elgyem",
    "Espurr",
    "Exeggcute",
    "Farfetch'd",
    "Feebas",
    "Fennekin",
    "Ferroseed",
    "Finneon",
    "Flaaffy",
    "Flabébé",
    "Flapple",
    "Fletchinder",
    "Fletchling",
    "Floette",
    "Fomantis",
    "Foongus",
    "Fraxure",
    "Frillish",
    "Froakie",
    "Frogadier",
    "Gabite",
    "Gastly",
    "Geodude",
    "Gible",
    "Glameow",
    "Gligar",
    "Gloom",
    "Golbat",
    "Goldeen",
    "Golett",
    "Goomy",
    "Gossifleur",
    "Gothita",
    "Gothorita",
    "Graveler",
    "Grimer",
    "Grookey",
    "Grotle",
    "Grovyle",
    "Growlithe",
    "Grubbin",
    "Gulpin",
    "Gurdurr",
    "Hakamo-o",
    "Happiny",
    "Hatenna",
    "Hattrem",
    "Haunter",
    "Helioptile",
    "Herdier",
    "Hippopotas",
    "Honedge",
    "Hoothoot",
    "Hoppip",
    "Horsea",
    "Houndour",
    "Igglybuff",
    "Impidimp",
    "Inkay",
    "Ivysaur",
    "Jangmo-o",
    "Jigglypuff",
    "Joltik",
    "Kabuto",
    "Kadabra",
    "Kakuna",
    "Karrablast",
    "Kirlia",
    "Klang",
    "Klink",
    "Koffing",
    "Krabby",
    "Kricketot",
    "Krokorok",
    "Lairon",
    "Lampent",
    "Larvesta",
    "Larvitar",
    "Ledyba",
    "Lickitung",
    "Lileep",
    "Lillipup",
    "Linoone",
    "Litleo",
    "Litten",
    "Litwick",
    "Lombre",
    "Lotad",
    "Loudred",
    "Luxio",
    "Machoke",
    "Machop",
    "Magby",
    "Magikarp",
    "Magmar",
    "Magnemite",
    "Magneton",
    "Makuhita",
    "Mankey",
    "Mantyke",
    "Mareanie",
    "Mareep",
    "Marill",
    "Marshtomp",
    "Meditite",
    "Meltan",
    "Meowth",
    "Metang",
    "Metapod",
    "Mienfoo",
    "Milcery",
    "Mime Jr.",
    "Minccino",
    "Misdreavus",
    "Monferno",
    "Morelull",
    "Morgrem",
    "Mr. Mime",
    "Mudbray",
    "Mudkip",
    "Munchlax",
    "Munna",
    "Murkrow",
    "Natu",
    "Nickit",
    "Nidoran♀",
    "Nidoran♂",
    "Nidorina",
    "Nidorino",
    "Nincada",
    "Noibat",
    "Nosepass",
    "Numel",
    "Nuzleaf",
    "Oddish",
    "Omanyte",
    "Onix",
    "Oshawott",
    "Palpitoad",
    "Pancham",
    "Panpour",
    "Pansage",
    "Pansear",
    "Paras",
    "Patrat",
    "Pawniard",
    "Petilil",
    "Phanpy",
    "Phantump",
    "Pichu",
    "Pidgeotto",
    "Pidgey",
    "Pidove",
    "Pignite",
    "Pikachu",
    "Pikipek",
    "Piloswine",
    "Pineco",
    "Piplup",
    "Poipole",
    "Poliwag",
    "Poliwhirl",
    "Ponyta",
    "Poochyena",
    "Popplio",
    "Porygon",
    "Porygon2",
    "Prinplup",
    "Psyduck",
    "Pumpkaboo",
    "Pupitar",
    "Purrloin",
    "Quilava",
    "Quilladin",
    "Raboot",
    "Ralts",
    "Rattata",
    "Remoraid",
    "Rhydon",
    "Rhyhorn",
    "Riolu",
    "Rockruff",
    "Roggenrola",
    "Rolycoly",
    "Rookidee",
    "Roselia",
    "Rowlet",
    "Rufflet",
    "Salandit",
    "Sandile",
    "Sandshrew",
    "Sandygast",
    "Scatterbug",
    "Scorbunny",
    "Scraggy",
    "Scyther",
    "Seadra",
    "Sealeo",
    "Seedot",
    "Seel",
    "Sentret",
    "Servine",
    "Sewaddle",
    "Shelgon",
    "Shellder",
    "Shellos",
    "Shelmet",
    "Shieldon",
    "Shinx",
    "Shroomish",
    "Shuppet",
    "Silcoon Cascoon",
    "Silicobra",
    "Sinistea",
    "Sizzlipede",
    "Skiddo",
    "Skiploom",
    "Skitty",
    "Skorupi",
    "Skrelp",
    "Skwovet",
    "Slakoth",
    "Sliggoo",
    "Slowpoke",
    "Slugma",
    "Smoochum",
    "Sneasel",
    "Snivy",
    "Snom",
    "Snorunt",
    "Snover",
    "Snubbull",
    "Sobble",
    "Solosis",
    "Spearow",
    "Spewpa",
    "Spheal",
    "Spinarak",
    "Spoink",
    "Spritzee",
    "Squirtle",
    "Staravia",
    "Starly",
    "Staryu",
    "Steenee",
    "Stufful",
    "Stunky",
    "Sunkern",
    "Surskit",
    "Swablu",
    "Swadloon",
    "Swinub",
    "Swirlix",
    "Taillow",
    "Tangela",
    "Teddiursa",
    "Tentacool",
    "Tepig",
    "Thwackey",
    "Timburr",
    "Tirtouga",
    "Togepi",
    "Togetic",
    "Torchic",
    "Torracat",
    "Totodile",
    "Toxel",
    "Tranquill",
    "Trapinch",
    "Treecko",
    "Trubbish",
    "Trumbeak",
    "Turtwig",
    "Tympole",
    "Tynamo",
    "Type: Null",
    "Tyrogue",
    "Tyrunt",
    "Vanillish",
    "Vanillite",
    "Venipede",
    "Venonat",
    "Vibrava",
    "Vigoroth",
    "Voltorb",
    "Vullaby",
    "Vulpix",
    "Wailmer",
    "Wartortle",
    "Weedle",
    "Weepinbell",
    "Whirlipede",
    "Whismur",
    "Wimpod",
    "Wingull",
    "Woobat",
    "Wooloo",
    "Wooper",
    "Wurmple",
    "Wynaut",
    "Yamask",
    "Yamper",
    "Yanma",
    "Yungoos",
    "Zigzagoon",
    "Zorua",
    "Zubat",
    "Zweilous"
];
exports.default = compatible;
//# sourceMappingURL=eviolite.js.map