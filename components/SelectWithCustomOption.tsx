import InfoTooltip from "./InfoTooltip";

type Props = {
  label: string;
  options: string[];
  value: string;
  setValue: (v: string) => void;
  customValue: string;
  setCustomValue: (v: string) => void;
  info?: string;
};

const fieldClassName =
  "mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

export default function SelectWithCustomOption({
  label,
  options,
  value,
  setValue,
  customValue,
  setCustomValue,
  info,
}: Props) {
  return (
    <div>
      <div>
        <label className="font-semibold">{label}</label>
        {info && <InfoTooltip text={info} />}
      </div>

      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={fieldClassName}
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
          onChange={(e) => setCustomValue(e.target.value)}
          className={fieldClassName}
        />
      )}
    </div>
  );
}
