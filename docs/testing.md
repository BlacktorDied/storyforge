# Testing Guidelines

## Table Of Contents

- [Purpose](#purpose)
- [Test Location](#test-location)
- [File Structure](#file-structure)
- [Grouping Rules](#grouping-rules)
- [Naming Rules](#naming-rules)
- [Fixtures](#fixtures)
- [Coverage Priorities](#coverage-priorities)
- [Commands](#commands)

## Purpose

StoryForge tests focus on reliability for parser behavior, validation rules, prompt consistency and story editing helpers. Tests should stay lightweight, readable and close to the domain logic they protect.

## Test Location

Automated tests live in:

```txt
__tests__/
```

Use Vitest for unit tests. Keep tests focused on TypeScript modules in `lib/` unless a component or hook behavior needs direct coverage.

## File Structure

Use one optional fixtures section at the top of a test file when shared fixtures improve readability:

```ts
// ===========================================================================
// Fixtures
// ===========================================================================

const validStory = {
  // ...
};
```

After fixtures organize tests by exported function:

```ts
describe("functionName", () => {
  describe("valid input", () => {
    it("accepts a complete structured value", () => {
      // ...
    });
  });

  describe("invalid input", () => {
    it("rejects missing required fields", () => {
      // ...
    });
  });

  describe("edge cases", () => {
    it("returns the original value when no edit target exists", () => {
      // ...
    });
  });
});
```

## Grouping Rules

- Use behavioral nested `describe()` blocks.
- Each exported function should generally have its own top-level `describe()` block.
- Group by behavior, such as `valid input`, `invalid input`, `format handling`, `edge cases`, `custom messages` or `error ordering`.
- Do not use comment sections for behavior groups, such as `Happy Path`, `Invalid Path`, `Edge Cases` or `Error Cases`.
- Remove comments when the surrounding `describe()` already explains the behavior.
- Prefer consistent grouping across test files over local stylistic differences.

## Naming Rules

- Test names should describe behavior, not implementation details.
- Prefer names like `rejects an empty NPC list` over names like `throws on npcs.length === 0`.
- Keep names specific enough that a failing test explains the broken behavior.
- Avoid duplicating the function name in every `it()` block when the parent `describe()` already names it.

## Fixtures

- Keep fixtures small but realistic for the StoryForge domain.
- Reuse shared fixtures only when they make the test easier to read.
- Use local overrides inside individual tests to make the tested behavior obvious.
- Preserve strict TypeScript types for structured story fixtures with `ParsedStory`, `ParsedEncounter` or `ParsedNpc` when useful.

## Coverage Priorities

Prioritize tests for:

- AI response parsing and trimming behavior.
- Required story, encounter and NPC fields.
- Malformed or structurally invalid JSON responses.
- Shared validation helpers.
- Generation form validation.
- Story editing validation and edit application.
- Prompt builder consistency for schema keys, selected parameters and encounter counts.

Avoid broad infrastructure or UI-heavy tests unless they protect a thesis-relevant workflow.

## Commands

Run the full test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run coverage:

```bash
npm run test:coverage
```

Before finishing test changes, run:

```bash
npm test
npm run format:check
npm run lint
npm run typecheck
```
