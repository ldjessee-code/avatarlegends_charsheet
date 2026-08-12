/**
 * bold.js — The Bold (Core Book)
 * Extracted from AvatarLegends-CorePlaybooks-printerfriendly-4.pdf
 */
window.AL = window.AL || {};
AL.PLAYBOOKS = AL.PLAYBOOKS || {};

AL.PLAYBOOKS.bold = {
  id: "bold",
  name: "The Bold",
  source: "Core Book",
  tagline:
    "You have dedicated yourself to accomplishing great, exciting deeds and becoming worthy of the trust others place in you.",

  principles: {
    left: "Confidence",
    right: "Loyalty"
  },

  baseStats: {
    Creativity: 1,
    Focus: 1,
    Harmony: 0,
    Passion: -1
  },

  demeanors: [
    "Impatient",
    "Sensitive",
    "Affable",
    "Enthusiastic",
    "Talkative",
    "Impetuous"
  ],

  feature: {
    name: "Legacy of Excellence",
    summary: "Pursue great deeds through marked drives.",
    fields: [],
    drives: [
      "Successfully lead your companions in battle",
      "Give your affection to someone worthy",
      "Start a real fight with a dangerous master",
      "Do justice to a friend or mentor’s guidance",
      "Take down a dangerous threat all on your own",
      "Openly outperform an authority figure",
      "Save a friend’s life",
      "Get a fancy new outfit",
      "Earn the respect of an adult you admire",
      "Openly call out a friend’s unworthy actions",
      "Form a strong relationship with a new master",
      "Stop a fight with calm words",
      "Sacrifice your pride or love for a greater good",
      "Defend an inhabited place from dire threats",
      "Stand up to someone who doesn’t respect you",
      "Make a friend live up to a principle they have neglected",
      "Show mercy or forgiveness to a dangerous person",
      "Stand up to someone abusing their power",
      "Tame or befriend a dangerous beast or rare creature",
      "Pull off a ridiculous stunt"
    ],
    text: [
      "Choose four drives to mark at the start of play. When you fulfill a marked drive, strike it out, and mark growth or clear a condition. When your four marked drives are all struck out, choose and mark four new drives. When all drives are struck out, change playbooks or accept a position of great responsibility and retire from a life of adventure."
    ]
  },

  movesChoose: 2,
  moves: [
    {
      id: "best-friend",
      name: "Best Friend",
      text: "Your best friend is small, fuzzy, and dependable. Unlike all your other relationships, this one is simple and true. You can understand and communicate with your small companion and—although they may give you a hard time now and again—they are always there when you need them most. Whenever your pal could help you push your luck, mark fatigue to roll with Creativity instead of Passion. If your pet ever gets hurt, mark a condition."
    },
    {
      id: "heres-the-plan",
      name: "Here’s the Plan",
      text: "When you commit to a plan you’ve proposed to the group, roll with Creativity; take a −1 for each of your companions who isn’t on board. On a 10+, hold 2. On a 7–9, hold 1. You can spend your hold 1-for-1 while the plan is being carried out to overcome or evade an obstacle, create an advantage, or neutralize a danger; if any of your companions abandon you while the plan is underway, you must mark a condition. On a miss, hold 1, but your plan goes awry when you encounter surprising opposition."
    },
    {
      id: "not-done-yet",
      name: "Not Done Yet!",
      text: "Once per session, when you are taken out, shift your balance towards center to stay up for one more combat exchange. After that exchange ends, you become helpless, unconscious, or otherwise incapable of continuing on, and are taken out as normal."
    },
    {
      id: "you-missed-something",
      name: "You Missed Something",
      text: "When you evaluate a friendly NPC’s plan to get something done, roll with Focus. On a hit, the GM tells you how you can drastically improve the chances of success; get it done, and they’re sure to come through on top. On a 7–9, the problems inherent in the plan are fairly serious; the NPC will be resistant to making the necessary changes. On a miss, something about the plan throws you for a loop; the GM tells you what obvious danger the NPC is ignoring…or what they’re hiding about their intent."
    },
    {
      id: "straight-shooter",
      name: "Straight Shooter",
      text: "When you tell an NPC the blunt, honest truth about what you really think of them and their plans, roll with Focus. On a hit, they’ll look upon your honesty favorably; they’ll answer a non-compromising question honestly and grant you a simple favor. On a 7–9, they also give you an honest assessment of how they see you; mark a condition. On a miss, you’re a bit too honest—they’re either furious or genuinely hurt."
    }
  ],

  history: [
    "Why do you feel the need to prove yourself so badly?",
    "Who epitomizes the kind of big, bold figure you hope to be?",
    "Whose approval do you think you will never attain?",
    "What token or symbol do you wear to prove you are serious?",
    "Why are you committed to this group or purpose?"
  ],

  connections: [
    {
      id: "conn1",
      prompt: "scoffs at me and my plans; one day I’ll show them what I can do."
    },
    {
      id: "conn2",
      prompt: "has a pretty good head on their shoulders; they’re a great sounding board for my ideas."
    }
  ],

  growthQuestion:
    "Did you express vulnerability by admitting you were wrong or that you should have listened to someone you ignored?",

  momentOfBalance:
    "The greatest heroes of your age may have overwhelming confidence, but balance isn’t about pursuing greatness for the sake of greatness. You find a way to stand with your companions like no one else ever could. Tell the GM how you strike down an impossibly strong enemy or obstacle to protect your friends from harm as the best version of yourself.",

  startingTechnique: {
    id: "tag-team",
    name: "Tag Team",
    approach: "defend",
    mastery: "mastered",
    text: "Work with an ally against the same foe; choose an engaged foe and an ally—double any fatigue, conditions, or balance shifts that ally inflicts upon that foe."
  }
};
