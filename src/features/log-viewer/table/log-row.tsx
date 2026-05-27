import type { ILogRecord } from "@/api/logs";
import { TableCell, TableRow } from "@/components/ui/table";

export function LogRow({ logRecord }: { logRecord: ILogRecord }) {
  const { severityNumber, body } = logRecord;

  return (
    <TableRow>
      <TableCell>time</TableCell>
      <TableCell>{severityNumber}</TableCell>
      <TableCell>{JSON.stringify(body)}</TableCell>
    </TableRow>
  );
}
