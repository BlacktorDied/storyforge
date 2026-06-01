import FieldError from "./FieldError";
import InfoTooltip from "./InfoTooltip";
import SelectField from "./SelectField";
import TextInput from "./TextInput";

type Props = {
  id?: string;
  label: string;
  options: readonly string[];
  value: string;
  onValueChange: (value: string) => void;
  customValue: string;
  onCustomValueChange: (value: string) => void;
  info?: string;
  error?: string | null;
  onTouch?: () => void;
  onValidationReset?: () => void;
};

export default function SelectWithCustomOption({
  id,
  label,
  options,
  value,
  onValueChange,
  customValue,
  onCustomValueChange,
  info,
  error,
  onTouch,
  onValidationReset,
}: Props) {
  const errorId = id ? `${id}-error` : undefined;

  return (
    <div id={id}>
      <div>
        <label className="font-semibold">{label}</label>
        {info && <InfoTooltip text={info} />}
      </div>

      <SelectField
        value={value}
        onChange={(e) => {
          const nextValue = e.target.value;

          onValueChange(nextValue);
          onValidationReset?.();
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </SelectField>

      {value === "Other" && (
        <TextInput
          placeholder={`Custom ${label.toLowerCase()}`}
          value={customValue}
          hasError={Boolean(error)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onBlur={onTouch}
          onChange={(e) => {
            onTouch?.();
            onCustomValueChange(e.target.value);
          }}
          className="mt-2"
        />
      )}
      <FieldError id={errorId} error={error} />
    </div>
  );
}
