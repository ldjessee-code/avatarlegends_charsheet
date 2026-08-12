/**
 * hammer.js — The Hammer (Core Book)
 * Playbook data for AL.PLAYBOOKS.hammer
 */
window.AL = window.AL || {};
AL.PLAYBOOKS = AL.PLAYBOOKS || {};

AL.PLAYBOOKS.hammer = {
  id: "hammer",
  name: "The Hammer",
  source: "Core Book",
  tagline: "You always have an adversary who embodies what you’re trying to smash through.",

  principles: {
    left: "Care",
    right: "Force"
  },

  baseStats: {
    Creativity: 1,
    Focus: -1,
    Harmony: 0,
    Passion: 1,
  },

  demeanors: ["Playful", "Blunt", "Quiet", "Loud", "Excessive", "Determined"],

  feature: {
    name: "Bringing Them Down",
    summary: "Name an adversary and a goal against them.",
    fields: [{"id": "adversary", "label": "Name your adversary", "type": "text"}, {"id": "adversary_goal", "label": "Goal (Capture / Discredit / Depose / Restrain / Expose / Exile)", "type": "text"}],
    text: [
      "You always have an adversary, one who represents the things you’re trying to smash through—tyranny, inequality, war; larger and more dangerous concepts that, to you at least, this one person embodies. Your adversary is someone significant and powerful—someone who actually deserves the amount of force you can bring to bear.",
      "Take −1 ongoing to plead with, trick, or guide and comfort your adversary.",
      "Changing Your Adversary — You can change your adversary any time you mark a condition, or at the end of each session. When you do, choose an appropriate goal, and the GM shifts your balance twice to match your new adversary and your new goal. When you successfully accomplish your goal and defeat your adversary, take a growth advancement and choose a new adversary.",
      "Fighting Your Adversary — When you enter into a fight against your adversary, clear all fatigue and become Inspired. When you select any combat approach against your adversary, mark fatigue to roll with conditions marked instead of your normal stat.",
    ]
  },

  movesChoose: 2,
  moves: [
    {
      id: "fueled-by-anger",
      name: "Fueled by Anger",
      text: "Mark Angry to use an additional basic or mastered technique when you advance and attack, even on a miss. While Angry is marked, take +1 ongoing to intimidate others."
    },
    {
      id: "walls-cant-hold-me",
      name: "Walls Can’t Hold Me",
      text: "When you rely on your skills and training to dangerously smash your way through walls or other obstacles, roll with Passion instead of Focus."
    },
    {
      id: "punch-where-it-matters",
      name: "Punch Where It Matters",
      text: "When you assess a situation, you can always ask, “Who or what here is most vulnerable to me?”, even on a miss. Remember to take +1 ongoing to act in accordance with the answer."
    },
    {
      id: "comprehend-your-foe",
      name: "Comprehend Your Foe",
      text: "When you defend and maneuver against a foe whose balance principle you know, you may mark fatigue to roll with Creativity instead of Focus."
    },
    {
      id: "stand-and-fight",
      name: "Stand and Fight!",
      text: "When you provoke an NPC opponent into attacking you, roll with Passion. On a hit, they’re coming at you specifically. On a 10+, you’re ready for them; clear a condition or become Prepared. On a miss, they take advantage of your provocation to strike a blow where you least expect it."
    },
  ],

  history: ["What injustice has driven you to use your strength for good?", "Who represents the kind of positive strength and force you want to embody?", "Who tried their best to teach you restraint, calm, and thoughtfulness?", "What fragile trinket or heirloom do you keep and protect?", "Why are you committed to this group or purpose?"],

  connections: [{"id": "conn1", "prompt": "has a way to solve problems with words instead of fists—it’s really impressive!"}, {"id": "conn2", "prompt": "won’t be able to hold their own when things get tough. I’m going to toughen them up!"}],

  growthQuestion: "Did you make progress towards your goal against your adversary?",

  momentOfBalance: "You can knock down every wall in the world, but balance isn’t found in conquest and destruction. You know some walls need to stand to keep people safe. Tell the GM how you put yourself directly in the path of an inescapable threat to completely protect someone or something from harm.",

  startingTechnique: {
    id: "overpower",
    name: "Overpower",
    approach: "advance",
    mastery: "mastered",
    text: "Throw a punch with all your weight behind it; mark 3-fatigue to inflict Stunned on an engaged foe."
  }
};
