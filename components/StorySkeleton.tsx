import {
  ENCOUNTER_COUNT_BY_SESSION_LENGTH,
  type SessionLength,
} from "@/lib/data";

type Props = {
  sessionLength: SessionLength;
};

export default function StorySkeleton({ sessionLength }: Props) {
  const encounterCount = ENCOUNTER_COUNT_BY_SESSION_LENGTH[sessionLength];

  return (
    <div className="mt-6 animate-pulse space-y-6">
      <div className="border-border bg-surface h-8 w-1/3 rounded border" />

      {[1, 2, 3, 4].map((section) => (
        <section key={section} className="space-y-3">
          <div className="border-border bg-surface h-5 w-32 rounded border" />

          <div className="space-y-2">
            <div className="border-border bg-surface h-4 w-full rounded border" />
            <div className="border-border bg-surface h-4 w-11/12 rounded border" />
            <div className="border-border bg-surface h-4 w-4/5 rounded border" />
          </div>
        </section>
      ))}

      <section className="space-y-3">
        <div className="border-border bg-surface h-5 w-40 rounded border" />

        {Array.from({ length: encounterCount }, (_, i) => (
          <div
            key={i}
            className="border-border bg-surface space-y-3 rounded-lg border p-4"
          >
            <div className="bg-border h-5 w-1/3 rounded" />
            <div className="bg-border h-4 w-full rounded" />
            <div className="bg-border h-4 w-5/6 rounded" />
            <div className="bg-border h-4 w-2/3 rounded" />
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <div className="border-border bg-surface h-5 w-20 rounded border" />

        {[1, 2, 3].map((card) => (
          <div
            key={card}
            className="border-border bg-surface space-y-3 rounded-lg border p-4"
          >
            <div className="bg-border h-5 w-1/4 rounded" />
            <div className="bg-border h-4 w-1/3 rounded" />
            <div className="bg-border h-4 w-full rounded" />
            <div className="bg-border h-4 w-4/5 rounded" />
          </div>
        ))}
      </section>
    </div>
  );
}
