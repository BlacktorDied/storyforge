import type { TextareaAutosizeProps } from "react-textarea-autosize";
import TextareaAutosize from "react-textarea-autosize";

import { getInputClass } from "./inputStyles";

type TextareaFieldProps = TextareaAutosizeProps & {
  hasError?: boolean;
};

export default function TextareaField({
  className = "",
  hasError = false,
  ...props
}: TextareaFieldProps) {
  return (
    <TextareaAutosize
      className={`${getInputClass(hasError)} resize-none ${className}`}
      {...props}
    />
  );
}
