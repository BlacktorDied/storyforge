# StoryForge Glossary

## Table Of Contents

- [Architecture Principles](#architecture-principles)
- [React And UI Terms](#react-and-ui-terms)
- [Naming Patterns](#naming-patterns)
- [StoryForge Domain Terms](#storyforge-domain-terms)
- [Project Structure Terms](#project-structure-terms)

## Architecture Principles

### DRY

DRY means **Don't Repeat Yourself**. A shared rule, field list, validation rule, parser rule or transform lives in one source of truth and is imported by the files that need it.

### KISS

KISS means **Keep It Simple, Stupid**. StoryForge uses plain TypeScript modules, React components and custom hooks instead of adding architecture layers that do not serve the current thesis-sized application.

### Do One Thing

Do One Thing means each file or function has one primary responsibility. For example, a component renders UI, a hook coordinates workflow state, a parser converts raw input into trusted data and a validator checks whether values follow rules.

### SOLID

SOLID means **Single Responsibility**, **Open/Closed**, **Liskov Substitution**, **Interface Segregation** and **Dependency Inversion**.

- **Single Responsibility:** a module, component, hook or function has one clear reason to change.
- **Open/Closed:** behavior is extended through focused definitions and helpers instead of rewriting unrelated consumers.
- **Liskov Substitution:** shared types stay consistent so a `ParsedStory`, `ParsedEncounter` or `ParsedNpc` can be used safely wherever that type is expected.
- **Interface Segregation:** components and hooks receive focused props and helper functions instead of broad objects with unrelated responsibilities.
- **Dependency Inversion:** UI and workflow code depend on typed shared helpers from `lib/`, while domain rules stay independent from React components.

### Meaningful Names

Meaningful Names means files, types, variables and functions describe their role clearly. Examples include `ParsedStory`, `buildStoryPrompt`, `parseStory`, `validateStoryEdit`, `trimStory` and `useStoryEditing`.

## React And UI Terms

### React Component

A React component is a function that returns UI. Components use `PascalCase` names so JSX treats them as custom components instead of HTML elements.

Official docs: [Your First Component](https://react.dev/learn/your-first-component)

```tsx
function StoryForm() {
  return <form>...</form>;
}
```

### Props

Props are values passed from a parent component to a child component. They let the parent provide data and actions while the child stays focused on rendering.

Official docs: [Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)

```tsx
<StoryResult story={parsedStory} onStoryChange={setParsedStory} />
```

In this example, `story` gives the child data to display and `onStoryChange` gives the child a way to report a story update.

### State

State is component-owned or hook-owned memory. State values change over time and trigger React to render updated UI.

Official docs: [State: A Component's Memory](https://react.dev/learn/state-a-components-memory)

```ts
const [loading, setLoading] = useState(false);
```

### Hook

A hook is a function that connects React code to React features such as state and effects. Custom hooks group reusable workflow logic.

Official docs: [Built-in React Hooks](https://react.dev/reference/react/hooks)

Examples:

- `useState`: stores component state
- `useEffect`: synchronizes with browser or external behavior after render
- `useStoryGenerator`: owns the StoryForge generation workflow
- `useStoryEditing`: owns the StoryForge editing workflow

### Client Component

A client component is a React component that runs in the browser and can use client-side hooks such as `useState`, `useEffect` and custom hooks. In Next.js, it starts with `"use client"`.

Official docs: [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)

### Server Component

A server component renders on the server by default in the Next.js App Router. It does not use browser-only APIs or client-side React state.

Official docs: [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)

## Naming Patterns

### Callback Props

Callback props use `on...` names because they are functions passed from a parent to a child component. The child calls the callback, but the parent owns the behavior.

Official docs: [Responding to Events](https://react.dev/learn/responding-to-events)

Use `onSomething` for action callbacks. An action callback reports that an event happened or that a workflow should start.

```tsx
<StoryForm onGenerate={handleGenerate} />
```

`onGenerate` means the form can request generation. `StoryForm` does not need to know whether generation calls an API, uses mock data, sets loading state or parses a response.

Use `onSomethingChange` as a specific kind of callback prop for controlled value updates. A change callback reports the next value for one specific prop.

Example:

```tsx
<MultiSelectWithMode
  mode={raceMode}
  onModeChange={setRaceMode}
  selectedOptions={selectedRaces}
  onSelectedOptionsChange={setSelectedRaces}
/>
```

`onModeChange` is not just `onSomething` with an extra word. The `Change` suffix tells readers the callback is tied to the `mode` value and receives the next mode. The child does not own the state; it only reports that the value should change.

### `handleSomething`

`handleSomething` names the function that owns an action. It usually lives in the parent component or hook that has enough context to perform the full workflow.

```ts
const handleGenerate = async () => {
  // validate form, call API or mock, parse result, update state
};
```

`handleGenerate` is paired with `onGenerate` when the action is passed down to a child component.

### `setSomething`

`setSomething` names a state update function.

Official docs: [useState](https://react.dev/reference/react/useState)

```ts
const [genre, setGenre] = useState("Fantasy");
```

React's `useState` returns this pattern naturally. Project-specific setters can also follow it, such as `setDraftField`.

Use `setSomething` in the component or hook that owns the state. When passing that function to a child component, expose it as an `onSomethingChange` prop.

### Function Ownership

The owner of a function is the component, hook or module that has the context needed to complete the behavior.

Common ownership rules:

- State setter ownership belongs to the component or hook that calls `useState`.
- Workflow handler ownership belongs to the component or hook that can validate data, call APIs, update loading state and handle errors.
- Domain helper ownership belongs in `lib/` when the logic does not depend on React rendering.
- Child UI components receive callbacks through `onSomething` or `onSomethingChange` props and call them without knowing the parent implementation.

Example:

```tsx
const [mode, setMode] = useState<SelectionMode>("all");

<MultiSelectWithMode mode={mode} onModeChange={setMode} />;
```

The parent owns `setMode` because it owns the state. The child receives that function as `onModeChange` because, from the child perspective, it is only reporting a requested change.

### `validateSomething`

`validateSomething` names a function that checks whether a value follows a rule and returns a validation result.

Examples:

- `validateTextValue`
- `validateSelectionValue`
- `validateStoryEdit`

### `parseSomething`

`parseSomething` names a function that converts raw or unknown input into a trusted application shape.

```ts
const story = parseStory(aiResponse);
```

Parsing is stricter than formatting. A parser rejects input that does not match the expected structure.

### `buildSomething`

`buildSomething` names a function that creates a structured result from inputs without side effects.

Example:

- `buildStoryPrompt`

### `trimSomething`

`trimSomething` names a function that normalizes string whitespace while preserving the same domain shape.

Examples:

- `trimStory`
- `trimEncounter`
- `trimNpc`

## StoryForge Domain Terms

### `ParsedStory`

`ParsedStory` is the trusted TypeScript shape used after an AI response has been parsed and validated. UI components and editing logic use this type instead of raw AI text.

Official docs: [TypeScript Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html)

### Parser

A parser converts raw input into a trusted application shape. In StoryForge, `parseStory` receives raw AI text, parses JSON, checks the story structure, trims strings and returns a `ParsedStory`.

Official docs: [JSON.parse on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)

### Validator

A validator checks whether a value follows a rule. In StoryForge, validation functions return error messages for invalid values or `null` for valid values.

### Transform

A transform returns a normalized copy of data. In StoryForge, transform helpers trim story strings and clone story drafts without changing the public story type.

### Draft

A draft is an editable copy of a story. It lets the user change text in the UI before saving those changes back to the current story.

### Field Error Key

A field error key identifies which UI field owns a validation message. Examples include `title`, `encounters.0.title` and `npcs.1.description`.

### Story Field Definition

A story field definition is a shared field list used by parsing, validation, transforms and editing logic. Keeping these fields centralized avoids disagreement between modules.

## Project Structure Terms

### `app/`

`app/` contains Next.js App Router routes, layouts, pages, metadata and API route files.

Official docs: [Next.js App Router](https://nextjs.org/docs/app)

### `components/`

`components/` contains reusable React UI components.

Official docs: [React Components](https://react.dev/learn/your-first-component)

### `components/ui/`

`components/ui/` contains generic UI primitives and form controls that can be reused across multiple parts of the app.

### `components/story/`

`components/story/` contains UI components that only make sense for generated stories, such as story results, encounter cards, NPC cards and story editing controls.

### `hooks/`

`hooks/` contains reusable client-side state and workflow logic.

Official docs: [Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)

### `lib/`

`lib/` contains shared domain logic, types, constants, validation, parsing, transforms, prompts and export helpers.

### `tests/`

`tests/` contains automated tests for domain logic and UI workflows.

Official docs: [Next.js Testing](https://nextjs.org/docs/app/guides/testing)

### `docs/`

`docs/` contains project documentation such as architecture notes, glossary entries and implementation guides.
