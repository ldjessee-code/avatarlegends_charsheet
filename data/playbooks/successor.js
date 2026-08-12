/**
 * successor.js — The Successor (Core Book)
 * Playbook data for AL.PLAYBOOKS.successor
 */
window.AL = window.AL || {};
AL.PLAYBOOKS = AL.PLAYBOOKS || {};

AL.PLAYBOOKS.successor = {
  id: "successor",
  name: "The Successor",
  source: "Core Book",
  tagline: "You hail from a powerful, infamous lineage with an impressive and terrible reputation.",

  principles: {
    left: "Progress",
    right: "Tradition"
  },

  baseStats: {
    Creativity: 1,
    Focus: 1,
    Harmony: -1,
    Passion: 0,
  },

  demeanors: ["Perky", "Intense", "By-the-book", "Casual", "Arrogant", "Oblivious"],

  feature: {
    name: "A Tainted Past",
    summary: "Lineage domains, resources, and family pulls.",
    fields: [{"id": "lineage_name", "label": "Your lineage", "type": "text"}, {"id": "domain_power", "label": "Domain of power", "type": "text"}, {"id": "domain_reach", "label": "Domain they’re extending into", "type": "text"}, {"id": "resources", "label": "2 lineage resources you can access", "type": "textarea", "minHeight": "3rem"}, {"id": "resource_hold", "label": "Resources currently held", "type": "text", "placeholder": "0"}],
    text: [
      "Your lineage has had a massive impact on the world within the scope of your story—its reach extends over the whole scope, and everyone knows of it. Choose one domain that is the source of your lineage’s power and another into which they’re now beginning to extend their reach (high society; military command; arts and entertainment; land ownership; organized crime; spiritual authority; state politics; business and industry; elite academics; vigilante militias; media and news; vital supply chains).",
      "Lineage Resources — You have access to your family’s extensive stores of two resources: obscure or forbidden knowledge; introductions and connections; servants or muscle; high technology; cold hard cash; spiritual artifacts or tomes. Spend resources during the session to establish a boon you had previously asked for or obtained.",
      "Humble Yourself — When you politely and obediently humble yourself before a powerful member of your lineage, roll with your Tradition. On a hit, you earn some credit; hold 3-resources. On a 7–9, their resources don’t come without strings; you’ll need to promise to fulfill some other obligation of your lineage, or let them shift your balance. On a miss, they’re dissatisfied with your display; they’re cutting you off until you fulfill some task they set to you.",
      "Raid Your Lineage’s Resources — When you raid your lineage’s resources without their consent or knowledge, mark a condition and roll with your Progress. On a hit, hold 1-resource. On a 7–9, choose 1. On a 10+, choose 2: You obtain an additional 1-resource; You nab your goodies quietly; your lineage is none the wiser; You steel yourself for what you’re doing; avoid marking a condition. On a miss, you’re caught red-handed by a powerful member of your lineage who saw you coming.",
    ]
  },

  movesChoose: 2,
  moves: [
    {
      id: "way-of-the-future",
      name: "Way of the Future",
      text: "Take +1 Creativity (max +3)."
    },
    {
      id: "black-koala-sheep",
      name: "Black Koala-Sheep",
      text: "When you behave in a way that shocks and unsettles people from one of your backgrounds, roll with Creativity to intimidate them or push your luck."
    },
    {
      id: "a-life-of-regret",
      name: "A Life of Regret",
      text: "When you guide and comfort an NPC by apologizing and honestly promising to make amends for the harm they have suffered, roll with Focus instead of Harmony. If they choose not to open up to you, you do not take +1 forward against them. If they choose to open up to you, take +1 ongoing to attempts to take action to make amends."
    },
    {
      id: "walk-this-way",
      name: "Walk This Way",
      text: "When you make over, disguise, and/or coach your friends to fit in with a specific crowd appropriate to one of your backgrounds, roll with Creativity. On a 10+, the performance is flawless; you gain access to wherever you wanted to fit in while attracting little suspicion. On a 7–9, you fool nearly everyone; there’s only a single gatekeeper who asks any questions or stands in your way. On a miss, the only way to get the access you desired is for one of your friends to take on an uncomfortable, dangerous, or attention-grabbing role."
    },
    {
      id: "worldly-knowledge",
      name: "Worldly Knowledge",
      text: "Your upbringing expanded your horizons, skillsets, and contacts. Choose another training and another background."
    },
  ],

  history: ["Who is the current head of your lineage? How do you love and frustrate each other?", "What close member of your lineage wants to revolutionize it?", "What do you carry that reminds you of the place most associated with your lineage?", "What part of your lineage’s identity is most important and valuable to you—and which part do you reject?", "Why are you committed to this group or purpose?"],

  connections: [{"id": "conn1", "prompt": "has major concerns, fears, or grievances with my lineage—and with me, by proxy."}, {"id": "conn2", "prompt": "seems free of their past in a way I wish I could let go of mine; hearing them talk about the future feels amazing!"}],

  growthQuestion: "Did you learn something meaningful or important about your lineage, its members, or its effects on the world and others?",

  momentOfBalance: "You may never escape the legacy of your family, but balance allows you to learn from them without defining yourself in their image. You call upon a resource of your family to innovate a new solution to an intractable problem, never forgetting who you are in the face of incredible danger. Tell the GM how you knock down obstacles that seem impossible to overcome and save the day.",

  startingTechnique: {
    id: "break",
    name: "Break",
    approach: "evade",
    mastery: "mastered",
    text: "Target a foe’s vulnerable equipment; render it useless or broken—possibly inflicting or overcoming a fictionally appropriate status."
  }
};
