import { describe, expect, it } from "vitest";
import {
  getFirstGenerationErrorField,
  getGenerationFormErrors,
  type GenerationFormValues,
} from "@/lib/generationValidation";
import {
  getEncounterErrorKey,
  getNpcErrorKey,
  validateEncounterField,
  validateNpcField,
  validateStoryEdit,
  validateStoryTextField,
} from "@/lib/storyValidation";
import type { ParsedStory } from "@/lib/types";
import { validateSelectionValue, validateTextValue } from "@/lib/validation";

// ===========================================================================
// Fixtures
// ===========================================================================

const baseGenerationValues: GenerationFormValues = {
  genre: "Fantasy",
  customGenre: "",
  setting: "Forest",
  customSetting: "",
  raceMode: "all",
  selectedRaces: [],
  classMode: "all",
  selectedClasses: [],
};

const validStory: ParsedStory = {
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
      content: "The party finds Ashfen quiet, cold, and watched.",
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
  ],
};

const storyTextCases = [
  ["title", 120, "Title"],
  ["setting", 1500, "Setting"],
  ["background", 2500, "Background"],
  ["adventureHook", 1500, "Adventure hook"],
  ["mainQuest", 2500, "Main quest"],
] as const;

const encounterFieldCases = [
  ["title", 120, "Encounter title"],
  ["content", 1500, "Encounter description"],
] as const;

const npcFieldCases = [
  ["name", 80, "NPC name"],
  ["race", 60, "NPC race"],
  ["class", 60, "NPC class"],
  ["role", 100, "NPC role"],
  ["location", 120, "NPC location"],
  ["motivation", 300, "NPC motivation"],
  ["description", 1000, "NPC description"],
] as const;

describe("validateTextValue", () => {
  describe("valid input", () => {
    it("accepts text at the maximum length", () => {
      expect(validateTextValue("a".repeat(40), "genre", 40)).toBeNull();
    });

    it("accepts ASCII text containing letters", () => {
      expect(validateTextValue("Dark Fantasy", "genre", 40)).toBeNull();
    });

    it("accepts non-ASCII text containing letters", () => {
      expect(validateTextValue("Тёмное фэнтези", "genre", 40)).toBeNull();
    });
  });

  describe("invalid input", () => {
    it("rejects an empty string", () => {
      const result = validateTextValue("", "genre", 40);

      expect(result).toBe("genre is required.");
    });

    it("rejects whitespace-only text", () => {
      expect(validateTextValue("   ", "genre", 40)).toBe("genre is required.");
    });

    it("rejects text without letters", () => {
      const result = validateTextValue("12345!@#", "genre", 40);

      expect(result).toBe("genre must contain at least one letter.");
    });

    it("rejects text that exceeds the maximum length", () => {
      const result = validateTextValue("a".repeat(41), "genre", 40);

      expect(result).toBe("genre must be 40 characters or less.");
    });
  });

  describe("custom messages", () => {
    it("uses the provided required message for empty text", () => {
      expect(
        validateTextValue("", "genre", 40, "Please enter a custom genre."),
      ).toBe("Please enter a custom genre.");
    });
  });
});

describe("validateSelectionValue", () => {
  describe("valid input", () => {
    it("accepts one selected item", () => {
      expect(validateSelectionValue(["Human"], "race")).toBeNull();
    });

    it("accepts multiple selected items", () => {
      expect(
        validateSelectionValue(["Human", "Elf", "Dwarf"], "race"),
      ).toBeNull();
    });
  });

  describe("invalid input", () => {
    it("rejects an empty selection", () => {
      const result = validateSelectionValue([], "race");

      expect(result).toBe("Please select at least one race.");
    });
  });
});

