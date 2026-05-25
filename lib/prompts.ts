import {
  CLASSES,
  ENCOUNTER_COUNT_BY_SESSION_LENGTH,
  RACES,
  type SessionLength,
} from "./data";

// ---------------------------------------------------------------------------
// Narrative diversity pools
// Each pool is randomly sampled at call time so identical inputs produce
// structurally different adventures on every generation.
// ---------------------------------------------------------------------------

const NARRATIVE_ARCHETYPES = [
  "mystery investigation — the party uncovers hidden truths through clues and interrogation",
  "heist or infiltration — the party must achieve an objective through stealth, planning or deception",
  "survival or escape — the party is trapped, hunted or must survive against overwhelming odds",
  "rescue mission — the party must locate and free someone under threat or captivity",
  "political intrigue — the party navigates competing factions, loyalty and hidden agendas",
  "monster hunt — the party tracks and confronts a dangerous creature threatening a community",
  "ancient ruins exploration — the party navigates a forgotten place with its own buried history",
  "faction conflict — the party is caught between two powers and must choose sides or broker peace",
  "curse or corruption — the party must lift a supernatural affliction from a place or person",
  "criminal underworld — the party operates in a world of crime, deception and moral ambiguity",
  "lost expedition — the party must uncover what happened to those who disappeared before them",
  "haunting resolution — restoring peace to a place tormented by an unresolved past",
  "competition or tournament — the party competes in a high-stakes contest with hidden dangers",
  "rebellion support — the party aids an uprising against an oppressive power",
  "escort or protection — the party must safely guide someone or something through danger",
];

const EMOTIONAL_TONES = [
  "grim and foreboding — a world where hope is scarce and danger lurks in every shadow",
  "hopeful and heroic — ordinary people rising to become heroes against overwhelming odds",
  "dark comedy — absurd situations with real consequences, levity threading through danger",
  "tragic and melancholic — a story shaped by loss, sacrifice and bittersweet outcomes",
  "mysterious and unsettling — something is deeply wrong and the truth is stranger than expected",
  "epic and grand — world-shaking stakes, legendary deeds and the weight of history",
  "tense and paranoid — trust is scarce, betrayal is possible and danger wears a friendly face",
  "whimsical and fantastical — strange magic, unusual creatures and genuine wonder",
  "gritty and grounded — harsh realities, human cost and moral complexity without easy answers",
  "dreamlike and surreal — shifting reality, unreliable perception and impossible things",
];

const GAMEPLAY_THEMES = [
  "exploration-focused — discovering hidden places, environmental secrets and world-building through space",
  "social intrigue — NPC relationships, information extraction and political maneuvering",
  "puzzle-solving — environmental and intellectual challenges that reward creative thinking",
  "tactical combat — strategic encounters with positioning, terrain and unexpected complications",
  "investigation — gathering clues, following leads and piecing together hidden truths",
  "moral dilemmas — hard choices without clear right answers and meaningful consequences for each",
  "stealth and deception — infiltration, disguise and avoiding direct confrontation",
  "time pressure — a ticking clock where every choice consumes a limited resource",
  "resource scarcity — survival under pressure with limited supplies and environmental threats",
  "negotiation and diplomacy — resolving conflict through words, deals and difficult compromise",
];

const NARRATIVE_PACING = [
  "slow-burn — a quiet, eerie opening that gradually builds to an explosive climax",
  "fast-paced — immediate action from the start, constant pressure with no time to breathe",
  "escalating dread — a calm beginning that becomes increasingly desperate as the truth emerges",
  "peaks and valleys — intense moments alternating with brief recovery and discovery",
  "flashpoint structure — explosive opening incident, followed by investigation and final confrontation",
  "single-act crisis — one continuous emergency that forces constant improvisation and adaptation",
  "three-act tension arc — setup establishing stakes, rising conflict, climactic confrontation",
];

