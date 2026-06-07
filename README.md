# StoryForge

StoryForge is an AI-powered tabletop RPG adventure generator designed to help Game Masters quickly create structured adventures, encounters, locations, and NPCs for their campaigns.

The current version focuses on generating D&D-style adventures with configurable:

- Genre
- Setting
- Allowed races and classes
- Party size
- Character level
- Session length

## Table Of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [Architecture Principles](#architecture-principles)
- [Documentation](#documentation)
- [Development Notes](#development-notes)
- [Roadmap](#roadmap)

## Features

- AI-generated tabletop RPG adventures
- Configurable story generation form
- Custom genre and setting support
- Optional race and class restrictions
- Structured adventure parsing
- NPC and encounter generation
- Light/dark theme support
- Mock generation mode for development

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Environment Variables

Create a `.env.local` file in the project root:

```env
OPENAI_API_KEY=your_api_key_here
```

The API key is used in:

```txt
app/api/generate/route.ts
```

## Scripts

```bash
npm run dev
npm run build
npm run start

npm run format:check
npm run format:fix

npm run lint
npm run lint:fix

npm run typecheck

npm run check
npm run check:all

npm run fix

npm run qr:repo
```

## Project Structure

```txt
app/                 Next.js routes, layouts, pages, metadata, API routes
components/          Reusable React UI components
components/ui/       Generic UI primitives and form controls
components/story/    Generated-story display and editing UI
hooks/               Client-side state and workflow hooks
lib/                 Shared domain logic, types, prompts, validation, parsing
__tests__/           Automated tests for domain logic and UI workflows
public/              Browser-served static assets
assets/              Source branding and design assets
docs/                Project documentation
.github/             GitHub issue and pull request templates
```

## Architecture Principles

StoryForge follows five lightweight architecture principles:

- **DRY:** shared story fields, validation rules, parsing rules, and transforms live in `lib/`.
- **KISS:** the app uses simple Next.js, React, hooks, and TypeScript modules.
- **Do One Thing:** components render, hooks coordinate workflows, and `lib/` files hold domain rules.
- **SOLID:** shared modules expose focused functions with typed inputs and outputs.
- **Meaningful Names:** files and symbols describe their role in the story generation flow.

## Documentation

- [Documentation Index](./docs/README.md)
- [Application Structure](./docs/application-structure.md)
- [Glossary](./docs/glossary.md)
- [Testing Guidelines](./docs/testing.md)
- [Versioning](./docs/versioning.md)

## Development Notes

Mock generation can be enabled through:

```txt
lib/mockStory.ts
```

## Roadmap

- Structured JSON AI responses
- Support for additional TTRPG systems
- Campaign generation support
- Adventure export functionality
- SVGR integration for branding assets
- Improved mock generation with dynamic input support
