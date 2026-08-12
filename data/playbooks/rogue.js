/**
 * rogue.js — The Rogue (Core Book)
 * Playbook data for AL.PLAYBOOKS.rogue
 */
window.AL = window.AL || {};
AL.PLAYBOOKS = AL.PLAYBOOKS || {};

AL.PLAYBOOKS.rogue = {
  id: "rogue",
  name: "The Rogue",
  source: "Core Book",
  tagline: "You’ve picked up some bad habits—and maybe your friends can come along for the ride.",

  principles: {
    left: "Survival",
    right: "Friendship"
  },

  baseStats: {
    Creativity: 1,
    Focus: 0,
    Harmony: -1,
    Passion: 1,
  },

  demeanors: ["Acerbic", "Joking", "Cynical", "Sly", "Extreme", "Wild"],

  feature: {
    name: "Bad Habits",
    summary: "Indulge bad habits alone or with friends.",
    fields: [{"id": "bad_habits", "label": "Your 4 bad habits", "type": "textarea", "minHeight": "3.5rem", "placeholder": "Casual thievery; Vandalism; Trespassing; Daredevil stunts; …"}],
    text: [
      "Choose 4 bad habits you indulge: Casual thievery and pickpocketing; Vandalism or sabotage; Trespassing; Daredevil stunts; “Charming” insults of dangerous people; Cons; Rabble-rousing; Gambling. Any necessary skills or talents related to your bad habits are considered part of your background.",
      "When you indulge a bad habit on your own, shift your balance toward Survival, and roll with Survival. On a hit, you pull it off and vent your frustrations; clear fatigue or conditions equal to your Survival (minimum 0). If you have no fatigue or conditions, mark growth. On a 10+, you also gain a windfall, a boon or opportunity—your bad habits paid off this time. On a miss, you’re caught by someone dangerous or powerful, and they complicate your life.",
      "When you indulge a bad habit with a friend, shift your balance toward Friendship, and roll with Friendship. On a hit, you and your friend pull it off and grow closer; each of you makes the other Inspired. On a 10+, you also obtain some useful resource or information, and become Prepared. On a miss, something goes terribly awry; you can either take the heat yourself, or shift your Balance twice toward Survival and leave your friend in the lurch.",
    ]
  },

  movesChoose: 2,
  moves: [
    {
      id: "roguish-charm",
      name: "Roguish Charm",
      text: "When you plead with an NPC or guide and comfort someone by flattering them and empathizing with them, mark 1-fatigue to roll with Creativity instead of Harmony."
    },
    {
      id: "slippery-eel-hound",
      name: "Slippery Eel-Hound",
      text: "When you defend and maneuver and choose to use Seize a Position to escape the scene, foes must mark an additional 2-fatigue to stop you, and you may bring any allies within reach when you retreat."
    },
    {
      id: "youre-not-my-master",
      name: "You’re Not My Master!",
      text: "When you resist an NPC shifting your balance, roll +2 instead of +0."
    },
    {
      id: "casing-the-joint",
      name: "Casing the Joint",
      text: "When you assess a situation, add these questions to the list. You may always ask one extra question from these options, even on a miss: What here is most valuable or interesting to me? Who or what is most vulnerable to me? Who here is in control/wealthiest/has the most power?"
    },
    {
      id: "is-that-the-best-you-got",
      name: "Is That the Best You Got?",
      text: "When you goad or provoke an NPC into foolhardy action, say what you want them to do and roll with Passion. On a 10+, they do it. On a 7–9, they can choose 1 instead: They do it, but more intensely than expected—you’re taken off guard; They do it, but more carefully than expected—they gain an advantage against you; They don’t do it, but they embarrass themselves—they mark a condition; They don’t do it, but only catch themself at the last minute—they stumble and give you an opportunity. On a miss, they are provoked to take harsh action, directly against you, in a way you’re ill-prepared to counter."
    },
  ],

  history: ["How did you come to feel that the only way to survive was to break the rules?", "Who kept trying to reach a kind hand out towards you, only to be rebuffed?", "Who was ready to do anything to break you of your bad habits?", "What is your favorite possession that you stole, swiped, or otherwise acquired illegitimately?", "Why are you committed to this group or purpose?"],

  connections: [{"id": "conn1", "prompt": "is waaaaay too uptight, too trapped in themselves; they need to break some rules!"}, {"id": "conn2", "prompt": "is amazing and I hope they like me; maybe they’re worth playing it straight?"}],

  growthQuestion: "Did you get a friend to join in or approve of one of your bad habits?",

  momentOfBalance: "You learned early on that you had to do what you needed to survive, and that sometimes that meant you lost friends. Now, you find a new balance: rule-breaking isn’t something that just drives people away—it’s something you can use constructively, with your friends! Tell the GM how you lead your companions to break all the rules and accomplish an incredible feat.",

  startingTechnique: {
    id: "sweep-the-leg",
    name: "Sweep the Leg",
    approach: "advance",
    mastery: "mastered",
    text: "You attack where an enemy is weakest or most off-balance; if your foe has a total of 3 or more fatigue and conditions marked, inflict 2-fatigue. If your foe has fewer than 3 total fatigue and conditions marked, inflict 2-fatigue, but you must mark 1-fatigue as well."
  }
};
