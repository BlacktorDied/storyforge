import { isStoryTextField } from "@/lib/storyFields";
import { trimEncounter, trimNpc } from "@/lib/storyTransforms";
import type { ParsedStory } from "@/lib/types";

type ApplyStoryEditParams = {
  editingSection: string | null;
  story: ParsedStory;
  draft: ParsedStory;
};

export function applyStoryEdit({
  editingSection,
  story,
  draft,
}: ApplyStoryEditParams): ParsedStory {
  if (!editingSection) {
    return story;
  }

  if (isStoryTextField(editingSection)) {
    return {
      ...story,
      [editingSection]: draft[editingSection].trim(),
    };
  }

  const encounterIndex = getListItemIndex(editingSection, "encounter");

  if (encounterIndex !== null) {
    const encounter = draft.encounters[encounterIndex];

    if (!encounter) {
      return story;
    }

    const trimmedEncounter = trimEncounter(encounter);

    return {
      ...story,
      encounters: story.encounters.map((currentEncounter, index) =>
        index === encounterIndex ? trimmedEncounter : currentEncounter,
      ),
    };
  }

  const npcIndex = getListItemIndex(editingSection, "npc");

  if (npcIndex !== null) {
    const npc = draft.npcs[npcIndex];

    if (!npc) {
      return story;
    }

    const trimmedNpc = trimNpc(npc);

    return {
      ...story,
      npcs: story.npcs.map((currentNpc, index) =>
        index === npcIndex ? trimmedNpc : currentNpc,
      ),
    };
  }

  return story;
}

export function getListItemIndex(section: string, prefix: "encounter" | "npc") {
  const match = section.match(new RegExp(`^${prefix}-(\\d+)$`));

  if (!match) {
    return null;
  }

  return Number(match[1]);
}
