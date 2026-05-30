"use client";

import TextareaAutosize from "react-textarea-autosize";

import FieldError from "@/components/FieldError";
import { getInputClass } from "@/components/inputStyles";
import type { ParsedNpc } from "@/lib/types";

import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";
import SaveCancelBar from "./SaveCancelBar";

type NpcCardProps = {
  npc: ParsedNpc;
  draftNpc?: ParsedNpc;
  errors?: Partial<Record<keyof ParsedNpc, string>>;
  isEditing: boolean;
  onStartEdit: () => void;
  onChange: (field: keyof ParsedNpc, value: string) => void;
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
  onChange,
  onDelete,
  onSave,
  onCancel,
}: NpcCardProps) {
  return (
    <div className="border-border bg-surface print-card group rounded border p-3">
      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            value={draftNpc?.name ?? npc.name}
            onChange={(event) => onChange("name", event.target.value)}
            className={`${getInputClass(Boolean(errors.name))} font-semibold`}
            placeholder="Name"
            aria-invalid={Boolean(errors.name)}
          />
          <FieldError error={errors.name} />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <input
                type="text"
                value={draftNpc?.race ?? npc.race}
                onChange={(event) => onChange("race", event.target.value)}
                className={getInputClass(Boolean(errors.race))}
                placeholder="Race"
                aria-invalid={Boolean(errors.race)}
              />
              <FieldError error={errors.race} />
            </div>
            <div>
              <input
                type="text"
                value={draftNpc?.class ?? npc.class}
                onChange={(event) => onChange("class", event.target.value)}
                className={getInputClass(Boolean(errors.class))}
                placeholder="Class"
                aria-invalid={Boolean(errors.class)}
              />
              <FieldError error={errors.class} />
            </div>
          </div>
          <input
            type="text"
            value={draftNpc?.role ?? npc.role}
            onChange={(event) => onChange("role", event.target.value)}
            className={getInputClass(Boolean(errors.role))}
            placeholder="Role"
            aria-invalid={Boolean(errors.role)}
          />
          <FieldError error={errors.role} />
          <input
            type="text"
            value={draftNpc?.location ?? npc.location}
            onChange={(event) => onChange("location", event.target.value)}
            className={getInputClass(Boolean(errors.location))}
            placeholder="Location"
            aria-invalid={Boolean(errors.location)}
          />
          <FieldError error={errors.location} />
          <input
            type="text"
            value={draftNpc?.motivation ?? npc.motivation}
            onChange={(event) => onChange("motivation", event.target.value)}
            className={getInputClass(Boolean(errors.motivation))}
            placeholder="Motivation"
            aria-invalid={Boolean(errors.motivation)}
          />
          <FieldError error={errors.motivation} />
          <TextareaAutosize
            value={draftNpc?.description ?? npc.description}
            onChange={(event) => onChange("description", event.target.value)}
            className={`${getInputClass(Boolean(errors.description))} resize-none`}
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
