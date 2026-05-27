"use client";

import { useLogs } from "@/api/logs";
import { Table } from "./table";
import { getCoreRowModel, getExpandedRowModel } from "@tanstack/react-table";
import { getGroupedRowModel } from "@tanstack/react-table";
import { useTableData } from "./use-table-data";
import { useReactTable } from "@tanstack/react-table";
import type { ResourceLogs } from "@/api/logs";
import { columns } from "./table/columns";
import { Histogram } from "./histogram";
import { useHistogramData } from "./use-histogram-data";
import { GroupingCombobox } from "./grouping-combobox";
import { useComboboxProps } from "./use-combobox-props";

export function LogViewer() {
  const { data, isPending, error } = useLogs();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <LogViewerContent data={data} />;
}

export function LogViewerContent({ data }: { data: ResourceLogs[] }) {
  const tableData = useTableData(data);

  const table = useReactTable({
    data: tableData,
    columns,
    groupedColumnMode: "remove",
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getRowCanExpand: () => true, // TODO: make it dynamic
  });

  const groupingComboboxProps = useComboboxProps(table);
  const histogramData = useHistogramData(table);

  return (
    <div className="grid h-dvh grid-rows-[auto_minmax(0,1fr)_minmax(0,2fr)] gap-4 p-4">
      <GroupingCombobox {...groupingComboboxProps} />
      <Histogram data={histogramData} />
      <Table table={table} />
    </div>
  );
}
