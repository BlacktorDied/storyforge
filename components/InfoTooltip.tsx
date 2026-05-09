type Props = {
  text: string;
};

export default function InfoTooltip({ text }: Props) {
  return (
    <span
      title={text}
      className="ml-1 cursor-help text-muted whitespace-pre-line"
    >
      ⓘ
    </span>
  );
}
