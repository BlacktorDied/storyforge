import type { SelectHTMLAttributes } from "react";

import { getInputClass } from "./inputStyles";

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  hasError?: boolean;
};

export default function SelectField({
  children,
  className = "",
  hasError = false,
  ...props
}: SelectFieldProps) {
  return (
    <select
      className={`${getInputClass(hasError)} cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
