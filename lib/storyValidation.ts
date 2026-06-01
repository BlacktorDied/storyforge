import type { ParsedStory } from "@/lib/types";
import { validateTextValue } from "@/lib/validation";
import {
  encounterFields,
  isStoryTextField,
  npcFields,
  type EncounterField,
  type NpcField,
  type StoryTextField,
} from "@/lib/storyFields";
import { getListItemIndex } from "@/lib/storyEditing";
import { trimEncounter, trimNpc } from "@/lib/storyTransforms";

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

const encounterFieldRules: Record<EncounterField, StoryValidationRule> = {
  title: { label: "Encounter title", maxLength: 120 },
  content: { label: "Encounter description", maxLength: 1500 },
};

const npcFieldRules: Record<NpcField, StoryValidationRule> = {
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

  const trimmedEncounter = trimEncounter(encounter);

  encounterFields.forEach((field) => {
    const error = validateEncounterField(field, trimmedEncounter[field]);

    if (error) {
      errors[getEncounterErrorKey(index, field)] = error;
    }
  });

  return errors;
}

function validateNpcEdit(index: number, draft: ParsedStory): StoryFieldErrors {
  const errors: StoryFieldErrors = {};
  const npc = draft.npcs[index];

  if (!npc) {
    return errors;
  }

  const trimmedNpc = trimNpc(npc);

  npcFields.forEach((field) => {
    const error = validateNpcField(field, trimmedNpc[field]);

    if (error) {
      errors[getNpcErrorKey(index, field)] = error;
    }
  });

  return errors;
}

// =========================================================================
// Field Validation
// =========================================================================

export function validateStoryTextField(field: StoryTextField, value: string) {
  const rule = storyTextRules[field];

  return validateTextValue(value, rule.label, rule.maxLength);
}

export function validateEncounterField(field: EncounterField, value: string) {
  const rule = encounterFieldRules[field];

  return validateTextValue(value, rule.label, rule.maxLength);
}

export function validateNpcField(field: NpcField, value: string) {
  const rule = npcFieldRules[field];

  return validateTextValue(value, rule.label, rule.maxLength);
}

export function getEncounterErrorKey(index: number, field: EncounterField) {
  return `encounters.${index}.${field}`;
}

export function getNpcErrorKey(index: number, field: NpcField) {
  return `npcs.${index}.${field}`;
}
