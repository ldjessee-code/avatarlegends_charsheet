/**
 * adamant.js — The Adamant (Core Book)
 *
 * Playbook-only data consumed by js/sheet.js via AL.PLAYBOOKS.adamant
 * Extracted from AvatarLegends-CorePlaybooks-printerfriendly-4.pdf
 *
 * Fields: principles, baseStats, demeanors, feature, moves, history,
 * connections, growthQuestion, momentOfBalance, startingTechnique
 */
window.AL = window.AL || {};
AL.PLAYBOOKS = AL.PLAYBOOKS || {};

AL.PLAYBOOKS.adamant = {
  id: "adamant",
  name: "The Adamant",
  source: "Core Book",
  tagline: "There’s only one person you often let past your emotional walls.",

  principles: {
    left: "Results",
    right: "Restraint"
  },

  /** Base stats before creation +1 */
  baseStats: {
    Creativity: 0,
    Focus: 1,
    Harmony: -1,
    Passion: 1
  },

  demeanors: [
    "Above-it-all",
    "Perfectionist",
    "Chilly",
    "Rebellious",
    "Flippant",
    "Standoffish"
  ],

  feature: {
    name: "The Lodestar",
    summary: "One person you let past your emotional walls.",
    fields: [
      {
        id: "lodestar",
        label: "Name your lodestar (choose a PC to start)",
        type: "text"
      }
    ],
    text: [
      "You can shift your lodestar to someone new when they guide and comfort you and you open up to them, or when you guide and comfort them and they open up to you. If you do choose to shift your lodestar, clear a condition.",
      "When you shut down someone vulnerable to harsh words or icy silence, shift your balance toward Results and roll with Results. On a hit, they mark a condition and you may clear the same condition. On a 10+, they also cannot shift your balance or call you out for the rest of the scene. On a miss, they have exactly the right retort; mark a condition and they shift your balance. You cannot use this on your lodestar.",
      "When your lodestar shifts your balance or calls you out, you cannot resist it. Treat an NPC lodestar calling you out as if you rolled a 10+, and a PC lodestar calling you out as if they rolled a 10+.",
      "When you consult your lodestar for advice on a problem (or permission to use your preferred solution), roll with Restraint. On a 10+ take all three; on a 7–9 they choose two:",
      "• You see the wisdom of their advice. They shift your balance; follow their advice and they shift your balance again.",
      "• The conversation bolsters you. Clear a condition or 2-fatigue.",
      "• They feel at ease offering their opinion. They clear a condition or 2-fatigue.",
      "On a miss, something about their advice infuriates you. Mark a condition or have the GM shift your balance twice."
    ]
  },

  movesChoose: 2,
  moves: [
    {
      id: "this-was-a-victory",
      name: "This Was a Victory",
      text: "When you reveal that you have sabotaged a building, device, or vehicle right as it becomes relevant, mark fatigue and roll with Passion. On a hit, your work pays off, creating an opportunity for you and your allies at just the right time. On a 7–9, the opportunity is fleeting—act fast to stay ahead of the consequences. On a miss, your action was ill-judged and something or someone you care about is hurt as collateral damage."
    },
    {
      id: "takes-one-to-know-one",
      name: "Takes One to Know One",
      text: "When you verbally needle someone by finding the weaknesses in their armor, roll with Focus. On a hit, ask 1 question. On a 7–9, they ask 1 of you as well: What is your principle? What do you need to prove? What could shake your certainty? Whom do you care about more than you let on? Anyone who lies or stonewalls marks 2-fatigue. On a miss, your attack leaves you exposed; they may ask you any one question from the list, and you must answer honestly."
    },
    {
      id: "no-time-for-feelings",
      name: "No Time for Feelings",
      text: "When you have equal or fewer conditions marked than your highest principle, mark fatigue to push down your feelings for the rest of the scene and ignore condition penalties until the end of the scene. When you resist an NPC shifting your balance, mark a condition to roll with conditions marked (max +4). You cannot then choose to clear a condition by immediately proving them wrong."
    },
    {
      id: "i-dont-hate-you",
      name: "I Don’t Hate You",
      text: "When you guide and comfort someone in an awkward, understated, or idiosyncratic fashion, roll with Passion instead of Harmony if you mark Insecure or Insecure is already marked."
    },
    {
      id: "driven-by-justice",
      name: "Driven by Justice",
      text: "Take +1 to Passion (max +3)."
    }
  ],

  history: [
    "What experience of being deceived or manipulated convinced you to steel yourself against being swayed by other people?",
    "Who was your first lodestar, and why were they an exception? Why aren’t they your lodestar anymore?",
    "Who earned your grudging respect by teaching you pragmatism?",
    "What heirloom or piece of craftsmanship do you carry to remind you to stay true to yourself?",
    "Why are you committed to this group or purpose?"
  ],

  connections: [
    {
      id: "conn1",
      prompt: "takes issue with my methods—perhaps they have a point, but I certainly can’t admit that to them!"
    },
    {
      id: "conn2",
      prompt: "is my lodestar; something about them makes them the one person I let my guard down around."
    }
  ],

  growthQuestion: "Did you seek support or guidance from others?",

  momentOfBalance:
    "You’ve held true to a core of conviction even while getting your hands dirty to do what you deemed necessary. But balance means appreciating that other people are just as complex as you are, not merely obstacles or pawns. Tell the GM how you solve an intractable problem or calm a terrible conflict by relating to dangerous people on a human level.",

  startingTechnique: {
    id: "pinpoint-aim",
    name: "Pinpoint Aim",
    approach: "defend",
    mastered: false,
    text: "Take the time you need to line up a perfect shot; become Prepared. In the next exchange, if you advance and attack, roll with Focus or Passion, your choice. If you use Strike, you do not have to mark fatigue to choose what you inflict."
  }
};
