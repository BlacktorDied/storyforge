"use client";

import FieldError from "@/components/ui/FieldError";
import TextareaField from "@/components/ui/TextareaField";
import TextInput from "@/components/ui/TextInput";

import EditButton from "./EditButton";
import SaveCancelBar from "./SaveCancelBar";

type Props = {
  label: string;
  value: string;
  draftValue: string;
  isEditing: boolean;
  onStartEdit: () => void;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
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
  minRows = 1,
  isTitle = false,
  error,
}: Props) {
  if (isTitle) {
    return (
      <div className="flex items-center gap-2">
        {isEditing ? (
          <div className="w-full">
            <TextInput
              value={draftValue}
              onChange={(event) => onChange(event.target.value)}
              className="text-xl font-bold"
              hasError={Boolean(error)}
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
    <section>
      <div className="mb-1 flex items-center gap-2">
        <h3 className="font-semibold">{label}</h3>
        {!isEditing && <EditButton onClick={onStartEdit} />}
      </div>
      {isEditing ? (
        <>
          <TextareaField
            value={draftValue}
            minRows={minRows}
            onChange={(event) => onChange(event.target.value)}
            hasError={Boolean(error)}
            aria-label={label}
            aria-invalid={Boolean(error)}
          />

          <FieldError error={error} />
          <SaveCancelBar onSave={onSave} onCancel={onCancel} />
        </>
      ) : (
        <p>{value}</p>
      )}
    </section>
  );
}
