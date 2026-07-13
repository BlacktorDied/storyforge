"use client";

import StoryForm from "@/components/StoryForm";
import StorySkeleton from "@/components/StorySkeleton";
import StoryActions from "@/components/story/StoryActions";
import StoryResult from "@/components/story/StoryResult";
import { useStoryGenerator } from "@/hooks/useStoryGenerator";

export default function StoryForgePage() {
  const story = useStoryGenerator();

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 p-6 lg:grid-cols-[360px_1fr]">
      {story.parsed && !story.loading && (
        <StoryActions
          copyStatus={story.copyStatus}
          onCopy={story.handleCopy}
          onDownloadPdf={story.handleDownloadPdf}
        />
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
