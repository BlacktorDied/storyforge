import type { ParsedEncounter, ParsedNpc, ParsedStory } from "@/lib/types";

export type StoryTextField =
  | "title"
  | "setting"
  | "background"
  | "adventureHook"
  | "mainQuest";

export type StoryListField = "encounters" | "npcs";

type ApplyStoryEditParams = {
  editingSection: string | null;
  story: ParsedStory;
  draft: ParsedStory;
};

const storyTextFields: Record<StoryTextField, true> = {
  title: true,
  setting: true,
  background: true,
  adventureHook: true,
  mainQuest: true,
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

    const trimmedEncounter: ParsedEncounter = {
      title: encounter.title.trim(),
      content: encounter.content.trim(),
    };

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

    const trimmedNpc: ParsedNpc = {
      name: npc.name.trim(),
      race: npc.race.trim(),
      class: npc.class.trim(),
      role: npc.role.trim(),
      location: npc.location.trim(),
      motivation: npc.motivation.trim(),
      description: npc.description.trim(),
    };

    return {
      ...story,
      npcs: story.npcs.map((currentNpc, index) =>
        index === npcIndex ? trimmedNpc : currentNpc,
      ),
    };
  }

  return story;
}

export function isStoryTextField(section: string): section is StoryTextField {
  return section in storyTextFields;
}

export function getListItemIndex(section: string, prefix: "encounter" | "npc") {
  const match = section.match(new RegExp(`^${prefix}-(\\d+)$`));

  if (!match) {
    return null;
  }

  return Number(match[1]);
}
