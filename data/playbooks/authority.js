/**
 * authority.js — The Authority (Uncle Iroh’s Adventure Guide)
 * From Uncle Iroh's Adventure Guide playbooks PDF
 */
window.AL = window.AL || {};
AL.PLAYBOOKS = AL.PLAYBOOKS || {};

AL.PLAYBOOKS.authority = {
  id: "authority",
  name: "The Authority",
  source: "Uncle Iroh’s Adventure Guide",
  tagline: "You lead a faction of relevance and prominence in the scope of your game.",

  principles: {
    left: "Self",
    right: "Service"
  },

  baseStats: {
    Creativity: -1,
    Focus: 1,
    Harmony: 1,
    Passion: 0,
  },

  demeanors: ["Dignified", "Firm", "Open", "Steely", "Thoughtful", "Tired"],

  feature: {
    name: "Faction Leadership",
    summary: "Lead a faction; manage assets, weaknesses, and dissent.",
    fields: [{"id": "faction_name", "label": "Faction name", "type": "text"}, {"id": "faction_kind", "label": "Kind of faction", "type": "text", "placeholder": "corporation, political organization, craft guild, …"}, {"id": "faction_assets", "label": "3 primary assets", "type": "textarea", "minHeight": "3rem"}, {"id": "faction_weaknesses", "label": "2 major weaknesses", "type": "text"}, {"id": "faction_principle", "label": "Faction principle (Growth, Power, Change, Protection, Invention)", "type": "text"}, {"id": "faction_dissent", "label": "Faction dissent (0–10+)", "type": "text", "placeholder": "0"}, {"id": "faction_desire", "label": "Current overarching desire / leading voice (notes)", "type": "textarea", "minHeight": "3rem"}],
    text: [
      "When you interact with a bulk of faction members, you can take the pulse of your faction. Ask the GM what the faction’s current overarching desire is, and the GM will describe it, along with the leading voice speaking for that goal. You can try to plead, trick, intimidate, and guide and comfort that leader to shift your faction’s goal.",
      "Faction Dissent — If dissent would ever go beyond 5, then within 1–2 sessions the faction enters a crisis of leadership in which another voice attempts to depose you. When you act in service to your faction, in line with its principle, you may shift your balance toward Service and clear 1 faction dissent to live up to the faction’s principle as if it were a +1.",
      "Wielding Faction Assets — When you demand that members wield an asset on your behalf, mark faction dissent and roll with Self. On a hit, your faction comes through. On a 7–9, they’re frustrated; mark faction dissent again. On a miss, they push back. If dissent is at 3 or more, the faction won’t respond to any demands until you clear all dissent. If dissent is less than 3, mark 2 faction dissent. When you truthfully ask members to wield an asset on behalf of the faction, roll with Service. On a hit, they successfully wield the asset. On a 7–9, they encounter trouble; the GM tells you how one of your major weaknesses shows itself. On a miss, an enemy seizes on a weakness to put the faction in danger.",
      "Wins and Losses (end of session) — Did you accomplish a significant goal of your faction? If yes, clear all faction dissent. Is the faction’s dissent 3 or higher? If yes, increase faction dissent by 1.",
    ]
  },

  movesChoose: 2,
  moves: [
    {
      id: "read-the-room",
      name: "Read the Room",
      text: "When you assess the situation among a group of discontented people, roll with Focus instead of Creativity."
    },
    {
      id: "promises-promises",
      name: "Promises, Promises",
      text: "You are adept at receiving and giving promises. When someone makes a promise to do something to you, mark 1-fatigue to know with certainty whether they truly mean it. When you make a promise to someone to get them to do what you want, roll with Harmony. On a hit, they accept your promise but expect you to perform. On a 10+, they’ll let you handle it but check back in later. On a 7–9, they’ll try to go with you and ensure you follow through. On a miss, the promise you’ve made isn’t enough; they want you to promise more, much more, than you are comfortable with. If you fail to fulfill a promise within a reasonable timeframe (decided by the GM at the end of a session), word gets out of your untrustworthiness; anyone from a relevant background won’t trust you at all until you redeem yourself."
    },
    {
      id: "moldable",
      name: "Moldable",
      text: "When an NPC calls on you to live up to your principle or attempts to shift your principle, if you don’t deny or resist, you may clear a condition or 2-fatigue, your choice."
    },
    {
      id: "opening-a-dialogue",
      name: "Opening a Dialogue",
      text: "When you guide and comfort someone and roll a hit, you learn their principle. If you call someone out after you learned their principle in this way, take +1 to the roll."
    },
    {
      id: "making-them-listen",
      name: "Making Them Listen",
      text: "When you try to plead with an NPC, you may mark 2-fatigue to make them care what you think for the length of the move, even if they normally wouldn’t care."
    },
  ],

  history: ["What did you do to secure leadership of your faction?", "Who represents the faction’s goals and supported you on your way up?", "Who opposes your leadership and pushes for reforms in the faction?", "What trinket from before your rise do you always keep with you?", "Why are you committed to this group or purpose?"],

  connections: [{"id": "conn1", "prompt": "is a friend from outside of my faction—I value the perspective they give me."}, {"id": "conn2", "prompt": "has so much potential to lead; I’ll try to help them as best I can."}],

  growthQuestion: "Did your actions earn or reinforce the respect of someone in your faction?",

  momentOfBalance: "You’ve constantly felt torn between your own needs and beliefs, and the needs and beliefs of the faction that you both serve and lead. Now, you impart some of yourself forever into the faction, leaving a mark upon it and guiding it to take action in line with your own values, of its own volition. Tell the GM how the faction comes through in a way that realizes your vision to overcome a challenge or threat that no one person could defeat.",

  startingTechnique: {
    id: "direct",
    name: "Direct",
    approach: "evade",
    mastery: "mastered",
    text: "Shout out orders that help your allies position themselves effectively for the next exchange. Mark 1-fatigue and give every ally who can hear your orders Favored. Mark an additional 1-fatigue to give every ally who can hear your orders Inspired."
  }
};
