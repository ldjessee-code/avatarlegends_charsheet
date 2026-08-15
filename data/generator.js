/**
 * generator.js — Tables for the constrained character randomizer.
 *
 * Original culture-inspired name lists (not copied from the rulebook).
 * Water Tribe: Inuit / Iñupiaq. Earth Kingdom: Chinese. Fire Nation:
 * Japanese with Chinese mixed in. Air Nomads: Tibetan and Nepalese.
 * Kyoshi Island: Japanese. United Republic / colonies: mixed.
 */
window.AL = window.AL || {};

AL.GENERATOR = {
  eras: [
    { id: "kyoshi", name: "Kyoshi Era" },
    { id: "roku", name: "Roku Era" },
    { id: "hundred-year-war", name: "Hundred Year War" },
    { id: "aang", name: "Aang Era" },
    { id: "korra", name: "Korra Era" }
  ],

  cultures: [
    { id: "air-nomads", name: "Air Nomads" },
    { id: "northern-water", name: "Northern Water Tribe" },
    { id: "southern-water", name: "Southern Water Tribe" },
    { id: "foggy-swamp", name: "Foggy Swamp" },
    { id: "earth-kingdom", name: "Earth Kingdom" },
    { id: "fire-nation", name: "Fire Nation" },
    { id: "kyoshi-island", name: "Kyoshi Island" },
    { id: "fire-colonies", name: "Fire Nation colonies" },
    { id: "united-republic", name: "United Republic" }
  ],

  /**
   * Culture ids allowed in each era. Missing = not used.
   * Weights are relative; omitted culture is unavailable.
   */
  eraCultures: {
    kyoshi: {
      "air-nomads": 1.2,
      "northern-water": 1,
      "southern-water": 1,
      "foggy-swamp": 0.6,
      "earth-kingdom": 1.3,
      "fire-nation": 1,
      "kyoshi-island": 0.8
    },
    roku: {
      "air-nomads": 1.2,
      "northern-water": 1,
      "southern-water": 1,
      "foggy-swamp": 0.6,
      "earth-kingdom": 1.2,
      "fire-nation": 1.1,
      "kyoshi-island": 0.7,
      "fire-colonies": 0.5
    },
    "hundred-year-war": {
      "air-nomads": 0.15,
      "northern-water": 1,
      "southern-water": 0.85,
      "foggy-swamp": 0.7,
      "earth-kingdom": 1.3,
      "fire-nation": 1.2,
      "kyoshi-island": 0.6,
      "fire-colonies": 0.9
    },
    aang: {
      "air-nomads": 0.7,
      "northern-water": 1,
      "southern-water": 1,
      "foggy-swamp": 0.6,
      "earth-kingdom": 1.2,
      "fire-nation": 1,
      "kyoshi-island": 0.7,
      "fire-colonies": 0.5,
      "united-republic": 0.8
    },
    korra: {
      "air-nomads": 0.9,
      "northern-water": 1,
      "southern-water": 1,
      "foggy-swamp": 0.5,
      "earth-kingdom": 1.1,
      "fire-nation": 1,
      "kyoshi-island": 0.6,
      "united-republic": 1.4
    }
  },

  /** Relative chance a culture uses each training. */
  cultureTrainings: {
    "air-nomads": {
      Airbending: 3.2,
      Weapons: 0.35,
      Technology: 0.15
    },
    "northern-water": {
      Waterbending: 2.6,
      Weapons: 0.7,
      Technology: 0.25
    },
    "southern-water": {
      Waterbending: 2.4,
      Weapons: 0.9,
      Technology: 0.2
    },
    "foggy-swamp": {
      Waterbending: 2.2,
      Earthbending: 0.6,
      Weapons: 0.5,
      Technology: 0.15
    },
    "earth-kingdom": {
      Earthbending: 2.4,
      Weapons: 1,
      Technology: 0.45,
      Firebending: 0.12,
      Waterbending: 0.12
    },
    "fire-nation": {
      Firebending: 2.6,
      Weapons: 0.9,
      Technology: 1.1,
      Earthbending: 0.1
    },
    "kyoshi-island": {
      Earthbending: 1.4,
      Weapons: 2.2,
      Technology: 0.2,
      Waterbending: 0.25
    },
    "fire-colonies": {
      Firebending: 1.3,
      Earthbending: 1.3,
      Weapons: 1,
      Technology: 0.8
    },
    "united-republic": {
      Firebending: 1,
      Earthbending: 1.1,
      Waterbending: 0.9,
      Airbending: 0.55,
      Weapons: 1.1,
      Technology: 1.6
    }
  },

  /**
   * Multiply training weights by era. Technology is uncommon before
   * Aang; Airbending is scarce in the Hundred Year War.
   */
  eraTrainingMult: {
    kyoshi: { Technology: 0.28, Airbending: 1, Weapons: 1.05 },
    roku: { Technology: 0.4, Airbending: 1, Weapons: 1 },
    "hundred-year-war": { Technology: 0.55, Airbending: 0.12, Weapons: 1.15 },
    aang: { Technology: 1, Airbending: 0.55, Weapons: 1 },
    korra: { Technology: 1.25, Airbending: 0.85, Weapons: 1 }
  },

  /**
   * Extra culture weight when training is already locked.
   * Pre-Aang Technology leans Fire Nation (and colonies).
   */
  trainingCultureBoost: {
    Airbending: { "air-nomads": 3, "united-republic": 1.4 },
    Waterbending: {
      "northern-water": 2.2,
      "southern-water": 2,
      "foggy-swamp": 1.6,
      "united-republic": 1.1
    },
    Earthbending: {
      "earth-kingdom": 2.2,
      "kyoshi-island": 1.4,
      "fire-colonies": 1.2,
      "united-republic": 1.2
    },
    Firebending: {
      "fire-nation": 2.4,
      "fire-colonies": 1.5,
      "united-republic": 1.2
    },
    Weapons: { "kyoshi-island": 1.6 },
    Technology: {
      "fire-nation": 2.2,
      "fire-colonies": 1.6,
      "united-republic": 1.8,
      "earth-kingdom": 0.9
    }
  },

  /** Extra Technology → Fire Nation lean in early eras. */
  earlyTechCultureBoost: {
    kyoshi: { "fire-nation": 3.2, "fire-colonies": 1.2, "earth-kingdom": 0.55 },
    roku: { "fire-nation": 2.8, "fire-colonies": 1.4, "earth-kingdom": 0.65 },
    "hundred-year-war": {
      "fire-nation": 3,
      "fire-colonies": 1.6,
      "earth-kingdom": 0.7
    }
  },

  /** Soft playbook weights when a training is locked. */
  trainingPlaybooks: {
    Airbending: { icon: 1.4, destined: 1.3, foundling: 1.3, idealist: 1.15 },
    Waterbending: { idealist: 1.25, broken: 1.2, foundling: 1.2, guardian: 1.1 },
    Earthbending: { guardian: 1.25, pillar: 1.2, hammer: 1.15, adamant: 1.1 },
    Firebending: { hammer: 1.25, adamant: 1.2, prodigy: 1.15, razor: 1.1 },
    Weapons: { rogue: 1.2, razor: 1.2, hammer: 1.15, guardian: 1.1 },
    Technology: { architect: 1.35, successor: 1.2, authority: 1.15, prodigy: 1.1 }
  },

  personFieldIds: [
    "lodestar",
    "ward",
    "catch_a_liar_name",
    "adversary",
    "steward_name",
    "proteges",
    "allies",
    "animal_companion"
  ],

  names: {
    "air-nomads": [
      "Dawa",
      "Karma",
      "Tashi",
      "Sonam",
      "Yeshe",
      "Nima",
      "Pasang",
      "Dorje",
      "Lhamo",
      "Pema-La",
      "Kiran",
      "Sagar",
      "Asha",
      "Nabin",
      "Bina",
      "Prakash",
      "Arun",
      "Rina",
      "Dipak",
      "Sunita",
      "Hari",
      "Lila",
      "Nisha",
      "Amit",
      "Gita",
      "Raj",
      "Dechen",
      "Jigme"
    ],
    "northern-water": [
      "Aput",
      "Nanuq",
      "Siku",
      "Taqqiq",
      "Nukka",
      "Kallik",
      "Amka",
      "Tulok",
      "Yura",
      "Kunik",
      "Panik",
      "Sesi",
      "Miki",
      "Toklo",
      "Aputi",
      "Nuna",
      "Qannik",
      "Kirima",
      "Tapeesa",
      "Nukilik",
      "Iluak",
      "Ticasuk",
      "Silla",
      "Koko"
    ],
    "southern-water": [
      "Siku",
      "Amka",
      "Tulok",
      "Panik",
      "Nuna",
      "Kallik",
      "Toklo",
      "Yura",
      "Nanuq",
      "Kirima",
      "Aput",
      "Miki",
      "Tapeesa",
      "Iluak",
      "Sesi",
      "Qannik",
      "Nukka",
      "Kunik",
      "Ticasuk",
      "Silla",
      "Aputi",
      "Nukilik"
    ],
    "foggy-swamp": [
      "Reed",
      "Moss",
      "Paddle",
      "Cypress",
      "Mire",
      "Jun",
      "Wei",
      "Hao",
      "Shan",
      "Bo",
      "Fen",
      "Qing"
    ],
    "earth-kingdom": [
      "Wei",
      "Ming",
      "Jun",
      "Tao",
      "Hui",
      "Zhen",
      "Qing",
      "Rui",
      "Shan",
      "Xin",
      "Chen",
      "Hao",
      "Yan",
      "Ping",
      "Qiao",
      "Ren",
      "Shun",
      "Yi",
      "Bo",
      "Dai",
      "Fen",
      "Guo",
      "Heng",
      "Jia",
      "Kun",
      "Lan",
      "Ning",
      "Pei",
      "Shen",
      "Wen",
      "Yu",
      "Zhi",
      "An",
      "Bai"
    ],
    "fire-nation": [
      "Akira",
      "Haru",
      "Kaito",
      "Ren",
      "Yuki",
      "Sora",
      "Hana",
      "Nao",
      "Shin",
      "Toru",
      "Kenji",
      "Yuna",
      "Riku",
      "Asa",
      "Daichi",
      "Emi",
      "Hoshi",
      "Kyo",
      "Michi",
      "Nori",
      "Renji",
      "Saki",
      "Toma",
      "Wataru",
      "Zhen",
      "Hui",
      "Rui",
      "Xin"
    ],
    "kyoshi-island": [
      "Hoshi",
      "Nami",
      "Isamu",
      "Kaede",
      "Sora",
      "Haru",
      "Nao",
      "Michi",
      "Asa",
      "Kyo",
      "Yuna",
      "Toma",
      "Hana",
      "Shin",
      "Emi",
      "Riku"
    ]
  },

  hometowns: {
    "air-nomads": [
      "A cliffside temple",
      "A high-valley monastery",
      "A wind-carved mountain village",
      "A traveling air caravan"
    ],
    "northern-water": [
      "A canal city under ice walls",
      "A northern harbor village",
      "A spirit-oasis settlement",
      "A sealing camp on the pack ice"
    ],
    "southern-water": [
      "A southern ice-floe village",
      "A repaired harbor of tents and timber",
      "A hunting camp on the outer floes",
      "A small coastal clan-hold"
    ],
    "foggy-swamp": [
      "A stilt village in the deep swamp",
      "A banyan-root settlement",
      "A fog-choked river landing"
    ],
    "earth-kingdom": [
      "A river farming town",
      "A walled provincial city",
      "A quarry village in the hills",
      "A caravan stop on the outer ring road",
      "A lower-ring neighborhood"
    ],
    "fire-nation": [
      "A caldera harbor town",
      "An inner-island village",
      "A foundry district",
      "A cliff palace town",
      "A volcanic-farm hamlet"
    ],
    "kyoshi-island": [
      "A fishing village on the island’s lee",
      "A dojo town above the bay",
      "A cedar-and-tile hamlet"
    ],
    "fire-colonies": [
      "A harbor under a Fire banner",
      "A mixed earth-and-ash market town",
      "A riverside town with two languages"
    ],
    "united-republic": [
      "A canal district",
      "An industrial ward",
      "A hillside apartment block",
      "A harbor-market neighborhood"
    ]
  },

  looks: [
    "Weathered travel coat, hair tied back, one bead at the wrist",
    "Practical layers, scuffed boots, a mended sleeve",
    "Clean lines, a single bright sash, careful posture",
    "Sun-faded wraps, dust on the hems, a small carved charm",
    "Short cropped hair, a heavy scarf, ink-stained fingers",
    "Loose outer robe over work clothes, a faded clan mark",
    "Burn-scarred gloves tucked in a belt, eyes always moving",
    "Sea-salt in the hair, oilskin over warmer wool",
    "Temple-plain clothes with one inherited ornament",
    "Factory-soot on the cuffs, a carefully kept comb"
  ],

  fightingStyles: {
    Airbending: [
      "wide circling staff forms",
      "short, evasive footwork",
      "spirals that steal an opponent’s breath"
    ],
    Waterbending: [
      "flowing redirects and ice edges",
      "pulling stances, then a sudden freeze",
      "healing-trained hands that can also cut"
    ],
    Earthbending: [
      "rooted, crushing stances",
      "fast pebble-shot forms",
      "wall-and-pillar control of the ground"
    ],
    Firebending: [
      "short snapping bursts",
      "wide circular blasts",
      "tight breath-driven jabs"
    ],
    Weapons: [
      "twin short blades",
      "a hooked polearm",
      "fans or war-fans used as shields",
      "a heavy dao and a stubborn guard"
    ],
    Technology: [
      "gauntlet tools and shock charges",
      "a compact launcher and smoke pots",
      "clockwork traps set before the fight"
    ],
    "Other / Custom": ["a style you have not named yet"]
  },

  statHooks: {
    _default: {
      Creativity: "You learned to improvise when the plan fell apart.",
      Focus: "You kept watch long after others slept.",
      Harmony: "You talked someone down when steel would have been easier.",
      Passion: "You refused to stand still while the world burned."
    },
    guardian: {
      Focus: "Years of watching a doorway instead of sleeping.",
      Harmony: "You got good at reading whether someone was actually safe."
    },
    hammer: {
      Passion: "Someone powerful walked away from harm they caused. You did not.",
      Focus: "You studied one enemy until their habits were a map."
    },
    adamant: {
      Focus: "You practiced not flinching until it became a habit.",
      Creativity: "You built a way out of a room no one else thought to leave."
    },
    rogue: {
      Creativity: "You talked your way past a gate that should have been shut.",
      Passion: "A dare went too far and you liked who you were in it."
    },
    icon: {
      Harmony: "Ritual after ritual, until the words sat in your bones.",
      Focus: "You were not allowed to be sloppy. The tradition noticed."
    },
    prodigy: {
      Focus: "A teacher said you were wasting talent. You trained until dawn.",
      Creativity: "You found a form that was not in any scroll."
    }
  },

  closedLists: {
    hammerGoals: ["Capture", "Discredit", "Depose", "Restrain", "Expose", "Exile"],
    rogueHabits: [
      "Casual thievery and pickpocketing",
      "Vandalism or sabotage",
      "Trespassing",
      "Daredevil stunts",
      "“Charming” insults of dangerous people",
      "Cons",
      "Rabble-rousing",
      "Gambling"
    ],
    idealistIdeals: [
      "Always speak the truth",
      "Always stand up to bullies",
      "Always keep your promises",
      "Never strike the first blow",
      "Never deny a request for help",
      "Never leave a friend behind"
    ],
    iconResponsibilities: [
      "protecting people from natural disasters and dark spirits",
      "destroying dangerous creatures",
      "overthrowing tyrants",
      "serving and defending rightful rulers",
      "performing rituals",
      "providing aid to the downtrodden",
      "searching for hidden histories and artifacts",
      "guarding nature",
      "safekeeping records and relics"
    ],
    iconProhibitions: [
      "never refuse an earnest request for help",
      "never express great emotion",
      "never run from a fight",
      "never start a fight",
      "never deny someone knowledge or truth",
      "never use your role for gain or profit",
      "never intervene in a community without invitation",
      "never withhold forgiveness",
      "never steal or cheat"
    ],
    prodigyAreas: ["Shaping", "Sensing", "Maneuvering", "Forcing", "Breaking", "Guarding"],
    boundExtraTenets: [
      "prevent destruction",
      "protect the vulnerable",
      "subdue dangers",
      "discover and share the truth",
      "handle problems decisively"
    ],
    pillarValues: ["Excellence", "Justice", "Duty", "Mercy", "Tradition", "Protection"],
    pillarLeadership: [
      "Firm — openly call on a companion to live up to their principle",
      "Inspiring — live up to your principle and roll a hit",
      "Diplomatic — plead with an NPC for help and roll a 10+",
      "Empathetic — guide and comfort a companion and they open up",
      "Guidance — assess a situation and give instructions based on the answers",
      "Indomitable — hit when you resist a balance shift or deny a callout"
    ],
    pillarSupport: [
      "Comforting — quiet moment to clear a condition",
      "Invigorating — rally a companion to clear 2-fatigue",
      "Defending — clear a negative status within reach",
      "Bolstering — help another companion for +1 after the roll",
      "Encouraging — endorse a friend living up to their principle",
      "Trusting — endorse a friend resisting a balance shift for +2"
    ],
    successorDomains: [
      "high society",
      "military command",
      "arts and entertainment",
      "land ownership",
      "organized crime",
      "spiritual authority",
      "state politics",
      "business and industry",
      "elite academics",
      "vigilante militias",
      "media and news",
      "vital supply chains"
    ],
    successorResources: [
      "obscure or forbidden knowledge",
      "introductions and connections",
      "servants or muscle",
      "high technology",
      "cold hard cash",
      "spiritual artifacts or tomes"
    ],
    authorityKinds: [
      "corporation",
      "political organization",
      "craft guild",
      "relief society",
      "shipping concern"
    ],
    authorityPrinciples: ["Growth", "Power", "Change", "Protection", "Invention"],
    architectMarvels: [
      "An impressive invention → a profitable company [Growth vs Restraint]",
      "An ideological treatise → a philosophical movement [Complexity vs Certainty]",
      "A unique fighting style → a training center [Study vs Action]",
      "A major discovery → a research community [Knowledge vs Utility]",
      "A set of healing processes → an aid organization [Intervention vs Reaction]"
    ],
    destined: [
      "I will restore a place that was written off",
      "I will end a conflict I did not start",
      "I will bring a hidden truth into the open",
      "I will protect someone the world has already mourned",
      "I will refuse the future others named for me"
    ],
    destinedDetails: [
      "I will need the help of someone I do not yet trust",
      "I will weather a betrayal close to home",
      "I will lose a tool or title I think I need",
      "I will learn a crucial truth from a rival"
    ],
    razorMistakes: [
      "subjugated a group or place",
      "betrayed trust in a vital moment",
      "destroyed someone trying to save you",
      "delivered an innocent to your masters",
      "badly injured someone who would not fight back",
      "trained someone younger with the same awful methods"
    ],
    brokenWounds: [
      "You failed at a crucial moment — underline Afraid",
      "You made the wrong decision — underline Guilty",
      "You were betrayed — underline Insecure",
      "You lost control — underline Angry",
      "You were absent — underline Troubled"
    ],
    iconTraditions: {
      "air-nomads": "Keeper of a temple’s wind-rites",
      "northern-water": "Heir of a moon-and-ocean rite",
      "southern-water": "Bearer of a southern clan’s old songs",
      "foggy-swamp": "Speaker for the deep-root spirits",
      "earth-kingdom": "Guardian of a provincial earth-rite",
      "fire-nation": "Bearer of an ancestral flame duty",
      "kyoshi-island": "Island tradition of the painted warriors",
      "fire-colonies": "Go-between rite of two flags",
      "united-republic": "Civic tradition of a new city"
    },
    successorLineages: {
      "air-nomads": "a remembered temple lineage",
      "northern-water": "a northern chiefly house",
      "southern-water": "a southern clan with old claims",
      "foggy-swamp": "a swamp family that speaks for a stretch of river",
      "earth-kingdom": "a provincial house with a long wall-name",
      "fire-nation": "an island house tied to the court",
      "kyoshi-island": "an island family that keeps the old makeup-rites",
      "fire-colonies": "a colonial house with two homelands",
      "united-republic": "a city family that funded the first wards"
    },
    authorityFactions: {
      "air-nomads": "the Temple Steward Circle",
      "northern-water": "the Harbor Compact",
      "southern-water": "the Southern Relief Society",
      "foggy-swamp": "the Root-and-River Collective",
      "earth-kingdom": "the Provincial Grain Board",
      "fire-nation": "the Foundry Syndicate",
      "kyoshi-island": "the Island Defense Compact",
      "fire-colonies": "the Mixed-Harbor Guild",
      "united-republic": "the Ward Council League"
    },
    boundInstitutions: [
      "a secretive order",
      "a military force",
      "a peacekeeping organization",
      "a temple bureaucracy",
      "a city watch"
    ],
    boundTitles: ["adjutant", "initiate-captain", "oath-bearer", "field justiciar", "temple liaison"],
    pillarTraits: ["disciplined", "loud in a fight", "famous for drills", "loyal to a fault", "overly formal"],
    animalCompanions: [
      "Nuri, eel-hound",
      "Kepp, sky bison calf",
      "Doro, polar bear-dog",
      "Saffron, flying boar",
      "Moth, cat-gator"
    ]
  }
};
