"use client";

import StoryForm from "@/components/StoryForm";
import StoryResult from "@/components/StoryResult";
import StorySkeleton from "@/components/StorySkeleton";
import { useStoryGenerator } from "@/hooks/useStoryGenerator";

export default function Home() {
  const story = useStoryGenerator();

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 p-6 lg:grid-cols-[360px_1fr]">
      {story.parsed && !story.loading && (
        <div className="fixed top-30 right-2">
          <button
            className="rounded-l-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text shadow-sm transition hover:bg-background"
            onClick={story.handleCopy}
          >
            Copy
          </button>

          <button
            className="rounded-r-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text shadow-sm transition hover:bg-background"
            onClick={() => window.print()}
          >
            Download
          </button>
        </div>
      )}

      <StoryForm {...story.formProps} />

      <section aria-label="Generated story">
        {story.loading && <StorySkeleton length={story.length} />}

        <section
          id="print-area"
          className="mt-6 w-full"
          aria-label="Generated story output"
        >
          {story.parsed && <StoryResult story={story.parsed} />}
        </section>
      </section>
    </div>
  );
}
