"use client";

import TextareaAutosize from "react-textarea-autosize";

import FieldError from "@/components/FieldError";
import { getInputClass } from "@/components/inputStyles";

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
  error?: string | null;
};

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
  error,
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
              className={`${getInputClass(Boolean(error))} text-xl font-bold`}
              aria-label={label}
              aria-invalid={Boolean(error)}
            />
            <FieldError error={error} />
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
              className={getInputClass(Boolean(error))}
              aria-label={label}
              aria-invalid={Boolean(error)}
            />
          ) : (
            <TextareaAutosize
              value={draftValue}
              minRows={minRows}
              onChange={(event) => onChange(event.target.value)}
              className={`${getInputClass(Boolean(error))} resize-none`}
              aria-label={label}
              aria-invalid={Boolean(error)}
            />
          )}
          <FieldError error={error} />
          <SaveCancelBar onSave={onSave} onCancel={onCancel} />
        </>
      ) : (
        <p>{value}</p>
      )}
    </section>
  );
}
