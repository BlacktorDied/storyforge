import FieldError from "./FieldError";

import type { SelectionMode } from "@/lib/types";

type Props = {
  id?: string;
  label: string;
  options: readonly string[];
  mode: SelectionMode;
  setMode: (mode: SelectionMode) => void;
  selected: string[];
  setSelected: (values: string[]) => void;
  allDescription: string;
  customDescription?: string;
  error?: string | null;
  onTouch?: () => void;
  resetValidation?: () => void;
};

export default function MultiSelectWithMode({
  id,
  label,
  options,
  mode,
  setMode,
  selected,
  setSelected,
  allDescription,
  customDescription = "Restrict generated NPCs to only the selected options.",
  error,
  onTouch,
  resetValidation,
}: Props) {
  const errorId = id ? `${id}-error` : undefined;

  const getOptionCardClass = (active: boolean, hasError = false) =>
    `block cursor-pointer rounded border p-3 transition ${
      hasError
        ? "border-error bg-error/10"
        : active
          ? "border-primary bg-primary/10"
          : "border-border bg-surface hover:border-primary/60"
    }`;

  return (
    <div id={id}>
      <label className="font-semibold">{label}</label>

      <div className="mt-2 space-y-2">
        <label className={getOptionCardClass(mode === "all")}>
          <input
            type="radio"
            checked={mode === "all"}
            onChange={() => {
              setMode("all");
              setSelected([]);
              resetValidation?.();
            }}
            className="accent-primary mr-2"
          />
          <span className="font-medium">All official</span>
          <p className="text-muted text-sm">{allDescription}</p>
        </label>

        <label
          className={getOptionCardClass(mode === "custom", Boolean(error))}
        >
          <input
            type="radio"
            checked={mode === "custom"}
            aria-describedby={error ? errorId : undefined}
            onChange={() => {
              setMode("custom");
              resetValidation?.();
            }}
            className={`mr-2 ${error ? "accent-error" : "accent-primary"}`}
          />
          <span className="font-medium">Custom selection</span>
          <p className="text-muted text-sm">{customDescription}</p>
        </label>
      </div>

      {mode === "custom" && (
        <div
          role="group"
          aria-describedby={error ? errorId : undefined}
          className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2"
        >
          {options.map((option) => (
            <label key={option} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selected.includes(option)}
                className="accent-primary"
                onChange={(e) => {
                  onTouch?.();

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

      <FieldError id={errorId} error={error} />
    </div>
  );
}
