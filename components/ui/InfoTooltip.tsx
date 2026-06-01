import { Info } from "lucide-react";

type Props = {
  text: string;
};

export default function InfoTooltip({ text }: Props) {
  return (
    <span
      title={text}
      aria-label={text}
      className="text-muted ml-1 inline-flex cursor-help items-center whitespace-pre-line"
    >
      <Info aria-hidden="true" focusable="false" className="size-3" />
    </span>
  );
}
