import { describe, expect, it } from "vitest";
import {
  CLASSES,
  EMOTIONAL_TONE_OPTIONS,
  ENCOUNTER_COUNT_BY_SESSION_LENGTH,
  GAMEPLAY_THEME_OPTIONS,
  NARRATIVE_ARCHETYPE_OPTIONS,
  NARRATIVE_PACING_OPTIONS,
  RACES,
  type SessionLength,
} from "@/lib/data";
import {
  buildResolvedNarrativeDirection,
  buildStoryPrompt,
} from "@/lib/prompts";

// ===========================================================================
// Fixtures
// ===========================================================================

const baseParams = {
  genre: "Dark Fantasy",
  setting: "Swamp",
  races: null,
  classes: null,
  sessionLength: "Medium" as SessionLength,
  partySize: "4",
  level: "3",
};

const firstRandomValue = () => 0;

describe("buildStoryPrompt", () => {
  describe("output structure", () => {
    it("returns non-empty prompt text", () => {
      const result = buildStoryPrompt({
        ...baseParams,
        random: firstRandomValue,
      });

      expect(typeof result).toBe("string");
      expect(result.trim().length).toBeGreaterThan(0);
    });

    it("keeps the generated JSON structure compatible with ParsedStory", () => {
      const result = buildStoryPrompt({
        ...baseParams,
        random: firstRandomValue,
      });

      expect(result).toContain('"title": "string"');
      expect(result).toContain('"setting": "string"');
      expect(result).toContain('"background": "string"');
      expect(result).toContain('"adventureHook": "string"');
      expect(result).toContain('"mainQuest": "string"');
      expect(result).toContain('"encounters": [');
      expect(result).toContain('"checks": [');
      expect(result).toContain('"dc": 15');
      expect(result).toContain('"creatures": [');
      expect(result).toContain('"quantity": 1');
      expect(result).not.toContain('"source"');
      expect(result).toContain('"puzzle": {');
      expect(result).toContain('"npcs": [');
      expect(result).not.toContain('"narrativeArchetype"');
      expect(result).not.toContain('"emotionalTone"');
      expect(result).not.toContain('"gameplayTheme"');
      expect(result).not.toContain('"pacingStyle"');
    });
  });

  describe("generation parameters", () => {
    it("includes each selected generation parameter", () => {
      const result = buildStoryPrompt({
        ...baseParams,
        genre: "Horror",
        setting: "Desert",
        partySize: "5",
        level: "4",
        sessionLength: "Long",
        random: firstRandomValue,
      });

      expect(result).toContain("Genre: Horror");
      expect(result).toContain("Setting: Desert");
      expect(result).toContain("Party size: 5 players");
      expect(result).toContain("Recommended player level: 4");
      expect(result).toContain("Session length: Long");
    });
  });

  describe("race and class selection", () => {
    it("uses all races when no custom race list is provided", () => {
      const result = buildStoryPrompt({
        ...baseParams,
        random: firstRandomValue,
      });

      expect(result).toContain(`Allowed races: ${RACES.join(", ")}`);
    });

    it("uses only custom races when a race list is provided", () => {
      const selectedRaces = ["Elf", "Human"] as const;

      const result = buildStoryPrompt({
        ...baseParams,
        races: selectedRaces,
        random: firstRandomValue,
      });

      expect(result).toContain("Allowed races: Elf, Human");
      expect(result).toContain(
        "NPCs MUST use ONLY races from the allowed list: Elf, Human",
      );
    });

    it("uses all classes when no custom class list is provided", () => {
      const result = buildStoryPrompt({
        ...baseParams,
        random: firstRandomValue,
      });

      expect(result).toContain(`Allowed classes: ${CLASSES.join(", ")}`);
    });

    it("uses only custom classes when a class list is provided", () => {
      const selectedClasses = ["Wizard", "Rogue"] as const;

      const result = buildStoryPrompt({
        ...baseParams,
        classes: selectedClasses,
        random: firstRandomValue,
      });

      expect(result).toContain("Allowed classes: Wizard, Rogue");
      expect(result).toContain(
        "NPCs MUST use ONLY classes from the allowed list: Wizard, Rogue",
      );
    });
  });

  describe("narrative diversity", () => {
    it("resolves deterministic narrative direction values when advanced selections are empty", () => {
      const direction = buildResolvedNarrativeDirection({}, firstRandomValue);

      expect(direction.archetype).toBe(NARRATIVE_ARCHETYPE_OPTIONS[0].prompt);
      expect(direction.tone).toBe(EMOTIONAL_TONE_OPTIONS[0].prompt);
      expect(direction.theme).toBe(GAMEPLAY_THEME_OPTIONS[0].prompt);
      expect(direction.pacing).toBe(NARRATIVE_PACING_OPTIONS[0].prompt);
      expect(direction.climax).toBe(
        "direct confrontation - final combat with the main antagonist or most dangerous threat",
      );
      expect(direction.storyFlow).toBe(
        "branching investigation - each encounter reveals a clue that can point to two different next steps",
      );
      expect(direction.locationInspiration).toBe(
        "a coastal fishing town haunted by strange disappearances at sea",
      );
      expect(direction.antiTropes).toEqual([
        "Do not use a generic dungeon crawl format - the adventure must not primarily take place in a series of underground rooms with monsters behind every door",
        "Do not use an evil wizard in a tower as the central threat",
        "Do not start the adventure in a tavern",
      ]);
    });

    it("uses explicitly selected future advanced story options", () => {
      const result = buildStoryPrompt({
        ...baseParams,
        narrativeArchetype: "heist-infiltration",
        emotionalTone: "hopeful-heroic",
        gameplayTheme: "puzzle-solving",
        pacingStyle: "fast-paced",
        random: firstRandomValue,
      });

      expect(result).toContain(
        `Archetype: ${NARRATIVE_ARCHETYPE_OPTIONS[1].prompt}`,
      );
      expect(result).toContain(
        `Emotional tone: ${EMOTIONAL_TONE_OPTIONS[1].prompt}`,
      );
      expect(result).toContain(
        `Gameplay theme: ${GAMEPLAY_THEME_OPTIONS[2].prompt}`,
      );
      expect(result).toContain(`Pacing: ${NARRATIVE_PACING_OPTIONS[1].prompt}`);
    });

    it("includes every resolved narrative direction field in the prompt", () => {
      const direction = buildResolvedNarrativeDirection({}, firstRandomValue);
      const result = buildStoryPrompt({
        ...baseParams,
        random: firstRandomValue,
      });

      expect(result).toContain("--- NARRATIVE DIRECTION ---");
      expect(result).toContain(`Archetype: ${direction.archetype}`);
      expect(result).toContain(`Emotional tone: ${direction.tone}`);
      expect(result).toContain(`Gameplay theme: ${direction.theme}`);
      expect(result).toContain(`Pacing: ${direction.pacing}`);
      expect(result).toContain(`Story flow: ${direction.storyFlow}`);
      expect(result).toContain(`Climax type: ${direction.climax}`);
      expect(result).toContain(
        `Location inspiration: Use "${direction.locationInspiration}"`,
      );
    });
  });

  describe("encounter requirements", () => {
    it("uses the configured encounter count for each session length", () => {
      for (const [sessionLength, encounterCount] of Object.entries(
        ENCOUNTER_COUNT_BY_SESSION_LENGTH,
      ) as [SessionLength, number][]) {
        const result = buildStoryPrompt({
          ...baseParams,
          sessionLength,
          random: firstRandomValue,
        });

        expect(result).toContain(
          `- Generate exactly ${encounterCount} encounters`,
        );
      }
    });
  });

  describe("Rules & Constraints", () => {
    it("includes constraints, rules and requirements", () => {
      const result = buildStoryPrompt({
        ...baseParams,
        random: firstRandomValue,
      });

      expect(result).toContain("--- NARRATIVE DIRECTION ---");
      expect(result).toContain(
        "--- ANTI-REPETITION DIRECTIVES (follow all of these strictly) ---",
      );
      expect(result).toContain("--- STORY CONTENT REQUIREMENTS ---");
      expect(result).toContain("--- ENCOUNTER REQUIREMENTS ---");
      expect(result).toContain("--- GLOBAL CONSTRAINTS ---");
      expect(result).toContain("--- OUTPUT FORMAT (VERY IMPORTANT) ---");
    });
  });
});
