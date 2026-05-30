import type { ParsedEncounter, ParsedNpc, ParsedStory } from "@/lib/types";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidEncounter(value: unknown): value is ParsedEncounter {
  if (!value || typeof value !== "object") return false;
  const e = value as ParsedEncounter;
  return isNonEmptyString(e.title) && isNonEmptyString(e.content);
}

function isValidNpc(value: unknown): value is ParsedNpc {
  if (!value || typeof value !== "object") return false;
  const n = value as ParsedNpc;
  return (
    isNonEmptyString(n.name) &&
    isNonEmptyString(n.race) &&
    isNonEmptyString(n.class) &&
    isNonEmptyString(n.role) &&
    isNonEmptyString(n.location) &&
    isNonEmptyString(n.motivation) &&
    isNonEmptyString(n.description)
  );
}

function isValidStory(data: unknown): data is ParsedStory {
  if (!data || typeof data !== "object") return false;

  const story = data as ParsedStory;

  return (
    isNonEmptyString(story.title) &&
    isNonEmptyString(story.setting) &&
    isNonEmptyString(story.background) &&
    isNonEmptyString(story.adventureHook) &&
    isNonEmptyString(story.mainQuest) &&
    Array.isArray(story.encounters) &&
    story.encounters.length > 0 &&
    story.encounters.every(isValidEncounter) &&
    Array.isArray(story.npcs) &&
    story.npcs.length > 0 &&
    story.npcs.every(isValidNpc)
  );
}

export function parseStory(response: string): ParsedStory {
  try {
    const cleaned = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    if (!isValidStory(parsed)) {
      throw new Error("Invalid story structure");
    }

    return trimStory(parsed);
  } catch {
    throw new Error("Failed to parse AI response");
  }
}

function trimStory(story: ParsedStory): ParsedStory {
  return {
    ...story,
    title: story.title.trim(),
    setting: story.setting.trim(),
    background: story.background.trim(),
    adventureHook: story.adventureHook.trim(),
    mainQuest: story.mainQuest.trim(),
    encounters: story.encounters.map((encounter) => ({
      title: encounter.title.trim(),
      content: encounter.content.trim(),
    })),
    npcs: story.npcs.map((npc) => ({
      name: npc.name.trim(),
      race: npc.race.trim(),
      class: npc.class.trim(),
      role: npc.role.trim(),
      location: npc.location.trim(),
      motivation: npc.motivation.trim(),
      description: npc.description.trim(),
    })),
  };
}
