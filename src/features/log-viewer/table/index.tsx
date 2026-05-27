import type { IResourceLogs } from "@/api/logs";
import { Fragment } from "react";

import {
  Table as UITable,
  TableHeader,
  TableBody,
} from "@/components/ui/table";
import { HeaderRow } from "./header-row";
import { LogRow } from "./log-row";
import { ResourceRow } from "./resource-row";

export function Table({
  data,
  groupByResource,
}: {
  data: IResourceLogs[];
  groupByResource: boolean;
}) {
  return (
    <div>
      <UITable>
        <TableHeader>
          <HeaderRow />
        </TableHeader>
        <TableBody>
          {data.map(({ scopeLogs, resource }, resourceLogsIndex) => {
            return (
              <Fragment key={resourceLogsIndex}>
                {groupByResource && <ResourceRow resource={resource} />}
                {scopeLogs.map(({ logRecords = [] }, scopeLogsIndex) => {
                  return logRecords.map((logRecord, logRecordIndex) => {
                    return (
                      <LogRow
                        key={`${scopeLogsIndex}-${logRecordIndex}`}
                        logRecord={logRecord}
                      />
                    );
                  });
                })}
              </Fragment>
            );
          })}
        </TableBody>
      </UITable>
    </div>
  );
}
