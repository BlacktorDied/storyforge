"use client";

import { useState } from "react";

import { applyStoryEdit } from "@/lib/storyEditing";
import { cloneStoryDraft } from "@/lib/storyTransforms";
import type {
  EncounterCheck,
  EncounterCreature,
  EncounterPuzzle,
  ParsedEncounter,
  ParsedStory,
} from "@/lib/types";
import {
  getEncounterCheckErrorKey,
  getEncounterCreatureErrorKey,
  getEncounterErrorKey,
  getEncounterPuzzleErrorKey,
  getEncounterPuzzleListErrorKey,
  getNpcErrorKey,
  type StoryFieldErrors,
  validateEncounterCheckField,
  validateEncounterCreatureField,
  validateEncounterPuzzleField,
  validateEncounterPuzzleListItem,
  validateEncounterTextField,
  validateNpcField,
  validateStoryEdit,
  validateStoryTextField,
} from "@/lib/storyValidation";
import type {
  EncounterCheckField,
  EncounterCreatureField,
  EncounterPuzzleField,
  EncounterPuzzleListField,
  EncounterTextField,
  NpcField,
  StoryListField,
  StoryTextField,
} from "@/lib/storyFields";

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
    setDraft(cloneStoryDraft(story));
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

  const updateDraftEncounter = (
    encounterIndex: number,
    updateEncounter: (encounter: ParsedEncounter) => ParsedEncounter,
  ) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      encounters: currentDraft.encounters.map((encounter, currentIndex) =>
        currentIndex === encounterIndex
          ? updateEncounter(encounter)
          : encounter,
      ),
    }));
  };

  const setDraftEncounterField = (
    index: number,
    field: EncounterTextField,
    value: string,
  ) => {
    validateField(
      getEncounterErrorKey(index, field),
      validateEncounterTextField(field, value),
    );
    updateDraftEncounter(index, (encounter) => ({
      ...encounter,
      [field]: value,
    }));
  };

  const setDraftEncounterCheckField = <K extends EncounterCheckField>(
    encounterIndex: number,
    checkIndex: number,
    field: K,
    value: EncounterCheck[K],
  ) => {
    validateField(
      getEncounterCheckErrorKey(encounterIndex, checkIndex, field),
      validateEncounterCheckField(field, value),
    );
    updateDraftEncounter(encounterIndex, (encounter) => ({
      ...encounter,
      checks: encounter.checks.map((check, currentCheckIndex) =>
        currentCheckIndex === checkIndex ? { ...check, [field]: value } : check,
      ),
    }));
  };

  const setDraftEncounterCreatureField = <K extends EncounterCreatureField>(
    encounterIndex: number,
    creatureIndex: number,
    field: K,
    value: EncounterCreature[K],
  ) => {
    validateField(
      getEncounterCreatureErrorKey(encounterIndex, creatureIndex, field),
      validateEncounterCreatureField(field, value),
    );
    updateDraftEncounter(encounterIndex, (encounter) => ({
      ...encounter,
      creatures: encounter.creatures.map((creature, currentCreatureIndex) =>
        currentCreatureIndex === creatureIndex
          ? { ...creature, [field]: value }
          : creature,
      ),
    }));
  };

  const setDraftEncounterPuzzleField = <K extends EncounterPuzzleField>(
    encounterIndex: number,
    field: K,
    value: EncounterPuzzle[K],
  ) => {
    validateField(
      getEncounterPuzzleErrorKey(encounterIndex, field),
      validateEncounterPuzzleField(field, value),
    );
    updateDraftEncounter(encounterIndex, (encounter) =>
      encounter.puzzle
        ? {
            ...encounter,
            puzzle: { ...encounter.puzzle, [field]: value },
          }
        : encounter,
    );
  };

  const setDraftEncounterPuzzleListItem = (
    encounterIndex: number,
    field: EncounterPuzzleListField,
    itemIndex: number,
    value: string,
  ) => {
    validateField(
      getEncounterPuzzleListErrorKey(encounterIndex, field, itemIndex),
      validateEncounterPuzzleListItem(field, value),
    );
    updateDraftEncounter(encounterIndex, (encounter) =>
      encounter.puzzle
        ? {
            ...encounter,
            puzzle: {
              ...encounter.puzzle,
              [field]: encounter.puzzle[field].map((item, currentItemIndex) =>
                currentItemIndex === itemIndex ? value : item,
              ),
            },
          }
        : encounter,
    );
  };

  const setDraftNpcField = (index: number, field: NpcField, value: string) => {
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
    setDraftEncounterCheckField,
    setDraftEncounterCreatureField,
    setDraftEncounterPuzzleField,
    setDraftEncounterPuzzleListItem,
    setDraftNpcField,
    deleteStoryItem,
    getEncounterErrorKey,
    getEncounterCheckErrorKey,
    getEncounterCreatureErrorKey,
    getEncounterPuzzleErrorKey,
    getEncounterPuzzleListErrorKey,
    getNpcErrorKey,
  };
}
