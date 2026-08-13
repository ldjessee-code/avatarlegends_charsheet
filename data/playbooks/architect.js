/**
 * architect.js — The Architect (Uncle Iroh’s Adventure Guide)
 * From Uncle Iroh's Adventure Guide playbooks PDF
 */
window.AL = window.AL || {};
AL.PLAYBOOKS = AL.PLAYBOOKS || {};

AL.PLAYBOOKS.architect = {
  id: "architect",
  name: "The Architect",
  source: "Uncle Iroh’s Adventure Guide",
  tagline: "One of your creations is a true marvel—and a steward grew to monitor and wield it.",

  principles: {
    left: "Discovery",
    right: "Planning"
  },

  baseStats: {
    Creativity: 2,
    Focus: 0,
    Harmony: -1,
    Passion: 0,
  },

  demeanors: ["Distractible", "Excitable", "Talkative", "Perfectionist", "Wide-eyed", "Zealous"],

  feature: {
    name: "Your Marvel & Steward",
    summary: "A marvel, its steward organization, and making new marvels.",
    fields: [{"id": "marvel_nature", "label": "Marvel & steward nature (with steward balance principles)", "type": "textarea", "minHeight": "3rem", "placeholder": "e.g. An impressive invention → a profitable company [Growth vs Restraint]"}, {"id": "steward_name", "label": "Steward’s name", "type": "text"}, {"id": "steward_principles", "label": "Steward balance ends (left vs right)", "type": "text", "placeholder": "e.g. Growth vs Restraint"}, {"id": "steward_intention", "label": "Your Intention (−1 or +1)", "type": "text"}, {"id": "steward_balance", "label": "Steward’s current balance", "type": "text", "placeholder": "e.g. +1 Growth"}, {"id": "marvel_projects", "label": "Marvel projects / clocks (notes)", "type": "textarea", "minHeight": "3.5rem"}],
    text: [
      "One of your creations is a true marvel. A whole organization—the steward—grew to monitor and wield the marvel. That organization doesn’t belong to you, but you have hopes for it. Choose the nature of your marvel and steward: An impressive invention → a profitable company [Growth vs Restraint]; An ideological treatise → a philosophical movement [Complexity vs Certainty]; A unique fighting style → a training center [Study vs Action]; A major discovery → a research community [Knowledge vs Utility]; A set of healing processes → an aid organization [Intervention vs Reaction].",
      "At character creation, underline either −1 or +1 as your Intention for the steward; circle the opposite point as the steward’s starting balance. At the end of each session, the GM may shift the steward’s balance one step if appropriate. When your center shifts toward Discovery, you may move your Intention to the organization’s balance. When your center shifts toward Planning, you may move your Intention and the organization’s balance once in the same direction of your choice.",
      "If the organization ever loses its balance, it enters into a dangerous crisis; the GM will tell you how internal rifts threaten to tear it apart. If your Intent and the organization’s balance are ever in-line, you and the organization are in sync—while in sync, you can create marvels.",
      "Making Marvels — When you try to create or work on a new marvel while in sync, choose an existing project or a new one; for a new project the GM sets a clock with 4, 6, or 8 segments. Roll with your highest balance principle. On 10+, mark 3 segments. On 7–9, mark 2 segments, or mark a condition and 3 segments. On a miss, mark a condition and 1 segment. When all segments are filled, you create your new marvel. When you use a marvel (including your original) to solve an immediate problem, roll to rely on your skills and training with a +2, and ignore any conditions you have marked.",
    ]
  },

  movesChoose: 2,
  moves: [
    {
      id: "creative-combat",
      name: "Creative Combat",
      text: "When you gain a positive status, you may mark 2-fatigue to take a second appropriate to the situation. When you inflict a negative status, you may mark 2-fatigue to inflict a second appropriate to the situation."
    },
    {
      id: "think-of-the-possibilities",
      name: "Think of the Possibilities",
      text: "When you assess the situation, you may always mark 1-fatigue to ask “What here can I use to ___?”, as an additional question, even on a miss."
    },
    {
      id: "slow-down-and-think",
      name: "Slow Down and Think",
      text: "When you guide and comfort someone by asking them to slow down and think, roll with Creativity instead of Harmony. If they embrace your guidance and comfort, both you and they shift your balance toward center."
    },
    {
      id: "do-you-have-a-plan",
      name: "Do You Have a Plan?",
      text: "When you watch someone to discover their goals and intent, roll with Creativity. On a 7–9, you may learn 2 of the following; on a 10+, you may learn 3: Their balance principle; Their immediate goal; Their most pressing concern; Their long term investment. On a miss, you inadvertently reveal your own goals to someone watching; they learn 3 of the above from you."
    },
    {
      id: "see-it-my-way",
      name: "See It My Way",
      text: "When you try to alter an NPC’s perspective, roll with Creativity. On a hit, they adopt the balance principle of your choice at the same value as their current value until the situation changes. On a 10+, you may also shift their balance one step. On a miss, they hear the wrong message; the GM may change their principle to whatever they choose, permanently or temporarily as they choose."
    },
  ],

  history: ["What first inspired you to build your marvel?", "Who was instrumental in building your marvel but no longer agrees with you about its future?", "Who has the greatest direct influence over your marvel today?", "What memento do you keep that reminds you of your spark of innovation?", "Why are you committed to this group or purpose?"],

  connections: [{"id": "conn1", "prompt": "seems to have great ideas worth building upon; I should partner up with them!"}, {"id": "conn2", "prompt": "might be exactly the right person to help guide my marvel’s steward back on track."}],

  growthQuestion: "Did you work toward creating a new marvel?",

  momentOfBalance: "You love to plan, and you love to problem solve, and you love to deal with issues on the fly…and now, in this moment, you can put it all together to create a solution perfected for this situation. You can call upon past plans you’ve abandoned, along with all your experience implementing new solutions on the fly, to solve an intractable, large-scale problem. Tell the GM how your old plans meld with your invention to solve the problem.",

  startingTechnique: {
    id: "stick-to-the-plan",
    name: "Stick to the Plan",
    approach: "evade",
    mastery: "mastered",
    text: "Form a plan for next exchange. Become Prepared. Choose an approach, a primary technique, and a secondary technique. For each you use next exchange, clear 1-fatigue. If you use two, become Favored. If you use all three, clear a condition."
  }
};
