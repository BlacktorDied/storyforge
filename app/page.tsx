"use client";

import { useEffect, useState } from "react";
import MultiSelectWithMode from "@/components/MultiSelectWithMode";
import SelectWithCustomOption from "@/components/SelectWithCustomOption";
import {
  GENRES,
  LENGTHS,
  SETTINGS,
  RACES,
  CLASSES,
  PARTY_SIZES,
  LEVELS,
} from "@/lib/data";
import { parseStory, type ParsedStory } from "@/lib/parser";
import InfoTooltip from "@/components/InfoTooltip";
import StorySkeleton from "@/components/StorySkeleton";

type ThemeMode = "system" | "light" | "dark";

const selectClassName =
  "mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

const cardClassName = "rounded border border-border bg-surface p-3 print-card";

export default function Home() {
  const [genre, setGenre] = useState(GENRES[0]);
  const [customGenre, setCustomGenre] = useState("");

  const [setting, setSetting] = useState(SETTINGS[0]);
  const [customSetting, setCustomSetting] = useState("");

  const [raceMode, setRaceMode] = useState<"all" | "custom">("all");
  const [selectedRaces, setSelectedRaces] = useState<string[]>([]);

  const [classMode, setClassMode] = useState<"all" | "custom">("all");
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

  const [length, setLength] = useState(LENGTHS[0]);
  const [partySize, setPartySize] = useState("4");
  const [level, setLevel] = useState("1");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [parsed, setParsed] = useState<ParsedStory | null>(null);

  const [themeMode, setThemeMode] = useState<ThemeMode>("system");

  useEffect(() => {
    if (!parsed) return;

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [parsed]);

  useEffect(() => {
    if (result) {
      console.log("Unparsed Text:", result);
    }
  }, [result]);

  useEffect(() => {
    const applyTheme = () => {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;

      const shouldUseDark =
        themeMode === "dark" || (themeMode === "system" && prefersDark);

      document.documentElement.classList.toggle("dark", shouldUseDark);
    };

    applyTheme();

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", applyTheme);

    return () => {
      mediaQuery.removeEventListener("change", applyTheme);
    };
  }, [themeMode]);

  const MOCK_RESULT = `
# Test Adventure

## Setting
Test setting text.

## Background
Test background text.

## Adventure Hook
Test hook text.

## Main Quest
Test quest text.

## Key Encounters

### Encounter 1: Test Encounter
Test encounter content.

### Encounter 2: Final Test Encounter
Test final encounter content.

## NPCs

### NPC
- Name: Test NPC
- Race: Human
- Class: Fighter
- Role in story: Test role
- Location: Test location
- Motivation: Test motivation
- Description: Test description
`;

  const USE_MOCK = true;

  const handleGenerate = async () => {
    setParsed(null);
    setResult("");
    setLoading(true);

    const finalGenre =
      genre === "Other" && customGenre.trim() !== "" ? customGenre : genre;

    const finalSetting =
      setting === "Other" && customSetting.trim() !== ""
        ? customSetting
        : setting;

    if (raceMode === "custom" && selectedRaces.length === 0) {
      alert("Please select at least one race");
      setLoading(false);
      return;
    }

    if (classMode === "custom" && selectedClasses.length === 0) {
      alert("Please select at least one class");
      setLoading(false);
      return;
    }

    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const parsedData = parseStory(MOCK_RESULT);

      setResult(MOCK_RESULT);
      setParsed(parsedData);
      setLoading(false);
      return;
    }

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        genre: finalGenre,
        setting: finalSetting,
        races: raceMode === "all" ? null : selectedRaces,
        classes: classMode === "all" ? null : selectedClasses,
        length,
        partySize,
        level,
      }),
    });

    const data = await res.json();

    const parsedData = parseStory(data.result);

    setResult(data.result);
    setParsed(parsedData);
    setLoading(false);
  };

  const handleCopy = async () => {
    const element = document.getElementById("print-area");

    if (!element) return;

    try {
      await navigator.clipboard.writeText(element.innerText);
      alert("Copied to clipboard!");
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text">
      <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-bold">StoryForge</h1>
            <p className="text-sm text-muted">
              Generate structured D&D one-shot adventures.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div>
              <label className="block font-semibold">Theme</label>
              <select
                value={themeMode}
                onChange={(e) => setThemeMode(e.target.value as ThemeMode)}
                className={selectClassName}
              >
                <option value="system">Match system</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            {/* Copy/Download buttons */}
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 p-6 lg:grid-cols-[360px_1fr]">
        {parsed && !loading && (
          <div className="fixed top-30 right-2">
            <button
              className="border select-none border-border bg-surface px-4 py-2 text-sm font-medium text-text shadow-sm transition hover:bg-background rounded-l-lg"
              onClick={handleCopy}
            >
              Copy
            </button>
            <button
              className="border select-none border-border bg-surface px-4 py-2 text-sm font-medium text-text shadow-sm transition hover:bg-background rounded-r-lg"
              onClick={() => window.print()}
            >
              Download
            </button>
          </div>
        )}

        <aside className="space-y-4">
          <SelectWithCustomOption
            label="Genre"
            options={GENRES}
            value={genre}
            setValue={setGenre}
            customValue={customGenre}
            setCustomValue={setCustomGenre}
          />

          <SelectWithCustomOption
            label="Setting"
            options={SETTINGS}
            value={setting}
            setValue={setSetting}
            customValue={customSetting}
            setCustomValue={setCustomSetting}
          />

          <MultiSelectWithMode
            label="Allowed Races"
            options={RACES}
            mode={raceMode}
            setMode={setRaceMode}
            selected={selectedRaces}
            setSelected={setSelectedRaces}
            allDescription="Use all core D&D 5e races from the 2014 Player’s Handbook."
          />

          <MultiSelectWithMode
            label="Allowed Classes"
            options={CLASSES}
            mode={classMode}
            setMode={setClassMode}
            selected={selectedClasses}
            setSelected={setSelectedClasses}
            allDescription="Use all classic D&D 5e classes from the 2014 Player’s Handbook."
          />

          <div>
            <div>
              <label className="font-semibold">Session Length</label>
              <InfoTooltip
                text={`
Short: 2 encounters
Medium: 3 encounters
Long: 5 encounters
`}
              />
            </div>
            <select
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className={selectClassName}
            >
              {LENGTHS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold">Party Size</label>
            <select
              value={partySize}
              onChange={(e) => setPartySize(e.target.value)}
              className={selectClassName}
            >
              {PARTY_SIZES.map((p) => (
                <option key={p} value={p}>
                  {p} players
                </option>
              ))}
            </select>
          </div>

          <div>
            <div>
              <label className="font-semibold">Character Level</label>
              <InfoTooltip text="Recommended level for the player character." />
            </div>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className={selectClassName}
            >
              {LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  Level {lvl}
                </option>
              ))}
            </select>
          </div>

          <button
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading && (
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            )}

            {loading ? "Generating..." : "Generate"}
          </button>
        </aside>

        <main>
          {loading && <StorySkeleton length={length} />}

          <div id="print-area" className="mt-6 w-full">
            {parsed && (
              <div className="mt-6 space-y-6">
                <h2 className="text-xl font-bold">{parsed.title}</h2>

                <section>
                  <h3 className="font-semibold">Setting</h3>
                  <p>{parsed.setting}</p>
                </section>

                <section>
                  <h3 className="font-semibold">Background</h3>
                  <p>{parsed.background}</p>
                </section>

                <section>
                  <h3 className="font-semibold">Adventure Hook</h3>
                  <p>{parsed.hook}</p>
                </section>

                <section>
                  <h3 className="font-semibold">Main Quest</h3>
                  <p>{parsed.quest}</p>
                </section>

                <section>
                  <h3 className="font-semibold">Key Encounters</h3>
                  <div className="space-y-3">
                    {parsed.encounters.map((encounter, i) => (
                      <div key={i} className={cardClassName}>
                        <h4 className="font-semibold">{encounter.title}</h4>
                        <p>{encounter.content}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="font-semibold">NPCs</h3>
                  <div className="space-y-3">
                    {parsed.npcs.map((npc, i) => (
                      <div key={i} className={cardClassName}>
                        <h4 className="font-semibold">{npc.name}</h4>
                        <p>
                          {npc.race} — {npc.class}
                        </p>
                        <p>
                          <strong>Role:</strong> {npc.role}
                        </p>
                        <p>
                          <strong>Location:</strong> {npc.location}
                        </p>
                        <p>
                          <strong>Motivation:</strong> {npc.motivation}
                        </p>
                        <p>{npc.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </div>
        </main>

        <span className="fixed bottom-2 right-2 text-xs text-muted opacity-70">
          v{process.env.NEXT_PUBLIC_APP_VERSION}
        </span>
      </div>
    </div>
  );
}
