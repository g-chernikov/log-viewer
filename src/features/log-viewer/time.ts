import type { Fixed64 } from "@/api/logs";

const NANOSECONDS_PER_MILLISECOND = BigInt(1_000_000);

function fixed64ToBigInt(value: Fixed64): bigint | null {
  if (typeof value === "string") {
    try {
      return BigInt(value);
    } catch {
      return null;
    }
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? BigInt(Math.trunc(value)) : null;
  }

  return (BigInt(value.high >>> 0) << BigInt(32)) | BigInt(value.low >>> 0);
}

export function getUnixMillisecondsFromUnixNano(
  timeUnixNano: Fixed64,
): number | null {
  const unixNano = fixed64ToBigInt(timeUnixNano);

  if (unixNano === null) {
    return null;
  }

  const unixMilliseconds = Number(unixNano / NANOSECONDS_PER_MILLISECOND);

  return Number.isFinite(unixMilliseconds) ? unixMilliseconds : null;
}

export function getDateFromUnixNano(timeUnixNano: Fixed64): Date | null {
  const unixMilliseconds = getUnixMillisecondsFromUnixNano(timeUnixNano);

  if (unixMilliseconds === null) {
    return null;
  }

  const date = new Date(unixMilliseconds);

  return Number.isNaN(date.getTime()) ? null : date;
}
