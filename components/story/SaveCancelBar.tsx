type SaveCancelBarProps = {
  onSave: () => void;
  onCancel: () => void;
};

export default function SaveCancelBar({
  onSave,
  onCancel,
}: SaveCancelBarProps) {
  return (
    <div className="mt-2 flex gap-2">
      <button
        onClick={onSave}
        className="bg-primary hover:bg-primary-hover rounded px-3 py-1 text-xs text-white transition"
      >
        Save
      </button>
      <button
        onClick={onCancel}
        className="border-border text-muted hover:text-text hover:bg-background rounded border px-3 py-1 text-xs transition"
      >
        Cancel
      </button>
    </div>
  );
}
