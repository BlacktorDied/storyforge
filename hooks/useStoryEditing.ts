"use client";

import { useState } from "react";

import {
  applyStoryEdit,
  type StoryListField,
  type StoryTextField,
} from "@/lib/storyEditing";
import type { ParsedEncounter, ParsedNpc, ParsedStory } from "@/lib/types";
import {
  getEncounterErrorKey,
  getNpcErrorKey,
  type StoryFieldErrors,
  validateEncounterField,
  validateNpcField,
  validateStoryEdit,
  validateStoryTextField,
} from "@/lib/storyValidation";

export function useStoryEditing(
  story: ParsedStory,
  onStoryChange: (story: ParsedStory) => void,
) {
  // =========================================================================
  // State
  // =========================================================================

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [draft, setDraft] = useState<ParsedStory>(story);
  const [fieldErrors, setFieldErrors] = useState<StoryFieldErrors>({});

  // =========================================================================
  // Edit Actions
  // =========================================================================

  const startEdit = (section: string) => {
    setDraft({
      ...story,
      encounters: story.encounters.map((encounter) => ({ ...encounter })),
      npcs: story.npcs.map((npc) => ({ ...npc })),
    });
    setFieldErrors({});
    setEditingSection(section);
  };

  const cancelEdit = () => {
    setFieldErrors({});
    setEditingSection(null);
  };

  const saveEdit = () => {
    const errors = validateStoryEdit({ editingSection, draft });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const updatedStory = applyStoryEdit({ editingSection, story, draft });

    onStoryChange(updatedStory);
    setDraft(updatedStory);
    setFieldErrors({});
    setEditingSection(null);
  };

  // =========================================================================
  // Draft Updates
  // =========================================================================

  const setDraftField = (field: StoryTextField, value: string) => {
    validateField(field, validateStoryTextField(field, value));
    setDraft((currentDraft) => ({ ...currentDraft, [field]: value }));
  };

  const setDraftEncounterField = (
    index: number,
    field: keyof ParsedEncounter,
    value: string,
  ) => {
    validateField(
      getEncounterErrorKey(index, field),
      validateEncounterField(field, value),
    );
    setDraft((currentDraft) => ({
      ...currentDraft,
      encounters: currentDraft.encounters.map((encounter, encounterIndex) =>
        encounterIndex === index ? { ...encounter, [field]: value } : encounter,
      ),
    }));
  };

  const setDraftNpcField = (
    index: number,
    field: keyof ParsedNpc,
    value: string,
  ) => {
    validateField(getNpcErrorKey(index, field), validateNpcField(field, value));
    setDraft((currentDraft) => ({
      ...currentDraft,
      npcs: currentDraft.npcs.map((npc, npcIndex) =>
        npcIndex === index ? { ...npc, [field]: value } : npc,
      ),
    }));
  };

  // =========================================================================
  // Delete Actions
  // =========================================================================

  const deleteStoryItem = (field: StoryListField, index: number) => {
    onStoryChange({
      ...story,
      [field]: story[field].filter((_, itemIndex) => itemIndex !== index),
    });
  };

  // =========================================================================
  // Error State
  // =========================================================================

  const validateField = (key: string, error: string | null) => {
    setFieldErrors((currentErrors) => {
      if (error) {
        return { ...currentErrors, [key]: error };
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[key];

      return nextErrors;
    });
  };

  const isEditing = (key: string) => editingSection === key;

  // =========================================================================
  // Public API
  // =========================================================================

  return {
    draft,
    fieldErrors,
    isEditing,
    startEdit,
    cancelEdit,
    saveEdit,
    setDraftField,
    setDraftEncounterField,
    setDraftNpcField,
    deleteStoryItem,
    getEncounterErrorKey,
    getNpcErrorKey,
  };
}
