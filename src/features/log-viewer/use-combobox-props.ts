"use client";

import { useCallback, useMemo } from "react";
import type {
  GroupingState,
  Table as TanStackTable,
} from "@tanstack/react-table";

import type {
  GroupingComboboxOption,
  GroupingComboboxProps,
} from "./grouping-combobox/types";
import type { TableRowData } from "./types";

export function useComboboxProps(
  table: TanStackTable<TableRowData>,
): GroupingComboboxProps {
  const options = useMemo<GroupingComboboxOption[]>(() => {
    return table
      .getAllLeafColumns()
      .filter((column) => column.getCanGroup())
      .flatMap((column) => {
        const header = column.columnDef.header;

        return typeof header === "string"
          ? [{ label: header, value: column.id }]
          : [];
      });
  }, [table]);

  const setGrouping = useCallback(
    (nextGrouping: GroupingState) => {
      table.setGrouping(nextGrouping);
    },
    [table],
  );

  return {
    grouping: table.getState().grouping,
    options,
    setGrouping,
  };
}
