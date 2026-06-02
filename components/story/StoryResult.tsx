"use client";

import { useStoryEditing } from "@/hooks/useStoryEditing";
import type { ParsedStory } from "@/lib/types";

import EditableTextSection from "./EditableTextSection";
import EncounterCard from "./EncounterCard";
import NpcCard from "./NpcCard";

type Props = {
  story: ParsedStory;
  onStoryChange: (story: ParsedStory) => void;
};

export default function StoryResult({ story, onStoryChange }: Props) {
  const {
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
  } = useStoryEditing(story, onStoryChange);

  return (
    <div className="mt-6 space-y-6">
      <EditableTextSection
        label="Title"
        value={story.title}
        draftValue={draft.title}
        isEditing={isEditing("title")}
        onStartEdit={() => startEdit("title")}
        onChange={(value) => setDraftField("title", value)}
        onSave={saveEdit}
        onCancel={cancelEdit}
        error={fieldErrors.title}
        isTitle
      />

      <EditableTextSection
        label="Setting"
        value={story.setting}
        draftValue={draft.setting}
        isEditing={isEditing("setting")}
        onStartEdit={() => startEdit("setting")}
        onChange={(value) => setDraftField("setting", value)}
        onSave={saveEdit}
        onCancel={cancelEdit}
        error={fieldErrors.setting}
      />

      <EditableTextSection
        label="Background"
        value={story.background}
        draftValue={draft.background}
        isEditing={isEditing("background")}
        onStartEdit={() => startEdit("background")}
        onChange={(value) => setDraftField("background", value)}
        onSave={saveEdit}
        onCancel={cancelEdit}
        error={fieldErrors.background}
      />

      <EditableTextSection
        label="Adventure Hook"
        value={story.adventureHook}
        draftValue={draft.adventureHook}
        isEditing={isEditing("adventureHook")}
        onStartEdit={() => startEdit("adventureHook")}
        onChange={(value) => setDraftField("adventureHook", value)}
        onSave={saveEdit}
        onCancel={cancelEdit}
        error={fieldErrors.adventureHook}
      />

      <EditableTextSection
        label="Main Quest"
        value={story.mainQuest}
        draftValue={draft.mainQuest}
        isEditing={isEditing("mainQuest")}
        onStartEdit={() => startEdit("mainQuest")}
        onChange={(value) => setDraftField("mainQuest", value)}
        onSave={saveEdit}
        onCancel={cancelEdit}
        error={fieldErrors.mainQuest}
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
                errors={{
                  title: fieldErrors[getEncounterErrorKey(index, "title")],
                  content: fieldErrors[getEncounterErrorKey(index, "content")],
                }}
                fieldErrors={fieldErrors}
                encounterIndex={index}
                getCheckErrorKey={getEncounterCheckErrorKey}
                getCreatureErrorKey={getEncounterCreatureErrorKey}
                getPuzzleErrorKey={getEncounterPuzzleErrorKey}
                getPuzzleListErrorKey={getEncounterPuzzleListErrorKey}
                isEditing={isEditing(key)}
                onStartEdit={() => startEdit(key)}
                onFieldChange={(field, value) => {
                  setDraftEncounterField(index, field, value);
                }}
                onCheckFieldChange={(checkIndex, field, value) => {
                  setDraftEncounterCheckField(index, checkIndex, field, value);
                }}
                onCreatureFieldChange={(creatureIndex, field, value) => {
                  setDraftEncounterCreatureField(
                    index,
                    creatureIndex,
                    field,
                    value,
                  );
                }}
                onPuzzleFieldChange={(field, value) => {
                  setDraftEncounterPuzzleField(index, field, value);
                }}
                onPuzzleListItemChange={(field, itemIndex, value) => {
                  setDraftEncounterPuzzleListItem(
                    index,
                    field,
                    itemIndex,
                    value,
                  );
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
                errors={{
                  name: fieldErrors[getNpcErrorKey(index, "name")],
                  race: fieldErrors[getNpcErrorKey(index, "race")],
                  class: fieldErrors[getNpcErrorKey(index, "class")],
                  role: fieldErrors[getNpcErrorKey(index, "role")],
                  location: fieldErrors[getNpcErrorKey(index, "location")],
                  motivation: fieldErrors[getNpcErrorKey(index, "motivation")],
                  description:
                    fieldErrors[getNpcErrorKey(index, "description")],
                }}
                isEditing={isEditing(key)}
                onStartEdit={() => startEdit(key)}
                onFieldChange={(field, value) => {
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
