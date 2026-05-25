import { describe, expect, it } from "vitest";
import {
  validateCustomSelection,
  validateCustomText,
} from "@/lib/validation";

// ---------------------------------------------------------------------------
// validateCustomText
// ---------------------------------------------------------------------------

describe("validateCustomText", () => {
  it("returns an error for an empty string", () => {
    const result = validateCustomText("", "genre");
    expect(result).toContain("genre");
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns an error for a whitespace-only string", () => {
    const result = validateCustomText("   ", "genre");
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns an error when the string exceeds 40 characters", () => {
    const longValue = "a".repeat(41);
    const result = validateCustomText(longValue, "genre");
    expect(result).toContain("40");
  });

  it("returns no error for a string of exactly 40 characters", () => {
    const exactly40 = "a".repeat(40);
    expect(validateCustomText(exactly40, "genre")).toBe("");
  });

  it("returns an error when the string contains no letters", () => {
    const result = validateCustomText("12345!@#", "genre");
    expect(result).toContain("letter");
  });

  it("returns no error for valid ASCII text", () => {
    expect(validateCustomText("Dark Fantasy", "genre")).toBe("");
  });

  it("returns no error for valid Cyrillic text", () => {
    expect(validateCustomText("Тёмное фэнтези", "genre")).toBe("");
  });

  it("includes the field label in the error message when empty", () => {
    const result = validateCustomText("", "race");
    expect(result.toLowerCase()).toContain("race");
  });

  it("capitalizes the field label in the length error message", () => {
    const longValue = "a".repeat(41);
    const result = validateCustomText(longValue, "setting");
    expect(result).toContain("Setting");
  });
});

// ---------------------------------------------------------------------------
// validateCustomSelection
// ---------------------------------------------------------------------------

describe("validateCustomSelection", () => {
  it("returns an error for an empty selection", () => {
    const result = validateCustomSelection([], "race");
    expect(result.length).toBeGreaterThan(0);
    expect(result.toLowerCase()).toContain("race");
  });

  it("returns no error when one item is selected", () => {
    expect(validateCustomSelection(["Human"], "race")).toBe("");
  });

  it("returns no error when multiple items are selected", () => {
    expect(validateCustomSelection(["Human", "Elf", "Dwarf"], "race")).toBe(
      "",
    );
  });
});
