import type { ParsedEncounter, ParsedNpc, ParsedStory } from "@/lib/types";
import { validateTextValue } from "@/lib/validation";
import {
  getListItemIndex,
  isStoryTextField,
  type StoryTextField,
} from "@/lib/storyEditing";

export type StoryFieldErrors = Record<string, string>;

// =========================================================================
// Types
// =========================================================================

type StoryValidationRule = {
  label: string;
  maxLength: number;
};

type StoryEditValidationParams = {
  editingSection: string | null;
  draft: ParsedStory;
};

// =========================================================================
// Rules
// =========================================================================

const storyTextRules: Record<StoryTextField, StoryValidationRule> = {
  title: { label: "Title", maxLength: 120 },
  setting: { label: "Setting", maxLength: 1500 },
  background: { label: "Background", maxLength: 2500 },
  adventureHook: { label: "Adventure hook", maxLength: 1500 },
  mainQuest: { label: "Main quest", maxLength: 2500 },
};

const encounterFieldRules: Record<keyof ParsedEncounter, StoryValidationRule> =
  {
    title: { label: "Encounter title", maxLength: 120 },
    content: { label: "Encounter description", maxLength: 1500 },
  };

const npcFieldRules: Record<keyof ParsedNpc, StoryValidationRule> = {
  name: { label: "NPC name", maxLength: 80 },
  race: { label: "NPC race", maxLength: 60 },
  class: { label: "NPC class", maxLength: 60 },
  role: { label: "NPC role", maxLength: 100 },
  location: { label: "NPC location", maxLength: 120 },
  motivation: { label: "NPC motivation", maxLength: 300 },
  description: { label: "NPC description", maxLength: 1000 },
};

// =========================================================================
// Edit Validation
// =========================================================================

export function validateStoryEdit({
  editingSection,
  draft,
}: StoryEditValidationParams): StoryFieldErrors {
  if (!editingSection) {
    return {};
  }

  const errors: StoryFieldErrors = {};

  if (isStoryTextField(editingSection)) {
    return validateStorySectionEdit(editingSection, draft);
  }

  const encounterIndex = getListItemIndex(editingSection, "encounter");

  if (encounterIndex !== null) {
    return validateEncounterEdit(encounterIndex, draft);
  }

  const npcIndex = getListItemIndex(editingSection, "npc");

  if (npcIndex !== null) {
    return validateNpcEdit(npcIndex, draft);
  }

  return errors;
}

function validateStorySectionEdit(
  field: StoryTextField,
  draft: ParsedStory,
): StoryFieldErrors {
  const errors: StoryFieldErrors = {};
  const trimmedValue = draft[field].trim();
  const error = validateStoryTextField(field, trimmedValue);

  if (error) {
    errors[field] = error;
  }

  return errors;
}

function validateEncounterEdit(
  index: number,
  draft: ParsedStory,
): StoryFieldErrors {
  const errors: StoryFieldErrors = {};
  const encounter = draft.encounters[index];

  if (!encounter) {
    return errors;
  }

  const trimmedEncounter = {
    title: encounter.title.trim(),
    content: encounter.content.trim(),
  };
  const titleError = validateEncounterField("title", trimmedEncounter.title);
  const contentError = validateEncounterField(
    "content",
    trimmedEncounter.content,
  );

  if (titleError) {
    errors[getEncounterErrorKey(index, "title")] = titleError;
  }

  if (contentError) {
    errors[getEncounterErrorKey(index, "content")] = contentError;
  }

  return errors;
}

function validateNpcEdit(index: number, draft: ParsedStory): StoryFieldErrors {
  const errors: StoryFieldErrors = {};
  const npc = draft.npcs[index];

  if (!npc) {
    return errors;
  }

  const trimmedNpc = {
    name: npc.name.trim(),
    race: npc.race.trim(),
    class: npc.class.trim(),
    role: npc.role.trim(),
    location: npc.location.trim(),
    motivation: npc.motivation.trim(),
    description: npc.description.trim(),
  };
  const nameError = validateNpcField("name", trimmedNpc.name);
  const raceError = validateNpcField("race", trimmedNpc.race);
  const classError = validateNpcField("class", trimmedNpc.class);
  const roleError = validateNpcField("role", trimmedNpc.role);
  const locationError = validateNpcField("location", trimmedNpc.location);
  const motivationError = validateNpcField("motivation", trimmedNpc.motivation);
  const descriptionError = validateNpcField(
    "description",
    trimmedNpc.description,
  );

  if (nameError) {
    errors[getNpcErrorKey(index, "name")] = nameError;
  }

  if (raceError) {
    errors[getNpcErrorKey(index, "race")] = raceError;
  }

  if (classError) {
    errors[getNpcErrorKey(index, "class")] = classError;
  }

  if (roleError) {
    errors[getNpcErrorKey(index, "role")] = roleError;
  }

  if (locationError) {
    errors[getNpcErrorKey(index, "location")] = locationError;
  }

  if (motivationError) {
    errors[getNpcErrorKey(index, "motivation")] = motivationError;
  }

  if (descriptionError) {
    errors[getNpcErrorKey(index, "description")] = descriptionError;
  }

  return errors;
}

// =========================================================================
// Field Validation
// =========================================================================

export function validateStoryTextField(field: StoryTextField, value: string) {
  const rule = storyTextRules[field];

  return validateTextValue(value, rule.label, rule.maxLength);
}

export function validateEncounterField(
  field: keyof ParsedEncounter,
  value: string,
) {
  const rule = encounterFieldRules[field];

  return validateTextValue(value, rule.label, rule.maxLength);
}

export function validateNpcField(field: keyof ParsedNpc, value: string) {
  const rule = npcFieldRules[field];

  return validateTextValue(value, rule.label, rule.maxLength);
}

export function getEncounterErrorKey(
  index: number,
  field: keyof ParsedEncounter,
) {
  return `encounters.${index}.${field}`;
}

export function getNpcErrorKey(index: number, field: keyof ParsedNpc) {
  return `npcs.${index}.${field}`;
}
