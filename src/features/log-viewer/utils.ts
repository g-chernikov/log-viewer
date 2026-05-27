export function fallbackGroupingValue(value: unknown): string {
  if (!value) {
    return "No value";
  }

  if (typeof value === "string") {
    return value;
  }

  throw new Error("Invalid grouping value");
}
