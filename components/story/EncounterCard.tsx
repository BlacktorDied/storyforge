"use client";

import FieldError from "@/components/ui/FieldError";
import TextareaField from "@/components/ui/TextareaField";
import TextInput from "@/components/ui/TextInput";
import type { ParsedEncounter } from "@/lib/types";

import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";
import SaveCancelBar from "./SaveCancelBar";

type EncounterCardProps = {
  encounter: ParsedEncounter;
  draftEncounter?: ParsedEncounter;
  errors?: Partial<Record<keyof ParsedEncounter, string>>;
  isEditing: boolean;
  onStartEdit: () => void;
  onFieldChange: (field: keyof ParsedEncounter, value: string) => void;
  onDelete: () => void;
  onSave: () => void;
  onCancel: () => void;
};

export default function EncounterCard({
  encounter,
  draftEncounter,
  errors = {},
  isEditing,
  onStartEdit,
  onFieldChange,
  onDelete,
  onSave,
  onCancel,
}: EncounterCardProps) {
  return (
    <div className="border-border bg-surface print-card group rounded border p-3">
      {isEditing ? (
        <div className="space-y-2">
          <TextInput
            value={draftEncounter?.title ?? encounter.title}
            onChange={(event) => onFieldChange("title", event.target.value)}
            className="font-semibold"
            hasError={Boolean(errors.title)}
            placeholder="Encounter title"
            aria-invalid={Boolean(errors.title)}
          />
          <FieldError error={errors.title} />
          <TextareaField
            value={draftEncounter?.content ?? encounter.content}
            onChange={(event) => onFieldChange("content", event.target.value)}
            hasError={Boolean(errors.content)}
            placeholder="Encounter description"
            aria-invalid={Boolean(errors.content)}
          />
          <FieldError error={errors.content} />
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
