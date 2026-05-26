"use client";

import { useState } from "react";

import type { ParsedEncounter, ParsedNpc, ParsedStory } from "@/lib/types";

import EditableTextSection from "./EditableTextSection";
import EncounterCard from "./EncounterCard";
import NpcCard from "./NpcCard";

type Props = {
  story: ParsedStory;
  onStoryChange: (story: ParsedStory) => void;
};

type StoryTextField =
  | "title"
  | "setting"
  | "background"
  | "adventureHook"
  | "mainQuest";

type StoryListField = "encounters" | "npcs";

export default function StoryResult({ story, onStoryChange }: Props) {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [draft, setDraft] = useState<ParsedStory>(story);

  const startEdit = (section: string) => {
    setDraft({
      ...story,
      encounters: story.encounters.map((encounter) => ({ ...encounter })),
      npcs: story.npcs.map((npc) => ({ ...npc })),
    });
    setEditingSection(section);
  };

  const cancelEdit = () => setEditingSection(null);

  const saveEdit = () => {
    onStoryChange(draft);
    setEditingSection(null);
  };

  const setDraftField = (field: StoryTextField, value: string) => {
    setDraft((currentDraft) => ({ ...currentDraft, [field]: value }));
  };

  const setDraftEncounterField = (
    index: number,
    field: keyof ParsedEncounter,
    value: string,
  ) => {
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
    setDraft((currentDraft) => ({
      ...currentDraft,
      npcs: currentDraft.npcs.map((npc, npcIndex) =>
        npcIndex === index ? { ...npc, [field]: value } : npc,
      ),
    }));
  };

  const deleteStoryItem = (field: StoryListField, index: number) => {
    onStoryChange({
      ...story,
      [field]: story[field].filter((_, itemIndex) => itemIndex !== index),
    });
  };

  const editing = (key: string) => editingSection === key;

  return (
    <div className="mt-6 space-y-6">
      <EditableTextSection
        label="Title"
        value={story.title}
        draftValue={draft.title}
        isEditing={editing("title")}
        onStartEdit={() => startEdit("title")}
        onChange={(value) => setDraftField("title", value)}
        onSave={saveEdit}
        onCancel={cancelEdit}
        mode="input"
        isTitle
      />

      <EditableTextSection
        label="Setting"
        value={story.setting}
        draftValue={draft.setting}
        isEditing={editing("setting")}
        onStartEdit={() => startEdit("setting")}
        onChange={(value) => setDraftField("setting", value)}
        onSave={saveEdit}
        onCancel={cancelEdit}
      />

      <EditableTextSection
        label="Background"
        value={story.background}
        draftValue={draft.background}
        isEditing={editing("background")}
        onStartEdit={() => startEdit("background")}
        onChange={(value) => setDraftField("background", value)}
        onSave={saveEdit}
        onCancel={cancelEdit}
      />

      <EditableTextSection
        label="Adventure Hook"
        value={story.adventureHook}
        draftValue={draft.adventureHook}
        isEditing={editing("adventureHook")}
        onStartEdit={() => startEdit("adventureHook")}
        onChange={(value) => setDraftField("adventureHook", value)}
        onSave={saveEdit}
        onCancel={cancelEdit}
      />

      <EditableTextSection
        label="Main Quest"
        value={story.mainQuest}
        draftValue={draft.mainQuest}
        isEditing={editing("mainQuest")}
        onStartEdit={() => startEdit("mainQuest")}
        onChange={(value) => setDraftField("mainQuest", value)}
        onSave={saveEdit}
        onCancel={cancelEdit}
      />

      <section>
        <h3 className="font-semibold">Key Encounters</h3>
        <div className="mt-2 space-y-3">
          {story.encounters.map((encounter, index) => {
            const key = `encounter-${index}`;

            return (
              <EncounterCard
                key={key}
                encounter={encounter}
                draftEncounter={draft.encounters[index]}
                isEditing={editing(key)}
                onStartEdit={() => startEdit(key)}
                onChange={(field, value) => {
                  setDraftEncounterField(index, field, value);
                }}
                onDelete={() => deleteStoryItem("encounters", index)}
                onSave={saveEdit}
                onCancel={cancelEdit}
              />
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="font-semibold">NPCs</h3>
        <div className="mt-2 space-y-3">
          {story.npcs.map((npc, index) => {
            const key = `npc-${index}`;

            return (
              <NpcCard
                key={key}
                npc={npc}
                draftNpc={draft.npcs[index]}
                isEditing={editing(key)}
                onStartEdit={() => startEdit(key)}
                onChange={(field, value) => {
                  setDraftNpcField(index, field, value);
                }}
                onDelete={() => deleteStoryItem("npcs", index)}
                onSave={saveEdit}
                onCancel={cancelEdit}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
