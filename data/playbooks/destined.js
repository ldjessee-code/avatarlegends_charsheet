/**
 * destined.js — The Destined (Wan Shi Tong’s Adventure Guide)
 * Playbook data for AL.PLAYBOOKS.destined
 */
window.AL = window.AL || {};
AL.PLAYBOOKS = AL.PLAYBOOKS || {};

AL.PLAYBOOKS.destined = {
  id: "destined",
  name: "The Destined",
  source: "Wan Shi Tong’s Adventure Guide",
  tagline: "You have been touched by something spiritual and otherworldly.",

  principles: {
    left: "Determination",
    right: "Patience"
  },

  baseStats: {
    Creativity: 0,
    Focus: -1,
    Harmony: 2,
    Passion: 0,
  },

  demeanors: ["Eager", "Solemn", "Haunted", "Uncertain", "Jocular", "Watchful"],

  feature: {
    name: "Marked by Fate",
    summary: "Destiny details, track, and signs.",
    fields: [{"id": "my_destiny", "label": "My Destiny (choose one from the list)", "type": "textarea", "minHeight": "3rem"}, {"id": "destiny_details", "label": "Destiny details (fill as revealed)", "type": "textarea", "minHeight": "4rem"}, {"id": "destiny_track", "label": "Destiny track marks (0–10)", "type": "text", "placeholder": "0"}, {"id": "destiny_signs", "label": "Destiny signs taken", "type": "textarea", "minHeight": "3.5rem"}],
    text: [
      "At character creation, choose one from My Destiny (back of sheet), fill in one destiny detail, and take one destiny sign.",
      "Destiny Details — Fill these in as your destiny is revealed. When you act to bring about one of these details, you may live up to your Determination without marking fatigue. When you and the GM agree one is fully explored or fulfilled, mark growth. Examples: I will bring great change to ____; I will weather betrayal by ____; I will lose ____; I will need the help of ____; I will learn a crucial truth from ____; I will defend or save ____.",
      "Destiny Track — Whenever you lose your balance, get taken out, or are otherwise instructed to, mark your Destiny Track. When it fills, clear it and take a destiny sign. If you have already taken the other four, you must take “Meet Your Fate.”",
      "Destiny Signs — Otherworldly Visions: mark track for a vision; ask the GM one question. Tremble Before Me: mark track and reveal otherworldly aspect to intimidate as 10+; afterward you cannot guide/plead with them until trust is earned. Self-sacrificing: once per scene, mark track to absorb a blow aimed at an ally. Inner Strength: once per session, mark destiny twice to clear all conditions. Meet Your Fate: destiny arrives and you are changed; if you survive in human form, change playbooks.",
    ]
  },

  movesChoose: 2,
  moves: [
    {
      id: "call-from-afar",
      name: "Call from Afar",
      text: "When you reach out in mind or spirit to a far-away NPC, mark 1-fatigue and roll with Harmony. On a hit, your message gets through; choose 1. On a 10+, choose 2: You cry for help; they rush to you; You whisper a question; they whisper an answer; You send a premonition of danger; they prepare; You let them see something you see; they return memories. On a miss, you’ve attracted dangerous attention."
    },
    {
      id: "eyes-of-the-soul",
      name: "Eyes of the Soul",
      text: "When you assess a situation, you can ask one of the following as an extra question, even on a miss: Who or what here has been touched by spirits? How can I bring about peace here?"
    },
    {
      id: "peacemaker",
      name: "Peacemaker",
      text: "When you walk calmly into the middle of a fierce conflict and plead with the fighters to stop, mark fatigue to ensure that they care what you think and listen to you. On a miss, the conflict burns far hotter than you had imagined, and now you’re dead in the crosshairs of the angry fighters; brace yourself."
    },
    {
      id: "more-than-fates-playthings",
      name: "More Than Fate’s Playthings",
      text: "When you call someone out to live up to their principle by convincing them that their destiny is (or can be) different than they imagined, on a hit, they must do it or mark two conditions. On a miss, their demand hits all the harder. Mark two conditions or act as they request."
    },
    {
      id: "echoes-of-legend",
      name: "Echoes of Legend",
      text: "Once per session, when you rely on your skills and training to mirror an act from a legend, myth, or story, treat it as if you had rolled a 10+. Then, no matter the result, the GM shifts your balance toward the principle best embodied by the lore and stories you’re drawing on."
    },
  ],

  history: ["When did you realize you were marked by supernatural forces?", "Who envies your destiny and seeks to seize it from you? Why can’t you let that happen?", "Who do you turn to for guidance when you feel overwhelmed by your destiny?", "What token or symbol do you carry that proves to any observer that you are chosen by fate?", "Why are you committed to this group or purpose?"],

  connections: [{"id": "conn1", "prompt": "will play a crucial role in my fulfillment of my destiny, for good or ill."}, {"id": "conn2", "prompt": "helps me put my destiny out of my mind, for a time. Why?"}],

  growthQuestion: "Did you spend meaningful time with someone else focused on their concerns and troubles?",

  momentOfBalance: "Destiny can be a frustrating thing, demanding commitment while leaving you in the dark about its timing. But now, with your soul in balance, you can see that this is the moment you’ve been waiting for. You rise to the occasion, bolstering others with your unique spiritual gifts. Tell the GM how your serenity and resolve together win the day and inspire all those around you.",

  startingTechnique: {
    id: "anticipate",
    name: "Anticipate",
    approach: "evade",
    mastery: "mastered",
    text: "Study a nearby foe to learn where their momentum will take them next. Declare the approach they are tending towards. In the next exchange, that foe must use that approach or mark a condition."
  }
};
