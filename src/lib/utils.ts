import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function getMeasureTableRow():
  | ((element: HTMLTableRowElement) => number)
  | undefined {
  const isBrowser = typeof window !== "undefined";
  if (!isBrowser) {
    return undefined;
  }

  const isFirefox = navigator.userAgent.indexOf("Firefox") !== -1;

  if (isFirefox) {
    // Firefox measures table border height incorrectly
    return undefined;
  }

  return (element) => element.getBoundingClientRect().height;
}

export const measureTableRow = getMeasureTableRow();
