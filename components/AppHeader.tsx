"use client";

import StoryForgeIcon from "./icons/StoryForgeIcon";
import SelectField from "./ui/SelectField";
import { useTheme, type ThemeMode } from "@/hooks/useTheme";

export default function AppHeader() {
  const { themeMode, setThemeMode } = useTheme();

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
          <SelectField
            value={themeMode}
            onChange={(e) => setThemeMode(e.target.value as ThemeMode)}
          >
            <option value="system">Match system</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </SelectField>
        </div>
      </div>
    </header>
  );
}