describe("getGenerationFormErrors", () => {
  describe("valid input", () => {
    it("accepts preset genre, setting, races, and classes", () => {
      expect(getGenerationFormErrors(baseGenerationValues)).toEqual({
        genreError: null,
        settingError: null,
        raceError: null,
        classError: null,
      });
    });

    it("accepts valid custom genre and setting text", () => {
      expect(
        getGenerationFormErrors({
          ...baseGenerationValues,
          genre: "Other",
          customGenre: "Science Fantasy",
          setting: "Other",
          customSetting: "Floating City",
        }),
      ).toEqual({
        genreError: null,
        settingError: null,
        raceError: null,
        classError: null,
      });
    });

    it("accepts custom race and class selections", () => {
      expect(
        getGenerationFormErrors({
          ...baseGenerationValues,
          raceMode: "custom",
          selectedRaces: ["Human"],
          classMode: "custom",
          selectedClasses: ["Wizard"],
        }),
      ).toEqual({
        genreError: null,
        settingError: null,
        raceError: null,
        classError: null,
      });
    });
  });

  describe("invalid input", () => {
    it("requires custom genre text when genre is Other", () => {
      const result = getGenerationFormErrors({
        ...baseGenerationValues,
        genre: "Other",
        customGenre: "   ",
      });

      expect(result.genreError).toBe("Please enter a custom genre.");
    });

    it("requires custom setting text when setting is Other", () => {
      const result = getGenerationFormErrors({
        ...baseGenerationValues,
        setting: "Other",
        customSetting: "   ",
      });

      expect(result.settingError).toBe("Please enter a custom setting.");
    });

    it("requires races when race mode is custom", () => {
      const result = getGenerationFormErrors({
        ...baseGenerationValues,
        raceMode: "custom",
        selectedRaces: [],
      });

      expect(result.raceError).toBe("Please select at least one race.");
    });

    it("requires classes when class mode is custom", () => {
      const result = getGenerationFormErrors({
        ...baseGenerationValues,
        classMode: "custom",
        selectedClasses: [],
      });

      expect(result.classError).toContain("Please select at least one class.");
    });
  });
});

describe("getFirstGenerationErrorField", () => {
  describe("valid input", () => {
    it("returns null when there are no errors", () => {
      expect(
        getFirstGenerationErrorField({
          genreError: null,
          settingError: null,
          raceError: null,
          classError: null,
        }),
      ).toBeNull();
    });
  });

  describe("error priority", () => {
    it("returns the genre field before later errors", () => {
      expect(
        getFirstGenerationErrorField({
          genreError: "Genre error",
          settingError: "Setting error",
          raceError: "Race error",
          classError: "Class error",
        }),
      ).toBe("genre-field");
    });

    it("returns the first invalid field in display order", () => {
      expect(
        getFirstGenerationErrorField({
          genreError: null,
          settingError: "Setting error",
          raceError: "Race error",
          classError: "Class error",
        }),
      ).toBe("setting-field");
    });

    it("returns the race field before the class field", () => {
      expect(
        getFirstGenerationErrorField({
          genreError: null,
          settingError: null,
          raceError: "Race error",
          classError: "Class error",
        }),
      ).toBe("races-field");
    });

    it("returns the class field when it is the only invalid field", () => {
      expect(
        getFirstGenerationErrorField({
          genreError: null,
          settingError: null,
          raceError: null,
          classError: "Class error",
        }),
      ).toBe("classes-field");
    });
  });
});

describe("validateStoryTextField", () => {
  describe("valid input", () => {
    it.each([
      "title",
      "setting",
      "background",
      "adventureHook",
      "mainQuest",
    ] as const)("accepts a valid %s value", (field) => {
      expect(validateStoryTextField(field, "Valid text")).toBeNull();
    });
  });

  describe("invalid input", () => {
    it.each(storyTextCases)(
      "rejects an empty %s value",
      (field, _maxLength, label) => {
        expect(validateStoryTextField(field, "")).toBe(`${label} is required.`);
      },
    );

    it.each(storyTextCases)(
      "rejects %s values above their maximum length",
      (field, maxLength, label) => {
        expect(validateStoryTextField(field, "a".repeat(maxLength + 1))).toBe(
          `${label} must be ${maxLength} characters or less.`,
        );
      },
    );
  });
});

