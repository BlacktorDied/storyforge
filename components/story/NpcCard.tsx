"use client";

import TextareaAutosize from "react-textarea-autosize";

import type { ParsedNpc } from "@/lib/types";

import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";
import SaveCancelBar from "./SaveCancelBar";
import { inputClass } from "./EditableTextSection";

type NpcCardProps = {
  npc: ParsedNpc;
  draftNpc?: ParsedNpc;
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
            className={`${inputClass} font-semibold`}
            placeholder="Name"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={draftNpc?.race ?? npc.race}
              onChange={(event) => onChange("race", event.target.value)}
              className={inputClass}
              placeholder="Race"
            />
            <input
              type="text"
              value={draftNpc?.class ?? npc.class}
              onChange={(event) => onChange("class", event.target.value)}
              className={inputClass}
              placeholder="Class"
            />
          </div>
          <input
            type="text"
            value={draftNpc?.role ?? npc.role}
            onChange={(event) => onChange("role", event.target.value)}
            className={inputClass}
            placeholder="Role"
          />
          <input
            type="text"
            value={draftNpc?.location ?? npc.location}
            onChange={(event) => onChange("location", event.target.value)}
            className={inputClass}
            placeholder="Location"
          />
          <input
            type="text"
            value={draftNpc?.motivation ?? npc.motivation}
            onChange={(event) => onChange("motivation", event.target.value)}
            className={inputClass}
            placeholder="Motivation"
          />
          <TextareaAutosize
            value={draftNpc?.description ?? npc.description}
            onChange={(event) => onChange("description", event.target.value)}
            className={`${inputClass} resize-none`}
            placeholder="Description"
          />
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
