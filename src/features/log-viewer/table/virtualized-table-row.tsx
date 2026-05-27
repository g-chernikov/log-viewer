import type { VirtualItem, Virtualizer } from "@tanstack/react-virtual";
import { flexRender, type Cell, type Row } from "@tanstack/react-table";

import { TableCell, TableRow } from "@/components/ui/table";

import { LogRowDetails } from "./log-row-details";
import type { TableRowData } from "./types";

type VirtualizedTableRowProps = {
  row: Row<TableRowData>;
  virtualRow: VirtualItem;
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement>;
};

export function VirtualizedTableRow({
  row,
  virtualRow,
  rowVirtualizer,
}: VirtualizedTableRowProps) {
  const isGroupedRow = row.getIsGrouped();

  return (
    <TableRow
      data-index={virtualRow.index}
      ref={(node) => rowVirtualizer.measureElement(node)}
      aria-expanded={row.getCanExpand() ? row.getIsExpanded() : undefined}
      className={
        row.getCanExpand()
          ? "absolute flex w-full cursor-pointer flex-wrap"
          : "absolute flex w-full bg-muted/20"
      }
      style={{ transform: `translateY(${virtualRow.start}px)` }}
      onClick={row.getCanExpand() ? row.getToggleExpandedHandler() : undefined}
    >
      {isGroupedRow ? (
        <TableCell>
          <span aria-hidden>{row.getIsExpanded() ? "-" : "+"}</span>
          {row.getGroupingValue(row.groupingColumnId!) as string}
          <span className="text-muted-foreground">({row.subRows.length})</span>
        </TableCell>
      ) : (
        row.getVisibleCells().map((cell) => (
          <TableCell
            key={cell.id}
            className="flex"
            style={{ width: cell.column.getSize() }}
          >
            <CellContent cell={cell} />
          </TableCell>
        ))
      )}
      {!isGroupedRow && row.getIsExpanded() && (
        <TableCell
          colSpan={row.getVisibleCells().length}
          className="w-full whitespace-normal border-t bg-muted/20 px-2 py-3 text-muted-foreground"
        >
          <LogRowDetails log={row.original} />
        </TableCell>
      )}
    </TableRow>
  );
}

function CellContent({ cell }: { cell: Cell<TableRowData, unknown> }) {
  return flexRender(cell.column.columnDef.cell, cell.getContext());
}
