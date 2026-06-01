import type { ParsedEncounter, ParsedNpc } from "@/lib/types";

export const storyTextFields = [
  "title",
  "setting",
  "background",
  "adventureHook",
  "mainQuest",
] as const;

export type StoryTextField = (typeof storyTextFields)[number];

export const encounterFields = [
  "title",
  "content",
] as const satisfies readonly (keyof ParsedEncounter)[];

export type EncounterField = (typeof encounterFields)[number];

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

export type StoryListField = "encounters" | "npcs";

export function isStoryTextField(section: string): section is StoryTextField {
  return storyTextFields.includes(section as StoryTextField);
}
