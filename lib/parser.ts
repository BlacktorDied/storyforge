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
  hook: string;
  quest: string;
  encounters: ParsedEncounter[];
  npcs: ParsedNpc[];
};

function extractSection(
  markdown: string,
  startHeader: string,
  endHeader?: string,
) {
  const pattern = endHeader
    ? new RegExp(`## ${startHeader}([\\s\\S]*?)## ${endHeader}`)
    : new RegExp(`## ${startHeader}([\\s\\S]*)`);

  return markdown.match(pattern)?.[1]?.trim() || "";
}

function extractField(block: string, field: string) {
  return block.match(new RegExp(`${field}:\\s*(.*)`))?.[1]?.trim() || "";
}

export function parseStory(markdown: string): ParsedStory {
  const title = markdown.match(/^# (.*)/)?.[1]?.trim() || "";

  const setting = extractSection(markdown, "Setting", "Background");
  const background = extractSection(markdown, "Background", "Adventure Hook");
  const hook = extractSection(markdown, "Adventure Hook", "Main Quest");
  const quest = extractSection(markdown, "Main Quest", "Key Encounters");
  const encountersRaw = extractSection(markdown, "Key Encounters", "NPCs");
  const npcsRaw = extractSection(markdown, "NPCs");

  const encounterBlocks = encountersRaw
    .split("###")
    .slice(1)
    .map((block) => block.trim());

  const encounters = encounterBlocks.map((block) => {
    const lines = block.split("\n");
    const title = lines[0]?.trim() || "Encounter";
    const content = lines.slice(1).join("\n").trim();

    return {
      title,
      content,
    };
  });

  const npcBlocks = npcsRaw
    .split("###")
    .slice(1)
    .map((block) => block.trim());

  const npcs = npcBlocks.map((block) => ({
    name: extractField(block, "Name"),
    race: extractField(block, "Race"),
    class: extractField(block, "Class"),
    role: extractField(block, "Role in story"),
    location: extractField(block, "Location"),
    motivation: extractField(block, "Motivation"),
    description: block.match(/Description:\s*([\s\S]*)/)?.[1]?.trim() || "",
  }));

  return {
    title,
    setting,
    background,
    hook,
    quest,
    encounters,
    npcs,
  };
}
