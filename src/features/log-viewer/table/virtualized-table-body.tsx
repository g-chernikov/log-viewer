import type { RefObject } from "react";
import type { Table as TanStackTable } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";

import { TableBody } from "@/components/ui/table";
import { measureTableRow } from "@/lib/utils";

import type { TableRowData } from "../types";
import { VirtualizedTableRow } from "./virtualized-table-row";

type VirtualizedTableBodyProps = {
  table: TanStackTable<TableRowData>;
  tableContainerRef: RefObject<HTMLDivElement | null>;
};

export function VirtualizedTableBody({
  table,
  tableContainerRef,
}: VirtualizedTableBodyProps) {
  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    count: rows.length,
    estimateSize: () => 36,
    getScrollElement: () => tableContainerRef.current,
    measureElement: measureTableRow,
    overscan: 5,
  });

  return (
    <TableBody
      className="relative grid"
      style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
    >
      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
        const row = rows[virtualRow.index];

        return (
          <VirtualizedTableRow
            key={row.id}
            row={row}
            virtualRow={virtualRow}
            rowVirtualizer={rowVirtualizer}
          />
        );
      })}
    </TableBody>
  );
}
