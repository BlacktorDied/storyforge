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
      ⓘ
    </span>
  );
}
