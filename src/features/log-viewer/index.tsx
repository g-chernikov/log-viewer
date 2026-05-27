"use client";

import { useLogs } from "@/api/logs";
import { Table } from "./table";
import { useGroupingCombobox } from "./table/use-grouping-combobox";

export function LogViewer() {
  const { data, isPending, error } = useLogs();

  const { grouping, setGrouping, node: groupingComboboxNode } =
    useGroupingCombobox();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="grid h-dvh grid-rows-[auto_minmax(0,1fr)] gap-4 p-4">
      {groupingComboboxNode}
      <Table data={data} grouping={grouping} setGrouping={setGrouping} />
    </div>
  );
}
