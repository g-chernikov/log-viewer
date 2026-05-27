import { useMemo } from "react";
import type { Row, Table as TanStackTable } from "@tanstack/react-table";

import { getUnixMillisecondsFromUnixNano } from "./time";
import type { TableRowData } from "./types";
import { fallbackGroupingValue } from "./utils";
import type { HistogramData, Bin } from "./histogram";

export type ColumnId = string;
export type ColumnValue = string;
export type Column = [ColumnId, ColumnValue];
export type Group = Column[];

export type GroupId = string;
export type Count = number;
export type Interval = number;

const HISTOGRAM_INTERVAL_MILLISECONDS = 60 * 60 * 1_000;

export function useHistogramData(
  table: TanStackTable<TableRowData>,
): HistogramData {
  const groupedRows = table.getGroupedRowModel().rows;

  const columnLabelById = useMemo(() => {
    return new Map(
      table.getAllColumns().flatMap((column) => {
        const header = column.columnDef.header;

        return typeof header === "string" ? [[column.id, header] as const] : [];
      }),
    );
  }, [table]);

  return useMemo<HistogramData>(() => {
    const bins = new Map<Interval, Map<GroupId, Count>>();
    const groups = new Map<GroupId, Group>();

    const getGroupId = (group: Group): GroupId => {
      return group.length === 0 ? "logs" : JSON.stringify(group);
    };

    const getGroupLabel = (group: Group): string => {
      return group.length === 0
        ? "Logs"
        : group
            .map(([id, value]) => `${columnLabelById.get(id) ?? id}: ${value}`)
            .join(" / ");
    };

    const incrementBin = (interval: Interval, groupId: GroupId) => {
      const countsByGroup = bins.get(interval) ?? new Map<GroupId, Count>();
      countsByGroup.set(groupId, (countsByGroup.get(groupId) ?? 0) + 1);
      bins.set(interval, countsByGroup);
    };

    const visitRow = (row: Row<TableRowData>, currentGroup: Group) => {
      if (row.getIsGrouped()) {
        const columnId = row.groupingColumnId;

        if (!columnId) {
          return;
        }

        const columnValue = fallbackGroupingValue(
          row.getGroupingValue(columnId),
        );

        const column = [columnId, columnValue] satisfies Column;
        const nextGroup = [...currentGroup, column];

        for (const subRow of row.subRows) {
          visitRow(subRow, nextGroup);
        }

        return;
      }

      const unixMilliseconds = getUnixMillisecondsFromUnixNano(
        row.original.timeUnixNano,
      );

      if (unixMilliseconds === null) {
        return;
      }

      const interval =
        Math.floor(unixMilliseconds / HISTOGRAM_INTERVAL_MILLISECONDS) *
        HISTOGRAM_INTERVAL_MILLISECONDS;
      const groupId = getGroupId(currentGroup);
      groups.set(groupId, currentGroup);
      incrementBin(interval, groupId);
    };

    for (const row of groupedRows) {
      visitRow(row, []);
    }

    const histogramGroups = [...groups.entries()]
      .map(([key, group]) => ({
        key,
        label: getGroupLabel(group),
      }))
      .sort((groupA, groupB) => groupA.label.localeCompare(groupB.label));
    const histogramBins = [...bins.entries()].map(([time, countsByGroup]) => {
      const bin: Bin = { time };

      for (const group of histogramGroups) {
        bin[group.key] = countsByGroup.get(group.key) ?? 0;
      }

      return bin;
    });

    return { bins: histogramBins, groups: histogramGroups };
  }, [columnLabelById, groupedRows]);
}
