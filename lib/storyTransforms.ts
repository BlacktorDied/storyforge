import {
  encounterTextFields,
  npcFields,
  storyTextFields,
} from "@/lib/storyFields";
import type {
  EncounterCheck,
  EncounterCreature,
  EncounterPuzzle,
  ParsedEncounter,
  ParsedNpc,
  ParsedStory,
} from "@/lib/types";

export function trimEncounter(encounter: ParsedEncounter): ParsedEncounter {
  const trimmedEncounter = trimFields(encounter, encounterTextFields);

  return {
    ...trimmedEncounter,
    checks: encounter.checks.map(trimEncounterCheck),
    creatures: encounter.creatures.map(trimEncounterCreature),
    puzzle: encounter.puzzle ? trimEncounterPuzzle(encounter.puzzle) : null,
  };
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
    encounters: story.encounters.map((encounter) => ({
      ...encounter,
      checks: encounter.checks.map((check) => ({ ...check })),
      creatures: encounter.creatures.map((creature) => ({ ...creature })),
      puzzle: encounter.puzzle
        ? {
            ...encounter.puzzle,
            hints: [...encounter.puzzle.hints],
            alternateSolutions: [...encounter.puzzle.alternateSolutions],
          }
        : null,
    })),
    npcs: story.npcs.map((npc) => ({ ...npc })),
  };
}

function trimEncounterCheck(check: EncounterCheck): EncounterCheck {
  return {
    ...check,
    ability: check.ability.trim(),
    skillOrTool: check.skillOrTool?.trim(),
    purpose: check.purpose.trim(),
    success: check.success.trim(),
    failure: check.failure.trim(),
  };
}

function trimEncounterCreature(creature: EncounterCreature): EncounterCreature {
  return {
    ...creature,
    name: creature.name.trim(),
    role: creature.role.trim(),
    combatTrigger: creature.combatTrigger.trim(),
    goal: creature.goal.trim(),
  };
}

function trimEncounterPuzzle(puzzle: EncounterPuzzle): EncounterPuzzle {
  return {
    ...puzzle,
    prompt: puzzle.prompt.trim(),
    answer: puzzle.answer.trim(),
    hints: puzzle.hints.map((hint) => hint.trim()),
    alternateSolutions: puzzle.alternateSolutions.map((solution) =>
      solution.trim(),
    ),
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
