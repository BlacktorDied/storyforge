"use client";

import StoryForm from "@/components/StoryForm";
import StoryResult from "@/components/StoryResult";
import StorySkeleton from "@/components/StorySkeleton";
import { useStoryGenerator } from "@/hooks/useStoryGenerator";

export default function StoryForgePage() {
  const story = useStoryGenerator();

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 p-6 lg:grid-cols-[360px_1fr]">
      {story.parsed && !story.loading && (
        <div className="fixed top-30 right-2">
          <button
            className="border-border bg-surface text-text hover:bg-background rounded-l-lg border px-4 py-2 text-sm font-medium shadow-sm transition"
            onClick={story.handleCopy}
          >
            {story.copyStatus === "copied" ? "Copied!" : "Copy"}
          </button>

          <button
            className="border-border bg-surface text-text hover:bg-background rounded-r-lg border px-4 py-2 text-sm font-medium shadow-sm transition"
            onClick={() => window.print()}
          >
            Download
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
        {story.parsed && <StoryResult story={story.parsed} />}
      </section>
    </div>
  );
}
