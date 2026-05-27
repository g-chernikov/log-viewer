import { flexRender, type Table as TanStackTable } from "@tanstack/react-table";

import {
  TableHead,
  TableHeader as UITableHeader,
  TableRow,
} from "@/components/ui/table";

import { getColumnSizeStyle } from "./column-size";
import type { TableRowData } from "./types";

type TableHeaderProps = {
  table: TanStackTable<TableRowData>;
};

export function TableHeader({ table }: TableHeaderProps) {
  return (
    <UITableHeader className="sticky top-0 z-10 grid bg-background">
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
                : flexRender(header.column.columnDef.header, header.getContext())}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </UITableHeader>
  );
}
