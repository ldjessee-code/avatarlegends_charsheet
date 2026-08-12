/**
 * pillar.js — The Pillar (Core Book)
 * Playbook data for AL.PLAYBOOKS.pillar
 */
window.AL = window.AL || {};
AL.PLAYBOOKS = AL.PLAYBOOKS || {};

AL.PLAYBOOKS.pillar = {
  id: "pillar",
  name: "The Pillar",
  source: "Core Book",
  tagline: "You lead a squad—and hold any group together with leadership and support.",

  principles: {
    left: "Leadership",
    right: "Support"
  },

  baseStats: {
    Creativity: 1,
    Focus: 0,
    Harmony: 1,
    Passion: -1,
  },

  demeanors: ["Confident", "Lighthearted", "Critical", "Stern", "Gentle", "Warm"],

  feature: {
    name: "Squad Leader",
    summary: "Earn and spend Team through leadership and support styles.",
    fields: [{"id": "squad_home", "label": "Where does your squad call home?", "type": "text"}, {"id": "squad_traits", "label": "Well-known traits (up to 3)", "type": "text"}, {"id": "squad_values", "label": "Squad values (2): Excellence, Justice, Duty, Mercy, Tradition, Protection", "type": "text"}, {"id": "squad_where", "label": "Where is your team without you?", "type": "textarea", "minHeight": "3rem"}, {"id": "leadership_styles", "label": "2 leadership styles (earn Team)", "type": "textarea", "minHeight": "3.5rem"}, {"id": "support_styles", "label": "2 support styles (spend Team)", "type": "textarea", "minHeight": "3.5rem"}, {"id": "team", "label": "Current Team (number)", "type": "text", "placeholder": "0"}],
    text: [
      "You were the leader of a small group of 10 or so well-trained warriors from a recognized and noble tradition. Despite being the leader, you chose to travel with your new companions for the time being, until you’ve achieved this group’s purpose.",
      "Within any group, you serve a role both subtle and overt, sometimes leading the team, sometimes helping it glue itself together. You earn Team through your leadership style, and you spend Team through your support style. At the end of each session, you may change 1 style of leadership and 1 style of support.",
      "Leadership styles (earn 1-Team when…): Firm—you openly call on a companion to live up to their principle; Inspiring—you live up to your principle and roll a hit; Diplomatic—you plead with an NPC for help and roll a 10+; Empathetic—you guide and comfort a companion and they open up to you; Guidance—you assess a situation and give a companion instructions based on the answers; Indomitable—you roll a hit when you resist shifting your balance or you deny a callout.",
      "Support styles (spend 1-Team when…): Comforting—quiet moment with a companion to clear a condition; Invigorating—rally a companion to clear 2-fatigue; Defending—within reach in combat to clear a negative status; Bolstering—help another companion for +1 after the roll; Encouraging—endorse a friend living up to their principle to shift their balance toward it; Trusting—endorse a friend resisting balance shift for +2 after the roll.",
    ]
  },

  movesChoose: 2,
  moves: [
    {
      id: "understanding-mien",
      name: "Understanding Mien",
      text: "Take +1 to Harmony (max +3)."
    },
    {
      id: "a-warriors-heart",
      name: "A Warrior’s Heart",
      text: "When you live up to your principle while you have 3+ conditions marked, ignore your condition penalties. When you live up to your principle while you have 5 conditions marked, don’t mark fatigue."
    },
    {
      id: "out-of-uniform",
      name: "Out of Uniform",
      text: "When you put on a disguised or physically altered persona to fool a community into thinking you’re two different people, roll with Creativity. On a hit, people mostly unfamiliar with you won’t connect your two personas. On a 7–9, this is the last time you can pull this trick without them catching on. On a miss, someone misidentifies you when you switch in a way that causes more trouble for you."
    },
    {
      id: "fighting-like-dancing",
      name: "Fighting Like Dancing",
      text: "When you advance and attack against a group of foes—or a foe who has previously defeated you—roll with Harmony instead of Passion."
    },
    {
      id: "taking-care-of-business",
      name: "Taking Care of Business",
      text: "When you lose your balance in a battle, instead of choosing one of the normal options, you may instead sacrifice yourself for your companions. If you do, your companions have a chance to get away without issue, and you are taken out (and possibly captured). You also choose 1: Leave a clue your companions can follow; Throw your companions one vulnerable object; Provoke an opponent, shifting their balance twice."
    },
  ],

  history: ["How did you rise to lead a renowned squad or group?", "Who was your closest friend and confidant in the squad?", "Who never thought you deserved to lead the group?", "What uniform, heirloom, or symbol do you carry as a talisman of the group?", "Why are you committed to this group or purpose?"],

  connections: [{"id": "conn1", "prompt": "doesn’t really respect my accomplishments; they probably need a lesson or two."}, {"id": "conn2", "prompt": "seems like they would’ve been a good candidate to be a part of my squad; I’ll look out for them."}],

  growthQuestion: "Did you help a companion find a significant success with their issues, or lead the group in finding a significant collective success?",

  momentOfBalance: "You define yourself as a part of a larger group, and in this moment, the group defines itself by you. You rally them, move among them, saying the right things and providing the right guidance so your group works with perfect cohesion and confidence. Tell the GM what you say to each of your companions so that in this moment, you overcome an indomitable challenge, together.",

  startingTechnique: {
    id: "slide-around-the-blow",
    name: "Slide Around the Blow",
    approach: "evade",
    mastery: "mastered",
    text: "You move perfectly, slipping past strikes and demanding an opponent’s attention; a foe you are engaged with must remain engaged with you and can only use techniques against you in the next exchange. If no foe is engaged with you, you may slip through the fight to engage a new foe (no foe may mark fatigue to stop you)."
  }
};
