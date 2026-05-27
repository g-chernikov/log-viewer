import { createColumnHelper } from "@tanstack/react-table";
import { TimeCell } from "./time-cell";
import { SeverityCell } from "./severity-cell";
import { BodyCell } from "./body-cell";
import type { TableData } from "./types";

const columnHelper = createColumnHelper<TableData[number]>();

export const columns = [
  columnHelper.accessor("timeUnixNano", {
    header: "Time",
    size: 220,
    cell: ({ getValue }) => <TimeCell value={getValue()} />,
  }),
  columnHelper.accessor("severityText", {
    id: "Severity",
    header: "Severity",
    size: 120,
    cell: ({ getValue }) => <SeverityCell value={getValue()} />,
  }),
  columnHelper.accessor("body", {
    header: "Body",
    size: 640,
    cell: ({ getValue }) => <BodyCell value={getValue()} />,
  }),
  columnHelper.accessor("resource._id", {
    id: "Resource",
    header: "Resource",
    size: 360,
    cell: ({ getValue }) => getValue(),
  }),
  columnHelper.accessor(
    (row) =>
      row.resource.attributes?.find(({ key }) => key === "service.name")?.value
        .stringValue,
    {
      id: "Service Name",
      header: "Service Name",
      size: 110,
      cell: ({ getValue }) => getValue(),
    },
  ),
  columnHelper.accessor(
    (row) =>
      row.resource.attributes?.find(({ key }) => key === "service.version")
        ?.value.stringValue,
    {
      id: "Service Version",
      header: "Service Version",
      size: 80,
      cell: ({ getValue }) => getValue(),
    },
  ),
];
