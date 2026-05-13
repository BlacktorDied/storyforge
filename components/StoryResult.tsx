import type { ParsedStory } from "@/lib/parser";

type Props = {
  story: ParsedStory;
};

export default function StoryResult({ story }: Props) {
  return (
    <div className="mt-6 space-y-6">
      <h2 className="text-xl font-bold">{story.title}</h2>

      <section>
        <h3 className="font-semibold">Setting</h3>
        <p>{story.setting}</p>
      </section>

      <section>
        <h3 className="font-semibold">Background</h3>
        <p>{story.background}</p>
      </section>

      <section>
        <h3 className="font-semibold">Adventure Hook</h3>
        <p>{story.hook}</p>
      </section>

      <section>
        <h3 className="font-semibold">Main Quest</h3>
        <p>{story.quest}</p>
      </section>

      <section>
        <h3 className="font-semibold">Key Encounters</h3>
        <div className="space-y-3">
          {story.encounters.map((encounter, i) => (
            <div
              key={i}
              className="rounded border border-border bg-surface p-3 print-card"
            >
              <h4 className="font-semibold">{encounter.title}</h4>
              <p>{encounter.content}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="font-semibold">NPCs</h3>
        <div className="space-y-3">
          {story.npcs.map((npc, i) => (
            <div
              key={i}
              className="rounded border border-border bg-surface p-3 print-card"
            >
              <h4 className="font-semibold">{npc.name}</h4>
              <p>
                {npc.race} — {npc.class}
              </p>
              <p>
                <strong>Role:</strong> {npc.role}
              </p>
              <p>
                <strong>Location:</strong> {npc.location}
              </p>
              <p>
                <strong>Motivation:</strong> {npc.motivation}
              </p>
              <p>{npc.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
