/**
 * razor.js — The Razor (Wan Shi Tong’s Adventure Guide)
 * Playbook data for AL.PLAYBOOKS.razor
 */
window.AL = window.AL || {};
AL.PLAYBOOKS = AL.PLAYBOOKS || {};

AL.PLAYBOOKS.razor = {
  id: "razor",
  name: "The Razor",
  source: "Wan Shi Tong’s Adventure Guide",
  tagline: "You were once the weapon of powerful masters—and you must make amends.",

  principles: {
    left: "Connection",
    right: "Control"
  },

  baseStats: {
    Creativity: 0,
    Focus: 2,
    Harmony: -1,
    Passion: 0,
  },

  demeanors: ["Childish", "Fierce", "Imperious", "Overbearing", "Proper", "Strange"],

  feature: {
    name: "Making Amends",
    summary: "Mistakes, disconnected Connection track, and Honed.",
    fields: [{"id": "mistakes", "label": "4 mistakes you’re making up for", "type": "textarea", "minHeight": "4rem"}, {"id": "connection_unlocked", "label": "Highest unlocked Connection space (− notes)", "type": "text", "placeholder": "0 (starts locked above +0)"}, {"id": "crossed_conditions", "label": "Crossed-off conditions (Honed)", "type": "text"}],
    text: [
      "You were once the weapon of powerful figures—your masters. Choose four mistakes you’re trying to make up for (examples: subjugate a group or place; betray trust in a vital moment; destroy someone trying to save you; deliver an innocent to your masters; badly injure someone; train someone younger with the same awful methods).",
      "Once per session, when you have tried your best to prove you are a different, better person through your actions, roll taking +1 for each yes: Did you make amends directly to a person you harmed? Are you at your center? Did someone honestly thank you or forgive you? On a hit, you feel hope. On a 7–9, choose 1. On a 10+, choose 2 (or the same twice), or unlock the next Connection balance track space: Clear a condition; Mark growth; Shift your Balance toward Connection. On a miss, ask someone what more you can do; the GM shifts your balance twice based on their answer.",
      "Disconnected — Your Balance begins play at +2 Control; you can still shift it by one step at creation. Your Connection principle starts locked—you cannot shift your balance higher than +0 Connection. If you would shift to a locked value, you lose your balance, but your center cannot shift higher than the highest unlocked Connection value. When you unlock Connection +3, treat your balance track as normal. When you shift your center to +1, +2, and +3 Connection for the first time, choose a companion; they give you one move from their playbook (ignoring advancement limits).",
      "Honed — When you sublimate your feelings to be effective, clear conditions equal to one plus your Control and cross off one unmarked condition—you can no longer mark that condition. When you shift your center toward Connection, you may restore all crossed-off conditions. You may live up to your Control principle by shifting balance toward Control instead of marking fatigue.",
    ]
  },

  movesChoose: 2,
  moves: [
    {
      id: "air-cutting-edge",
      name: "Air-Cutting Edge",
      text: "Take +1 Focus (to a max of +3)."
    },
    {
      id: "mind-of-steel",
      name: "Mind of Steel",
      text: "When you advance & attack or evade & observe with fewer conditions marked than your highest principle, you can roll with Focus instead of the normal stat."
    },
    {
      id: "im-a-people-person",
      name: "I’m a People Person",
      text: "When you watch someone interact with another person, roll with Focus. On a 7–9, ask 1. On a 10+, ask 2. Take +1 ongoing to act on the answers: Are you lying right now? What are you most afraid of? How are you vulnerable to me? How can I get you to mark the condition ______? On a miss, you can’t get a good read on them; mark a condition in frustration."
    },
    {
      id: "come-and-get-it",
      name: "Come and Get It",
      text: "When you trick someone by provoking them through their conditions, roll with their conditions marked instead of Creativity."
    },
    {
      id: "winning-is-everything",
      name: "Winning Is Everything",
      text: "When you choose to use dirty tactics—targeting an innocent your foe is trying to protect, throwing sand in their face, etc.—at the start of a combat exchange, instead of using one of the standard approaches say what you do and take a 10+ instead of rolling the stance move; you become Favored for this exchange and may choose your techniques from any approach. At the end of the exchange, your opponent may call out your disgraceful behavior and lack of integrity to shift your balance twice."
    },
  ],

  history: ["Why were you chosen to be honed, perfected, and used by your masters?", "Who was the former master you were closest to?", "Who helped give you the will you needed to break with your masters and be something more?", "What totem of your masters can you not bring yourself to throw away?", "Why are you committed to this group or purpose?"],

  connections: [{"id": "conn1", "prompt": "seems to be able to connect to other people openly, freely, and easily. I wish they would show me how."}, {"id": "conn2", "prompt": "I see them as lacking control. Maybe I can help hone them, at least a little bit."}],

  growthQuestion: "Did you try to make amends for past mistakes, or prove you’re a different person now?",

  momentOfBalance: "You were taught to control yourself, and that to give of yourself, to connect, is to lose control. But now, you see that connection isn’t weakness; it is a choice, a true way of controlling yourself. You seize that now, choosing to embrace connection to others and spring yourself to impossible heights. Tell the GM how you save those you care about from an outrageously dangerous threat or problem.",

  startingTechnique: {
    id: "lure",
    name: "Lure",
    approach: "defend",
    mastery: "mastered",
    text: "You put a foe off-balance by luring them in. Name a foe you lure; if they don’t attempt to either inflict fatigue, conditions, balance shifts, or negative statuses on you by the end of this exchange, they must mark 2-fatigue. If they do attempt to harm you this exchange, you become Favored for the next exchange."
  }
};
