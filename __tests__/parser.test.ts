import { describe, expect, it } from "vitest";
import { parseStory } from "@/lib/parser";
import type { ParsedStory } from "@/lib/types";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const validNpc = {
  name: "Mira Ashvale",
  race: "Human",
  class: "Rogue",
  role: "Informant",
  location: "The local inn",
  motivation: "She wants to expose the miller's secret deal",
  description:
    "A sharp-eyed woman with ink-stained fingers and a nervous habit of checking over her shoulder.",
};

const validEncounter = {
  title: "The Silent Village",
  content:
    "The party arrives to find the village eerily quiet — doors hang open, fires are cold, and no one answers calls.",
};

const validStoryObject: ParsedStory = {
  title: "The Cursed Mill",
  setting: "A fog-covered marshland village",
  background:
    "Three years ago, a local miller made a pact with a river spirit to ensure a bountiful harvest. The spirit kept its end of the bargain — but the cost grows each season. Now villagers vanish without a trace, and the miller refuses to speak of it.",
  adventureHook:
    "A merchant's cart is found abandoned on the road outside Ashfen — the horse still harnessed, the cargo untouched, and a single muddy trail leading toward the old mill.",
  mainQuest:
    "The party must uncover the nature of the pact, confront the river spirit at the mill, and break the curse before the next full moon or another family disappears.",
  encounters: [validEncounter],
  npcs: [validNpc],
};

const validJson = JSON.stringify(validStoryObject);

// ---------------------------------------------------------------------------
// Happy path
// ---------------------------------------------------------------------------

describe("parseStory — valid input", () => {
  it("parses a valid story JSON string", () => {
    const result = parseStory(validJson);
    expect(result.title).toBe(validStoryObject.title);
    expect(result.encounters).toHaveLength(1);
    expect(result.npcs).toHaveLength(1);
  });

  it("parses JSON wrapped in ```json fences", () => {
    const fenced = "```json\n" + validJson + "\n```";
    const result = parseStory(fenced);
    expect(result.title).toBe(validStoryObject.title);
  });

  it("parses JSON wrapped in plain ``` fences", () => {
    const fenced = "```\n" + validJson + "\n```";
    const result = parseStory(fenced);
    expect(result.title).toBe(validStoryObject.title);
  });
});

// ---------------------------------------------------------------------------
// Malformed JSON
// ---------------------------------------------------------------------------

describe("parseStory — malformed JSON", () => {
  it("throws on completely invalid input", () => {
    expect(() => parseStory("not json at all")).toThrow();
  });

  it("throws on empty string", () => {
    expect(() => parseStory("")).toThrow();
  });

  it("throws on a JSON array instead of an object", () => {
    expect(() => parseStory("[1, 2, 3]")).toThrow();
  });
});

// ---------------------------------------------------------------------------
// Missing or empty top-level fields
// ---------------------------------------------------------------------------

describe("parseStory — missing top-level fields", () => {
  const fields = [
    "title",
    "setting",
    "background",
    "adventureHook",
    "mainQuest",
  ] as const;

  for (const field of fields) {
    it(`throws when '${field}' is missing`, () => {
      const broken = { ...validStoryObject };
      delete (broken as Partial<ParsedStory>)[field];
      expect(() => parseStory(JSON.stringify(broken))).toThrow();
    });

    it(`throws when '${field}' is an empty string`, () => {
      const broken = { ...validStoryObject, [field]: "" };
      expect(() => parseStory(JSON.stringify(broken))).toThrow();
    });

    it(`throws when '${field}' is whitespace only`, () => {
      const broken = { ...validStoryObject, [field]: "   " };
      expect(() => parseStory(JSON.stringify(broken))).toThrow();
    });
  }
});

// ---------------------------------------------------------------------------
// Invalid encounter structure
// ---------------------------------------------------------------------------

describe("parseStory — invalid encounters", () => {
  it("throws when encounters is an empty array", () => {
    const broken = { ...validStoryObject, encounters: [] };
    expect(() => parseStory(JSON.stringify(broken))).toThrow();
  });

  it("throws when an encounter is missing 'title'", () => {
    const broken = {
      ...validStoryObject,
      encounters: [{ content: validEncounter.content }],
    };
    expect(() => parseStory(JSON.stringify(broken))).toThrow();
  });

  it("throws when an encounter has a whitespace-only 'content'", () => {
    const broken = {
      ...validStoryObject,
      encounters: [{ title: validEncounter.title, content: "   " }],
    };
    expect(() => parseStory(JSON.stringify(broken))).toThrow();
  });

  it("throws when encounters is not an array", () => {
    const broken = { ...validStoryObject, encounters: "not an array" };
    expect(() => parseStory(JSON.stringify(broken))).toThrow();
  });
});

// ---------------------------------------------------------------------------
// Invalid NPC structure
// ---------------------------------------------------------------------------

describe("parseStory — invalid NPCs", () => {
  it("throws when npcs is an empty array", () => {
    const broken = { ...validStoryObject, npcs: [] };
    expect(() => parseStory(JSON.stringify(broken))).toThrow();
  });

  const npcFields = [
    "name",
    "race",
    "class",
    "role",
    "location",
    "motivation",
    "description",
  ] as const;

  for (const field of npcFields) {
    it(`throws when NPC '${field}' is missing`, () => {
      const brokenNpc = { ...validNpc };
      delete (brokenNpc as Partial<typeof validNpc>)[field];
      const broken = { ...validStoryObject, npcs: [brokenNpc] };
      expect(() => parseStory(JSON.stringify(broken))).toThrow();
    });

    it(`throws when NPC '${field}' is whitespace only`, () => {
      const brokenNpc = { ...validNpc, [field]: "   " };
      const broken = { ...validStoryObject, npcs: [brokenNpc] };
      expect(() => parseStory(JSON.stringify(broken))).toThrow();
    });
  }
});
