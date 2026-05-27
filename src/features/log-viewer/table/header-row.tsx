import { TableHead, TableRow } from "@/components/ui/table";

export function HeaderRow() {
  return (
    <TableRow>
      <TableHead>Time</TableHead>
      <TableHead>Severity</TableHead>
      <TableHead>Body</TableHead>
    </TableRow>
  );
}
