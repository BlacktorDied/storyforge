# StoryForge Web Application Structure Guide

This guide describes the recommended structure for StoryForge as a modern
Next.js and React application. It is not meant to turn the project into an
enterprise codebase. The goal is a clear, industry-aligned structure that stays
friendly for a junior frontend developer.

StoryForge should be organized around responsibilities:

- Files that render pages and UI.
- Files that hold state and workflow actions.
- Files that define shared variables, types, and rules.
- Files that talk to external systems, such as the AI API.
- Files that test the behavior above.

## Recommended Project Structure

```txt
app/                 Next.js routes, layouts, pages, API routes
components/          Reusable React UI components
components/story/    Story-specific UI components
hooks/               Reusable client-side React state/workflow logic
lib/                 Shared application logic and single source of truth
tests/               Automated tests
public/              Public browser assets
assets/              Source design/branding assets
docs/                Project documentation
```

This structure is already close to the current project. The main missing
folders are `docs/` and `tests/`.

Use `docs/` for architecture notes, implementation decisions, and project
guides like this one.

Use `tests/` for automated tests when test coverage is added. For this project,
a central `tests/` folder is easier to discover than placing many small test
files beside source files.

## Responsibility Layers

### Rendering Layer

Use `app/` and `components/` for rendering.

`app/` belongs to Next.js. It defines routes, layouts, pages, metadata, and API
route files. Examples:

- `app/layout.tsx` renders the root page shell.
- `app/page.tsx` renders the main StoryForge page.
- `app/api/generate/route.ts` handles the story generation API route.

`components/` contains React UI pieces. Components should receive data through
props and render HTML. They may have small UI-only logic, but they should not
own shared business rules.

Use `components/story/` for UI that only makes sense for generated stories, such
as story results, encounters, NPC cards, and story editing sections.

### State And Workflow Layer

Use `hooks/` for reusable client-side state and workflows.

Hooks are a good place for logic like:

- Form state.
- Loading state.
- Copy/download actions.
- Editing drafts.
- Calling browser APIs.
- Preparing data before sending it to an API route.

For example, `useStoryGenerator.ts` owns the story generation workflow, while
`StoryForm.tsx` only renders form controls and calls the actions it receives.

### Shared Rules And Data Layer

Use `lib/` as the single source of truth for shared application logic.

Good examples:

- `lib/data.ts`: shared option lists and constants, such as genres, settings,
  races, classes, levels, and session lengths.
- `lib/types.ts`: shared TypeScript types, such as `ParsedStory`.
- `lib/validation.ts`: reusable validation helpers.
- `lib/parser.ts`: parsing and cleanup rules for AI-generated story JSON.
- `lib/prompts.ts`: prompt construction rules for AI generation.
- `lib/pdfExport.ts`: PDF export helper used by the browser.

If a value or rule is used in more than one place, it usually belongs in `lib/`.
If a rule defines what a valid StoryForge story is, it belongs in `lib/` even if
only one file currently calls it.

### AI And Domain Layer

StoryForge has domain logic around RPG story generation. Keep that logic in
plain TypeScript files instead of hiding it inside UI components.

Examples:

- Prompt text belongs in `lib/prompts.ts`.
- Story response parsing belongs in `lib/parser.ts`.
- Story shape definitions belong in `lib/types.ts`.
- Allowed genre, setting, race, and class data belongs in `lib/data.ts`.

This keeps the UI easier to read and makes the AI behavior easier to test later.

### Testing Layer

Use `tests/` for automated tests.

Recommended future structure:

```txt
tests/
  parser.test.ts
  validation.test.ts
  prompts.test.ts
  story-generator.test.tsx
```

Start with tests for pure logic because they are the easiest to write and give
high value:

- `parseStory` accepts valid story JSON.
- `parseStory` rejects invalid story JSON.
- `validateTextValue` returns useful error messages.
- `buildStoryPrompt` includes the selected generation options.

UI tests can come later when the core logic is stable.

## Folders To Add Only When Needed

Do not add folders just because large companies use them. Add them when the
project has enough code to make the separation useful.

### `components/ui/`

Add this only when there are many generic UI components used across the app,
such as:

- `Button`
- `TextField`
- `Modal`
- `Tooltip`
- `Select`

Until then, keeping generic components directly in `components/` is simpler.

### `lib/server/`

Add this only when there is enough server-only shared logic to separate it from
browser-safe logic.

Examples:

