export type SelectionMode = "all" | "custom";

export type ParsedNpc = {
  name: string;
  race: string;
  class: string;
  role: string;
  location: string;
  motivation: string;
  description: string;
};

export type ParsedEncounter = {
  title: string;
  content: string;
};

export type ParsedStory = {
  title: string;
  setting: string;
  background: string;
  adventureHook: string;
  mainQuest: string;
  encounters: ParsedEncounter[];
  npcs: ParsedNpc[];
};
