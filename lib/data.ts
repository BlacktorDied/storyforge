export const GENRES = [
  "Fantasy",
  "High Fantasy",
  "Dark Fantasy",
  "Adventure",
  "Horror",
  "Comedy",
  "Other",
] as const;

type NarrativeOption = {
  value: string;
  label: string;
  prompt: string;
};

export const NARRATIVE_ARCHETYPE_OPTIONS = [
  {
    value: "mystery-investigation",
    label: "Mystery Investigation",
    prompt:
      "mystery investigation - the party uncovers hidden truths through clues and interrogation",
  },
  {
    value: "heist-infiltration",
    label: "Heist Or Infiltration",
    prompt:
      "heist or infiltration - the party must achieve an objective through stealth, planning or deception",
  },
  {
    value: "survival-escape",
    label: "Survival Or Escape",
    prompt:
      "survival or escape - the party is trapped, hunted or must survive against overwhelming odds",
  },
  {
    value: "rescue-mission",
    label: "Rescue Mission",
    prompt:
      "rescue mission - the party must locate and free someone under threat or captivity",
  },
  {
    value: "political-intrigue",
    label: "Political Intrigue",
    prompt:
      "political intrigue - the party navigates competing factions, loyalty and hidden agendas",
  },
  {
    value: "monster-hunt",
    label: "Monster Hunt",
    prompt:
      "monster hunt - the party tracks and confronts a dangerous creature threatening a community",
  },
  {
    value: "ancient-ruins-exploration",
    label: "Ancient Ruins Exploration",
    prompt:
      "ancient ruins exploration - the party navigates a forgotten place with its own buried history",
  },
  {
    value: "faction-conflict",
    label: "Faction Conflict",
    prompt:
      "faction conflict - the party is caught between two powers and must choose sides or broker peace",
  },
  {
    value: "curse-corruption",
    label: "Curse Or Corruption",
    prompt:
      "curse or corruption - the party must lift a supernatural affliction from a place or person",
  },
  {
    value: "criminal-underworld",
    label: "Criminal Underworld",
    prompt:
      "criminal underworld - the party operates in a world of crime, deception and moral ambiguity",
  },
  {
    value: "lost-expedition",
    label: "Lost Expedition",
    prompt:
      "lost expedition - the party must uncover what happened to those who disappeared before them",
  },
  {
    value: "haunting-resolution",
    label: "Haunting Resolution",
    prompt:
      "haunting resolution - restoring peace to a place tormented by an unresolved past",
  },
  {
    value: "competition-tournament",
    label: "Competition Or Tournament",
    prompt:
      "competition or tournament - the party competes in a high-stakes contest with hidden dangers",
  },
  {
    value: "rebellion-support",
    label: "Rebellion Support",
    prompt:
      "rebellion support - the party aids an uprising against an oppressive power",
  },
  {
    value: "escort-protection",
    label: "Escort Or Protection",
    prompt:
      "escort or protection - the party must safely guide someone or something through danger",
  },
] as const satisfies readonly NarrativeOption[];

export const EMOTIONAL_TONE_OPTIONS = [
  {
    value: "grim-foreboding",
    label: "Grim And Foreboding",
    prompt:
      "grim and foreboding - a world where hope is scarce and danger lurks in every shadow",
  },
  {
    value: "hopeful-heroic",
    label: "Hopeful And Heroic",
    prompt:
      "hopeful and heroic - ordinary people rising to become heroes against overwhelming odds",
  },
  {
    value: "dark-comedy",
    label: "Dark Comedy",
    prompt:
      "dark comedy - absurd situations with real consequences, levity threading through danger",
  },
  {
    value: "tragic-melancholic",
    label: "Tragic And Melancholic",
    prompt:
      "tragic and melancholic - a story shaped by loss, sacrifice and bittersweet outcomes",
  },
  {
    value: "mysterious-unsettling",
    label: "Mysterious And Unsettling",
    prompt:
      "mysterious and unsettling - something is deeply wrong and the truth is stranger than expected",
  },
  {
    value: "epic-grand",
    label: "Epic And Grand",
    prompt:
      "epic and grand - world-shaking stakes, legendary deeds and the weight of history",
  },
  {
    value: "tense-paranoid",
    label: "Tense And Paranoid",
    prompt:
      "tense and paranoid - trust is scarce, betrayal is possible and danger wears a friendly face",
  },
  {
    value: "whimsical-fantastical",
    label: "Whimsical And Fantastical",
    prompt:
      "whimsical and fantastical - strange magic, unusual creatures and genuine wonder",
  },
  {
    value: "gritty-grounded",
    label: "Gritty And Grounded",
    prompt:
      "gritty and grounded - harsh realities, human cost and moral complexity without easy answers",
  },
  {
    value: "dreamlike-surreal",
    label: "Dreamlike And Surreal",
    prompt:
      "dreamlike and surreal - shifting reality, unreliable perception and impossible things",
  },
] as const satisfies readonly NarrativeOption[];

