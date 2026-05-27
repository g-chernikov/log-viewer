import { IResourceLogs } from "@/api/logs";

export function Table({
  data,
  groupByResource,
}: {
  data: IResourceLogs[];
  groupByResource: boolean;
}) {
  return <div>{JSON.stringify(data, null, 2)}</div>;
}
