import { useState } from "react";

function sliceMiddle(s: string, keepStart = 6, keepEnd = 4) {
  if (!s) return "";
  if (s.length <= keepStart + keepEnd + 1) return s;
  return `${s.slice(0, keepStart)}…${s.slice(-keepEnd)}`;
}

type Props = {
  text: string;
  label?: string;     // defaults to "ID"
  keepStart?: number; // how many chars to keep at the start when collapsed
  keepEnd?: number;   // how many chars to keep at the end when collapsed
  className?: string;
};

export default function RevealId({
  text,
  label = "ID",
  keepStart = 6,
  keepEnd = 4,
  className = "",
}: Readonly<Props>) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? text : sliceMiddle(text, keepStart, keepEnd);

  return (
    <button
      type="button"
      onClick={() => setExpanded((v) => !v)}
      className={
        "inline-flex items-center gap-1 rounded border px-2 py-0.5 text-xs font-mono hover:bg-gray-100 " +
        className
      }
      title={expanded ? "Hide full ID" : "Show full ID"}
    >
      <span className="font-semibold">{label}</span>
      <span>{shown}</span>
    </button>
  );
}
