import { describe, expect, it } from "vitest";
import {
  CLASSES,
  ENCOUNTER_COUNT_BY_SESSION_LENGTH,
  RACES,
  type SessionLength,
} from "@/lib/data";
import { buildStoryPrompt } from "@/lib/prompts";

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

describe("buildStoryPrompt", () => {
  describe("output structure", () => {
    it("returns non-empty prompt text", () => {
      const result = buildStoryPrompt(baseParams);

      expect(typeof result).toBe("string");
      expect(result.trim().length).toBeGreaterThan(0);
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
      const result = buildStoryPrompt(baseParams);

      expect(result).toContain(`Allowed races: ${RACES.join(", ")}`);
    });

    it("uses only custom races when a race list is provided", () => {
      const selectedRaces = ["Elf", "Human"] as const;

      const result = buildStoryPrompt({ ...baseParams, races: selectedRaces });

      expect(result).toContain("Allowed races: Elf, Human");
    });

    it("uses all classes when no custom class list is provided", () => {
      const result = buildStoryPrompt(baseParams);

      expect(result).toContain(`Allowed classes: ${CLASSES.join(", ")}`);
    });

    it("uses only custom classes when a class list is provided", () => {
      const selectedClasses = ["Wizard", "Rogue"] as const;

      const result = buildStoryPrompt({
        ...baseParams,
        classes: selectedClasses,
      });

      expect(result).toContain("Allowed classes: Wizard, Rogue");
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
        });

        expect(result).toContain(
          `- Generate exactly ${encounterCount} encounters`,
        );
      }
    });
  });

  describe("Rules & Constraints", () => {
    it("includes constraints, rules and requirements", () => {
      const result = buildStoryPrompt(baseParams);

      expect(result).toContain("Global constraints:");
      expect(result).toContain("Narrative rules:");
      expect(result).toContain("Encounter requirements:");
      expect(result).toContain("NPC requirements:");
      expect(result).toContain("Output format rules (VERY IMPORTANT):");
    });
  });
});
