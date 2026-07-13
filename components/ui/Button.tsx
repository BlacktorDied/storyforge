import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

export default function Button({
  children,
  className = "",
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  const variantClass =
    variant === "primary"
      ? "bg-primary hover:bg-primary-hover text-white"
      : "border-border bg-surface text-text hover:bg-background border";

  return (
    <button
      type={type}
      className={`${variantClass} inline-flex cursor-pointer items-center justify-center gap-2 rounded-md px-3.5 py-2.5 font-semibold text-sm shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
