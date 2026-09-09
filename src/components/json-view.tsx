import { Fragment, type ReactNode } from "react";

const TOKEN =
  /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false)\b|\bnull\b|-?\d+(?:\.\d+)?/g;

/** Small JSON colouriser. Keys violet, strings rose, numbers warning, booleans success. */
export function JsonView({ value }: { value: unknown }) {
  const text = JSON.stringify(value, null, 2);
  const parts: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = TOKEN.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const [raw, str, colon, bool] = match;
    if (str && colon) {
      parts.push(
        <Fragment key={match.index}>
          <span className="text-violet">{str}</span>
          <span className="text-text-3">{colon}</span>
        </Fragment>,
      );
    } else if (str) {
      parts.push(
        <span key={match.index} className="text-rose">
          {str}
        </span>,
      );
    } else if (bool) {
      parts.push(
        <span key={match.index} className="text-success">
          {raw}
        </span>,
      );
    } else if (raw === "null") {
      parts.push(
        <span key={match.index} className="text-text-3">
          {raw}
        </span>,
      );
    } else {
      parts.push(
        <span key={match.index} className="text-warning">
          {raw}
        </span>,
      );
    }
    last = match.index + raw.length;
  }
  parts.push(text.slice(last));

  return (
    <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-text-2">
      {parts}
    </pre>
  );
}
