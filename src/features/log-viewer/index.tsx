"use client";

import { useLogs } from "@/api/logs";

export function LogViewer() {
  const { data, isLoading, isError, error } = useLogs();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Log Viewer</h1>
      {JSON.stringify(data, null, 2)}
    </div>
  );
}
