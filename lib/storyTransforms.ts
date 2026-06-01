import { encounterFields, npcFields, storyTextFields } from "@/lib/storyFields";
import type { ParsedEncounter, ParsedNpc, ParsedStory } from "@/lib/types";

export function trimEncounter(encounter: ParsedEncounter): ParsedEncounter {
  return trimFields(encounter, encounterFields);
}

export function trimNpc(npc: ParsedNpc): ParsedNpc {
  return trimFields(npc, npcFields);
}

export function trimStory(story: ParsedStory): ParsedStory {
  const trimmedStory = trimFields(story, storyTextFields);

  return {
    ...story,
    ...trimmedStory,
    encounters: story.encounters.map(trimEncounter),
    npcs: story.npcs.map(trimNpc),
  };
}

export function cloneStoryDraft(story: ParsedStory): ParsedStory {
  return {
    ...story,
    encounters: story.encounters.map((encounter) => ({ ...encounter })),
    npcs: story.npcs.map((npc) => ({ ...npc })),
  };
}

function trimFields<T, K extends keyof T>(
  value: T & Record<K, string>,
  fields: readonly K[],
): T {
  return fields.reduce(
    (trimmedValue, field) => ({
      ...trimmedValue,
      [field]: value[field].trim(),
    }),
    { ...value },
  );
}
