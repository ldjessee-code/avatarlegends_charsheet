/**
 * broken.js — The Broken (Uncle Iroh’s Adventure Guide)
 * From Uncle Iroh's Adventure Guide playbooks PDF
 */
window.AL = window.AL || {};
AL.PLAYBOOKS = AL.PLAYBOOKS || {};

AL.PLAYBOOKS.broken = {
  id: "broken",
  name: "The Broken",
  source: "Uncle Iroh’s Adventure Guide",
  tagline: "You suffered a terrible tragedy that broke your image of yourself—and you’re healing.",

  principles: {
    left: "Reinvention",
    right: "Restoration"
  },

  baseStats: {
    Creativity: -1,
    Focus: -1,
    Harmony: -1,
    Passion: -1,
  },

  demeanors: ["Aloof", "Benign", "Generous", "Melancholy", "Succinct", "Supportive"],

  feature: {
    name: "Wounds of the Past",
    summary: "Three ongoing wounds with Recovery tracks; reconciling raises stats.",
    fields: [{"id": "wound1", "label": "Wound 1 (underlined condition + recovery notes)", "type": "textarea", "minHeight": "2.8rem"}, {"id": "wound2", "label": "Wound 2", "type": "textarea", "minHeight": "2.8rem"}, {"id": "wound3", "label": "Wound 3", "type": "textarea", "minHeight": "2.8rem"}, {"id": "reconcile_methods_used", "label": "Reconciliation methods already used (cross off)", "type": "textarea", "minHeight": "2.8rem"}],
    text: [
      "Choose three ongoing wounds (examples: you failed at a crucial moment—underline Afraid; you made the wrong decision—underline Guilty; you were betrayed—underline Insecure; you lost control—underline Angry; you were absent—underline Troubled).",
      "Reconciliation — Record each underlined condition. Each time you would clear one of these conditions, you may instead mark one box on its Recovery track. Each time you would mark growth, you may instead mark a Recovery box. Once a Recovery track is full, reconcile that wound by: encountering a similar situation and playing it differently; confronting someone from the tragedy and sharing true feelings; using a Moment of Balance; or losing your Balance by your own choice. Check at end of session; only one wound per session. Each method can only be used once (cross it off). Then add +2 to one stat and +1 to a second (may raise to +3). Once all wounds are reconciled, shift your center once toward the principle it’s closest to (or choose if tied).",
      "On the Path — Whenever you roll a miss, you mark growth. Whenever someone helps you, as long as you still have at least one wound, you take a +2 instead of a +1.",
    ]
  },

  movesChoose: 2,
  moves: [
    {
      id: "destiny-is-a-funny-thing",
      name: "Destiny Is a Funny Thing",
      text: "When you shift someone else’s balance through kindness or understanding, mark 1-fatigue to shift it an additional time."
    },
    {
      id: "true-humility",
      name: "True Humility",
      text: "When you rely on your skills and training, if you roll a miss, you may express true humility in the face of difficulty to mark 3-fatigue and treat your roll as a 7–9."
    },
    {
      id: "life-happens-where-you-are",
      name: "Life Happens Where You Are",
      text: "When you assess a situation, you may always ask one of the following questions, even on a miss: Who here could be a friend or ally? Who here is most in need of help? Does anything here belong to my past? If so, what?"
    },
    {
      id: "second-chances",
      name: "Second Chances",
      text: "When you offer a chance to stop fighting and talk to an opponent after you have advanced & attacked during an exchange, you may plead with them using Passion instead of Harmony. After you plead, you may shift your balance one step, even on a miss."
    },
    {
      id: "give-yourself-hope",
      name: "Give Yourself Hope",
      text: "When you encourage someone to choose something to hope for while guiding and comforting them, if they name what they hope for out loud then they and you clear 1-fatigue in addition to any other effects, even on a miss."
    },
  ],

  history: ["What does the world at large know about your tragedy?", "Who was there during your tragedy and has shown you only kindness?", "Who cannot stand the sight of you after your tragedy?", "What simple keepsake reminds you of what you have lost?", "Why are you committed to this group or purpose?"],

  connections: [{"id": "conn1", "prompt": "reminds me of someone I have lost; I have to keep them safe, even from themself."}, {"id": "conn2", "prompt": "is walking down a path that leads to tragedy like mine; I have to deter them, or keep them away from those I care about."}],

  growthQuestion: "Did you get someone to invest in their own future?",

  momentOfBalance: "You’ve been trying to heal yourself, but it’s painful to simply try to be the person you once were without acknowledging what you’ve been through, and that pain keeps you from doing good in the world. But now, you have a flash of inspiration of who you could be, melding the best of who you once were with the person who knows more, who has seen more, and who can use that wisdom to do real good. Tell the GM how you wield a piece of your training or knowledge from your past self in a brand new way to create something truly good or change someone for the better.",

  startingTechnique: {
    id: "watchful-protection",
    name: "Watchful Protection",
    approach: "defend",
    mastery: "mastered",
    text: "Prepare to save your comrades from dire straits. If any of your companions is taken out or loses their balance in this exchange, you may mark 2-fatigue to save them from the brink, nullifying the blow that would have taken them out or shifted their balance."
  }
};
