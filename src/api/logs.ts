import { LOGS_API_URL } from "@/env";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type {
  IExportLogsServiceRequest as ExportLogsServiceRequest,
  IResourceLogs as ResourceLogs,
  ILogRecord as LogRecord,
} from "@opentelemetry/otlp-transformer/build/src/logs/internal-types";

export type {
  Resource,
  IInstrumentationScope as InstrumentationScope,
  Fixed64,
} from "@opentelemetry/otlp-transformer/build/src/common/internal-types";

export type { ExportLogsServiceRequest, ResourceLogs, LogRecord };

export type Logs = ResourceLogs[];

const logsQueryKey = ["logs"] as const;

function fetchLogs(): Promise<ExportLogsServiceRequest> {
  return fetch(`${LOGS_API_URL}`).then((response) => response.json());
}

export function useLogs(): UseQueryResult<Logs, Error> {
  return useQuery<ExportLogsServiceRequest, Error, Logs, typeof logsQueryKey>({
    queryKey: logsQueryKey,
    queryFn: fetchLogs,
    select: (data): Logs => {
      return data.resourceLogs ?? [];
    },
  });
}
