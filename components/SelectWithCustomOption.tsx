import InfoTooltip from "./InfoTooltip";

type Props = {
  label: string;
  options: string[];
  value: string;
  setValue: (v: string) => void;
  customValue: string;
  setCustomValue: (v: string) => void;
  info?: string;
  error?: string;
  clearError?: () => void;
};

export default function SelectWithCustomOption({
  label,
  options,
  value,
  setValue,
  customValue,
  setCustomValue,
  info,
  error,
  clearError,
}: Props) {
  return (
    <div>
      <div>
        <label className="font-semibold">{label}</label>
        {info && <InfoTooltip text={info} />}
      </div>

      <select
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          clearError?.();
        }}
        className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
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
          onChange={(e) => {
            setCustomValue(e.target.value);
            clearError?.();
          }}
          className={`mt-2 w-full rounded-md border bg-surface px-3 py-2 text-sm text-text shadow-sm outline-none transition
    ${
      error
        ? "border-red-500 focus:border-red-500"
        : "border-border focus:border-primary"
    }`}
        />
      )}
      {error && (
        <small className="mt-1 block text-sm text-red-500">{error}</small>
      )}
    </div>
  );
}
