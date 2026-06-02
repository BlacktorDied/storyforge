import jsPDF from "jspdf";

import type { ParsedEncounter, ParsedStory } from "./types";

// =========================================================================
// Types
// =========================================================================

type RGB = [number, number, number];

type FontStyle = "normal" | "bold" | "italic" | "bolditalic";

type RenderState = {
  doc: jsPDF;
  y: number;
};

type CardSection = {
  text: string;
  size: number;
  bold?: boolean;
  muted?: boolean;
};

type CardOptions = {
  sections: CardSection[];
};

// =========================================================================
// Layout
// =========================================================================

const MARGIN = 20;

const PAGE_W = 210;
const PAGE_H = 297;
const CONTENT_W = PAGE_W - MARGIN * 2;

const CARD_PAD_X = 5;
const CARD_PAD_Y = 4;
const CARD_W = CONTENT_W - CARD_PAD_X * 2;

// =========================================================================
// Spacing
// =========================================================================

const SPACE = {
  xs: 1,
  sm: 2,
  md: 4,
  lg: 6,
  xl: 10,
} as const;

// =========================================================================
// Typography
// =========================================================================

const FONT = {
  family: "helvetica",

  size: {
    sm: 9,
    md: 10,
    lg: 11,
    xl: 14,
    title: 22,
  },

  style: {
    normal: "normal" as FontStyle,
    bold: "bold" as FontStyle,
    italic: "italic" as FontStyle,
    boldItalic: "bolditalic" as FontStyle,
  },

  color: {
    primary: [30, 30, 30] as RGB,
    muted: [120, 120, 120] as RGB,
    border: [180, 180, 180] as RGB,
  },
} as const;

// =========================================================================
// Helpers
// =========================================================================

function getLineH(size: number): number {
  // 1pt = 0.3528mm
  // 1.2 = line spacing multiplier
  return size * 0.3528 * 1.2;
}

function checkPage(s: RenderState, neededH: number): void {
  if (s.y + neededH > PAGE_H - MARGIN) {
    s.doc.addPage();
    s.y = MARGIN;
  }
}

// =========================================================================
// Measuring
// =========================================================================

function measureTextH(
  s: RenderState,
  text: string,
  size: number,
  bold: boolean,
  maxW: number,
): number {
  s.doc.setFontSize(size);
  s.doc.setFont(FONT.family, bold ? FONT.style.bold : FONT.style.normal);
  const lines = s.doc.splitTextToSize(text, maxW);

  return lines.length * getLineH(size);
}

// =========================================================================
// Drawing
// =========================================================================

function drawText(
  s: RenderState,
  text: string,
  size: number,
  bold: boolean,
  muted: boolean,
  x: number,
  maxW: number,
): void {
  s.doc.setFontSize(size);
  s.doc.setFont(FONT.family, bold ? FONT.style.bold : FONT.style.normal);
  s.doc.setTextColor(...(muted ? FONT.color.muted : FONT.color.primary));
  const lines = s.doc.splitTextToSize(text, maxW);

  s.doc.text(lines, x, s.y);

  s.y += lines.length * getLineH(size);
}

function drawCardBorder(s: RenderState, height: number): void {
  s.doc.setDrawColor(...FONT.color.border);
  s.doc.setLineWidth(0.3);
  s.doc.rect(MARGIN, s.y, CONTENT_W, height);
}

// =========================================================================
// Card Component
// =========================================================================

function drawCard(s: RenderState, options: CardOptions): void {
  let contentH = 0;

  for (const section of options.sections) {
    contentH += measureTextH(
      s,
      section.text,
      section.size,
      section.bold ?? false,
      CARD_W,
    );

    contentH += SPACE.sm;
  }

  const cardH = CARD_PAD_Y * 2 + contentH;

  checkPage(s, cardH + SPACE.md);

  const startY = s.y;

  drawCardBorder(s, cardH);

  s.y += CARD_PAD_Y;

  for (const section of options.sections) {
    drawText(
      s,
      section.text,
      section.size,
      section.bold ?? false,
      section.muted ?? false,
      MARGIN + CARD_PAD_X,
      CARD_W,
    );

    s.y += SPACE.sm;
  }

  s.y = startY + cardH + SPACE.md;
}

// =========================================================================
// Sections
// =========================================================================

function drawSectionTitle(s: RenderState, title: string): void {
  s.y += SPACE.lg;

  const h = getLineH(FONT.size.xl);

  checkPage(s, h + SPACE.sm);

  s.doc.setFontSize(FONT.size.xl);
  s.doc.setFont(FONT.family, FONT.style.bold);
  s.doc.setTextColor(...FONT.color.primary);
  s.doc.text(title, MARGIN, s.y);
  s.y += h + SPACE.sm;
}

