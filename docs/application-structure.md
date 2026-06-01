# StoryForge Application Structure

## Table Of Contents

- [Overview](#overview)
- [Big 5 Principles](#big-5-principles)
- [Project Structure](#project-structure)
- [Responsibility Layers](#responsibility-layers)
- [Story Core Structure](#story-core-structure)
- [Naming Rules](#naming-rules)
- [Testing Structure](#testing-structure)
- [Placement Guide](#placement-guide)
- [Glossary](#glossary)
- [Related Docs](#related-docs)

## Overview

StoryForge follows a small responsibility-based Next.js structure. UI rendering, client workflow state, shared domain logic, automated tests, documentation, and external API handling live in separate folders with clear ownership.

The structure supports the bachelor thesis scope: reliable structured story generation, maintainable parsing and validation, automated verification, and a clean editing UI without enterprise-scale architecture.

## Big 5 Principles

### DRY

DRY means **Don't Repeat Yourself**.

Shared story rules live in one source of truth. Field lists, domain types, validation helpers, parsing rules and story transforms are defined in `lib/` and imported where needed.

### KISS

KISS means **Keep It Simple, Stupid**.

The application uses plain TypeScript modules, React components, and custom hooks. Folders and abstractions exist when they make the code easier to read and maintain.

### Do One Thing

Each file has one primary responsibility:

- components render UI
- hooks manage client workflows
- parsers convert raw AI output into trusted story data
- validators check data rules
- transforms normalize story data
- API routes connect the app to server-side services

### SOLID Principles

SOLID means **Single Responsibility**, **Open/Closed**, **Liskov Substitution**, **Interface Segregation**, and **Dependency Inversion**.

StoryForge applies SOLID in a lightweight TypeScript module style:

- **Single Responsibility:** each component, hook, and `lib/` module has one primary role
- **Open/Closed:** shared story rules are centralized so story behavior can be extended through field, rule, and helper definitions
- **Liskov Substitution:** shared types keep `ParsedStory`, `ParsedEncounter`, and `ParsedNpc` objects consistent wherever they are used
- **Interface Segregation:** components and hooks receive focused props and helper functions instead of large all-purpose interfaces
- **Dependency Inversion:** UI and hooks depend on typed helpers from `lib/`, while domain rules stay independent from React components

### Meaningful Names

Files, functions, and types use names that describe their role in the story generation flow. Examples include `ParsedStory`, `buildStoryPrompt`, `parseStory`, `validateStoryEdit`, `trimStory`, and `useStoryEditing`.

## Project Structure

```txt
app/                 Next.js routes, layouts, pages, metadata, API routes
components/          Reusable React UI components
components/ui/       Generic UI primitives and form controls
components/story/    Generated-story display and editing UI
hooks/               Client-side state and workflow hooks
lib/                 Shared domain logic, types, prompts, validation, parsing
tests/               Automated tests for domain logic and UI workflows
public/              Browser-served static assets
assets/              Source branding and design assets
docs/                Project documentation
.github/             GitHub issue and pull request templates
```

## Responsibility Layers

### Rendering Layer

`app/` contains Next.js route files and page-level composition.

Key files:

- `app/layout.tsx`: root layout and app metadata
- `app/page.tsx`: main StoryForge page composition
- `app/api/generate/route.ts`: story generation API route

`components/` contains React UI components. Components receive data and actions through props, render HTML, and keep only local display logic.

`components/ui/` contains generic UI primitives and form controls, such as buttons, inputs, selects, field errors, and tooltips.

`components/story/` contains story-specific UI such as story results, editable text sections, encounter cards, NPC cards, and edit/delete controls.

### State And Workflow Layer

`hooks/` contains client-side workflow logic.

Key files:

- `hooks/useStoryGenerator.ts`: generation form state, loading state, copy action, PDF export action, and story result state
- `hooks/useStoryEditing.ts`: story edit draft state, field updates, validation flow, save/cancel behavior, and deletion actions

Hooks coordinate UI actions and browser APIs while keeping shared story rules in `lib/`.

### Shared Domain Layer

`lib/` contains framework-light domain logic and shared application rules.

Key files:

- `lib/types.ts`: shared TypeScript story and form types
- `lib/data.ts`: genre, setting, race, class, level, and session-length data
- `lib/storyFields.ts`: story, encounter, and NPC field definitions
- `lib/storyTransforms.ts`: story cloning and string trimming helpers
- `lib/storyValidation.ts`: story editing validation rules
- `lib/validation.ts`: reusable validation primitives
- `lib/parser.ts`: AI response JSON parsing and story structure checks
- `lib/prompts.ts`: prompt construction for story generation
- `lib/pdfExport.ts`: browser PDF export logic

## Story Core Structure

The story core is the shared logic around `ParsedStory`.

`lib/types.ts` defines the story shape:

- `ParsedStory`
- `ParsedEncounter`
- `ParsedNpc`

`lib/storyFields.ts` defines the editable field names used by parsing, validation, editing, and transforms.

`lib/storyTransforms.ts` normalizes story data:

- `trimStory`
- `trimEncounter`
- `trimNpc`
- `cloneStoryDraft`

`lib/parser.ts` parses raw AI text, verifies required story structure, and returns a trimmed `ParsedStory`.

`lib/storyValidation.ts` validates story edits and returns keyed field errors for the editing UI.

`lib/storyEditing.ts` applies validated draft edits back onto the current story.

## Naming Rules

### Components

React components use `PascalCase.tsx`.

Examples:

- `StoryForm.tsx`
- `StoryResult.tsx`
- `EncounterCard.tsx`

### Hooks

Custom hooks use the `useThing.ts` naming pattern.

Examples:

- `useStoryGenerator.ts`
- `useStoryEditing.ts`

### Shared Helpers

Shared helper files use `camelCase.ts`.

Examples:

- `validation.ts`
- `parser.ts`
- `storyTransforms.ts`

Function names start with a verb when they perform an action:

- `validateTextValue`
- `parseStory`
- `buildStoryPrompt`
- `exportStoryToPdf`

### Types

TypeScript types use `PascalCase`.

Examples:

- `ParsedStory`
- `ParsedNpc`
- `ParsedEncounter`
- `SelectionMode`

### Constants

Fixed option lists and application constants use `UPPER_SNAKE_CASE`.

Examples:

- `GENRES`
- `SETTINGS`
- `SESSION_LENGTHS`
- `ENCOUNTER_COUNT_BY_SESSION_LENGTH`

### Event And Handler Names

Callback props use `on...` names. Use `onSomething` for action callbacks and `onSomethingChange` for controlled value updates.

Example:

```tsx
<StoryForm onGenerate={handleGenerate} />
```

Owning handlers use `handleSomething`.

Example:

```ts
const handleGenerate = async () => {
  // generation workflow
};
```

State setters use `setSomething`.

Examples:

- `setGenre`
- `setLoading`
- `setDraftField`

Example:

```tsx
<MultiSelectWithMode mode={raceMode} onModeChange={setRaceMode} />
```

The parent owns `setRaceMode`; the child receives it as `onModeChange` because it reports the next `mode` value.

## Testing Structure

Automated tests belong in a central `tests/` folder.

```txt
tests/
  parser.test.ts
  validation.test.ts
  prompts.test.ts
  story-generator.test.tsx
```

Pure logic tests cover the highest-value behavior:

- valid story JSON parses into `ParsedStory`
- invalid story JSON is rejected
- validation helpers return expected error messages
- prompt generation includes selected form options
- story transforms trim and clone story data correctly

## Placement Guide

Use this placement model:

1. UI rendering belongs in `app/` or `components/`.
2. Client workflow state belongs in `hooks/`.
3. Shared types, constants, validation, parsing, transforms, prompts, and export logic belong in `lib/`.
4. Generic UI primitives and form controls belong in `components/ui/`.
5. Generated-story UI belongs in `components/story/`.
6. Automated tests belong in `tests/`.
7. Static browser assets belong in `public/`.
8. Source design assets belong in `assets/`.
9. Documentation belongs in `docs/`.

## Glossary

Detailed explanations of naming patterns, React terms, StoryForge domain terms, and architecture principles live in [glossary.md](./glossary.md).

## Related Docs

- [Documentation Index](./README.md)
- [Versioning](./versioning.md)
