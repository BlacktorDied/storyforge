import {
  CLASSES,
  ENCOUNTER_COUNT_BY_SESSION_LENGTH,
  RACES,
  type SessionLength,
} from "./data";

type BuildStoryPromptParams = {
  genre: string;
  setting: string;
  races: readonly string[] | null;
  classes: readonly string[] | null;
  sessionLength: SessionLength;
  partySize: string;
  level: string;
};

export function buildStoryPrompt({
  genre,
  setting,
  races,
  classes,
  sessionLength,
  partySize,
  level,
}: BuildStoryPromptParams) {
  const usedRaces = races === null ? RACES : races;
  const usedClasses = classes === null ? CLASSES : classes;

  const encounterCount = ENCOUNTER_COUNT_BY_SESSION_LENGTH[sessionLength];

  return `
Create a structured one-shot adventure using these parameters:

Genre: ${genre}
Setting: ${setting}
Party size: ${partySize} players
Recommended player level: ${level}
Session length: ${sessionLength}

Allowed races: ${usedRaces.join(", ")}
Allowed classes: ${usedClasses.join(", ")}

Global constraints:
- Do NOT invent new races or classes
- NPCs MUST use ONLY allowed races and classes
- The adventure must be appropriate for party size (${partySize}) and character level (${level})

Narrative rules:
- The adventure must have a clear beginning, middle and climax
- The final encounter MUST be the climax and involve the main antagonist or major challenge

Encounter requirements:
- Generate exactly ${encounterCount} encounters
- Each encounter must include:
  - title
  - content
- Each encounter must contain at least one playable element:
  - combat
  - obstacle
  - puzzle
  - roleplay challenge
  - exploration challenge
  - environmental hazard
- Encounters must be appropriate for party size (${partySize}) and level (${level})
- If an encounter includes a puzzle, riddle or challenge, provide its full content

NPC requirements:
- Generate 2-4 NPCs depending on story complexity
- Each NPC must contain all required fields

Output format rules (VERY IMPORTANT):
- Return ONLY valid JSON
- Do NOT wrap JSON in code blocks
- Do NOT include explanations or comments
- All fields are required
- Encounters and NPCs must be arrays

Use this exact JSON structure:

{
  "title": "string",
  "setting": "string",
  "background": "string",
  "adventureHook": "string",
  "mainQuest": "string",
  "encounters": [
    {
      "title": "string",
      "content": "string"
    }
  ],
  "npcs": [
    {
      "name": "string",
      "race": "string",
      "class": "string",
      "role": "string",
      "location": "string",
      "motivation": "string",
      "description": "string"
    }
  ]
}`;
}
