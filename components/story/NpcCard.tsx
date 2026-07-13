"use client";

import FieldError from "@/components/ui/FieldError";
import TextareaField from "@/components/ui/TextareaField";
import TextInput from "@/components/ui/TextInput";
import type { ParsedNpc } from "@/lib/types";

import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";
import SaveCancelBar from "./SaveCancelBar";

type Props = {
  npc: ParsedNpc;
  draftNpc?: ParsedNpc;
  errors?: Partial<Record<keyof ParsedNpc, string>>;
  isEditing: boolean;
  onStartEdit: () => void;
  onFieldChange: (field: keyof ParsedNpc, value: string) => void;
  onDelete: () => void;
  onSave: () => void;
  onCancel: () => void;
};

export default function NpcCard({
  npc,
  draftNpc,
  errors = {},
  isEditing,
  onStartEdit,
  onFieldChange,
  onDelete,
  onSave,
  onCancel,
}: Props) {
  return (
    <div className="print-card group rounded border border-border bg-surface p-3">
      {isEditing ? (
        <div className="space-y-2">
          <TextInput
            value={draftNpc?.name ?? npc.name}
            onChange={(event) => onFieldChange("name", event.target.value)}
            className="font-semibold"
            hasError={Boolean(errors.name)}
            placeholder="Name"
            aria-invalid={Boolean(errors.name)}
          />
          <FieldError error={errors.name} />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <TextInput
                value={draftNpc?.race ?? npc.race}
                onChange={(event) => onFieldChange("race", event.target.value)}
                hasError={Boolean(errors.race)}
                placeholder="Race"
                aria-invalid={Boolean(errors.race)}
              />
              <FieldError error={errors.race} />
            </div>
            <div>
              <TextInput
                value={draftNpc?.class ?? npc.class}
                onChange={(event) => onFieldChange("class", event.target.value)}
                hasError={Boolean(errors.class)}
                placeholder="Class"
                aria-invalid={Boolean(errors.class)}
              />
              <FieldError error={errors.class} />
            </div>
          </div>
          <TextInput
            value={draftNpc?.role ?? npc.role}
            onChange={(event) => onFieldChange("role", event.target.value)}
            hasError={Boolean(errors.role)}
            placeholder="Role"
            aria-invalid={Boolean(errors.role)}
          />
          <FieldError error={errors.role} />
          <TextInput
            value={draftNpc?.location ?? npc.location}
            onChange={(event) => onFieldChange("location", event.target.value)}
            hasError={Boolean(errors.location)}
            placeholder="Location"
            aria-invalid={Boolean(errors.location)}
          />
          <FieldError error={errors.location} />
          <TextInput
            value={draftNpc?.motivation ?? npc.motivation}
            onChange={(event) =>
              onFieldChange("motivation", event.target.value)
            }
            hasError={Boolean(errors.motivation)}
            placeholder="Motivation"
            aria-invalid={Boolean(errors.motivation)}
          />
          <FieldError error={errors.motivation} />
          <TextareaField
            value={draftNpc?.description ?? npc.description}
            onChange={(event) =>
              onFieldChange("description", event.target.value)
            }
            hasError={Boolean(errors.description)}
            placeholder="Description"
            aria-invalid={Boolean(errors.description)}
          />
          <FieldError error={errors.description} />
          <SaveCancelBar onSave={onSave} onCancel={onCancel} />
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-3">
            <h4 className="font-semibold">{npc.name}</h4>
            <div className="flex shrink-0 gap-1 transition">
              <EditButton onClick={onStartEdit} />
              <DeleteButton onClick={onDelete} confirmLabel="Delete NPC?" />
            </div>
          </div>
          <p>
            {npc.race} – {npc.class}
          </p>
          <p>
            <strong>Role:</strong> {npc.role}
          </p>
          <p>
            <strong>Location:</strong> {npc.location}
          </p>
          <p>
            <strong>Motivation:</strong> {npc.motivation}
          </p>
          <p>{npc.description}</p>
        </>
      )}
    </div>
  );
}
