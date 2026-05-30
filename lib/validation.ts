function hasLetter(value: string) {
  return /\p{L}/u.test(value);
}

export function validateTextValue(
  value: string,
  label: string,
  maxLength: number,
  requiredMessage?: string,
): string | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return requiredMessage ?? `${label} is required.`;
  }

  if (!hasLetter(trimmed)) {
    return `${label} must contain at least one letter.`;
  }

  if (trimmed.length > maxLength) {
    return `${label} must be ${maxLength} characters or less.`;
  }

  return null;
}

export function validateSelectionValue(
  selected: string[],
  label: string,
): string | null {
  if (selected.length === 0) {
    return `Please select at least one ${label}.`;
  }

  return null;
}