describe("validateEncounterField", () => {
  describe("valid input", () => {
    it.each(encounterFieldCases)("accepts a valid %s value", (field) => {
      expect(validateEncounterField(field, `Valid ${field}`)).toBeNull();
    });
  });

  describe("invalid input", () => {
    it.each(encounterFieldCases)(
      "rejects an empty %s value",
      (field, _maxLength, label) => {
        expect(validateEncounterField(field, "")).toBe(`${label} is required.`);
      },
    );

    it.each(encounterFieldCases)(
      "rejects %s values above their maximum length",
      (field, maxLength, label) => {
        expect(validateEncounterField(field, "a".repeat(maxLength + 1))).toBe(
          `${label} must be ${maxLength} characters or less.`,
        );
      },
    );
  });
});

describe("validateNpcField", () => {
  describe("valid input", () => {
    it.each(npcFieldCases)("accepts a valid %s value", (field) => {
      expect(validateNpcField(field, `Valid ${field}`)).toBeNull();
    });
  });

  describe("invalid input", () => {
    it.each(npcFieldCases)(
      "rejects an empty %s value",
      (field, _maxLength, label) => {
        expect(validateNpcField(field, "")).toBe(`${label} is required.`);
      },
    );

    it.each(npcFieldCases)(
      "rejects %s values above their maximum length",
      (field, maxLength, label) => {
        expect(validateNpcField(field, "a".repeat(maxLength + 1))).toBe(
          `${label} must be ${maxLength} characters or less.`,
        );
      },
    );
  });
});

describe("validateStoryEdit", () => {
  describe("valid input", () => {
    it("returns no errors when no section is being edited", () => {
      expect(
        validateStoryEdit({ editingSection: null, draft: validStory }),
      ).toEqual({});
    });

    it("returns no errors for a valid story section edit", () => {
      expect(
        validateStoryEdit({ editingSection: "title", draft: validStory }),
      ).toEqual({});
    });

    it("returns no errors for a valid encounter edit", () => {
      expect(
        validateStoryEdit({ editingSection: "encounter-0", draft: validStory }),
      ).toEqual({});
    });

    it("returns no errors for a valid NPC edit", () => {
      expect(
        validateStoryEdit({ editingSection: "npc-0", draft: validStory }),
      ).toEqual({});
    });
  });

  describe("invalid story sections", () => {
    it("rejects an invalid edited story section", () => {
      const draft = { ...validStory, title: "   " };

      expect(validateStoryEdit({ editingSection: "title", draft })).toEqual({
        title: "Title is required.",
      });
    });
  });

  describe("invalid encounter sections", () => {
    it("rejects invalid edited encounter fields", () => {
      const draft: ParsedStory = {
        ...validStory,
        encounters: [{ title: "   ", content: "1234" }],
      };

      expect(
        validateStoryEdit({ editingSection: "encounter-0", draft }),
      ).toEqual({
        [getEncounterErrorKey(0, "title")]: "Encounter title is required.",
        [getEncounterErrorKey(0, "content")]:
          "Encounter description must contain at least one letter.",
      });
    });

    it("ignores encounter sections outside the draft range", () => {
      expect(
        validateStoryEdit({
          editingSection: "encounter-99",
          draft: validStory,
        }),
      ).toEqual({});
    });
  });

  describe("invalid NPC sections", () => {
    it("rejects invalid edited NPC fields", () => {
      const draft: ParsedStory = {
        ...validStory,
        npcs: [
          {
            ...validStory.npcs[0],
            name: "   ",
            motivation: "1234",
          },
        ],
      };

      expect(validateStoryEdit({ editingSection: "npc-0", draft })).toEqual({
        [getNpcErrorKey(0, "name")]: "NPC name is required.",
        [getNpcErrorKey(0, "motivation")]:
          "NPC motivation must contain at least one letter.",
      });
    });

    it("ignores NPC sections outside the draft range", () => {
      expect(
        validateStoryEdit({ editingSection: "npc-99", draft: validStory }),
      ).toEqual({});
    });
  });

  describe("unknown sections", () => {
    it("ignores edit section keys that do not match story fields", () => {
      expect(
        validateStoryEdit({
          editingSection: "unknown-section",
          draft: validStory,
        }),
      ).toEqual({});
    });
  });
});