function drawBodyText(s: RenderState, text: string): void {
  const h = measureTextH(s, text, FONT.size.md, false, CONTENT_W);

  checkPage(s, h);

  drawText(s, text, FONT.size.md, false, false, MARGIN, CONTENT_W);
}

// =========================================================================
// Export
// =========================================================================

function getEncounterDetailSections(encounter: ParsedEncounter): CardSection[] {
  const sections: CardSection[] = [];

  if (encounter.checks.length > 0) {
    sections.push({
      text:
        "Checks\n" +
        encounter.checks
          .map((check) => {
            const label = [
              check.type,
              check.ability,
              check.skillOrTool ? `(${check.skillOrTool})` : "",
              `DC ${check.dc}`,
            ]
              .filter(Boolean)
              .join(" ");

            return `${label}: ${check.purpose}\nSuccess: ${check.success}\nFailure: ${check.failure}`;
          })
          .join("\n\n"),
      size: FONT.size.md,
    });
  }

  if (encounter.creatures.length > 0) {
    sections.push({
      text:
        "Creatures / Stat Blocks\n" +
        encounter.creatures
          .map(
            (creature) =>
              `${creature.quantity} x ${creature.name} - ${creature.role}\nTrigger: ${creature.combatTrigger}\nGoal: ${creature.goal}`,
          )
          .join("\n\n"),
      size: FONT.size.md,
    });
  }

  if (encounter.puzzle) {
    sections.push({
      text:
        `Puzzle: ${encounter.puzzle.type}\n` +
        `${encounter.puzzle.prompt}\n` +
        `Answer: ${encounter.puzzle.answer}\n` +
        `Hints: ${encounter.puzzle.hints.join("; ")}\n` +
        `Alternate solutions: ${encounter.puzzle.alternateSolutions.join("; ")}`,
      size: FONT.size.md,
    });
  }

  return sections;
}

export function exportStoryToPdf(story: ParsedStory): void {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const s: RenderState = { doc, y: MARGIN };

  // =========================================================================
  // Branding
  // =========================================================================

  doc.setFontSize(FONT.size.sm);
  doc.setFont(FONT.family, FONT.style.normal);
  doc.setTextColor(...FONT.color.muted);
  doc.text("StoryForge – Generated Adventure", MARGIN, s.y);

  s.y += getLineH(FONT.size.sm) + SPACE.md;

  // =========================================================================
  // Title
  // =========================================================================

  doc.setFontSize(FONT.size.title);
  doc.setFont(FONT.family, FONT.style.bold);
  doc.setTextColor(...FONT.color.primary);
  doc.text(story.title, MARGIN, s.y);

  s.y += getLineH(FONT.size.title) + SPACE.lg;

  // =========================================================================
  // Story Sections
  // =========================================================================

  drawSectionTitle(s, "Setting");
  drawBodyText(s, story.setting);

  drawSectionTitle(s, "Background");
  drawBodyText(s, story.background);

  drawSectionTitle(s, "Adventure Hook");
  drawBodyText(s, story.adventureHook);

  drawSectionTitle(s, "Main Quest");
  drawBodyText(s, story.mainQuest);

  // =========================================================================
  // Encounters
  // =========================================================================

  if (story.encounters.length > 0) {
    drawSectionTitle(s, "Encounters");

    story.encounters.forEach((encounter, index) => {
      drawCard(s, {
        sections: [
          {
            text: `${index + 1}. ${encounter.title}`,
            size: FONT.size.lg,
            bold: true,
          },
          {
            text: encounter.content,
            size: FONT.size.md,
          },
          ...getEncounterDetailSections(encounter),
        ],
      });
    });
  }

  // =========================================================================
  // NPCs
  // =========================================================================

  if (story.npcs.length > 0) {
    drawSectionTitle(s, "Non-Player Characters");

    story.npcs.forEach((npc) => {
      const raceLine = [npc.race, npc.class].filter(Boolean).join(" / ");

      const sections: CardSection[] = [
        {
          text: `${npc.name} — ${npc.role}`,
          size: FONT.size.lg,
          bold: true,
        },
      ];

      if (raceLine) {
        sections.push({
          text: raceLine,
          size: FONT.size.sm,
          muted: true,
        });
      }

      if (npc.location) {
        sections.push({
          text: `Location: ${npc.location}`,
          size: FONT.size.md,
        });
      }

      if (npc.motivation) {
        sections.push({
          text: `Motivation: ${npc.motivation}`,
          size: FONT.size.md,
        });
      }

      if (npc.description) {
        sections.push({
          text: npc.description,
          size: FONT.size.md,
        });
      }

      drawCard(s, { sections });
    });
  }

  // =========================================================================
  // Save
  // =========================================================================

  const safeTitle = story.title.replace(/[^a-z0-9]/gi, "_").toLowerCase();

  doc.save(`${safeTitle}.pdf`);
}
