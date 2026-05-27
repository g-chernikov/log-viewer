"use client";

import { useLogs } from "@/api/logs";
import { Table } from "./table";
import { useGroupByResourceSwitch } from "./group-by-resource-switch";

export function LogViewer() {
  const { data, isPending, error } = useLogs();

  const { groupByResource, node: groupByResourceNode } =
    useGroupByResourceSwitch();
  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="grid h-dvh grid-rows-[minmax(0,1fr)_minmax(0,2fr)] gap-4 p-4">
      {groupByResourceNode}
      <Table data={data} />
    </div>
  );
}
