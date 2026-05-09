type Props = {
  length: string;
};

const ENCOUNTER_COUNT_BY_LENGTH: Record<string, number> = {
  Short: 2,
  Medium: 3,
  Long: 5,
};

export default function StorySkeleton({ length }: Props) {
  const encounterCount = ENCOUNTER_COUNT_BY_LENGTH[length] ?? 3;

  return (
    <div className="mt-6 animate-pulse space-y-6">
      <div className="h-8 w-1/3 rounded border border-border bg-surface" />

      {[1, 2, 3, 4].map((section) => (
        <section key={section} className="space-y-3">
          <div className="h-5 w-32 rounded border border-border bg-surface" />

          <div className="space-y-2">
            <div className="h-4 w-full rounded border border-border bg-surface" />
            <div className="h-4 w-11/12 rounded border border-border bg-surface" />
            <div className="h-4 w-4/5 rounded border border-border bg-surface" />
          </div>
        </section>
      ))}

      <section className="space-y-3">
        <div className="h-5 w-40 rounded border border-border bg-surface" />

        {Array.from({ length: encounterCount }, (_, i) => (
          <div
            key={i}
            className="space-y-3 rounded-lg border border-border bg-surface p-4"
          >
            <div className="h-5 w-1/3 rounded bg-border" />
            <div className="h-4 w-full rounded bg-border" />
            <div className="h-4 w-5/6 rounded bg-border" />
            <div className="h-4 w-2/3 rounded bg-border" />
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <div className="h-5 w-20 rounded border border-border bg-surface" />

        {[1, 2, 3].map((card) => (
          <div
            key={card}
            className="space-y-3 rounded-lg border border-border bg-surface p-4"
          >
            <div className="h-5 w-1/4 rounded bg-border" />
            <div className="h-4 w-1/3 rounded bg-border" />
            <div className="h-4 w-full rounded bg-border" />
            <div className="h-4 w-4/5 rounded bg-border" />
          </div>
        ))}
      </section>
    </div>
  );
}
