"use client";

import {
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { VirtualItem, Virtualizer } from "@tanstack/react-virtual";
import {
  type Cell,
  flexRender,
  getCoreRowModel,
  useReactTable,
  createColumnHelper,
  getExpandedRowModel,
  getGroupedRowModel,
  type GroupingState,
  type Row,
  type Table as TanStackTable,
} from "@tanstack/react-table";

import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { measureTableRow } from "@/lib/utils";
import { BodyCell } from "./body-cell";

import { LogRowDetails } from "./log-row-details";
import { SeverityCell } from "./severity-cell";
import { TimeCell } from "./time-cell";
import type {
  LogRecord,
  ResourceLogs,
  Resource,
  InstrumentationScope,
} from "@/api/logs";

const columnHelper = createColumnHelper<TableData[number]>();

const RESOURCE_COLUMN_ID = "Resource";

const columns = [
  columnHelper.accessor("timeUnixNano", {
    header: "Time",
    size: 220,
    cell: ({ getValue }) => <TimeCell value={getValue()} />,
  }),
  columnHelper.accessor("severityText", {
    id: "Severity",
    header: "Severity",
    size: 120,
    cell: ({ getValue }) => <SeverityCell value={getValue()} />,
  }),
  columnHelper.accessor("body", {
    header: "Body",
    size: 640,
    cell: ({ getValue }) => <BodyCell value={getValue()} />,
  }),
  columnHelper.accessor("resource._id", {
    id: RESOURCE_COLUMN_ID,
    header: "Resource",
    size: 360,
    cell: ({ getValue }) => getValue(),
  }),
  columnHelper.accessor(
    (row) =>
      row.resource.attributes?.find(({ key }) => key === "service.name")?.value
        .stringValue,
    {
      id: "Service Name",
      header: "Service Name",
      size: 110,
      cell: ({ getValue }) => getValue(),
    },
  ),
  columnHelper.accessor(
    (row) =>
      row.resource.attributes?.find(({ key }) => key === "service.version")
        ?.value.stringValue,
    {
      id: "Service Version",
      header: "Service Version",
      size: 80,
      cell: ({ getValue }) => getValue(),
    },
  ),
];

function getColumnSizeStyle(size: number): CSSProperties {
  return {
    width: size,
    minWidth: size,
    maxWidth: size,
    flex: `0 0 ${size}px`,
  };
}

type TableResource = Partial<Resource> & {
  _id: string;
};

type TableRowData = LogRecord & {
  resource: TableResource;
  scope?: InstrumentationScope;
};

type TableData = TableRowData[];

export function Table({ data }: { data: ResourceLogs[] }) {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [grouping, setGrouping] = useState<GroupingState>([]);

  const tableData = useMemo<TableData>(() => {
    return data.flatMap(({ resource, scopeLogs }) => {
      const enrichedResource = {
        _id: `resource-${crypto.randomUUID()}`,
        ...resource,
      };
      return scopeLogs.flatMap(({ scope, logRecords = [] }) => {
        return logRecords.map((logRecord) => {
          return {
            ...logRecord,
            resource: enrichedResource,
            scope,
          };
        });
      });
    });
  }, [data]);

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
      <TableHeader className="sticky top-0 z-10 grid bg-background">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="flex w-full">
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                className="flex min-w-0 overflow-hidden"
                style={getColumnSizeStyle(header.getSize())}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <VirtualizedTableBody
        table={table}
        tableContainerRef={tableContainerRef}
      />
    </UITable>
  );
}

type VirtualizedTableBodyProps = {
  table: TanStackTable<TableRowData>;
  tableContainerRef: RefObject<HTMLDivElement | null>;
};

function VirtualizedTableBody({
  table,
  tableContainerRef,
}: VirtualizedTableBodyProps) {
  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    count: rows.length,
    estimateSize: () => 24,
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

type VirtualizedTableRowProps = {
  row: Row<TableRowData>;
  virtualRow: VirtualItem;
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement>;
};

function VirtualizedTableRow({
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
            <CellContent cell={cell} row={row} />
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

function CellContent({
  cell,
  row,
}: {
  cell: Cell<TableRowData, unknown>;
  row: Row<TableRowData>;
}) {
  return flexRender(cell.column.columnDef.cell, cell.getContext());
}
