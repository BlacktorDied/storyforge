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
      className={`text-muted hover:text-text inline-flex cursor-pointer items-center justify-center rounded-sm transition focus-visible:ring-2 focus-visible:outline-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
