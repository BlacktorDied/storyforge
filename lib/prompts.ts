import {
  CLASSES,
  EMOTIONAL_TONE_OPTIONS,
  ENCOUNTER_COUNT_BY_SESSION_LENGTH,
  GAMEPLAY_THEME_OPTIONS,
  NARRATIVE_ARCHETYPE_OPTIONS,
  NARRATIVE_PACING_OPTIONS,
  RACES,
  type EmotionalTone,
  type GameplayTheme,
  type NarrativeArchetype,
  type NarrativePacing,
  type SessionLength,
} from "./data";
import { encounterCheckTypes, encounterPuzzleTypes } from "./types";

const CLIMAX_TYPES = [
  "direct confrontation - final combat with the main antagonist or most dangerous threat",
  "social resolution - a negotiation, ultimatum or persuasion that ends the conflict without requiring violence",
  "environmental mechanism - activating, disabling or surviving a trap, ritual or magical device at a critical moment",
  "moral dilemma - a final choice with no clean answer where the cost of victory is real and felt",
  "trickery and deception - the party must deceive, impersonate or outsmart rather than overpower",
  "sacrifice - resolution requires giving something up permanently: a bond, an object or a life",
  "puzzle or revelation - the climax unlocks only when the party understands something hidden throughout",
  "chase and escape - survival over victory: getting out rather than defeating the threat",
];

const STORY_FLOW_STRUCTURES = [
  "branching investigation - each encounter reveals a clue that can point to two different next steps",
  "rising complications - each encounter solves one problem while introducing a sharper consequence",
  "faction pressure - each encounter shifts the balance between rival groups and forces visible choices",
  "countdown crisis - each encounter consumes time or resources as the climax draws closer",
  "location journey - each encounter moves the party through a distinct place with its own obstacle",
  "reversal chain - each encounter changes what the party believes about the true threat",
  "parallel threats - each encounter addresses a different pressure that converges in the climax",
];

const LOCATION_INSPIRATIONS = [
  "a coastal fishing town haunted by strange disappearances at sea",
  "a crumbling noble estate where old rivalries and grudges never fully died",
  "an underground fungal forest known only to a handful of explorers",
  "a fog-covered marshland surrounding a sunken village",
  "a floating market district built on tethered skyships or riverboats",
  "a desert canyon settlement carved from ancient red stone",
  "a winter tundra outpost at the edge of explored territory",
  "a volcanic island where dangerous forces and locals coexist in uneasy balance",
  "a dense jungle ruin slowly reclaimed by nature over centuries",
  "a river delta port where multiple criminal factions compete for control",
  "a highland monastery with dark secrets beneath its ancient foundations",
  "a quarantined district sealed after a magical catastrophe years ago",
  "a traveling carnival that conceals something sinister between its colorful tents",
  "a salt flat wasteland with a lone tower visible for miles in every direction",
  "an underground city built inside a vast natural cavern system",
];

