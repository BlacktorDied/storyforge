import Button from "@/components/ui/Button";

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
      <Button onClick={onSave} className="px-3 py-1 text-xs">
        Save
      </Button>
      <Button
        onClick={onCancel}
        variant="secondary"
        className="px-3 py-1 text-xs"
      >
        Cancel
      </Button>
    </div>
  );
}
