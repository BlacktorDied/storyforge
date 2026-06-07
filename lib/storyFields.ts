import type {
  EncounterCheck,
  EncounterCreature,
  EncounterPuzzle,
  ParsedEncounter,
  ParsedNpc,
} from "@/lib/types";

export const storyTextFields = [
  "title",
  "setting",
  "background",
  "adventureHook",
  "mainQuest",
] as const;

export type StoryTextField = (typeof storyTextFields)[number];

export type StoryListField = "encounters" | "npcs";

export const encounterTextFields = [
  "title",
  "content",
] as const satisfies readonly (keyof ParsedEncounter)[];

export type EncounterTextField = (typeof encounterTextFields)[number];

export const encounterCheckFields = [
  "type",
  "ability",
  "skillOrTool",
  "dc",
  "purpose",
  "success",
  "failure",
] as const satisfies readonly (keyof EncounterCheck)[];

export type EncounterCheckField = (typeof encounterCheckFields)[number];

export const encounterCreatureFields = [
  "name",
  "quantity",
  "role",
  "combatTrigger",
  "goal",
] as const satisfies readonly (keyof EncounterCreature)[];

export type EncounterCreatureField = (typeof encounterCreatureFields)[number];

export const encounterPuzzleFields = [
  "type",
  "prompt",
  "answer",
] as const satisfies readonly (keyof EncounterPuzzle)[];

export type EncounterPuzzleField = (typeof encounterPuzzleFields)[number];

export type EncounterPuzzleListField = "hints" | "alternateSolutions";

export const npcFields = [
  "name",
  "race",
  "class",
  "role",
  "location",
  "motivation",
  "description",
] as const satisfies readonly (keyof ParsedNpc)[];

export type NpcField = (typeof npcFields)[number];

export function isStoryTextField(section: string): section is StoryTextField {
  return storyTextFields.includes(section as StoryTextField);
}
