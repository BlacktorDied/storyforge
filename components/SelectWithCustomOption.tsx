import InfoTooltip from "./InfoTooltip";

type Props = {
  id?: string;
  label: string;
  options: readonly string[];
  value: string;
  setValue: (v: string) => void;
  customValue: string;
  setCustomValue: (v: string) => void;
  info?: string;
  error?: string;
  onTouch?: () => void;
  resetValidation?: () => void;
};

export default function SelectWithCustomOption({
  id,
  label,
  options,
  value,
  setValue,
  customValue,
  setCustomValue,
  info,
  error,
  onTouch,
  resetValidation,
}: Props) {
  return (
    <div id={id}>
      <div>
        <label className="font-semibold">{label}</label>
        {info && <InfoTooltip text={info} />}
      </div>

      <select
        value={value}
        onChange={(e) => {
          const nextValue = e.target.value;

          setValue(nextValue);
          resetValidation?.();
        }}
        className="border-border bg-surface text-text focus:border-primary focus:ring-primary/20 mt-1 w-full rounded-md border px-3 py-2 text-sm shadow-sm transition outline-none focus:ring-2"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>

      {value === "Other" && (
        <input
          placeholder={`Custom ${label.toLowerCase()}`}
          value={customValue}
          aria-invalid={Boolean(error)}
          onBlur={onTouch}
          onChange={(e) => {
            onTouch?.();
            setCustomValue(e.target.value);
          }}
          className={`bg-surface text-text mt-2 w-full rounded-md border px-3 py-2 text-sm shadow-sm transition outline-none ${
            error
              ? "border-error focus:border-error"
              : "border-border focus:border-primary"
          }`}
        />
      )}
      {error && (
        <small className="text-error mt-1 block text-sm">{error}</small>
      )}
    </div>
  );
}
