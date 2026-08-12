/**
 * common.js — Shared Avatar Legends rules reference (all playbooks)
 *
 * Sourced from Core playbooks + Printable Play Materials:
 *   conditions, statuses, backgrounds, trainings, basic techniques, growth.
 *
 * Advanced techniques by training live in the full core book and are entered
 * as custom techniques on the sheet until a catalog is added.
 */
window.AL = window.AL || {};

AL.COMMON = {
  conditions: [
    {
      id: "afraid",
      name: "Afraid",
      penalty: "−2 to intimidate and call someone out",
      clear: "Run from danger or difficulty."
    },
    {
      id: "angry",
      name: "Angry",
      penalty: "−2 to guide and comfort and assess a situation",
      clear: "Break something important or lash out at a friend."
    },
    {
      id: "guilty",
      name: "Guilty",
      penalty: "−2 to push your luck and +2 to deny a callout",
      clear: "Make a personal sacrifice to absolve your guilt."
    },
    {
      id: "insecure",
      name: "Insecure",
      penalty: "−2 to trick and resist shifting your balance",
      clear: "Take foolhardy action without talking to your companions."
    },
    {
      id: "troubled",
      name: "Troubled",
      penalty: "−2 to plead and rely on your skills or training",
      clear: "Seek guidance from a mentor or powerful figure."
    }
  ],

  statuses: {
    positive: ["Empowered", "Favored", "Inspired", "Prepared"],
    negative: ["Doomed", "Impaired", "Trapped", "Stunned"]
  },

  backgrounds: ["Military", "Monastic", "Outlaw", "Privileged", "Urban", "Wilderness"],

  trainings: [
    "Airbending",
    "Waterbending",
    "Earthbending",
    "Firebending",
    "Weapons",
    "Technology",
    "Other / Custom"
  ],

  stats: ["Creativity", "Focus", "Harmony", "Passion"],

  approaches: [
    { id: "defend", name: "Defend & Maneuver", roll: "Focus" },
    { id: "advance", name: "Advance & Attack", roll: "Passion" },
    { id: "evade", name: "Evade & Observe", roll: "Creativity or Harmony" }
  ],

  /** Basic techniques available to every PC (from Play Materials) */
  basicTechniques: [
    {
      id: "ready",
      name: "Ready",
      approach: "defend",
      mastered: false,
      text: "Mark 1-fatigue to ready yourself or your environment, assigning or clearing a fictionally appropriate status of nearby characters or yourself."
    },
    {
      id: "retaliate",
      name: "Retaliate",
      approach: "defend",
      mastered: false,
      text: "Steel yourself for their blows. Each time a foe inflicts fatigue, a condition, or shifts your balance in this exchange, inflict 1-fatigue on that foe."
    },
    {
      id: "seize-a-position",
      name: "Seize a Position",
      approach: "defend",
      mastered: false,
      text: "Move to a new location. Engage/disengage with a foe, overcome a negative status or danger, establish an advantageous position, or escape the scene. Any foe engaged with you can mark 1-fatigue to block this technique."
    },
    {
      id: "strike",
      name: "Strike",
      approach: "advance",
      mastered: false,
      text: "Strike a foe in reach, forcing them to mark 2-fatigue, mark a condition, or shift their balance away from center, their choice. Mark 1-fatigue to instead choose to hammer them with your blows, forcing them to mark 2-fatigue, or strike where they are weak, inflicting a condition."
    },
    {
      id: "pressure",
      name: "Pressure",
      approach: "advance",
      mastered: false,
      text: "Impress or intimidate a foe. Choose an approach—your foe cannot choose to use that approach in the next exchange."
    },
    {
      id: "smash",
      name: "Smash",
      approach: "advance",
      mastered: false,
      text: "Mark 1-fatigue to destroy or destabilize something in the environment—possibly inflicting or overcoming a fictionally appropriate positive or negative status."
    },
    {
      id: "test-balance",
      name: "Test Balance",
      approach: "evade",
      mastered: false,
      text: "Mark 1-fatigue to challenge an engaged foe’s balance. Ask what their principle is; they must answer honestly. If you already know their principle, instead shift their balance away from center by questioning or challenging their beliefs or perspective."
    },
    {
      id: "bolster-or-hinder",
      name: "Bolster or Hinder",
      approach: "evade",
      mastered: false,
      text: "Aid or impede a nearby character, inflicting an appropriate status."
    },
    {
      id: "commit",
      name: "Commit",
      approach: "evade",
      mastered: false,
      text: "Recenter yourself amidst the fray. Shift your balance toward one of your principles; the next time you live up to that principle, do not mark fatigue."
    }
  ],

  growthQuestionsShared: [
    "Did you learn something challenging, exciting, or complicated about the world?",
    "Did you stop a dangerous threat or solve a community problem?",
    "Did you guide a companion towards balance or end the session at your center?"
  ],

  growthAdvancements: [
    { id: "move-own", name: "Take a new move from your playbook", slots: 4 },
    { id: "move-other", name: "Take a new move from another playbook", slots: 4 },
    { id: "raise-stat", name: "Raise a stat by +1 (maximum of +2 in any given stat)", slots: 1 },
    { id: "shift-center", name: "Shift your center one step", slots: 4 },
    { id: "moment", name: "Unlock your Moment of Balance", slots: 4 }
  ],

  fatigueMax: 5,
  growthMax: 4,
  balanceMin: -3,
  balanceMax: 3
};
