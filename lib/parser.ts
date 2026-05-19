import type { ParsedStory } from "@/lib/types";

function isValidStory(data: unknown): data is ParsedStory {
  if (!data || typeof data !== "object") {
    return false;
  }

  const story = data as ParsedStory;

  return (
    typeof story.title === "string" &&
    typeof story.setting === "string" &&
    typeof story.background === "string" &&
    typeof story.adventureHook === "string" &&
    typeof story.mainQuest === "string" &&
    Array.isArray(story.encounters) &&
    Array.isArray(story.npcs)
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

    return parsed;
  } catch {
    throw new Error("Failed to parse AI response");
  }
}
