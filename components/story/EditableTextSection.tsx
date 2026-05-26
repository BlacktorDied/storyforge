"use client";

import TextareaAutosize from "react-textarea-autosize";

import EditButton from "./EditButton";
import SaveCancelBar from "./SaveCancelBar";

type EditableTextSectionProps = {
  label: string;
  value: string;
  draftValue: string;
  isEditing: boolean;
  onStartEdit: () => void;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  mode?: "input" | "textarea";
  minRows?: number;
  isTitle?: boolean;
};

export const inputClass =
  "w-full rounded border border-border bg-surface px-2 py-1 text-text focus:outline-none focus:ring-1 focus:ring-primary";

export default function EditableTextSection({
  label,
  value,
  draftValue,
  isEditing,
  onStartEdit,
  onChange,
  onSave,
  onCancel,
  mode = "textarea",
  minRows = 1,
  isTitle = false,
}: EditableTextSectionProps) {
  if (isTitle) {
    return (
      <div className="group flex items-center gap-2">
        {isEditing ? (
          <div className="w-full">
            <input
              type="text"
              value={draftValue}
              onChange={(event) => onChange(event.target.value)}
              className={`${inputClass} text-xl font-bold`}
              aria-label={label}
            />
            <SaveCancelBar onSave={onSave} onCancel={onCancel} />
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold">{value}</h2>
            <EditButton onClick={onStartEdit} />
          </>
        )}
      </div>
    );
  }

  return (
    <section className="group">
      <div className="mb-1 flex items-center gap-2">
        <h3 className="font-semibold">{label}</h3>
        {!isEditing && <EditButton onClick={onStartEdit} />}
      </div>
      {isEditing ? (
        <>
          {mode === "input" ? (
            <input
              type="text"
              value={draftValue}
              onChange={(event) => onChange(event.target.value)}
              className={inputClass}
              aria-label={label}
            />
          ) : (
            <TextareaAutosize
              value={draftValue}
              minRows={minRows}
              onChange={(event) => onChange(event.target.value)}
              className={`${inputClass} resize-none`}
              aria-label={label}
            />
          )}
          <SaveCancelBar onSave={onSave} onCancel={onCancel} />
        </>
      ) : (
        <p>{value}</p>
      )}
    </section>
  );
}
