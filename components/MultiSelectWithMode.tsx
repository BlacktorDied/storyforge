type Props = {
  label: string;
  options: string[];
  mode: "all" | "custom";
  setMode: (mode: "all" | "custom") => void;
  selected: string[];
  setSelected: (values: string[]) => void;
  allDescription: string;
  customDescription?: string;
};

export default function MultiSelectWithMode({
  label,
  options,
  mode,
  setMode,
  selected,
  setSelected,
  allDescription,
  customDescription = "Restrict generated NPCs to only the selected options.",
}: Props) {
  const optionCardClass = (active: boolean) =>
    `block cursor-pointer rounded border p-3 transition ${
      active
        ? "border-primary bg-primary/10"
        : "border-border bg-surface hover:border-primary/60"
    }`;

  return (
    <div>
      <label className="font-semibold">{label}</label>

      <div className="mt-2 space-y-2">
        <label className={optionCardClass(mode === "all")}>
          <input
            type="radio"
            checked={mode === "all"}
            onChange={() => {
              setMode("all");
              setSelected([]);
            }}
            className="mr-2 accent-primary"
          />
          <span className="font-medium">All official</span>
          <p className="text-sm text-muted">{allDescription}</p>
        </label>

        <label className={optionCardClass(mode === "custom")}>
          <input
            type="radio"
            checked={mode === "custom"}
            onChange={() => setMode("custom")}
            className="mr-2 accent-primary"
          />
          <span className="font-medium">Custom selection</span>
          <p className="text-sm text-muted">{customDescription}</p>
        </label>
      </div>

      {mode === "custom" && (
        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
          {options.map((option) => (
            <label key={option} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selected.includes(option)}
                className="accent-primary"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelected([...selected, option]);
                  } else {
                    setSelected(selected.filter((item) => item !== option));
                  }
                }}
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
