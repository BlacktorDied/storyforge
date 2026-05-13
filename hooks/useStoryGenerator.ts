"use client";

import { useEffect, useState } from "react";

import { GENRES, LENGTHS, SETTINGS } from "@/lib/data";
import { MOCK_RESULT, USE_MOCK } from "@/lib/mockStory";
import { parseStory, type ParsedStory } from "@/lib/parser";

export function useStoryGenerator() {
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

  const [genreError, setGenreError] = useState("");
  const [settingError, setSettingError] = useState("");

  const [loading, setLoading] = useState(false);
  const [parsed, setParsed] = useState<ParsedStory | null>(null);

  useEffect(() => {
    if (!parsed) return;

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [parsed]);

  const handleGenerate = async () => {
    setParsed(null);
    setLoading(true);

    const finalGenre = genre === "Other" ? customGenre.trim() : genre;

    const finalSetting = setting === "Other" ? customSetting.trim() : setting;

    setGenreError("");
    setSettingError("");

    if (genre === "Other" && finalGenre === "") {
      setGenreError("Please enter a custom genre.");
      setLoading(false);
      return;
    }

    if (setting === "Other" && finalSetting === "") {
      setSettingError("Please enter a custom setting.");
      setLoading(false);
      return;
    }

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

  return {
    parsed,
    loading,
    length,

    handleGenerate,
    handleCopy,

    formProps: {
      genre,
      setGenre,

      customGenre,
      setCustomGenre,

      setting,
      setSetting,

      customSetting,
      setCustomSetting,

      raceMode,
      setRaceMode,

      selectedRaces,
      setSelectedRaces,

      classMode,
      setClassMode,

      selectedClasses,
      setSelectedClasses,

      length,
      setLength,

      partySize,
      setPartySize,

      level,
      setLevel,

      genreError,
      clearGenreError: () => setGenreError(""),

      settingError,
      clearSettingError: () => setSettingError(""),

      loading,

      onGenerate: handleGenerate,
    },
  };
}
