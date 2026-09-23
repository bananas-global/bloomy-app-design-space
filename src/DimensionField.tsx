import { useEffect, useState } from "react";
import { dimension } from "./workbench";
export function DimensionField({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);
  function commit() {
    const next = dimension(draft, value, min, max);
    setDraft(String(next));
    onChange(next);
  }
  return (
    <input
      type="number"
      aria-label={label}
      min={min}
      max={max}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
        if (e.key === "Escape") {
          setDraft(String(value));
          e.currentTarget.blur();
        }
      }}
    />
  );
}
