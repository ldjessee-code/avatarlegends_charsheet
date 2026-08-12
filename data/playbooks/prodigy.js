/**
 * prodigy.js — The Prodigy (Core Book)
 * Playbook data for AL.PLAYBOOKS.prodigy
 */
window.AL = window.AL || {};
AL.PLAYBOOKS = AL.PLAYBOOKS || {};

AL.PLAYBOOKS.prodigy = {
  id: "prodigy",
  name: "The Prodigy",
  source: "Core Book",
  tagline: "You’re not just capable—you’re astonishing in your skill and training.",

  principles: {
    left: "Community",
    right: "Excellence"
  },

  baseStats: {
    Creativity: -1,
    Focus: 2,
    Harmony: 0,
    Passion: 0,
  },

  demeanors: ["Curious", "Proud", "Defensive", "Resolute", "Direct", "Stubborn"],

  feature: {
    name: "Extraordinary Skill",
    summary: "Mastery areas, learning, and teaching techniques.",
    fields: [{"id": "mastery_areas", "label": "2 mastery areas (Shaping, Sensing, Maneuvering, Forcing, Breaking, Guarding)", "type": "text"}],
    text: [
      "You start play with one additional mastered technique (second technique slot).",
      "When you rely on your skills and training, use a combat stance, or otherwise trigger a move while using your mastery, ignore penalties from conditions or statuses.",
      "When you see someone use an unknown technique, if it is available to your skills and training, you may mark fatigue to shift your balance towards Excellence and take the technique as learned. You can only do this if your balance is at +1 Excellence or higher. You must still get a mastery condition from a master of the technique in order to move the technique from practiced to mastered.",
      "When you study with a teacher to learn a new technique, shift your balance towards Community and automatically learn the technique at the practiced level (skipping learned). You cannot learn techniques by studying with a teacher if your Balance is +0 Community or lower.",
      "When you spend time teaching a fellow companion a technique available to their skills and training, roll with Community. On a hit, you teach well enough; they learn the technique. On a 7–9, you get impatient or frustrated; choose to either take it out on them and inflict 2 conditions, or take it out on yourself and suffer 2 conditions. On a miss, you get too frustrated with their inadequacies; both of you suffer 2 conditions, and you can never try to teach them this technique again.",
    ]
  },

  movesChoose: 2,
  moves: [
    {
      id: "judging-a-rival",
      name: "Judging a Rival",
      text: "When you size someone up, roll with Focus. On a 7–9, ask one. On a 10+, ask two: what are your weaknesses / strengths? how can I show you dominance / submission? what do you intend to do next? what do you wish I’d do right now? On a miss, they notice you watching them; they may ask you 1 question from the list."
    },
    {
      id: "an-open-mind",
      name: "An Open Mind",
      text: "You can learn techniques from other skills and trainings, as long as you have a teacher. You can learn up to three such techniques, total. Take a +1 on the training move to learn such techniques."
    },
    {
      id: "wait-and-listen",
      name: "Wait and Listen",
      text: "When you assess a situation while taking the time to use your extraordinary skills to absorb hidden or deep information, mark 1-fatigue, roll with Focus instead of Creativity, and become Prepared."
    },
    {
      id: "challenge",
      name: "Challenge",
      text: "When you throw a boastful challenge at an opponent before a fight, roll with Passion. On a hit, the challenge lands; if you win the fight, choose 1 from below. But your challenge goads them to impressive heights; they may choose 1 extra technique in every exchange for the duration of the fight. On a 10+, clear all fatigue at the end of the fight if you are victorious. If you win, choose 1: your opponent must teach you a technique of theirs, or help you master one you already know; give you answers or an item of your choice; acknowledge your superiority; shift your balance twice towards Excellence; take your side in a future conflict. On a miss, they dismiss your challenge and refuse to fight; they inflict a condition on you."
    },
    {
      id: "surprising-entrance",
      name: "Surprising Entrance",
      text: "When you trick someone by using your skills to disappear and reappear somewhere else within the same scene, roll with Focus instead of Creativity."
    },
  ],

  history: ["When did you first accomplish something your teachers thought would be impossible for you?", "Who gave you the lessons and support you needed to discover your incredible abilities?", "Who cares for you greatly but doesn’t understand your talent?", "What strange talisman or detail of your clothing plays a role in your talents?", "Why are you committed to this group or purpose?"],

  connections: [{"id": "conn1", "prompt": "could use training from someone who knows what they’re doing; I suppose I am up to the task."}, {"id": "conn2", "prompt": "I’m not sure if the overtures of friendship from them make me happy, mad, or both."}],

  growthQuestion: "Did you express gratitude to a companion for their presence, support, or teaching?",

  momentOfBalance: "You’ve always struggled to rely on other people—it feels like it makes you weak. But in this moment, connection to others is the very source of your strength. You call upon your commitment to the group to push yourself beyond your limits and do the impossible. Tell the GM how you accomplish a feat no one ever has before to help or save your friends.",

  startingTechnique: {
    id: "steady-stance",
    name: "Steady Stance",
    approach: "defend",
    mastery: "mastered",
    text: "Assume a strong, steady stance; any foes engaged with you who chose to advance and attack this exchange must mark 1-fatigue. Negate the first condition or negative status inflicted on you in this exchange. If no conditions or negative statuses were inflicted on you in this exchange, become Empowered for the next exchange."
  }
,
  extraStartingTechniqueSlots: 1
};
