export const GENRES = [
  "Fantasy",
  "High Fantasy",
  "Dark Fantasy",
  "Adventure",
  "Mystery",
  "Horror",
  "Comedy",
  "Political Intrigue",
  "Exploration",
  "Survival",
  "Other",
] as const;

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
