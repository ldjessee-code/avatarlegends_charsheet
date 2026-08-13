/**
 * bound.js — The Bound (Uncle Iroh’s Adventure Guide)
 * From Uncle Iroh's Adventure Guide playbooks PDF
 */
window.AL = window.AL || {};
AL.PLAYBOOKS = AL.PLAYBOOKS || {};

AL.PLAYBOOKS.bound = {
  id: "bound",
  name: "The Bound",
  source: "Uncle Iroh’s Adventure Guide",
  tagline: "You inhabit a role tied to an institution—oaths, obligations, and expectations.",

  principles: {
    left: "Justice",
    right: "Duty"
  },

  baseStats: {
    Creativity: -1,
    Focus: 0,
    Harmony: 0,
    Passion: 2,
  },

  demeanors: ["Formal", "Grandiose", "Honest", "Proud", "Stern", "Straight-laced"],

  feature: {
    name: "The Ties That Bind",
    summary: "Institution, tenets, qualifications, Duty and Justice.",
    fields: [{"id": "institution", "label": "Institution nature", "type": "text", "placeholder": "secretive order, military force, peacekeeping org, …"}, {"id": "role_title", "label": "Your role / title", "type": "text"}, {"id": "tenets", "label": "Primary tenets + marks / blackouts (notes)", "type": "textarea", "minHeight": "4.5rem", "placeholder": "Do good; Defend institution; Obey; + 2 chosen tenets…"}, {"id": "qualifications", "label": "Qualifications on tenets (from GM)", "type": "textarea", "minHeight": "3rem"}, {"id": "justice_hold", "label": "Justice hold (from violating tenets)", "type": "text", "placeholder": "0"}],
    text: [
      "You have three primary tenets by default: do good in the world; defend the institution and its interests; obey the institution’s tenets, leaders, and will. Choose two additional primary tenets (examples: prevent destruction; protect the vulnerable; subdue dangers; discover and share the truth; handle problems decisively).",
      "Fulfilling Duty — When you live up to your principle of Duty, you may name which tenet you are upholding to avoid marking 1-fatigue, and instead mark that tenet once. Once you have marked all empty boxes on a tenet, move your center one step toward Duty and clear all those boxes. Every time your center moves towards Duty, the GM will give one of your tenets a new qualification; upholding that tenet requires upholding all its qualifications as well.",
      "Pursuing Justice — When you resist an NPC shifting your balance toward Duty, you may mark 1-fatigue to roll with Justice. When you actively violate a tenet, suffer one condition for every mark on that tenet or for your Duty principle, whichever is highest (minimum one); permanently black out one box of that tenet; shift your center toward Justice; and then hold 3, which you may spend to live up to your Justice principle without marking 1-fatigue. When all three boxes of a tenet are blacked out, change playbooks.",
    ]
  },

  movesChoose: 2,
  moves: [
    {
      id: "find-your-center",
      name: "Find Your Center",
      text: "Whenever you clear your last condition, you may return your balance to its Center. If you do, you may also clear your fatigue."
    },
    {
      id: "a-committed-will",
      name: "A Committed Will",
      text: "When your highest balance principle is +2 or higher, you suffer 1-fewer fatigue from an incoming blow during a combat exchange, but you also must mark an additional 2-fatigue to resist anyone shifting your balance."
    },
    {
      id: "devotion",
      name: "Devotion",
      text: "Take +1 to Passion (max +3)."
    },
    {
      id: "comfort-in-guidance",
      name: "Comfort in Guidance",
      text: "When you ask a trusted NPC for guidance on what you should do next, they will tell you what they think you should do. If you make a meaningful attempt to do what they told you to do, the GM will shift your balance accordingly and you may clear conditions equal to your highest balance principle."
    },
    {
      id: "strength-of-purpose",
      name: "Strength of Purpose",
      text: "When you push your luck while following someone else’s plan or orders, on a hit you may shift your balance away from center to avoid whatever cost the GM describes to you."
    },
  ],

  history: ["Why did you agree to fully uphold the role you now inhabit?", "Who once held a similar (or the same) role before you and acts as a guide?", "Whom do you care about who doesn’t trust your role or the institution it serves?", "What is the badge or marker that you always carry to mark you as your role?", "Why are you committed to this group or purpose?"],

  connections: [{"id": "conn1", "prompt": "doesn’t seem to outwardly respect the rules and oaths of my duty; they need to learn discipline."}, {"id": "conn2", "prompt": "has a keen insight into right and wrong and what should be done for justice; if my oaths fail me, I should turn to them."}],

  growthQuestion: "Did you speak to at least two other characters about their beliefs on what you should do?",

  momentOfBalance: "Your role and your self have never been entirely the same thing, no matter how you might’ve wished they were, but in this moment that divide becomes a great boon. You expand and alter your understanding of yourself and your oaths to match the current situation, taking strength from your role to push yourself and perform the impossible. Tell the GM how your confidence in yourself and your role together allow you to take exactly the right action to solve the current crisis, and rewrite any one tenet of your role as you choose.",

  startingTechnique: {
    id: "drilled-form",
    name: "Drilled Form",
    approach: "evade",
    mastery: "mastered",
    text: "Attack a foe with a series of well-trained, practiced strikes in a consistent pattern. Mark 1-fatigue to inflict 3-fatigue on your target. If you have used this technique before in this combat, it deals 1-fewer fatigue for each use that your target witnessed."
  }
};
