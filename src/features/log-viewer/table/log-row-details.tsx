import type { LogRecord } from "@/api/logs";

export function LogRowDetails({ log }: { log: LogRecord }) {
  return (
    <pre className="overflow-x-auto whitespace-pre-wrap wrap-break-word font-mono text-xs text-foreground">
      {JSON.stringify(log.attributes, null, 2)}
    </pre>
  );
}
