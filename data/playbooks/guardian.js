/**
 * guardian.js — The Guardian (Core Book)
 * Extracted from AvatarLegends-CorePlaybooks-printerfriendly-4.pdf
 */
window.AL = window.AL || {};
AL.PLAYBOOKS = AL.PLAYBOOKS || {};

AL.PLAYBOOKS.guardian = {
  id: "guardian",
  name: "The Guardian",
  source: "Core Book",
  tagline:
    "You take it upon yourself to protect the people around you in general, but you have someone in particular you keep safe.",

  principles: {
    left: "Trust",
    right: "Self-Reliance"
  },

  baseStats: {
    Creativity: -1,
    Focus: 1,
    Harmony: 0,
    Passion: 1
  },

  demeanors: ["Harsh", "Serious", "Polite", "Quiet", "Suspicious", "Cautious"],

  feature: {
    name: "Protector’s Burden",
    summary: "You keep a ward safe.",
    fields: [
      {
        id: "ward",
        label: "Name your ward (choose a PC to start)",
        type: "text"
      },
      {
        id: "catch_a_liar_name",
        label: "Catch a Liar — target (if you took that move)",
        type: "text",
        placeholder: "Name of the person you’re watching"
      }
    ],
    text: [
      "When they mark a condition in front of you, mark fatigue or a condition. Your ward can always call on you to live up to your principle—without shifting their balance away from center—and they take +1 to do it.",
      "At the beginning of each session, roll, taking +1 for each yes:",
      "• Do you believe your ward listens to you more often than not?",
      "• Have you recently protected them or helped them with a problem?",
      "• Is there an immediate threat to your ward that you are aware of?",
      "On a 7–9, hold 1. On a 10+, hold 2. At any time, spend the hold to:",
      "• Take a 10+ without rolling on any move to defend or protect them",
      "• Track them down even if they are hidden or avoiding you",
      "• Figure out what they’re up to without them knowing",
      "On a miss, hold 1, but…you’re drifting apart on different paths. By the end of the session, you must choose one:",
      "• Decide you’re the only one who can keep them safe; shift your balance twice toward Self-Reliance and keep them as your ward",
      "• Decide they can handle life without your protection; shift your balance twice toward Trust and switch your ward to a new person",
      "You may also switch your ward if they leave play or are no longer present for some reason. When you switch your ward, you can switch to an NPC (if the GM agrees)."
    ]
  },

  movesChoose: 2,
  moves: [
    {
      id: "suspicious-mind",
      name: "Suspicious Mind",
      text: "When you watch a person carefully to figure them out, roll with Focus. On a 7–9, hold 1. On a 10+, hold 2. Spend your hold, 1-for-1, to ask their player questions while you observe or interact with them; they must answer honestly: Are you telling the truth? What are you truly feeling? What do you really want right now? What are you worried about? What are you about to do?"
    },
    {
      id: "badge-of-authority",
      name: "Badge of Authority",
      text: "You have some badge or symbol of authority from your background, something that makes you someone to be listened to, if not well-liked or entirely respected. When you give an NPC an order based on that authority and their recognition of it, roll with Passion. On a hit, they do what you say. On a 7–9, they choose 1: They do it, but in lackluster fashion; They say they need something first to be able to do it; They do it, but they’re going to talk to your superiors. On a miss, the authority of your badge doesn’t sway them; they do as they please and you take −1 forward against them."
    },
    {
      id: "catch-a-liar",
      name: "Catch a Liar",
      text: "When you are suspicious of someone, write their name here (use the field in Additional notes / this move’s notes). You cannot write another until you have made them admit their guilt and misdeeds in front of an audience, or until you no longer seek to uncover their secrets. When they admit their guilt and misdeeds in front of an audience, clear their name from this move. When you no longer seek to uncover their secrets, you may mark a condition to clear their name from this move. When you expose that person’s lies or wrong-doing, clear all your fatigue and up to two conditions. When you try to intimidate them into admitting their real crimes by using actual evidence, you can eliminate one additional option from the list on any hit before they choose."
    },
    {
      id: "furrowed-brow",
      name: "Furrowed Brow",
      text: "Take +1 Focus (max +3)."
    },
    {
      id: "martyr-complex",
      name: "Martyr Complex",
      text: "When you have a total of 8 between conditions marked, highest principle, and fatigue marked, take +1 ongoing to all moves."
    }
  ],

  history: [
    "What pushed you to assume responsibility for the people you care about?",
    "Whom have you protected for so long…but maybe doesn’t need you anymore?",
    "Who used to be in your circle of trust before they betrayed you?",
    "What tattered garment or adornment reminds you of those you protect…or failed to protect?",
    "Why are you committed to this group or purpose?"
  ],

  connections: [
    {
      id: "conn1",
      prompt: "is my ward—they need me to have their back, end of story."
    },
    {
      id: "conn2",
      prompt:
        "looks like they’re more than capable without my help; I’m glad some of us can take care of ourselves."
    }
  ],

  growthQuestion:
    "Did you pursue a desire or goal of your own, outside of protecting others?",

  momentOfBalance:
    "You’ve sworn to protect the people you care about, but balance is about finding your own place in the world as well. You know what you’re capable of accomplishing, and you step up to show the world your unique strength. Tell the GM how you put your own life on the line to defeat a villain or danger that seems unstoppable.",

  startingTechnique: {
    id: "divert",
    name: "Divert",
    approach: "defend",
    mastery: "mastered",
    text: "Step into the way of blows intended for allies; when any ally within reach suffers a blow this exchange, you can suffer it for them. If you also use Retaliate this exchange, deal an additional 1-fatigue each time."
  }
};
