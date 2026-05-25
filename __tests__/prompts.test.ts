import { describe, expect, it } from "vitest";
import { buildStoryPrompt } from "@/lib/prompts";
import { CLASSES, RACES } from "@/lib/data";
import type { SessionLength } from "@/lib/data";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const baseParams = {
  genre: "Dark Fantasy",
  setting: "Swamp",
  races: null,
  classes: null,
  sessionLength: "Medium" as SessionLength,
  partySize: "4",
  level: "3",
};

// ---------------------------------------------------------------------------
// Structure consistency
// ---------------------------------------------------------------------------

describe("buildStoryPrompt — structure", () => {
  it("returns a non-empty string", () => {
    const result = buildStoryPrompt(baseParams);
    expect(typeof result).toBe("string");
    expect(result.trim().length).toBeGreaterThan(0);
  });

  it("contains JSON schema keys in the output", () => {
    const result = buildStoryPrompt(baseParams);
    expect(result).toContain('"title"');
    expect(result).toContain('"encounters"');
    expect(result).toContain('"npcs"');
    expect(result).toContain('"adventureHook"');
  });

  it("contains the output format rules section", () => {
    const result = buildStoryPrompt(baseParams);
    expect(result).toContain("Output format rules");
  });
});

// ---------------------------------------------------------------------------
// Parameter reflection
// ---------------------------------------------------------------------------

describe("buildStoryPrompt — parameters reflected in output", () => {
  it("includes the genre in the output", () => {
    const result = buildStoryPrompt({ ...baseParams, genre: "Horror" });
    expect(result).toContain("Horror");
  });

  it("includes the setting in the output", () => {
    const result = buildStoryPrompt({ ...baseParams, setting: "Desert" });
    expect(result).toContain("Desert");
  });

  it("includes partySize in the output", () => {
    const result = buildStoryPrompt({ ...baseParams, partySize: "5" });
    expect(result).toContain("5");
  });

  it("includes the character level in the output", () => {
    const result = buildStoryPrompt({ ...baseParams, level: "4" });
    expect(result).toContain("4");
  });
});

// ---------------------------------------------------------------------------
// Default races and classes when null
// ---------------------------------------------------------------------------

describe("buildStoryPrompt — default races and classes", () => {
  it("uses all available races when races is null", () => {
    const result = buildStoryPrompt({ ...baseParams, races: null });
    // Spot-check a few races from the RACES constant
    expect(result).toContain(RACES[0]);
    expect(result).toContain(RACES[RACES.length - 1]);
  });

  it("uses all available classes when classes is null", () => {
    const result = buildStoryPrompt({ ...baseParams, classes: null });
    expect(result).toContain(CLASSES[0]);
    expect(result).toContain(CLASSES[CLASSES.length - 1]);
  });

  it("uses only the provided races when given explicitly", () => {
    const selectedRaces = ["Elf", "Human"] as const;
    const result = buildStoryPrompt({ ...baseParams, races: selectedRaces });
    expect(result).toContain("Elf");
    expect(result).toContain("Human");
  });
});

// ---------------------------------------------------------------------------
// Encounter count by session length
// ---------------------------------------------------------------------------

describe("buildStoryPrompt — encounter count per session length", () => {
  it("specifies 2 encounters for Short session", () => {
    const result = buildStoryPrompt({
      ...baseParams,
      sessionLength: "Short" as SessionLength,
    });
    expect(result).toContain("exactly 2 encounters");
  });

  it("specifies 3 encounters for Medium session", () => {
    const result = buildStoryPrompt({
      ...baseParams,
      sessionLength: "Medium" as SessionLength,
    });
    expect(result).toContain("exactly 3 encounters");
  });

  it("specifies 5 encounters for Long session", () => {
    const result = buildStoryPrompt({
      ...baseParams,
      sessionLength: "Long" as SessionLength,
    });
    expect(result).toContain("exactly 5 encounters");
  });
});
