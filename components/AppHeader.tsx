"use client";

import { useEffect, useState } from "react";

import { getInputClass } from "./inputStyles";
import StoryForgeIcon from "./icons/StoryForgeIcon";

type ThemeMode = "system" | "light" | "dark";

export default function AppHeader() {
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");

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

  return (
    <header className="border-border bg-background/90 sticky top-0 z-10 border-b backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <StoryForgeIcon className="text-text size-8" />
          <div>
            <h1 className="text-text text-lg font-bold">StoryForge</h1>
            <p className="text-muted text-xs">
              Generate structured tabletop RPG adventures.
            </p>
          </div>
        </div>

        <div className="w-40">
          <label className="text-text block text-sm font-semibold">Theme</label>
          <select
            value={themeMode}
            onChange={(e) => setThemeMode(e.target.value as ThemeMode)}
            className={getInputClass()}
          >
            <option value="system">Match system</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>
    </header>
  );
}
