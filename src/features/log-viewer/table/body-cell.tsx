import { Badge } from "@/components/ui/badge";
import type { AnyValue } from "../types";

type RenderableBodyValue =
  | { type: "string"; value: string }
  | { type: "boolean"; value: boolean }
  | { type: "number"; value: number };

function getRenderableBodyValue(body?: AnyValue): RenderableBodyValue | null {
  if (!body) {
    return null;
  }

  if (typeof body.stringValue === "string") {
    return { type: "string", value: body.stringValue };
  }

  if (typeof body.boolValue === "boolean") {
    return { type: "boolean", value: body.boolValue };
  }

  if (typeof body.intValue === "number") {
    return { type: "number", value: body.intValue };
  }

  if (typeof body.doubleValue === "number") {
    return { type: "number", value: body.doubleValue };
  }

  return null;
}

function StringBodyValue({ value }: { value: string }) {
  return (
    <span className="min-w-0 truncate" title={value}>
      {value}
    </span>
  );
}

function BooleanBodyValue({ value }: { value: boolean }) {
  return <Badge variant="outline">{String(value)}</Badge>;
}

function NumberBodyValue({ value }: { value: number }) {
  return <span className="font-mono text-xs tabular-nums">{value}</span>;
}

export function BodyCell({ value }: { value?: AnyValue }) {
  const renderableBody = getRenderableBodyValue(value);

  if (!renderableBody) {
    return null;
  }

  if (renderableBody.type === "string") {
    return <StringBodyValue value={renderableBody.value} />;
  }

  if (renderableBody.type === "boolean") {
    return <BooleanBodyValue value={renderableBody.value} />;
  }

  return <NumberBodyValue value={renderableBody.value} />;
}
