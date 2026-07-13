"use client";

import { type ThemeMode, useTheme } from "@/hooks/useTheme";
import StoryForgeIcon from "./icons/StoryForgeIcon";
import SelectField from "./ui/SelectField";

export default function AppHeader() {
  const { themeMode, setThemeMode } = useTheme();

  return (
    <header className="sticky top-0 z-10 border-border border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <StoryForgeIcon className="size-8 text-text" />
          <div>
            <h1 className="font-bold text-lg text-text">StoryForge</h1>
            <p className="text-muted text-xs">
              Generate structured tabletop RPG adventures.
            </p>
          </div>
        </div>

        <div className="w-40">
          <label className="block font-semibold text-sm text-text">Theme</label>
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