export const GAMEPLAY_THEME_OPTIONS = [
  {
    value: "exploration-focused",
    label: "Exploration-Focused",
    prompt:
      "exploration-focused - discovering hidden places, environmental secrets and world-building through space",
  },
  {
    value: "social-intrigue",
    label: "Social Intrigue",
    prompt:
      "social intrigue - NPC relationships, information extraction and political maneuvering",
  },
  {
    value: "puzzle-solving",
    label: "Puzzle-Solving",
    prompt:
      "puzzle-solving - environmental and intellectual challenges that reward creative thinking",
  },
  {
    value: "tactical-combat",
    label: "Tactical Combat",
    prompt:
      "tactical combat - strategic encounters with positioning, terrain and unexpected complications",
  },
  {
    value: "investigation",
    label: "Investigation",
    prompt:
      "investigation - gathering clues, following leads and piecing together hidden truths",
  },
  {
    value: "moral-dilemmas",
    label: "Moral Dilemmas",
    prompt:
      "moral dilemmas - hard choices without clear right answers and meaningful consequences for each",
  },
  {
    value: "stealth-deception",
    label: "Stealth And Deception",
    prompt:
      "stealth and deception - infiltration, disguise and avoiding direct confrontation",
  },
  {
    value: "time-pressure",
    label: "Time Pressure",
    prompt:
      "time pressure - a ticking clock where every choice consumes a limited resource",
  },
  {
    value: "resource-scarcity",
    label: "Resource Scarcity",
    prompt:
      "resource scarcity - survival under pressure with limited supplies and environmental threats",
  },
  {
    value: "negotiation-diplomacy",
    label: "Negotiation And Diplomacy",
    prompt:
      "negotiation and diplomacy - resolving conflict through words, deals and difficult compromise",
  },
] as const satisfies readonly NarrativeOption[];

export const NARRATIVE_PACING_OPTIONS = [
  {
    value: "slow-burn",
    label: "Slow-Burn",
    prompt:
      "slow-burn - a quiet, eerie opening that gradually builds to an explosive climax",
  },
  {
    value: "fast-paced",
    label: "Fast-Paced",
    prompt:
      "fast-paced - immediate action from the start, constant pressure with no time to breathe",
  },
  {
    value: "escalating-dread",
    label: "Escalating Dread",
    prompt:
      "escalating dread - a calm beginning that becomes increasingly desperate as the truth emerges",
  },
  {
    value: "peaks-valleys",
    label: "Peaks And Valleys",
    prompt:
      "peaks and valleys - intense moments alternating with brief recovery and discovery",
  },
  {
    value: "flashpoint-structure",
    label: "Flashpoint Structure",
    prompt:
      "flashpoint structure - explosive opening incident, followed by investigation and final confrontation",
  },
  {
    value: "single-act-crisis",
    label: "Single-Act Crisis",
    prompt:
      "single-act crisis - one continuous emergency that forces constant improvisation and adaptation",
  },
  {
    value: "three-act-tension-arc",
    label: "Three-Act Tension Arc",
    prompt:
      "three-act tension arc - setup establishing stakes, rising conflict, climactic confrontation",
  },
] as const satisfies readonly NarrativeOption[];

export type NarrativeArchetype =
  (typeof NARRATIVE_ARCHETYPE_OPTIONS)[number]["value"];
export type EmotionalTone = (typeof EMOTIONAL_TONE_OPTIONS)[number]["value"];
export type GameplayTheme = (typeof GAMEPLAY_THEME_OPTIONS)[number]["value"];
export type NarrativePacing =
  (typeof NARRATIVE_PACING_OPTIONS)[number]["value"];

export const SETTINGS = [
  "Forest",
  "Dungeon",
  "City",
  "Village",
  "Castle",
  "Ruins",
  "Mountain",
  "Swamp",
  "Desert",
  "Island",
  "Underdark",
  "Other",
] as const;

export const RACES = [
  "Dragonborn",
  "Dwarf",
  "Elf",
  "Gnome",
  "Half-Elf",
  "Half-Orc",
  "Halfling",
  "Human",
  "Tiefling",
] as const;

export const CLASSES = [
  "Artificer",
  "Barbarian",
  "Bard",
  "Cleric",
  "Druid",
  "Fighter",
  "Monk",
  "Paladin",
  "Ranger",
  "Rogue",
  "Sorcerer",
  "Warlock",
  "Wizard",
] as const;

export const SESSION_LENGTHS = ["Short", "Medium", "Long"] as const;

export type SessionLength = (typeof SESSION_LENGTHS)[number];

export const ENCOUNTER_COUNT_BY_SESSION_LENGTH: Record<SessionLength, number> =
  {
    Short: 2,
    Medium: 3,
    Long: 5,
  };

export const PARTY_SIZES = ["1", "2", "3", "4", "5", "6"] as const;

export const LEVELS = ["1", "2", "3", "4", "5"] as const;
