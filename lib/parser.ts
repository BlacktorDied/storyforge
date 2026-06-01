import { encounterFields, npcFields, storyTextFields } from "@/lib/storyFields";
import { trimStory } from "@/lib/storyTransforms";
import type { ParsedEncounter, ParsedNpc, ParsedStory } from "@/lib/types";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidEncounter(value: unknown): value is ParsedEncounter {
  if (!value || typeof value !== "object") return false;
  const e = value as ParsedEncounter;
  return encounterFields.every((field) => isNonEmptyString(e[field]));
}

function isValidNpc(value: unknown): value is ParsedNpc {
  if (!value || typeof value !== "object") return false;
  const n = value as ParsedNpc;
  return npcFields.every((field) => isNonEmptyString(n[field]));
}

function isValidStory(data: unknown): data is ParsedStory {
  if (!data || typeof data !== "object") return false;

  const story = data as ParsedStory;

  return (
    storyTextFields.every((field) => isNonEmptyString(story[field])) &&
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
