"use client";

import { useEffect, useState } from "react";

export type ThemeMode = "system" | "light" | "dark";

export function useTheme() {
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

  return { themeMode, setThemeMode };
}
