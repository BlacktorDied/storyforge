import { Pencil } from "lucide-react";

type EditButtonProps = {
  onClick: () => void;
};

export default function EditButton({ onClick }: EditButtonProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      aria-label="Edit"
      title="Edit"
      className="text-muted hover:text-primary focus-visible:ring-primary/60 inline-flex size-5 items-center justify-center rounded-sm transition focus-visible:ring-2 focus-visible:outline-none"
    >
      <Pencil className="size-3" aria-hidden="true" />
    </button>
  );
}
