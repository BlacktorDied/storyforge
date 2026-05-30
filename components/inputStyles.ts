export function getInputClass(hasError = false) {
  const stateClass = hasError
    ? "border-error focus:border-error focus:ring-error/20"
    : "border-border focus:border-primary focus:ring-primary/20";

  return `w-full rounded-md border bg-surface px-3 py-2 text-sm text-text shadow-sm transition focus:outline-none focus:ring-2 ${stateClass}`;
}
