"use client";

import { Check, Copy, FileDown } from "lucide-react";

type StoryActionsProps = {
  copyStatus: "idle" | "copied";
  onCopy: () => void;
  onDownloadPdf: () => void;
};

export default function StoryActions({
  copyStatus,
  onCopy,
  onDownloadPdf,
}: StoryActionsProps) {
  const actionButtonClass =
    "inline-flex cursor-pointer items-center gap-1 px-3 py-2 text-sm font-medium text-text transition hover:bg-background";

  return (
    <div className="border-border bg-surface fixed top-30 right-[max(1.5rem,calc((100%-80rem)/2+1.5rem))] z-50 inline-flex overflow-hidden rounded-lg border shadow-sm">
      <button
        className={actionButtonClass}
        onClick={onCopy}
        title="Copy story"
        aria-label="Copy story"
      >
        {copyStatus === "copied" ? (
          <>
            <Check className="size-4" aria-hidden="true" />
            <span>Copied</span>
          </>
        ) : (
          <>
            <Copy className="size-4" aria-hidden="true" />
            <span>Copy</span>
          </>
        )}
      </button>

      <button
        className={`${actionButtonClass} border-border border-l`}
        onClick={onDownloadPdf}
        title="Download story as PDF"
        aria-label="Download story as PDF"
      >
        <FileDown className="size-4" aria-hidden="true" />
        <span>PDF</span>
      </button>
    </div>
  );
}
