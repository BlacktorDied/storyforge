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
      className="text-muted hover:text-primary focus-visible:ring-primary/60 inline-flex size-5 items-center justify-center rounded-sm transition focus-visible:ring-2 focus-visible:outline-none"
    >
      <Pencil className="size-3" aria-hidden="true" />
    </IconButton>
  );
}
