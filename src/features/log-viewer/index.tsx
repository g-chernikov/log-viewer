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
    <div>
      <h1 className="text-2xl font-bold">Log Viewer</h1>
      {groupByResourceNode}
      <Table data={data} groupByResource={groupByResource} />
    </div>
  );
}
