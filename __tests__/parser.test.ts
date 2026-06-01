import { describe, expect, it } from "vitest";
import { parseStory } from "@/lib/parser";
import type { ParsedStory } from "@/lib/types";

// ===========================================================================
// Fixtures
// ===========================================================================

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
    "The party arrives to find the village eerily quiet - doors hang open, fires are cold, and no one answers calls.",
};

const validStoryObject: ParsedStory = {
  title: "The Cursed Mill",
  setting: "A fog-covered marshland village",
  background:
    "Three years ago, a local miller made a pact with a river spirit to ensure a bountiful harvest. The spirit kept its end of the bargain - but the cost grows each season. Now villagers vanish without a trace, and the miller refuses to speak of it.",
  adventureHook:
    "A merchant's cart is found abandoned on the road outside Ashfen - the horse still harnessed, the cargo untouched, and a single muddy trail leading toward the old mill.",
  mainQuest:
    "The party must uncover the nature of the pact, confront the river spirit at the mill, and break the curse before the next full moon or another family disappears.",
  encounters: [validEncounter],
  npcs: [validNpc],
};

const validJson = JSON.stringify(validStoryObject);

describe("parseStory", () => {
  describe("valid input", () => {
    it("accepts a complete structured story JSON string", () => {
      const result = parseStory(validJson);

      expect(result.title).toBe(validStoryObject.title);
      expect(result.encounters).toHaveLength(1);
      expect(result.npcs).toHaveLength(1);
    });

    it("trims accepted story fields", () => {
      const paddedStory: ParsedStory = {
        ...validStoryObject,
        title: "  The Cursed Mill  ",
        encounters: [
          {
            title: "  The Silent Village  ",
            content: "  The party arrives to find the village quiet.  ",
          },
        ],
        npcs: [
          {
            ...validNpc,
            name: "  Mira Ashvale  ",
            description: "  A sharp-eyed woman.  ",
          },
        ],
      };

      const result = parseStory(JSON.stringify(paddedStory));

      expect(result.title).toBe("The Cursed Mill");
      expect(result.encounters[0].title).toBe("The Silent Village");
      expect(result.encounters[0].content).toBe(
        "The party arrives to find the village quiet.",
      );
      expect(result.npcs[0].name).toBe("Mira Ashvale");
      expect(result.npcs[0].description).toBe("A sharp-eyed woman.");
    });
  });

  describe("format handling", () => {
    it("accepts JSON wrapped in language-tagged code fences", () => {
      const fenced = "```json\n" + validJson + "\n```";

      const result = parseStory(fenced);

      expect(result.title).toBe(validStoryObject.title);
    });

    it("accepts JSON wrapped in plain code fences", () => {
      const fenced = "```\n" + validJson + "\n```";

      const result = parseStory(fenced);

      expect(result.title).toBe(validStoryObject.title);
    });
  });

  describe("invalid JSON", () => {
    it("rejects completely invalid input", () => {
      expect(() => parseStory("not json at all")).toThrow();
    });

    it("rejects an empty string", () => {
      expect(() => parseStory("")).toThrow();
    });

    it("rejects a JSON array instead of a story object", () => {
      expect(() => parseStory("[1, 2, 3]")).toThrow();
    });

    it("rejects null JSON instead of a story object", () => {
      expect(() => parseStory("null")).toThrow();
    });
  });

  describe("invalid story fields", () => {
    const fields = [
      "title",
      "setting",
      "background",
      "adventureHook",
      "mainQuest",
    ] as const;

    for (const field of fields) {
      it(`rejects a missing '${field}' field`, () => {
        const broken = { ...validStoryObject };
        delete (broken as Partial<ParsedStory>)[field];

        expect(() => parseStory(JSON.stringify(broken))).toThrow();
      });

      it(`rejects an empty '${field}' field`, () => {
        const broken = { ...validStoryObject, [field]: "" };

        expect(() => parseStory(JSON.stringify(broken))).toThrow();
      });

      it(`rejects a whitespace-only '${field}' field`, () => {
        const broken = { ...validStoryObject, [field]: "   " };

        expect(() => parseStory(JSON.stringify(broken))).toThrow();
      });
    }
  });

  describe("invalid encounters", () => {
    it("rejects an empty encounter list", () => {
      const broken = { ...validStoryObject, encounters: [] };

      expect(() => parseStory(JSON.stringify(broken))).toThrow();
    });

    it("rejects an encounter without a title", () => {
      const broken = {
        ...validStoryObject,
        encounters: [{ content: validEncounter.content }],
      };

      expect(() => parseStory(JSON.stringify(broken))).toThrow();
    });

    it("rejects an encounter with whitespace-only content", () => {
      const broken = {
        ...validStoryObject,
        encounters: [{ title: validEncounter.title, content: "   " }],
      };

      expect(() => parseStory(JSON.stringify(broken))).toThrow();
    });

    it("rejects encounters that are not an array", () => {
      const broken = { ...validStoryObject, encounters: "not an array" };

      expect(() => parseStory(JSON.stringify(broken))).toThrow();
    });

    it("rejects null encounter items", () => {
      const broken = { ...validStoryObject, encounters: [null] };

      expect(() => parseStory(JSON.stringify(broken))).toThrow();
    });

    it("rejects primitive encounter items", () => {
      const broken = { ...validStoryObject, encounters: ["invalid"] };

      expect(() => parseStory(JSON.stringify(broken))).toThrow();
    });
  });

  describe("invalid NPCs", () => {
    it("rejects an empty NPC list", () => {
      const broken = { ...validStoryObject, npcs: [] };

      expect(() => parseStory(JSON.stringify(broken))).toThrow();
    });

    it("rejects null NPC items", () => {
      const broken = { ...validStoryObject, npcs: [null] };

      expect(() => parseStory(JSON.stringify(broken))).toThrow();
    });

    it("rejects primitive NPC items", () => {
      const broken = { ...validStoryObject, npcs: ["invalid"] };

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
      it(`rejects an NPC with a missing '${field}' field`, () => {
        const brokenNpc = { ...validNpc };
        delete (brokenNpc as Partial<typeof validNpc>)[field];
        const broken = { ...validStoryObject, npcs: [brokenNpc] };

        expect(() => parseStory(JSON.stringify(broken))).toThrow();
      });

      it(`rejects an NPC with a whitespace-only '${field}' field`, () => {
        const brokenNpc = { ...validNpc, [field]: "   " };
        const broken = { ...validStoryObject, npcs: [brokenNpc] };

        expect(() => parseStory(JSON.stringify(broken))).toThrow();
      });
    }
  });
});
