const MAX_CUSTOM_FIELD_LENGTH = 40;

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function validateCustomText(value: string, fieldLabel: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return `Please enter a custom ${fieldLabel}.`;
  }

  if (trimmed.length > MAX_CUSTOM_FIELD_LENGTH) {
    return `${capitalize(fieldLabel)} must be ${MAX_CUSTOM_FIELD_LENGTH} characters or less.`;
  }

  if (!/[a-zA-Zа-яА-Я]/.test(trimmed)) {
    return `${capitalize(fieldLabel)} must contain at least one letter.`;
  }

  return "";
}

export function validateCustomSelection(
  selected: string[],
  fieldLabel: string,
) {
  if (selected.length === 0) {
    return `Please select at least one ${fieldLabel}.`;
  }

  return "";
}