const CLIMAX_TYPES = [
  "direct confrontation — final combat with the main antagonist or most dangerous threat",
  "social resolution — a negotiation, ultimatum or persuasion that ends the conflict without requiring violence",
  "environmental mechanism — activating, disabling or surviving a trap, ritual or magical device at a critical moment",
  "moral dilemma — a final choice with no clean answer where the cost of victory is real and felt",
  "trickery and deception — the party must deceive, impersonate or outsmart rather than overpower",
  "sacrifice — resolution requires giving something up permanently: a bond, an object or a life",
  "puzzle or revelation — the climax unlocks only when the party understands something hidden throughout",
  "chase and escape — survival over victory: getting out rather than defeating the threat",
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
  "Do not use a generic dungeon crawl format — the adventure must not primarily take place in a series of underground rooms with monsters behind every door",
  "Do not use an evil wizard in a tower as the central threat",
  "Do not start the adventure in a tavern",
  "Do not use undead skeletons or zombie hordes as the primary enemies",
  "Do not use a generic dark lord or evil overlord as the antagonist — the villain must have a specific name, face and motivation",
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

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickMultiple<T>(arr: T[], count: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, count);
}

// ---------------------------------------------------------------------------
// Prompt builder
// ---------------------------------------------------------------------------

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

  const archetype = pick(NARRATIVE_ARCHETYPES);
  const tone = pick(EMOTIONAL_TONES);
  const theme = pick(GAMEPLAY_THEMES);
  const pacing = pick(NARRATIVE_PACING);
  const climax = pick(CLIMAX_TYPES);
  const locationInspiration = pick(LOCATION_INSPIRATIONS);
  const antiTropes = pickMultiple(ANTI_TROPES, 3);

  return `Create a structured one-shot D&D 5e adventure using these parameters:

Genre: ${genre}
Setting: ${setting}
Party size: ${partySize} players
Recommended player level: ${level}
Session length: ${sessionLength}

Allowed races: ${usedRaces.join(", ")}
Allowed classes: ${usedClasses.join(", ")}

--- NARRATIVE DIRECTION ---

Archetype: ${archetype}
Emotional tone: ${tone}
Gameplay theme: ${theme}
Pacing: ${pacing}
Climax type: ${climax}
Location inspiration: Use "${locationInspiration}" as a creative starting point. Adapt it freely to fit the genre and setting — it is a suggestion, not a constraint.

--- ANTI-REPETITION DIRECTIVES (follow all of these strictly) ---

${antiTropes.map((d) => `- ${d}`).join("\n")}

--- STORY CONTENT REQUIREMENTS ---

- Title: Write a specific, evocative title that reflects the archetype, tone and setting. Avoid generic fantasy titles like "The Dark Dungeon" or "Quest for the Ancient Relic".
- Background: Write at least 3 sentences establishing the history, lore and stakes of this specific adventure. Be specific — name locations, factions or events that make this world feel real.
- Adventure hook: Write a specific, immediate and emotionally engaging hook that draws the party in. It must create urgency and raise a clear question or problem.
- Main quest: Clearly describe what the party must accomplish, why it matters, what opposing forces stand in the way and what is at stake if they fail.
- NPCs: Each NPC must feel distinct. Give each one a specific name, a personality quirk visible in their behavior, and a motivation tied directly to the story's central conflict. Do not give two NPCs similar roles or functions in the story.

--- ENCOUNTER REQUIREMENTS ---

- Generate exactly ${encounterCount} encounters
- Vary encounter types — do not default to combat only
- Mix types from: combat, social negotiation, environmental puzzle, exploration, roleplay challenge, environmental hazard
- The final encounter MUST be the climax and match the climax type specified above
- Each encounter must contain at least one playable element
- If an encounter includes a puzzle, riddle or challenge, provide its full content inline
- Encounters must escalate in stakes and tension toward the climax

--- GLOBAL CONSTRAINTS ---

- Do NOT invent new races or classes
- NPCs MUST use ONLY races from the allowed list: ${usedRaces.join(", ")}
- NPCs MUST use ONLY classes from the allowed list: ${usedClasses.join(", ")}
- The adventure must be appropriate for party size (${partySize}) and character level (${level})

--- OUTPUT FORMAT (VERY IMPORTANT) ---

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
