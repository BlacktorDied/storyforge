"use client";

import TextareaAutosize from "react-textarea-autosize";

import type { ParsedEncounter } from "@/lib/types";

import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";
import SaveCancelBar from "./SaveCancelBar";
import { inputClass } from "./EditableTextSection";

type EncounterCardProps = {
  encounter: ParsedEncounter;
  draftEncounter?: ParsedEncounter;
  isEditing: boolean;
  onStartEdit: () => void;
  onChange: (field: keyof ParsedEncounter, value: string) => void;
  onDelete: () => void;
  onSave: () => void;
  onCancel: () => void;
};

export default function EncounterCard({
  encounter,
  draftEncounter,
  isEditing,
  onStartEdit,
  onChange,
  onDelete,
  onSave,
  onCancel,
}: EncounterCardProps) {
  return (
    <div className="border-border bg-surface print-card group rounded border p-3">
      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            value={draftEncounter?.title ?? encounter.title}
            onChange={(event) => onChange("title", event.target.value)}
            className={`${inputClass} font-semibold`}
            placeholder="Encounter title"
          />
          <TextareaAutosize
            value={draftEncounter?.content ?? encounter.content}
            onChange={(event) => onChange("content", event.target.value)}
            className={`${inputClass} resize-none`}
            placeholder="Encounter description"
          />
          <SaveCancelBar onSave={onSave} onCancel={onCancel} />
        </div>
      ) : (
        <>
          <div className="items-centre flex justify-between gap-3">
            <h4 className="font-semibold">{encounter.title}</h4>
            <div className="flex shrink-0 gap-1 transition">
              <EditButton onClick={onStartEdit} />
              <DeleteButton
                onClick={onDelete}
                confirmLabel="Delete encounter?"
              />
            </div>
          </div>
          <p className="whitespace-pre-line">{encounter.content}</p>
        </>
      )}
    </div>
  );
}