- OpenAI client creation.
- Server-only request validation.
- Server-only environment variable helpers.

Never import `lib/server/` files into client components or hooks.

### `lib/client/`

Add this only when there is enough browser-only shared logic.

Examples:

- Clipboard helpers.
- Local storage helpers.
- Browser download helpers.

### `features/`

Add this only if StoryForge grows into several large product areas.

For example:

```txt
features/
  story-generation/
  story-editing/
  campaign-builder/
```

This is useful for bigger applications, but it is too much structure for the
current version. The current `app/`, `components/`, `hooks/`, and `lib/` split is
more appropriate for a bachelor thesis project.

### Workplace-Specific Structures

Some workplaces use their own patterns, such as TEA CUP or other internal
architecture names. Those patterns can be useful in that company, but StoryForge
should not copy them unless the project has the same needs.

Prefer simple responsibility-based structure first:

- Rendering in `app/` and `components/`.
- State workflows in `hooks/`.
- Shared rules in `lib/`.
- Tests in `tests/`.
- Documentation in `docs/`.

## Naming Rules

### Components

Use `PascalCase.tsx` for React components.

Examples:

- `StoryForm.tsx`
- `StoryResult.tsx`
- `EncounterCard.tsx`

PascalCase means each word starts with a capital letter. React components use
PascalCase because JSX treats lowercase names like HTML elements and uppercase
names like custom components.

```tsx
<StoryForm />
```

### Hooks

Use `useThing.ts` for custom hooks.

Examples:

- `useStoryGenerator.ts`
- `useStoryEditing.ts`

The `use` prefix is required by React convention. It tells React, TypeScript,
ESLint, and other developers that the function may call React hooks such as
`useState` or `useEffect`.

### Shared Helpers

Use `camelCase.ts` for shared helper files.

Examples:

- `validation.ts`
- `parser.ts`
- `pdfExport.ts`

Use action-based function names:

- `validateTextValue`
- `parseStory`
- `buildStoryPrompt`
- `exportStoryToPdf`

The first word should usually be a verb because functions do something.

### Types

Keep central domain types in `lib/types.ts`.

Examples:

- `ParsedStory`
- `ParsedNpc`
- `ParsedEncounter`
- `SelectionMode`

Use `PascalCase` for TypeScript types because types describe named shapes.

### Constants And Options

Keep shared option lists and constants in `lib/data.ts`.

Examples:

- `GENRES`
- `SETTINGS`
- `SESSION_LENGTHS`
- `ENCOUNTER_COUNT_BY_SESSION_LENGTH`

Use `UPPER_SNAKE_CASE` for constants that behave like fixed application data.

### API Routes

Follow Next.js file names for routes.

Example:

```txt
app/api/generate/route.ts
```

The folder path defines the URL, and `route.ts` defines the request handlers.
For example, `app/api/generate/route.ts` creates `/api/generate`.

### Tests

Prefer the central `tests/` folder for StoryForge.

Examples:

- `tests/parser.test.ts`
- `tests/validation.test.ts`
- `tests/prompts.test.ts`

Small colocated tests are also common in the industry, but a central `tests/`
folder is easier to find in a smaller learning project.

## Function Naming Rules

### `onSomething`

Use `onSomething` for callback props received by a component.

Example:

```tsx
<StoryForm onGenerate={handleGenerate} />
```

`onGenerate` means "generation happened or was requested." The component does
not need to know how generation works. It only calls the prop.

### `handleSomething`

Use `handleSomething` for the function that owns the action.

Example:

```ts
const handleGenerate = async () => {
  // validate form, call API, parse result
};
```

`handleGenerate` means "this function handles the generate action."

### `setSomething`

Use `setSomething` for state update functions.

Examples:

- `setGenre`
- `setLoading`
- `setDraftField`

React's `useState` returns this naming pattern naturally:

```ts
const [genre, setGenre] = useState("Fantasy");
```

### `validateSomething`

Use `validateSomething` for functions that check if data is acceptable.

Examples:

- `validateTextValue`
- `validateSelectionValue`

Validation functions should return a clear result, such as an error message or
an object describing success/failure.

### `parseSomething`

Use `parseSomething` for functions that convert unknown/raw input into a trusted
application shape.

Example:

```ts
const story = parseStory(aiResponse);
```

Parsing is stricter than formatting. A parser should reject data that does not
match the expected structure.

## File Splitting Rules

Split a UI component when:

