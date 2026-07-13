import { Pencil } from "lucide-react";

import IconButton from "@/components/ui/IconButton";

type Props = {
  onClick: () => void;
};

export default function EditButton({ onClick }: Props) {
  return (
    <IconButton
      label="Edit"
      onClick={onClick}
      className="inline-flex size-5 items-center justify-center rounded-sm text-muted transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
    >
      <Pencil className="size-3" aria-hidden="true" />
    </IconButton>
  );
}
