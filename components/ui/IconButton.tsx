import type { ButtonHTMLAttributes, ReactNode } from "react";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  children: ReactNode;
};

export default function IconButton({
  label,
  children,
  className = "",
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={`inline-flex cursor-pointer items-center justify-center rounded-sm text-muted transition hover:text-text focus-visible:outline-none focus-visible:ring-2 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
