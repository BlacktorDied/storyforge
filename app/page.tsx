"use client";

import { Check, Copy, FileDown } from "lucide-react";

import StoryForm from "@/components/StoryForm";
import StoryResult from "@/components/story/StoryResult";
import StorySkeleton from "@/components/StorySkeleton";
import { useStoryGenerator } from "@/hooks/useStoryGenerator";

export default function StoryForgePage() {
  const story = useStoryGenerator();

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 p-6 lg:grid-cols-[360px_1fr]">
      {story.parsed && !story.loading && (
        <div className="fixed top-30 right-2 flex">
          <button
            className="border-border bg-surface text-text hover:bg-background inline-flex items-center gap-1 rounded-l-lg border px-3 py-2 text-sm font-medium shadow-sm transition"
            onClick={story.handleCopy}
            title="Copy story"
            aria-label="Copy story"
          >
            {story.copyStatus === "copied" ? (
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
            className="border-border bg-surface text-text hover:bg-background inline-flex items-center gap-1 rounded-r-lg border border-l-0 px-3 py-2 text-sm font-medium shadow-sm transition"
            onClick={story.handleDownloadPdf}
            title="Download story as PDF"
            aria-label="Download story as PDF"
          >
            <FileDown className="size-4" aria-hidden="true" />
            <span>PDF</span>
          </button>
        </div>
      )}

      <StoryForm {...story.formProps} />

      <section
        id="print-area"
        className="mt-6 w-full"
        aria-label="Generated story"
      >
        {story.loading && <StorySkeleton sessionLength={story.sessionLength} />}
        {story.parsed && (
          <StoryResult
            story={story.parsed}
            onStoryChange={story.onStoryChange}
          />
        )}
      </section>
    </div>
  );
}
