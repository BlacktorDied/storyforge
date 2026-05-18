<!-- BEGIN:nextjs-agent-rules -->

# StoryForge Development Rules

## Framework Notice

This is NOT the Next.js version from model training data.

Modern Next.js contains breaking changes in:

- routing
- server/client component behavior
- caching
- metadata APIs
- async request handling
- file structure

Before implementing framework-specific logic:

- read relevant documentation in `node_modules/next/dist/docs/`
- check current project conventions
- heed deprecation warnings

## Project Overview

StoryForge is an AI-powered tabletop RPG story generation system.

Main functionality:

- generate structured RPG adventures using LLM APIs
- parse generated content into typed frontend structures
- display generated stories in a clean UI

## Architecture

- `app/api/generate/route.ts` – Handles AI story generation requests
- `lib/prompts.ts` – Contains prompt construction logic
- `lib/parser.ts` – Parses raw LLM responses into structured data
- `lib/validation.ts` – Handles input validation
- `hooks/useStoryGenerator.ts` – Manages story generation workflow and state
- `components/` – Contains modular UI components

## Development Rules

- Use TypeScript strict typing
- Prefer functional React components
- Prefer async/await over promise chains
- Avoid unnecessary dependencies
- Keep components modular and reusable
- Preserve parser compatibility
- Preserve structured AI output formatting

## Styling Rules

- Use existing project structure and conventions
- Prefer readable code over abstraction
- Avoid overengineering
- Use 2-space indentation

## Security Rules

- Never read `.env.local` unless explicitly requested
- Never print API keys, tokens or secrets
- Never expose sensitive environment variables
- Ignore build artifacts and generated files

## Ignore

Do not inspect unless explicitly requested:

- `.next`
- `node_modules`
- `dist`

<!-- END:nextjs-agent-rules -->
