import type { InputHTMLAttributes } from "react";

import { getInputClass } from "./inputStyles";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
};

export default function TextInput({
  className = "",
  hasError = false,
  type = "text",
  ...props
}: TextInputProps) {
  return (
    <input
      type={type}
      className={`${getInputClass(hasError)} ${className}`}
      {...props}
    />
  );
}
