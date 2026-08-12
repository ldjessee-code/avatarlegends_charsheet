/**
 * icon.js — The Icon (Core Book)
 * Playbook data for AL.PLAYBOOKS.icon
 */
window.AL = window.AL || {};
AL.PLAYBOOKS = AL.PLAYBOOKS || {};

AL.PLAYBOOKS.icon = {
  id: "icon",
  name: "The Icon",
  source: "Core Book",
  tagline: "You are an icon of your burden and tradition—its exemplar, trained from a young age.",

  principles: {
    left: "Freedom",
    right: "Role"
  },

  baseStats: {
    Creativity: 0,
    Focus: 1,
    Harmony: 1,
    Passion: -1,
  },

  demeanors: ["Naive", "Playful", "Needy", "Sad", "Haughty", "Grave"],

  feature: {
    name: "Burden & Tradition",
    summary: "Responsibilities, prohibitions, and the weight of your role.",
    fields: [{"id": "tradition", "label": "Your burden / tradition", "type": "text"}, {"id": "responsibilities", "label": "3 responsibilities (list)", "type": "textarea", "minHeight": "3.5rem"}, {"id": "prohibitions", "label": "3 prohibitions (list; underline when broken)", "type": "textarea", "minHeight": "3.5rem"}, {"id": "animal_companion", "label": "Yip Yip! animal companion (if you took that move)", "type": "text", "placeholder": "Name and species"}],
    text: [
      "You are an icon of your burden and tradition. You are expected to be its exemplar, its single most important representative, trained up from a young age and saddled with the weight of history. You have been told that you are vital to the world.",
      "Choose 3 responsibilities (examples: protecting humanity from natural disasters and dark spirits; destroying dangerous creatures; overthrowing tyrants; serving and defending rightful rulers; performing rituals; providing aid and succor to the downtrodden; searching for hidden histories and artifacts; guarding nature; safekeeping records and relics).",
      "Choose 3 prohibitions (examples: never refuse an earnest request for help; never express great emotion; never run from a fight; never start a fight; never deny someone knowledge or truth; never use your role for gain or profit; never intervene in a community without invitation; never withhold forgiveness; never steal or cheat).",
      "Live Up to Your Role — When you live up to your Role through the responsibilities of your burden and tradition despite opposition or danger, shift your balance toward Role instead of marking fatigue, and clear fatigue equal to your Role (minimum 0-fatigue).",
      "Break Tradition — When you directly and openly break a prohibition of your burden and tradition, mark a condition, shift your balance twice towards Freedom, and mark growth.",
      "End of Session — After standard growth questions: Did I uphold a responsibility? If yes, shift balance toward Role and clear a condition. Did I break a prohibition? If yes, shift balance toward Freedom. Underline one prohibition you broke; if already underlined, cross it out—it doesn’t mean anything to break it again.",
    ]
  },

  movesChoose: 2,
  moves: [
    {
      id: "use-their-momentum",
      name: "Use Their Momentum",
      text: "When you are engaged with a large or powerful foe, mark fatigue to advance and attack with Focus instead of Passion. If you do, you become Prepared and may also choose to use Retaliate as if it were an advance and attack technique."
    },
    {
      id: "bonzu",
      name: "Bonzu Pippinpaddleopsicopolis… the Third",
      text: "When you trick an NPC by assuming a silly disguise or fake identity, mark Insecure to treat your roll as if it was a 12+. If Insecure is already marked, mark 2-fatigue instead."
    },
    {
      id: "concentration",
      name: "Concentration",
      text: "Take +1 Focus (max +3)."
    },
    {
      id: "otter-penguins",
      name: "Otter-Penguins, Unagi, and Hot Springs",
      text: "When you visit a new inhabited location you might know about, roll with Harmony. On a 7–9, ask 1. On a 10+, ask 2. PCs who interact with one of the answers clear 1-fatigue or mark growth: What’s the best local pastime? What interesting locations are nearby? Who is the most famous person here? What special tradition is prized by locals? What’s the most interesting legend locals recount about this place? On a miss, tell the GM what you expected to find; they will tell you how this place is different!"
    },
    {
      id: "yip-yip",
      name: "Yip Yip!",
      text: "You have an animal companion large enough to ride. Name them and choose their species (sky bison, polar bear-dog, eel-hound, cat-gator, elephant-mandrill, gemsbok-bull, shirshu, komodo-rhino, sabertooth moose-lion, flying boar, walrus-yak, flying fish-opotamus). When you fight beside your animal companion, mark 1-fatigue to become Favored for an exchange. When something hurts your animal companion, mark a condition. When you and your friends travel via your animal companion, everyone clears all fatigue."
    },
  ],

  history: ["What tradition do you represent as its icon? Why can’t you set down the role?", "Who was your chief mentor, teaching you the nature of your burden and its value?", "Who showed you that even with the weight of your burden, you could still find ways to play?", "What token of your burden and tradition do you always carry?", "Why are you committed to this group or purpose?"],

  connections: [{"id": "conn1", "prompt": "seems to not fully understand what it means that I’m the icon of my tradition…and I kind of like feeling free around them."}, {"id": "conn2", "prompt": "makes me feel better about my responsibilities and my burden with a smile and a few kind words."}],

  growthQuestion: "Did you accomplish a feat worthy of your burden and tradition?",

  momentOfBalance: "Others have laid a path for you that you cannot escape, but balance means you understand the limits of their vision. You make the role your own in this moment, charting a new path for yourself and your tradition. Tell the GM how your new understanding of your burdens forges a new way forward for everyone.",

  startingTechnique: {
    id: "wall-of-perfection",
    name: "Wall of Perfection",
    approach: "defend",
    mastery: "mastered",
    text: "Create a perfect wall of defense around yourself and any allies directly next to you; mark 1-fatigue to block a single attack towards the wall or keep an enemy at bay who tries to penetrate the wall."
  }
};
