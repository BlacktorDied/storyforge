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

---

# Project Overview

StoryForge is an AI-powered tabletop RPG story generation system.

Main functionality:

- generate structured RPG adventures using LLM APIs
- validate and parse structured AI-generated JSON responses
- display generated stories in a clean UI
- support configurable RPG generation parameters

---

# Architecture

Core files:

- `app/api/generate/route.ts` – AI request handling
- `lib/prompts.ts` – Prompt generation logic
- `lib/parser.ts` – JSON parsing and validation
- `lib/validation.ts` – Shared validation helpers
- `lib/types.ts` – Shared TypeScript types
- `hooks/useStoryGenerator.ts` – Story generation workflow/state
- `components/` – Reusable UI components

Architecture principles:

- keep architecture simple and maintainable
- prefer lightweight solutions over abstractions
- preserve structured JSON response compatibility
- avoid unnecessary dependencies
- avoid overengineering

---

# Development Rules

- Use strict TypeScript typing
- Prefer functional React components
- Prefer async/await over promise chains
- Keep components modular and reusable
- Preserve current UI behavior unless explicitly requested
- Preserve parser compatibility with `ParsedStory`
- Prefer readability over clever abstractions
- Use 2-space indentation

---

# Scope Rules

StoryForge is a bachelor thesis project.

Avoid:

- enterprise-scale architecture
- microservices
- unnecessary abstractions
- large infrastructure additions
- authentication systems unless explicitly requested
- database-heavy redesigns

Prefer:

- thesis-relevant improvements
- structured AI output reliability
- maintainable architecture
- focused incremental improvements
- lightweight validation approaches

---

# GitHub Workflow

Issue labels currently used:

- backend
- frontend
- enhancement
- bug
- refactor
- research
- documentation
- infrastructure
- design
- tech-debt
- blocked

GitHub Project fields used:

Priority:

- P0 — thesis-critical or urgent
- P1 — important improvement
- P2 — nice-to-have or future work

Size:

- XS
- S
- M
- L
- XL

Issue and pull request templates exist in:

- `.github/ISSUE_TEMPLATE/`
- `.github/pull_request_template.md`

When suggesting or creating issues, branches or pull requests:

- use existing labels
- assign appropriate Priority and Size values
- avoid duplicate labels
- prefer focused/scoped issues
- keep issue titles concise and descriptive
- follow existing repository templates

Branch naming convention:

- `<issue-number>-<short-description>`

Examples:

- `14-structured-json-output`
- `16-claude-code-setup`
- `17-deep-parser-validation`

---

# Security Rules

- Do not access or expose `.env.local`, API keys or secrets unless explicitly requested for debugging purposes
- Never print API keys, tokens, or secrets
- Never expose sensitive environment variables
- Ignore build artifacts and generated files

---

# Ignore

Do not inspect unless explicitly requested:

- `.next`
- `node_modules`
- `dist`

<!-- END:nextjs-agent-rules -->
