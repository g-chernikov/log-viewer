import { LOGS_API_URL } from "@/env";
import { useQuery } from "@tanstack/react-query";

import {
  IExportLogsServiceRequest,
  IResourceLogs,
  ILogRecord,
  Resource,
} from "@opentelemetry/otlp-transformer/build/src/logs/internal-types";

function fetchLogs(): Promise<IExportLogsServiceRequest> {
  return fetch(`${LOGS_API_URL}`).then((response) => response.json());
}

export {
  type IExportLogsServiceRequest,
  type IResourceLogs,
  type ILogRecord,
  type Resource,
};

export function useLogs() {
  return useQuery({
    queryKey: ["logs"],
    queryFn: () => fetchLogs(),
    select: (data) => {
      return data.resourceLogs ?? [];
    },
  });
}
