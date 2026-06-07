import { describe, expect, it } from "vitest";
import { applyStoryEdit, getListItemIndex } from "@/lib/storyEditing";
import { cloneStoryDraft, trimStory } from "@/lib/storyTransforms";
import type { ParsedStory } from "@/lib/types";

// ===========================================================================
// Fixtures
// ===========================================================================

const story: ParsedStory = {
  title: "The Cursed Mill",
  setting: "A fog-covered marshland village",
  background:
    "A miller's bargain with a river spirit has brought prosperity and disappearances in equal measure.",
  adventureHook:
    "A merchant's abandoned cart points toward the old mill outside Ashfen.",
  mainQuest:
    "The party must uncover the pact and break the curse before another family vanishes.",
  encounters: [
    {
      title: "The Silent Village",
      content: "The party finds Ashfen quiet, cold and watched.",
      checks: [],
      creatures: [],
      puzzle: null,
    },
    {
      title: "The Old Mill",
      content: "The wheel turns against the river current.",
      checks: [
        {
          type: "ability check",
          ability: "Wisdom",
          skillOrTool: "Perception",
          dc: 13,
          purpose: "Notice river water moving uphill.",
          success: "The party finds the hidden sluice.",
          failure: "The miller has time to prepare.",
        },
      ],
      creatures: [
        {
          name: "Wolf",
          quantity: 2,
          role: "Scout",
          combatTrigger: "The party threatens the pack.",
          goal: "Drive intruders away.",
        },
      ],
      puzzle: {
        type: "clue challenge",
        prompt: "Read the muddy trail.",
        answer: "The miller passed here.",
        hints: ["The mud is fresh."],
        alternateSolutions: ["Ask Mira for help."],
      },
    },
  ],
  npcs: [
    {
      name: "Mira Ashvale",
      race: "Human",
      class: "Rogue",
      role: "Informant",
      location: "The local inn",
      motivation: "Expose the miller's secret deal",
      description: "A sharp-eyed woman with ink-stained fingers.",
    },
    {
      name: "Eldric Vane",
      race: "Elf",
      class: "Wizard",
      role: "Archivist",
      location: "The flooded chapel",
      motivation: "Preserve forbidden river lore",
      description: "A scholar who speaks in careful half-truths.",
    },
  ],
};

describe("getListItemIndex", () => {
  describe("matching sections", () => {
    it("returns the index from an encounter section key", () => {
      expect(getListItemIndex("encounter-2", "encounter")).toBe(2);
    });

    it("returns the index from an NPC section key", () => {
      expect(getListItemIndex("npc-1", "npc")).toBe(1);
    });
  });

  describe("non-matching sections", () => {
    it("returns null when the prefix does not match", () => {
      expect(getListItemIndex("npc-1", "encounter")).toBeNull();
    });

    it("returns null when the section is not a list item key", () => {
      expect(getListItemIndex("title", "npc")).toBeNull();
    });
  });
});

describe("applyStoryEdit", () => {
  describe("valid input", () => {
    it("returns the original story when no section is being edited", () => {
      expect(
        applyStoryEdit({ editingSection: null, story, draft: story }),
      ).toBe(story);
    });

    it("applies and trims a story text edit", () => {
      const draft = { ...story, title: "  The River Pact  " };

      const result = applyStoryEdit({ editingSection: "title", story, draft });

      expect(result.title).toBe("The River Pact");
      expect(result.setting).toBe(story.setting);
    });

    it("applies and trims an encounter edit without changing other encounters", () => {
      const draft: ParsedStory = {
        ...story,
        encounters: [
          {
            title: "  The Empty Square  ",
            content: "  Lanterns gutter.  ",
            checks: [],
            creatures: [],
            puzzle: null,
          },
          story.encounters[1],
        ],
      };

      const result = applyStoryEdit({
        editingSection: "encounter-0",
        story,
        draft,
      });

      expect(result.encounters[0]).toEqual({
        title: "The Empty Square",
        content: "Lanterns gutter.",
        checks: [],
        creatures: [],
        puzzle: null,
      });
      expect(result.encounters[1]).toBe(story.encounters[1]);
    });

    it("applies and trims structured encounter detail edits", () => {
      const draft: ParsedStory = {
        ...story,
        encounters: [
          story.encounters[0],
          {
            ...story.encounters[1],
            checks: [
              {
                type: "ability check",
                ability: "  Intelligence  ",
                skillOrTool: "  Investigation  ",
                dc: 14,
                purpose: "  Study the old mechanism.  ",
                success: "  The party opens the sluice.  ",
                failure: "  The wheel accelerates.  ",
              },
            ],
            creatures: [
              {
                name: "  Giant Rat  ",
                quantity: 3,
                role: "  Swarm threat  ",
                combatTrigger: "  The party enters the grain room.  ",
                goal: "  Protect the nest.  ",
              },
            ],
            puzzle: {
              type: "logic puzzle",
              prompt: "  Align the wheel marks.  ",
              answer: "  Moon, river, mill.  ",
              hints: ["  The moon mark is worn.  "],
              alternateSolutions: ["  Force the wheel with tools.  "],
            },
          },
        ],
      };

      const result = applyStoryEdit({
        editingSection: "encounter-1",
        story,
        draft,
      });

      expect(result.encounters[1].checks[0]).toEqual({
        type: "ability check",
        ability: "Intelligence",
        skillOrTool: "Investigation",
        dc: 14,
        purpose: "Study the old mechanism.",
        success: "The party opens the sluice.",
        failure: "The wheel accelerates.",
      });
      expect(result.encounters[1].creatures[0]).toEqual({
        name: "Giant Rat",
        quantity: 3,
        role: "Swarm threat",
        combatTrigger: "The party enters the grain room.",
        goal: "Protect the nest.",
      });
      expect(result.encounters[1].puzzle).toEqual({
        type: "logic puzzle",
        prompt: "Align the wheel marks.",
        answer: "Moon, river, mill.",
        hints: ["The moon mark is worn."],
        alternateSolutions: ["Force the wheel with tools."],
      });
      expect(result.encounters[0]).toBe(story.encounters[0]);
    });

    it("applies and trims an NPC edit without changing other NPCs", () => {
      const draft: ParsedStory = {
        ...story,
        npcs: [
          story.npcs[0],
          {
            ...story.npcs[1],
            name: "  Eldric Vane  ",
            motivation: "  Hide the chapel ledger.  ",
          },
        ],
      };

      const result = applyStoryEdit({ editingSection: "npc-1", story, draft });

      expect(result.npcs[1].name).toBe("Eldric Vane");
      expect(result.npcs[1].motivation).toBe("Hide the chapel ledger.");
      expect(result.npcs[0]).toBe(story.npcs[0]);
    });
  });

  describe("edge cases", () => {
    it("returns the original story for out-of-range list edits", () => {
      const result = applyStoryEdit({
        editingSection: "encounter-99",
        story,
        draft: story,
      });

      expect(result).toBe(story);
    });

    it("returns the original story for out-of-range NPC edits", () => {
      const result = applyStoryEdit({
        editingSection: "npc-99",
        story,
        draft: story,
      });

      expect(result).toBe(story);
    });

    it("returns the original story for unknown edit sections", () => {
      const result = applyStoryEdit({
        editingSection: "unknown-section",
        story,
        draft: story,
      });

      expect(result).toBe(story);
    });
  });
});

