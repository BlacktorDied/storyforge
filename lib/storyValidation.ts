import {
  encounterCheckTypes,
  encounterPuzzleTypes,
  type EncounterCheck,
  type EncounterCreature,
  type EncounterPuzzle,
  type ParsedStory,
} from "@/lib/types";
import { validateTextValue } from "@/lib/validation";
import {
  encounterCheckFields,
  encounterCreatureFields,
  encounterTextFields,
  encounterPuzzleFields,
  isStoryTextField,
  npcFields,
  type EncounterCheckField,
  type EncounterCreatureField,
  type EncounterPuzzleField,
  type EncounterPuzzleListField,
  type EncounterTextField,
  type NpcField,
  type StoryTextField,
} from "@/lib/storyFields";
import { getListItemIndex } from "@/lib/storyEditing";
import { trimEncounter, trimNpc } from "@/lib/storyTransforms";

export type StoryFieldErrors = Record<string, string>;

const formatAllowedValues = (values: readonly string[]) => values.join(", ");

function setFieldError(
  errors: StoryFieldErrors,
  key: string,
  error: string | null,
) {
  if (error) {
    errors[key] = error;
  }
}

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

const encounterTextRules: Record<EncounterTextField, StoryValidationRule> = {
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

  encounterTextFields.forEach((field) => {
    const error = validateEncounterTextField(field, trimmedEncounter[field]);

    setFieldError(errors, getEncounterErrorKey(index, field), error);
  });

  trimmedEncounter.checks.forEach((check, checkIndex) => {
    Object.assign(errors, validateEncounterCheck(index, checkIndex, check));
  });

  trimmedEncounter.creatures.forEach((creature, creatureIndex) => {
    Object.assign(
      errors,
      validateEncounterCreature(index, creatureIndex, creature),
    );
  });

  if (trimmedEncounter.puzzle) {
    Object.assign(
      errors,
      validateEncounterPuzzle(index, trimmedEncounter.puzzle),
    );
  }

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

    setFieldError(errors, getNpcErrorKey(index, field), error);
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

export function validateEncounterTextField(
  field: EncounterTextField,
  value: string,
) {
  const rule = encounterTextRules[field];

  return validateTextValue(value, rule.label, rule.maxLength);
}

export function validateNpcField(field: NpcField, value: string) {
  const rule = npcFieldRules[field];

  return validateTextValue(value, rule.label, rule.maxLength);
}

function validateEncounterCheck(
  encounterIndex: number,
  checkIndex: number,
  check: EncounterCheck,
): StoryFieldErrors {
  const errors: StoryFieldErrors = {};
  const key = (field: string) =>
    `encounters.${encounterIndex}.checks.${checkIndex}.${field}`;

  encounterCheckFields.forEach((field) => {
    const error = validateEncounterCheckField(field, check[field]);

    setFieldError(errors, key(field), error);
  });

  return errors;
}

export function validateEncounterCheckField<K extends EncounterCheckField>(
  field: K,
  value: EncounterCheck[K],
) {
  switch (field) {
    case "type":
      return encounterCheckTypes.includes(value as EncounterCheck["type"])
        ? null
        : `Check type must be one of: ${formatAllowedValues(encounterCheckTypes)}.`;
    case "ability":
      return validateTextValue(value as string, "Check ability", 40);
    case "skillOrTool":
      return value === undefined
        ? null
        : validateTextValue(value as string, "Check skill or tool", 80);
    case "dc":
      return typeof value === "number" && Number.isFinite(value)
        ? null
        : "Check DC is required.";
    case "purpose":
      return validateTextValue(value as string, "Check purpose", 300);
    case "success":
      return validateTextValue(value as string, "Check success", 500);
    case "failure":
      return validateTextValue(value as string, "Check failure", 500);
  }
}

function validateEncounterCreature(
  encounterIndex: number,
  creatureIndex: number,
  creature: EncounterCreature,
): StoryFieldErrors {
  const errors: StoryFieldErrors = {};
  const key = (field: string) =>
    `encounters.${encounterIndex}.creatures.${creatureIndex}.${field}`;

  encounterCreatureFields.forEach((field) => {
    const error = validateEncounterCreatureField(field, creature[field]);

    setFieldError(errors, key(field), error);
  });

  return errors;
}

export function validateEncounterCreatureField<
  K extends EncounterCreatureField,
>(field: K, value: EncounterCreature[K]) {
  switch (field) {
    case "name":
      return validateTextValue(value as string, "Creature name", 120);
    case "quantity":
      return typeof value === "number" && Number.isInteger(value) && value >= 1
        ? null
        : "Creature quantity must be at least 1.";
    case "role":
      return validateTextValue(value as string, "Creature role", 200);
    case "combatTrigger":
      return validateTextValue(value as string, "Combat trigger", 400);
    case "goal":
      return validateTextValue(value as string, "Creature goal", 300);
  }
}

function validateEncounterPuzzle(
  encounterIndex: number,
  puzzle: EncounterPuzzle,
): StoryFieldErrors {
  const errors: StoryFieldErrors = {};
  const key = (field: string) => `encounters.${encounterIndex}.puzzle.${field}`;

  encounterPuzzleFields.forEach((field) => {
    const error = validateEncounterPuzzleField(field, puzzle[field]);

    setFieldError(errors, key(field), error);
  });

  puzzle.hints.forEach((hint, hintIndex) => {
    const hintError = validateEncounterPuzzleListItem("hints", hint);

    setFieldError(errors, `${key("hints")}.${hintIndex}`, hintError);
  });

  puzzle.alternateSolutions.forEach((solution, solutionIndex) => {
    const solutionError = validateEncounterPuzzleListItem(
      "alternateSolutions",
      solution,
    );

    setFieldError(
      errors,
      `${key("alternateSolutions")}.${solutionIndex}`,
      solutionError,
    );
  });

  return errors;
}

export function validateEncounterPuzzleField<K extends EncounterPuzzleField>(
  field: K,
  value: EncounterPuzzle[K],
) {
  switch (field) {
    case "type":
      return encounterPuzzleTypes.includes(value as EncounterPuzzle["type"])
        ? null
        : `Puzzle type must be one of: ${formatAllowedValues(encounterPuzzleTypes)}.`;
    case "prompt":
      return validateTextValue(value as string, "Puzzle prompt", 1000);
    case "answer":
      return validateTextValue(value as string, "Puzzle answer", 500);
  }
}

export function validateEncounterPuzzleListItem(
  field: EncounterPuzzleListField,
  value: string,
) {
  return field === "hints"
    ? validateTextValue(value, "Puzzle hint", 300)
    : validateTextValue(value, "Puzzle alternate solution", 400);
}

export function getEncounterErrorKey(index: number, field: EncounterTextField) {
  return `encounters.${index}.${field}`;
}

export function getEncounterCheckErrorKey(
  encounterIndex: number,
  checkIndex: number,
  field: EncounterCheckField,
) {
  return `encounters.${encounterIndex}.checks.${checkIndex}.${field}`;
}

export function getEncounterCreatureErrorKey(
  encounterIndex: number,
  creatureIndex: number,
  field: EncounterCreatureField,
) {
  return `encounters.${encounterIndex}.creatures.${creatureIndex}.${field}`;
}

export function getEncounterPuzzleErrorKey(
  encounterIndex: number,
  field: EncounterPuzzleField,
) {
  return `encounters.${encounterIndex}.puzzle.${field}`;
}

export function getEncounterPuzzleListErrorKey(
  encounterIndex: number,
  field: EncounterPuzzleListField,
  itemIndex: number,
) {
  return `encounters.${encounterIndex}.puzzle.${field}.${itemIndex}`;
}

export function getNpcErrorKey(index: number, field: NpcField) {
  return `npcs.${index}.${field}`;
}
