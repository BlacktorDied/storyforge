import { Info } from "lucide-react";

type Props = {
  text: string;
};

export default function InfoTooltip({ text }: Props) {
  return (
    <span
      title={text}
      aria-label={text}
      className="ml-1 inline-flex cursor-help items-center whitespace-pre-line text-muted"
    >
      <Info aria-hidden="true" focusable="false" className="size-3" />
    </span>
  );
}
