type FieldErrorProps = {
  error?: string | null;
  id?: string;
  className?: string;
};

export default function FieldError({ error, id, className }: FieldErrorProps) {
  if (!error) {
    return null;
  }

  return (
    <p id={id} className={className ?? "mt-1 text-error text-xs"}>
      {error}
    </p>
  );
}
