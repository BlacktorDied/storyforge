"use client";

import { useEffect, useState } from "react";

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
    <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <div>
          <h1 className="text-lg font-bold text-text">StoryForge</h1>
          <p className="text-xs text-muted">
            Generate structured tabletop RPG adventures.
          </p>
        </div>

        <div className="w-40">
          <label className="text-text block text-sm font-semibold">Theme</label>
          <select
            value={themeMode}
            onChange={(e) => setThemeMode(e.target.value as ThemeMode)}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
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
