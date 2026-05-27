import { TableCell, TableRow } from "@/components/ui/table";
import { type Resource } from "@/api/logs";

export function ResourceRow({ resource }: { resource?: Resource }) {
  return (
    <TableRow>
      <TableCell>{JSON.stringify(resource)}</TableCell>
    </TableRow>
  );
}
