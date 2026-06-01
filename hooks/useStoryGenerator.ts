"use client";

import { useEffect, useState } from "react";

import {
  GENRES,
  SESSION_LENGTHS,
  SETTINGS,
  type SessionLength,
} from "@/lib/data";
import {
  getFirstGenerationErrorField,
  getGenerationFormErrors,
} from "@/lib/generationValidation";
import { MOCK_RESULT, USE_MOCK } from "@/lib/mockStory";
import { parseStory } from "@/lib/parser";
import type { ParsedStory, SelectionMode } from "@/lib/types";

export function useStoryGenerator() {
  // =========================================================================
  // Form State
  // =========================================================================

  const [genre, setGenre] = useState<string>(GENRES[0]);
  const [customGenre, setCustomGenre] = useState("");

  const [setting, setSetting] = useState<string>(SETTINGS[0]);
  const [customSetting, setCustomSetting] = useState("");

  const [sessionLength, setSessionLength] = useState<SessionLength>(
    SESSION_LENGTHS[0],
  );
  const [partySize, setPartySize] = useState<string>("4");
  const [level, setLevel] = useState<string>("1");

  // =========================================================================
  // Selection State
  // =========================================================================

  const [raceMode, setRaceMode] = useState<SelectionMode>("all");
  const [selectedRaces, setSelectedRaces] = useState<string[]>([]);

  const [classMode, setClassMode] = useState<SelectionMode>("all");
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

  // =========================================================================
  // Validation State
  // =========================================================================

  const [genreTouched, setGenreTouched] = useState(false);
  const [settingTouched, setSettingTouched] = useState(false);
  const [raceTouched, setRaceTouched] = useState(false);
  const [classTouched, setClassTouched] = useState(false);

  const formErrors = getGenerationFormErrors({
    genre,
    customGenre,
    setting,
    customSetting,
    raceMode,
    selectedRaces,
    classMode,
    selectedClasses,
  });

  const genreError = genreTouched ? formErrors.genreError : null;
  const settingError = settingTouched ? formErrors.settingError : null;
  const raceError = raceTouched ? formErrors.raceError : null;
  const classError = classTouched ? formErrors.classError : null;

  // =========================================================================
  // UI State
  // =========================================================================

  const [loading, setLoading] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");

  // =========================================================================
  // Generated Story State
  // =========================================================================

  const [parsed, setParsed] = useState<ParsedStory | null>(null);

  // =========================================================================
  // Effects
  // =========================================================================

  useEffect(() => {
    if (!parsed) return;

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [parsed]);

  // =========================================================================
  // Helpers
  // =========================================================================

  const scrollToField = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  // =========================================================================
  // Handlers
  // =========================================================================

  const handleGenerate = async () => {
    setParsed(null);
    setLoading(true);

    setGenreTouched(true);
    setSettingTouched(true);
    setRaceTouched(true);
    setClassTouched(true);

    const finalGenre = genre === "Other" ? customGenre.trim() : genre;
    const finalSetting = setting === "Other" ? customSetting.trim() : setting;

    const currentFormErrors = getGenerationFormErrors({
      genre,
      customGenre,
      setting,
      customSetting,
      raceMode,
      selectedRaces,
      classMode,
      selectedClasses,
    });

    const firstErrorField = getFirstGenerationErrorField(currentFormErrors);

    if (firstErrorField) {
      setLoading(false);
      scrollToField(firstErrorField);
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
        sessionLength,
        partySize,
        level,
      }),
    });

    try {
      const data = await res.json();
      const parsedData = parseStory(data.result);

      setParsed(parsedData);
    } catch {
      alert("Failed to parse generated story.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!parsed) return;
    const { exportStoryToPdf } = await import("@/lib/pdfExport");
    exportStoryToPdf(parsed);
  };

  const handleCopy = async () => {
    const element = document.getElementById("print-area");

    if (!element) return;

    try {
      await navigator.clipboard.writeText(element.innerText);

      setCopyStatus("copied");

      window.setTimeout(() => {
        setCopyStatus("idle");
      }, 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  // =========================================================================
  // Public API
  // =========================================================================

  return {
    parsed,
    loading,
    sessionLength,

    handleGenerate,
    handleCopy,
    handleDownloadPdf,
    copyStatus,
    onStoryChange: (story: ParsedStory) => setParsed(story),

    formProps: {
      genre,
      onGenreChange: setGenre,
      customGenre,
      onCustomGenreChange: setCustomGenre,
      genreError,
      onGenreTouch: () => setGenreTouched(true),
      onGenreValidationReset: () => {
        setGenreTouched(false);
      },

      setting,
      onSettingChange: setSetting,
      customSetting,
      onCustomSettingChange: setCustomSetting,
      settingError,
      onSettingTouch: () => setSettingTouched(true),
      onSettingValidationReset: () => {
        setSettingTouched(false);
      },

      raceMode,
      onRaceModeChange: setRaceMode,
      selectedRaces,
      onSelectedRacesChange: setSelectedRaces,
      raceError,
      onRaceTouch: () => setRaceTouched(true),
      onRaceValidationReset: () => {
        setRaceTouched(false);
      },

      classMode,
      onClassModeChange: setClassMode,
      selectedClasses,
      onSelectedClassesChange: setSelectedClasses,
      classError,
      onClassTouch: () => setClassTouched(true),
      onClassValidationReset: () => {
        setClassTouched(false);
      },

      sessionLength,
      onSessionLengthChange: setSessionLength,

      partySize,
      onPartySizeChange: setPartySize,

      level,
      onLevelChange: setLevel,

      loading,
      onGenerate: handleGenerate,
    },
  };
}