- The JSX is becoming hard to scan.
- A section has its own props.
- A section repeats in a list.
- The section has a clear name in the user interface.

Split a hook when:

- It manages more than one workflow.
- Part of the logic could be reused by another component.
- The hook return value becomes difficult to understand.

Move logic to `lib/` when:

- It is shared by multiple files.
- It is pure logic that can be tested without rendering React.
- It defines StoryForge domain rules.
- It controls parser, prompt, validation, or export behavior.

Keep logic inside a component when:

- It only affects that component's display.
- It is a short helper for class names or labels.
- Moving it would make the code harder to follow.

Avoid abstractions until there are at least two real users of the same logic.
One clear duplicated line is often better than one confusing abstraction.

## Glossary

### React Component

A React component is a function that returns UI.

```tsx
function StoryForm() {
  return <form>...</form>;
}
```

Components are named with PascalCase so React knows they are custom UI pieces.

Official docs: [Your First Component](https://react.dev/learn/your-first-component)

### Props

Props are values passed from a parent component to a child component.

```tsx
<StoryResult story={parsedStory} />
```

In this example, `story` is a prop. Props let a parent control what a child
renders.

Official docs: [Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)

### State

State is component-owned memory. Use state for values that change over time and
should update the screen.

```ts
const [loading, setLoading] = useState(false);
```

When `loading` changes, React can render the component again with the new value.

Official docs: [State: A Component's Memory](https://react.dev/learn/state-a-components-memory)

### Hook

A hook is a function that lets React code connect to React features.

Examples:

- `useState` hooks into React state.
- `useEffect` hooks into React's render lifecycle.
- `useStoryGenerator` is a custom hook that groups StoryForge workflow logic.

Hooks are called hooks because they "hook into" React behavior from a function
component.

Official docs: [Built-in React Hooks](https://react.dev/reference/react/hooks)

### `useState`

`useState` stores a value that affects rendering.

```ts
const [genre, setGenre] = useState("Fantasy");
```

`genre` is the current value. `setGenre` updates it.

Official docs: [useState](https://react.dev/reference/react/useState)

### `useEffect`

`useEffect` runs after React renders. Use it to synchronize with something
outside React, such as the browser window, document title, subscriptions, or
manual DOM behavior.

Example from StoryForge:

```ts
useEffect(() => {
  if (!parsed) return;
  window.scrollTo({ top: 0, behavior: "smooth" });
}, [parsed]);
```

This means "when `parsed` changes and a story exists, scroll the window to the
top."

Official docs: [useEffect](https://react.dev/reference/react/useEffect)

### Event Names Like `onChange`

React uses names like `onChange`, `onClick`, and `onBlur` for events.

`onChange` means "run this function when the value changes."

```tsx
<input onChange={(event) => setGenre(event.target.value)} />
```

Official docs: [Responding to Events](https://react.dev/learn/responding-to-events)

### Handler Names Like `handleGenerate`

A handler is a function that responds to an event or user action.

Example:

```ts
const handleGenerate = async () => {
  // handle the Generate button action
};
```

Use `handle...` for the function that owns the behavior. Use `on...` for the
prop that passes the behavior to a child component.

### Single Source Of Truth

Single source of truth means one place owns a shared value or rule.

For example, `SESSION_LENGTHS` should live in `lib/data.ts`. Other files should
import it instead of creating their own session length lists.

This prevents bugs where two files disagree about the same concept.

### Parser

A parser converts raw input into a trusted application shape.

In StoryForge, `parseStory` receives raw AI text, parses JSON, checks the story
structure, trims strings, and returns a `ParsedStory`.

### Validator

A validator checks whether a value follows a rule.

In StoryForge, `validateTextValue` checks whether text is present, contains a
letter, and stays under the maximum length.

### API Route

An API route is a server endpoint inside the Next.js app.

In StoryForge, `app/api/generate/route.ts` receives generation options, builds
the prompt, calls the AI API, and returns the generated result.

Official docs: [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

## Practical Rule Of Thumb

When adding new code, ask:

1. Does this render UI? Put it in `app/` or `components/`.
2. Does this manage client state or user workflow? Put it in `hooks/`.
3. Is this a shared rule, type, parser, prompt, or constant? Put it in `lib/`.
4. Is this a test? Put it in `tests/`.
5. Is this documentation? Put it in `docs/`.

If the answer is unclear, keep the code close to where it is used. Move it only
when sharing it makes the project easier to understand.
