import { TableData } from "./types";
import { ResourceLogs } from "@/api/logs";
import { useMemo } from "react";

export function useTableData(data: ResourceLogs[]): TableData {
  return useMemo<TableData>(() => {
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
}
