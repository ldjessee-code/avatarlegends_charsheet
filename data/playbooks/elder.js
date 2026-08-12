/**
 * elder.js — The Elder (Wan Shi Tong’s Adventure Guide)
 * Playbook data for AL.PLAYBOOKS.elder
 */
window.AL = window.AL || {};
AL.PLAYBOOKS = AL.PLAYBOOKS || {};

AL.PLAYBOOKS.elder = {
  id: "elder",
  name: "The Elder",
  source: "Wan Shi Tong’s Adventure Guide",
  tagline: "You’ve lived longer than the other companions—long enough to have mastered your training many times over.",

  principles: {
    left: "Humility",
    right: "Experience"
  },

  baseStats: {
    Creativity: 0,
    Focus: 0,
    Harmony: 2,
    Passion: -1,
  },

  demeanors: ["Diligent", "Kindly", "Bemused", "Dour", "Distant", "Irascible"],

  conditions: [{"id": "frustrated", "name": "Frustrated", "penalty": "−2 to push your luck and +1 to intimidate", "clear": "Lash out at someone or act decisively without consulting anyone."}, {"id": "jaded", "name": "Jaded", "penalty": "−2 to plead and +1 to trick", "clear": "Give in or give up in the face of meaningful opposition."}, {"id": "remorseful", "name": "Remorseful", "penalty": "−2 to the stance move and +1 to call someone out", "clear": "Attempt to make genuine amends for past wrongs."}, {"id": "shaken", "name": "Shaken", "penalty": "−2 to guide and comfort and +1 to assess a situation", "clear": "Seek guidance from an old friend or mentor."}, {"id": "worried", "name": "Worried", "penalty": "−2 to deny a callout and +1 to rely on skills or training", "clear": "Take control in a situation in which another should lead."}],

  feature: {
    name: "Wisdom of the Ages",
    summary: "Extra mastered techniques and protégés instead of normal growth.",
    fields: [{"id": "proteges", "label": "Protégés (name + principle)", "type": "textarea", "minHeight": "3.5rem"}],
    text: [
      "In addition to your normal playbook technique, you start with four other mastered techniques. You don’t have to name them at character creation; you can choose them whenever you like, even in the middle of a combat exchange. You can train other PCs in your mastered techniques using the standard training move.",
      "Until you open up a new slot for another technique, you cannot learn new techniques. When you shift your center to +1, +2, or +3 Humility for the first time, you open up a new slot; you may learn and develop a new technique to fill that slot as normal.",
      "You do not earn growth from the usual questions. When a PC embraces your guidance and comfort, you may shift toward Experience to declare them a protégé; write their name and one of their principles. When that PC shifts their center toward that principle, clear their name and take an advancement; you may add them to your list again in the same way.",
      "Your conditions are different (see the Conditions section)—they offer bonuses as well as penalties. You cannot take moves from other playbooks that reference conditions you don’t have.",
    ]
  },

  movesChoose: 2,
  moves: [
    {
      id: "as-long-as-im-breathing",
      name: "As Long as I’m Breathing",
      text: "When you try to intimidate someone in order to protect the vulnerable or weak, roll with Harmony instead of Passion."
    },
    {
      id: "lifes-true-delights",
      name: "Life’s True Delights",
      text: "When you pursue a genuine moment of respite, roll with Harmony. On a hit, shift your balance as you choose. On a 10+, you also gain some new insight; ask the GM a question and they will answer honestly. On a 7–9, your self-indulgence creates an opportunity for your enemies or rivals; the GM will tell you how. On a miss, you fixate on your past with disastrous results; tell the GM what old conflict mars your peace and shift your balance twice away from center."
    },
    {
      id: "around-here-somewhere",
      name: "Around Here Somewhere",
      text: "When you go looking for help from an old friend in the area who you haven’t seen recently, name them and roll with Harmony. On a hit, you find them and they can assist you. On a 7–9, pick 1. On a 10+, both: they aren’t caught up in their own problems; you don’t owe them a favor or apology. On a miss, your old enemies were looking for you too; the GM will tell you how you know they are near."
    },
    {
      id: "cut-the-garbage",
      name: "Cut the Garbage",
      text: "When you openly confront someone to get the truth, roll with Harmony. On a hit, ask 2; the character can say or do what they like, but their player will answer honestly. On a 7–9, their player gets to ask a question you must answer honestly as well: Are you telling the truth? What are you really feeling? What do you intend to do next? What do you really think about ______? How could I get you to ______? On a miss, the confrontation goes awry; they inflict a condition on you and ask one question from the list of you; you must answer honestly."
    },
    {
      id: "an-open-heart",
      name: "An Open Heart",
      text: "Take +1 Harmony (max +3)."
    },
  ],

  history: ["What great legacy did you inherit decades ago and recently relinquish?", "Who has never forgiven you for decisions you made years ago?", "Who is still your ally and confidante, despite the tense history you’ve shared?", "What outfit or uniform do you wear to remind yourself of your former duties?", "Why are you committed to this group or purpose?"],

  connections: [{"id": "conn1", "prompt": "I care about them more than they know...even though they are probably my most frustrating student."}, {"id": "conn2", "prompt": "is not to be underestimated. In fact, they may have something to teach me!"}],

  growthQuestion: "Growth comes from protégés shifting center toward a principle you named (see Wisdom of the Ages)—not the usual session questions alone.",

  momentOfBalance: "You will always be anchored to the past—unable to escape the painful lessons you have learned—but now you can hold the weight of that experience with the humility true wisdom brings. You look upon the current situation with unbiased eyes to see the truths roiling beneath the surface. Tell the GM how you wipe away whatever conceals the truth so no one can see things as they once thought they were.",

  startingTechnique: {
    id: "patience",
    name: "Patience",
    approach: "evade",
    mastery: "mastered",
    text: "You wait until the perfect moment to act. Mark 1-fatigue to gain Prepared and use an advance and attack technique, paying all its costs as normal. Mark another fatigue to allow a companion engaged with that same foe to also use an advance and attack technique against them as well, also paying all costs as appropriate."
  }
,
  extraStartingTechniqueSlots: 4
};
