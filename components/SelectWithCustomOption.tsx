import FieldError from "./FieldError";
import InfoTooltip from "./InfoTooltip";
import { getInputClass } from "./inputStyles";

type Props = {
  id?: string;
  label: string;
  options: readonly string[];
  value: string;
  setValue: (v: string) => void;
  customValue: string;
  setCustomValue: (v: string) => void;
  info?: string;
  error?: string | null;
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
  const errorId = id ? `${id}-error` : undefined;

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
        className={getInputClass()}
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
          aria-describedby={error ? errorId : undefined}
          onBlur={onTouch}
          onChange={(e) => {
            onTouch?.();
            setCustomValue(e.target.value);
          }}
          className={`${getInputClass(Boolean(error))} mt-2`}
        />
      )}
      <FieldError id={errorId} error={error} />
    </div>
  );
}
