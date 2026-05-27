import { getDateFromUnixNano } from "./time";
import type { Fixed64 } from "@/api/logs";

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "medium",
});

export function TimeCell({ value }: { value: Fixed64 }) {
  const date = getDateFromUnixNano(value);

  if (!date) {
    return <span className="text-muted-foreground">Unknown time</span>;
  }

  return (
    <time
      dateTime={date.toISOString()}
      title={date.toISOString()}
      className="whitespace-nowrap font-mono text-xs tabular-nums"
    >
      {timeFormatter.format(date)}
    </time>
  );
}
