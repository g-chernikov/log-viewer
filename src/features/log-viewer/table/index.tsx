"use client";

import { useRef } from "react";
import { type Table as TanStackTable } from "@tanstack/react-table";

import { Table as UITable } from "@/components/ui/table";

import { TableHeader } from "./table-header";
import { VirtualizedTableBody } from "./virtualized-table-body";
import type { TableRowData } from "../types";

type TableProps = {
  table: TanStackTable<TableRowData>;
};

export function Table({ table }: TableProps) {
  const tableContainerRef = useRef<HTMLDivElement>(null);

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
