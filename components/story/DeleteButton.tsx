"use client";

import { Check, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import IconButton from "@/components/ui/IconButton";

type Props = {
  onClick: () => void;
  confirmLabel?: string;
};

export default function DeleteButton({
  onClick,
  confirmLabel = "Delete?",
}: Props) {
  const [isConfirming, setIsConfirming] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  const confirmDelete = () => {
    onClick();
    setIsConfirming(false);
  };

  useEffect(() => {
    if (!isConfirming) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsConfirming(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsConfirming(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isConfirming]);

  return (
    <span ref={containerRef} className="relative inline-flex">
      <IconButton
        label="Delete"
        onClick={() => setIsConfirming(true)}
        className="text-muted hover:text-error focus-visible:ring-error/60 inline-flex size-5 items-center justify-center rounded-sm transition focus-visible:ring-2 focus-visible:outline-none"
      >
        <Trash2 className="size-3" aria-hidden="true" />
      </IconButton>

      {isConfirming && (
        <span className="border-border bg-surface absolute top-5 right-0 z-10 flex items-center gap-1 rounded border px-2 py-1 shadow-sm">
          <span className="text-muted text-xs whitespace-nowrap">
            {confirmLabel}
          </span>
          <IconButton
            label="Confirm delete"
            onClick={confirmDelete}
            className="text-muted hover:text-error focus-visible:ring-error/60 inline-flex size-4 items-center justify-center rounded-sm transition focus-visible:ring-2 focus-visible:outline-none"
          >
            <Check className="size-3" aria-hidden="true" />
          </IconButton>
          <IconButton
            label="Cancel delete"
            onClick={() => setIsConfirming(false)}
            className="text-muted hover:text-text focus-visible:ring-primary/60 inline-flex size-4 items-center justify-center rounded-sm transition focus-visible:ring-2 focus-visible:outline-none"
          >
            <X className="size-3" aria-hidden="true" />
          </IconButton>
        </span>
      )}
    </span>
  );
}