const ANTI_TROPES = [
  "Do not use a generic dungeon crawl format - the adventure must not primarily take place in a series of underground rooms with monsters behind every door",
  "Do not use an evil wizard in a tower as the central threat",
  "Do not start the adventure in a tavern",
  "Do not use undead skeletons or zombie hordes as the primary enemies",
  "Do not use a generic dark lord or evil overlord as the antagonist - the villain must have a specific name, face and motivation",
  "Do not use a village-under-attack as the inciting incident",
  "Do not use a generic 'retrieve the lost artifact' quest as the sole driving force",
  "Do not use a dragon as the final boss",
  "Do not use an evil cult performing a summoning ritual as the central threat",
  "Do not use an orphaned child or helpless NPC as the sole quest giver",
  "Do not use a corrupt town guard captain as the only antagonist",
  "Do not use goblin or orc raids as the primary antagonist force",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export type SelectedNarrativeOptions = {
  narrativeArchetype?: NarrativeArchetype | null;
  emotionalTone?: EmotionalTone | null;
  gameplayTheme?: GameplayTheme | null;
  pacingStyle?: NarrativePacing | null;
};

type ResolvedNarrativeDirection = {
  archetype: string;
  tone: string;
  theme: string;
  pacing: string;
  climax: string;
  storyFlow: string;
  locationInspiration: string;
  antiTropes: string[];
};

type RandomNumber = () => number;

function formatAllowedValues(values: readonly string[]): string {
  return values.join(", ");
}

function pick<T>(arr: readonly T[], random: RandomNumber): T {
  return arr[Math.floor(random() * arr.length)];
}

function pickMultiple<T>(
  arr: readonly T[],
  count: number,
  random: RandomNumber,
): T[] {
  const pool = [...arr];
  const picked: T[] = [];

  while (picked.length < count && pool.length > 0) {
    const index = Math.floor(random() * pool.length);
    const [item] = pool.splice(index, 1);
    picked.push(item);
  }

  return picked;
}

function getSelectedOrRandomOption<T extends { value: string; prompt: string }>(
  options: readonly T[],
  value: T["value"] | null | undefined,
  random: RandomNumber,
): T {
  if (value === null || value === undefined) {
    return pick(options, random);
  }

  const option = options.find((item) => item.value === value);

  if (!option) {
    return pick(options, random);
  }

  return option;
}

export function buildResolvedNarrativeDirection(
  selection: SelectedNarrativeOptions = {},
  random: RandomNumber = Math.random,
): ResolvedNarrativeDirection {
  return {
    archetype: getSelectedOrRandomOption(
      NARRATIVE_ARCHETYPE_OPTIONS,
      selection.narrativeArchetype,
      random,
    ).prompt,
    tone: getSelectedOrRandomOption(
      EMOTIONAL_TONE_OPTIONS,
      selection.emotionalTone,
      random,
    ).prompt,
    theme: getSelectedOrRandomOption(
      GAMEPLAY_THEME_OPTIONS,
      selection.gameplayTheme,
      random,
    ).prompt,
    pacing: getSelectedOrRandomOption(
      NARRATIVE_PACING_OPTIONS,
      selection.pacingStyle,
      random,
    ).prompt,
    climax: pick(CLIMAX_TYPES, random),
    storyFlow: pick(STORY_FLOW_STRUCTURES, random),
    locationInspiration: pick(LOCATION_INSPIRATIONS, random),
    antiTropes: pickMultiple(ANTI_TROPES, 3, random),
  };
}

// ---------------------------------------------------------------------------
// Prompt builder
// ---------------------------------------------------------------------------

type BuildStoryPromptParams = SelectedNarrativeOptions & {
  genre: string;
  setting: string;
  races: readonly string[] | null;
  classes: readonly string[] | null;
  sessionLength: SessionLength;
  partySize: string;
  level: string;
  random?: RandomNumber;
};

export function buildStoryPrompt({
  genre,
  setting,
  races,
  classes,
  sessionLength,
  partySize,
  level,
  random = Math.random,
  narrativeArchetype,
  emotionalTone,
  gameplayTheme,
  pacingStyle,
}: BuildStoryPromptParams) {
  const usedRaces = races === null ? RACES : races;
  const usedClasses = classes === null ? CLASSES : classes;
  const encounterCount = ENCOUNTER_COUNT_BY_SESSION_LENGTH[sessionLength];
  const allowedRaces = formatAllowedValues(usedRaces);
  const allowedClasses = formatAllowedValues(usedClasses);
  const allowedCheckTypes = formatAllowedValues(encounterCheckTypes);
  const allowedPuzzleTypes = formatAllowedValues(encounterPuzzleTypes);
  const direction = buildResolvedNarrativeDirection(
    {
      narrativeArchetype,
      emotionalTone,
      gameplayTheme,
      pacingStyle,
    },
    random,
  );

  return `Create a structured one-shot D&D 5e adventure using these parameters:

Genre: ${genre}
Setting: ${setting}
Party size: ${partySize} players
Recommended player level: ${level}
Session length: ${sessionLength}

Allowed races: ${allowedRaces}
Allowed classes: ${allowedClasses}

--- NARRATIVE DIRECTION ---

Archetype: ${direction.archetype}
Emotional tone: ${direction.tone}
Gameplay theme: ${direction.theme}
Pacing: ${direction.pacing}
Story flow: ${direction.storyFlow}
Climax type: ${direction.climax}
Location inspiration: Use "${direction.locationInspiration}" as a creative starting point. Adapt it freely to fit the genre and setting - it is a suggestion, not a constraint.

--- ANTI-REPETITION DIRECTIVES (follow all of these strictly) ---

${direction.antiTropes.map((d) => `- ${d}`).join("\n")}

--- STORY CONTENT REQUIREMENTS ---

- Title: Write a specific, evocative title that reflects the archetype, tone and setting. Avoid generic fantasy titles like "The Dark Dungeon" or "Quest for the Ancient Relic".
- Background: Write at least 3 sentences establishing the history, lore and stakes of this specific adventure. Be specific - name locations, factions or events that make this world feel real.
- Adventure hook: Write a specific, immediate and emotionally engaging hook that draws the party in. It must create urgency and raise a clear question or problem.
- Main quest: Clearly describe what the party must accomplish, why it matters, what opposing forces stand in the way and what is at stake if they fail.
- NPCs: Each NPC must feel distinct. Give each one a specific name, a personality quirk visible in their behavior and a motivation tied directly to the story's central conflict. Do not give two NPCs similar roles or functions in the story.

--- ENCOUNTER REQUIREMENTS ---

- Generate exactly ${encounterCount} encounters
- Vary encounter types - do not default to combat only
- Mix types from: combat, social negotiation, environmental puzzle, exploration, roleplay challenge, environmental hazard
- The final encounter MUST be the climax and match the climax type specified above
- Each encounter must contain at least one playable element
- Put every ability check, skill check, tool check or saving throw in the encounter's "checks" array
- Check type MUST be one of: ${allowedCheckTypes}
- Every check MUST include a numeric DC appropriate for level ${level}; never write a check like "Wisdom" or "Dexterity" without a DC
- If an encounter includes combat or can turn into combat, put each opposing creature in the encounter's "creatures" array with its exact official name, quantity, role, combat trigger and goal
- Creature names MUST be exact official D&D 5e creature/stat block names that a DM can look up in trusted references such as Monster Manual or D&D Beyond, not vague invented labels
- Creature quantity MUST be a number of creatures, not part of the creature name
- Do not include creature sources or reproduce stat blocks in the JSON output
- Avoid vague creatures like "phantom wolves", "vengeful shadows" or "angry spirits" unless you map them to exact official stat block names
- If an encounter includes a puzzle, riddle or clue challenge, put its full content in the encounter's "puzzle" object with type, prompt, answer, hints and alternateSolutions
- Puzzle type MUST be one of: ${allowedPuzzleTypes}
- Riddles must be original, specific to the adventure's scene and not reused across encounters
- Do NOT use common stock riddles, especially "I can be cracked, made, told, and played. What am I?"
- Each encounter should support at least two resolution strategies when possible, such as negotiation, stealth, combat, investigation, puzzle-solving or retreat
- Encounters must follow the story flow specified above instead of repeating the same challenge structure
- Encounters must escalate in stakes and tension toward the climax
- Each encounter must have a distinct narrative function, obstacle type and consequence
- NPCs and encounters must not reuse the same archetype, role or conflict pattern

--- GLOBAL CONSTRAINTS ---

- Do NOT invent new races or classes
- NPCs MUST use ONLY races from the allowed list: ${allowedRaces}
- NPCs MUST use ONLY classes from the allowed list: ${allowedClasses}
- The adventure must be appropriate for party size (${partySize}) and character level (${level})

--- OUTPUT FORMAT (VERY IMPORTANT) ---

- Return ONLY valid JSON
- Do NOT wrap JSON in code blocks
- Do NOT include explanations or comments
- All fields are required
- Encounters and NPCs must be arrays
- Use [] for "checks" or "creatures" when none apply
- Use null for "puzzle" when an encounter has no puzzle, riddle or clue challenge

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
      "content": "string",
      "checks": [
        {
          "type": "ability check",
          "ability": "string",
          "skillOrTool": "string",
          "dc": 15,
          "purpose": "string",
          "success": "string",
          "failure": "string"
        }
      ],
      "creatures": [
        {
          "name": "exact official D&D 5e creature/stat block name",
          "quantity": 1,
          "role": "string",
          "combatTrigger": "string",
          "goal": "string"
        }
      ],
      "puzzle": {
        "type": "environmental puzzle",
        "prompt": "string",
        "answer": "string",
        "hints": ["string"],
        "alternateSolutions": ["string"]
      }
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
