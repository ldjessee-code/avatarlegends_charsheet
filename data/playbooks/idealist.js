/**
 * idealist.js — The Idealist (Core Book)
 * Playbook data for AL.PLAYBOOKS.idealist
 */
window.AL = window.AL || {};
AL.PLAYBOOKS = AL.PLAYBOOKS || {};

AL.PLAYBOOKS.idealist = {
  id: "idealist",
  name: "The Idealist",
  source: "Core Book",
  tagline: "You’ve seen sadness and grief—but you know the world can be a better place.",

  principles: {
    left: "Action",
    right: "Forgiveness"
  },

  baseStats: {
    Creativity: 0,
    Focus: -1,
    Harmony: 1,
    Passion: 1,
  },

  demeanors: ["Lonely", "Compassionate", "Joyful", "Grieving", "Earnest", "Resolute"],

  feature: {
    name: "Never Turn My Back",
    summary: "A code of three ideals and a list of allies.",
    fields: [{"id": "ideals", "label": "Your 3 ideals", "type": "textarea", "minHeight": "3.5rem", "placeholder": "Always speak the truth; Always stand up to bullies; …"}, {"id": "allies", "label": "Allies (names)", "type": "textarea", "minHeight": "3.5rem"}],
    text: [
      "You have a code—choose three ideals from the list to define it: Always speak the truth; Always stand up to bullies; Always keep your promises; Never strike the first blow; Never deny a request for help; Never leave a friend behind.",
      "When you live up to your ideals at a significant cost, someone who witnessed (or hears about) your sacrifice approaches you to affirm their allegiance to your group’s purpose; write their name down on the list of allies.",
      "You can always plead with these allies—they always care what you think; they always open up to you if you guide and comfort them; and you can call on them to live up to their principles as if you had rolled a 10+ by erasing their name from your list of allies.",
    ]
  },

  movesChoose: 2,
  moves: [
    {
      id: "strength-of-your-heart",
      name: "The Strength of Your Heart",
      text: "When you use Seize a Position, foes must mark 2-fatigue to block your movement."
    },
    {
      id: "whatever-i-can",
      name: "Whatever I Can",
      text: "When you spend time talking to the locals about their problems, roll with Harmony. On a hit, you hear about the most significant and serious problem at hand; the GM will tell you who it affects and what is the cause. On a 10+, you can ask a follow up question about the problem or cause; you take +1 ongoing when you act on the answer. On a miss, you wind up creating a whole new problem with your questions and ideas."
    },
    {
      id: "your-rules-stink",
      name: "Your Rules Stink",
      text: "When you stand up to an adult by telling them their rules are stupid, roll with Passion. On a hit, they are surprised by your argument; they must shift their balance or offer you a way forward, past the rules. On a 10+, both. On a miss, your efforts to move them only reveal how strongly they believe in the system—mark a condition as their resistance leaves you reeling."
    },
    {
      id: "it-doesnt-belong-to-you",
      name: "It Doesn’t Belong to You!",
      text: "When you secretly pocket something owned by someone undeserving, roll with Harmony. On a hit, you swipe something from them (your choice) without them noticing you took it. On a 7–9, the thing you took isn’t exactly what you thought it was; the GM will tell you how. On a miss, you grab the goods, but they notice—and pursue—as soon as you exit the scene."
    },
    {
      id: "cant-knock-me-down",
      name: "Can’t Knock Me Down",
      text: "When you are engaged in combat with superior opposition and openly refuse to back down or flee, roll with Harmony for the rest of the battle whenever you defend and maneuver; you cannot choose to escape the scene by using Seize a Position for the rest of the fight."
    },
  ],

  history: ["What tragedy befell you at a young age?", "Who do you hold most responsible for the tragedy? Why?", "Who helped you through your grief? What did they teach you?", "What symbol, heirloom, or mark do you carry to remind you of what you lost?", "Why are you committed to this group or purpose?"],

  connections: [{"id": "conn1", "prompt": "I recognize some of the pain I have felt inside of them; I’m going to try to help them."}, {"id": "conn2", "prompt": "frustrates me so much when they act without thinking about the consequences!"}],

  growthQuestion: "Did you improve the lives of a community of average citizens or help an ordinary person with their problems?",

  momentOfBalance: "The pain of the world can be overwhelming, but balance brings peace. You bring everything around you to a stop—villains, arguments, disaster—and set the world right. Tell the GM how your compassionate actions end a conflict utterly and completely.",

  startingTechnique: {
    id: "disorient",
    name: "Disorient",
    approach: "advance",
    mastery: "mastered",
    text: "Pummel an engaged foe with quick blows; mark 1-fatigue to shift their balance away from center."
  }
};
