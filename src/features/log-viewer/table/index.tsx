"use client";

import { useRef } from "react";
import {
  getCoreRowModel,
  useReactTable,
  getExpandedRowModel,
  getGroupedRowModel,
  type OnChangeFn,
  type GroupingState,
} from "@tanstack/react-table";

import { Table as UITable } from "@/components/ui/table";

import type { ResourceLogs } from "@/api/logs";
import { columns } from "./columns";
import { TableHeader } from "./table-header";
import { VirtualizedTableBody } from "./virtualized-table-body";
import { useTableData } from "./use-table-data";

type TableProps = {
  data: ResourceLogs[];
  grouping: GroupingState;
  setGrouping: OnChangeFn<GroupingState>;
};

export function Table({ data, grouping, setGrouping }: TableProps) {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const tableData = useTableData(data);

  const table = useReactTable({
    data: tableData,
    columns,
    groupedColumnMode: "remove",
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getRowCanExpand: () => true,
    state: {
      grouping,
    },

    onGroupingChange: setGrouping,
  });

  return (
    <UITable
      ref={tableContainerRef}
      containerClassName="min-h-0 overflow-auto"
      className="grid"
      style={{ width: "100%", minWidth: table.getTotalSize() }}
    >
      <TableHeader table={table} />
      <VirtualizedTableBody
        table={table}
        tableContainerRef={tableContainerRef}
      />
    </UITable>
  );
}
