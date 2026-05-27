import type { CSSProperties } from "react";

export function getColumnSizeStyle(size: number): CSSProperties {
  return {
    width: size,
    minWidth: size,
    maxWidth: size,
    flex: `0 0 ${size}px`,
  };
}
