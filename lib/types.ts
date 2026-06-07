export type SelectionMode = "all" | "custom";

export const encounterCheckTypes = [
  "ability check",
  "saving throw",
  "tool check",
] as const;

export type EncounterCheckType = (typeof encounterCheckTypes)[number];

export const encounterPuzzleTypes = [
  "environmental puzzle",
  "logic puzzle",
  "riddle",
  "clue challenge",
] as const;

export type EncounterPuzzleType = (typeof encounterPuzzleTypes)[number];

export type ParsedNpc = {
  name: string;
  race: string;
  class: string;
  role: string;
  location: string;
  motivation: string;
  description: string;
};

export type EncounterCheck = {
  type: EncounterCheckType;
  ability: string;
  skillOrTool?: string;
  dc: number;
  purpose: string;
  success: string;
  failure: string;
};

export type EncounterCreature = {
  name: string;
  quantity: number;
  role: string;
  combatTrigger: string;
  goal: string;
};

export type EncounterPuzzle = {
  type: EncounterPuzzleType;
  prompt: string;
  answer: string;
  hints: string[];
  alternateSolutions: string[];
};

export type ParsedEncounter = {
  title: string;
  content: string;
  checks: EncounterCheck[];
  creatures: EncounterCreature[];
  puzzle: EncounterPuzzle | null;
};

export type ParsedStory = {
  title: string;
  setting: string;
  background: string;
  adventureHook: string;
  mainQuest: string;
  encounters: ParsedEncounter[];
  npcs: ParsedNpc[];
};
