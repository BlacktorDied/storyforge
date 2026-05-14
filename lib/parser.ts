import type { ParsedStory } from "@/lib/types";

function extractSection(
  markdown: string,
  startHeader: string,
  endHeader?: string,
): string {
  // Match text after a specific "## Header".
  // If endHeader is provided, stop before the next "## End Header".
  // [\s\S] is used instead of "." so the match also includes line breaks.
  // *? makes the match non-greedy, so it stops at the first matching end header.
  const pattern = endHeader
    ? new RegExp(`## ${startHeader}([\\s\\S]*?)## ${endHeader}`)
    : new RegExp(`## ${startHeader}([\\s\\S]*)`);

  return markdown.match(pattern)?.[1]?.trim() || "";
}

function extractField(block: string, field: string): string {
  // Match one markdown list field, for example "- Name: Aria".
  // \s* allows optional spaces after the colon.
  // (.*) captures the rest of that line as the field value.
  return block.match(new RegExp(`${field}:\\s*(.*)`))?.[1]?.trim() || "";
}

export function parseStory(markdown: string): ParsedStory {
  // Match the first top-level markdown title: "# Title".
  const title = markdown.match(/^# (.*)/)?.[1]?.trim() || "";

  const setting = extractSection(markdown, "Setting", "Background");
  const background = extractSection(markdown, "Background", "Adventure Hook");
  const adventureHook = extractSection(
    markdown,
    "Adventure Hook",
    "Main Quest",
  );
  const mainQuest = extractSection(markdown, "Main Quest", "Key Encounters");
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
    // Capture everything after "Description:", including multiple lines.
    description: block.match(/Description:\s*([\s\S]*)/)?.[1]?.trim() || "",
  }));

  return {
    title,
    setting,
    background,
    adventureHook,
    mainQuest,
    encounters,
    npcs,
  };
}
