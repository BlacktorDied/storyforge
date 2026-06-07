import { npcFields, storyTextFields } from "@/lib/storyFields";
import { trimStory } from "@/lib/storyTransforms";
import {
  encounterCheckTypes,
  encounterPuzzleTypes,
  type EncounterCheck,
  type EncounterCheckType,
  type EncounterCreature,
  type EncounterPuzzle,
  type EncounterPuzzleType,
  type ParsedEncounter,
  type ParsedNpc,
  type ParsedStory,
} from "@/lib/types";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isAllowedValue<T extends string>(
  value: unknown,
  allowedValues: readonly T[],
): value is T {
  return typeof value === "string" && allowedValues.includes(value as T);
}

function isNotNull<T>(value: T | null): value is T {
  return value !== null;
}

function normalizeOptionalString(value: unknown): string | undefined {
  return isNonEmptyString(value) ? value.trim() : undefined;
}

function normalizeNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value.trim());

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function normalizePositiveInteger(value: unknown): number | null {
  const parsed = normalizeNumber(value);

  if (parsed === null || parsed < 1) {
    return null;
  }

  return Math.floor(parsed);
}

function normalizeArray(value: unknown): unknown[] {
  if (value === null || value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function normalizeCheckType(value: unknown): EncounterCheckType {
  if (isAllowedValue(value, encounterCheckTypes)) {
    return value;
  }

  if (typeof value === "string") {
    const normalizedValue = value.toLowerCase();

    if (normalizedValue.includes("saving")) {
      return "saving throw";
    }

    if (normalizedValue.includes("tool")) {
      return "tool check";
    }
  }

  return "ability check";
}

function normalizePuzzleType(value: unknown): EncounterPuzzleType {
  if (isAllowedValue(value, encounterPuzzleTypes)) {
    return value;
  }

  if (typeof value === "string") {
    const normalizedValue = value.toLowerCase();

    if (normalizedValue.includes("environment")) {
      return "environmental puzzle";
    }

    if (normalizedValue.includes("logic")) {
      return "logic puzzle";
    }

    if (normalizedValue.includes("riddle")) {
      return "riddle";
    }
  }

  return "clue challenge";
}

function isValidNpc(value: unknown): value is ParsedNpc {
  if (!value || typeof value !== "object") return false;
  const n = value as ParsedNpc;
  return npcFields.every((field) => isNonEmptyString(n[field]));
}

function normalizeCheck(value: unknown): EncounterCheck | null {
  if (!value || typeof value !== "object") return null;

  const check = value as Partial<EncounterCheck>;
  const dc = normalizeNumber(check.dc);

  if (
    !isNonEmptyString(check.ability) ||
    dc === null ||
    !isNonEmptyString(check.purpose) ||
    !isNonEmptyString(check.success) ||
    !isNonEmptyString(check.failure)
  ) {
    return null;
  }

  const normalizedCheck: EncounterCheck = {
    type: normalizeCheckType(check.type),
    ability: check.ability.trim(),
    dc,
    purpose: check.purpose.trim(),
    success: check.success.trim(),
    failure: check.failure.trim(),
  };

  const skillOrTool = normalizeOptionalString(check.skillOrTool);

  if (skillOrTool) {
    normalizedCheck.skillOrTool = skillOrTool;
  }

  return normalizedCheck;
}

function normalizeCreature(value: unknown): EncounterCreature | null {
  if (!value || typeof value !== "object") return null;

  const creature = value as Partial<EncounterCreature>;
  const quantity = normalizePositiveInteger(creature.quantity);

  if (
    !isNonEmptyString(creature.name) ||
    quantity === null ||
    !isNonEmptyString(creature.role) ||
    !isNonEmptyString(creature.combatTrigger) ||
    !isNonEmptyString(creature.goal)
  ) {
    return null;
  }

  return {
    name: creature.name.trim(),
    quantity,
    role: creature.role.trim(),
    combatTrigger: creature.combatTrigger.trim(),
    goal: creature.goal.trim(),
  };
}

function normalizeStringArray(value: unknown): string[] {
  return normalizeArray(value)
    .filter(isNonEmptyString)
    .map((item) => item.trim());
}

function normalizePuzzle(value: unknown): EncounterPuzzle | null {
  if (value === null || value === undefined) return null;
  if (!value || typeof value !== "object") return null;

  const puzzle = value as Partial<EncounterPuzzle>;
  const hints = normalizeStringArray(puzzle.hints);
  const alternateSolutions = normalizeStringArray(puzzle.alternateSolutions);

  if (!isNonEmptyString(puzzle.prompt) || !isNonEmptyString(puzzle.answer)) {
    return null;
  }

  return {
    type: normalizePuzzleType(puzzle.type),
    prompt: puzzle.prompt.trim(),
    answer: puzzle.answer.trim(),
    hints,
    alternateSolutions,
  };
}

function normalizeEncounter(value: unknown): ParsedEncounter | null {
  if (!value || typeof value !== "object") return null;

  const encounter = value as Partial<ParsedEncounter>;
  const title = encounter.title;
  const content = encounter.content;

  if (
    !isNonEmptyString(title) ||
    !isNonEmptyString(content) ||
    !Array.isArray(encounter.checks) ||
    !Array.isArray(encounter.creatures) ||
    !Object.hasOwn(encounter, "puzzle")
  ) {
    return null;
  }

  const normalizedChecks = encounter.checks
    .map(normalizeCheck)
    .filter(isNotNull);
  const normalizedCreatures = encounter.creatures
    .map(normalizeCreature)
    .filter(isNotNull);

  const normalizedPuzzle = normalizePuzzle(encounter.puzzle);

  return {
    title: title.trim(),
    content: content.trim(),
    checks: normalizedChecks,
    creatures: normalizedCreatures,
    puzzle: normalizedPuzzle,
  };
}

function normalizeStory(data: unknown): ParsedStory | null {
  if (!data || typeof data !== "object") return null;

  const story = data as ParsedStory;

  if (
    !storyTextFields.every((field) => isNonEmptyString(story[field])) ||
    !Array.isArray(story.encounters) ||
    story.encounters.length === 0 ||
    !Array.isArray(story.npcs) ||
    story.npcs.length === 0 ||
    !story.npcs.every(isValidNpc)
  ) {
    return null;
  }

  const encounters = story.encounters.map(normalizeEncounter);

  if (encounters.some((encounter) => encounter === null)) {
    return null;
  }

  return {
    title: story.title,
    setting: story.setting,
    background: story.background,
    adventureHook: story.adventureHook,
    mainQuest: story.mainQuest,
    encounters: encounters.filter(isNotNull),
    npcs: story.npcs,
  };
}

export function parseStory(response: string): ParsedStory {
  try {
    const cleaned = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const jsonStart = cleaned.indexOf("{");
    const jsonEnd = cleaned.lastIndexOf("}");

    if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
      throw new Error("Missing JSON object");
    }

    const parsed = JSON.parse(cleaned.slice(jsonStart, jsonEnd + 1));
    const story = normalizeStory(parsed);

    if (!story) {
      throw new Error("Invalid story structure");
    }

    return trimStory(story);
  } catch {
    throw new Error("Failed to parse AI response");
  }
}
