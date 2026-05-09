import { CLASSES, RACES } from "./data";

const ENCOUNTER_COUNT_BY_LENGTH = {
  Short: 2,
  Medium: 3,
  Long: 5,
} as const;

type BuildStoryPromptParams = {
  genre: string;
  setting: string;
  races: string[] | null;
  classes: string[] | null;
  length: string;
  partySize: string;
  level: string;
};

export function buildStoryPrompt({
  genre,
  setting,
  races,
  classes,
  length,
  partySize,
  level,
}: BuildStoryPromptParams) {
  const usedRaces = races === null ? RACES : races;
  const usedClasses = classes === null ? CLASSES : classes;

  const encounterCount =
    ENCOUNTER_COUNT_BY_LENGTH[
      length as keyof typeof ENCOUNTER_COUNT_BY_LENGTH
    ] ?? 3;

  return `
You are a professional Dungeon Master creating a ONE-SHOT adventure for Dungeons & Dragons 5e.

Genre: ${genre}
Setting: ${setting}
Party size: ${partySize} players
Recommended player level: ${level}
Session length: ${length}

Constraints:
- Allowed races: ${usedRaces.join(", ")}
- Allowed classes: ${usedClasses.join(", ")}
- NPCs MUST use ONLY the allowed races and classes.

Global constraints:
- Do NOT invent new races or classes.
- The adventure must be appropriate for party size (${partySize}) and character level (${level}).

Narrative rules:
- The adventure must have a clear beginning, middle, and climax
- The final encounter MUST be the climax and involve the main antagonist or major challenge

Task:
Generate a structured RPG one-shot scenario.

Output format rules (VERY IMPORTANT):
- Return STRICTLY in markdown format
- Use EXACT section headers as shown below
- Do NOT add extra sections
- Do NOT rename sections
- Use proper spacing and line breaks

# Title

## Setting
(Describe the world and atmosphere)

## Background
(Explain what happened before the adventure and why the current situation exists)

## Adventure Hook
(Describe where and how the players start the adventure)

## Main Quest
(Clear objective for players)

## Key Encounters
You MUST generate exactly ${encounterCount} encounters.

Each encounter MUST:
- Use format: ### Encounter Name
- Include a short description
- Include enemies or challenge details
- Be appropriate for party size (${partySize}) and level (${level})

IMPORTANT:
- If an encounter includes a puzzle, riddle, or challenge, you MUST provide its full content

## NPCs
Generate 2–4 NPCs depending on story complexity.

Each NPC MUST follow this format:

### NPC
- Name:
- Race:
- Class:
- Role in story:
- Location:
- Motivation:
- Description:
`;
}