describe("trimStory", () => {
  describe("valid input", () => {
    it("trims story text, encounters and NPCs", () => {
      const result = trimStory({
        ...story,
        title: "  The Cursed Mill  ",
        encounters: [
          {
            title: "  Title  ",
            content: "  Content  ",
            checks: [
              {
                type: "ability check",
                ability: "  Wisdom  ",
                skillOrTool: "  Perception  ",
                dc: 13,
                purpose: "  Find tracks.  ",
                success: "  The party finds them.  ",
                failure: "  The party loses time.  ",
              },
            ],
            creatures: [
              {
                name: "  Wolf  ",
                quantity: 2,
                role: "  Scout  ",
                combatTrigger: "  The party threatens it.  ",
                goal: "  Drive the party away.  ",
              },
            ],
            puzzle: {
              type: "clue challenge",
              prompt: "  Read the muddy trail.  ",
              answer: "  The miller passed here.  ",
              hints: ["  The mud is fresh.  "],
              alternateSolutions: ["  Ask Mira for help.  "],
            },
          },
        ],
        npcs: [
          {
            name: "  Name  ",
            race: "  Race  ",
            class: "  Class  ",
            role: "  Role  ",
            location: "  Location  ",
            motivation: "  Motivation  ",
            description: "  Description  ",
          },
        ],
      });

      expect(result.title).toBe("The Cursed Mill");
      expect(result.encounters[0]).toEqual({
        title: "Title",
        content: "Content",
        checks: [
          {
            type: "ability check",
            ability: "Wisdom",
            skillOrTool: "Perception",
            dc: 13,
            purpose: "Find tracks.",
            success: "The party finds them.",
            failure: "The party loses time.",
          },
        ],
        creatures: [
          {
            name: "Wolf",
            quantity: 2,
            role: "Scout",
            combatTrigger: "The party threatens it.",
            goal: "Drive the party away.",
          },
        ],
        puzzle: {
          type: "clue challenge",
          prompt: "Read the muddy trail.",
          answer: "The miller passed here.",
          hints: ["The mud is fresh."],
          alternateSolutions: ["Ask Mira for help."],
        },
      });
      expect(result.npcs[0]).toEqual({
        name: "Name",
        race: "Race",
        class: "Class",
        role: "Role",
        location: "Location",
        motivation: "Motivation",
        description: "Description",
      });
    });
  });
});

describe("cloneStoryDraft", () => {
  describe("valid input", () => {
    it("creates separate nested encounter and NPC objects", () => {
      const draft = cloneStoryDraft(story);

      expect(draft).not.toBe(story);
      expect(draft.encounters).not.toBe(story.encounters);
      expect(draft.encounters[0]).not.toBe(story.encounters[0]);
      expect(draft.encounters[1].checks).not.toBe(story.encounters[1].checks);
      expect(draft.encounters[1].checks[0]).not.toBe(
        story.encounters[1].checks[0],
      );
      expect(draft.encounters[1].creatures).not.toBe(
        story.encounters[1].creatures,
      );
      expect(draft.encounters[1].creatures[0]).not.toBe(
        story.encounters[1].creatures[0],
      );
      expect(draft.encounters[1].puzzle).not.toBe(story.encounters[1].puzzle);
      expect(draft.encounters[1].puzzle?.hints).not.toBe(
        story.encounters[1].puzzle?.hints,
      );
      expect(draft.npcs).not.toBe(story.npcs);
      expect(draft.npcs[0]).not.toBe(story.npcs[0]);
    });
  });
});
