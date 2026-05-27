import { createColumnHelper } from "@tanstack/react-table";
import { TimeCell } from "./time-cell";
import { SeverityCell } from "./severity-cell";
import { BodyCell } from "./body-cell";
import type { TableData } from "../types";

const columnHelper = createColumnHelper<TableData[number]>();

export const columns = [
  columnHelper.accessor("timeUnixNano", {
    header: "Time",
    size: 220,
    enableGrouping: false,
    cell: ({ getValue }) => <TimeCell value={getValue()} />,
  }),
  columnHelper.accessor("severityText", {
    id: "severity",
    header: "Severity",
    size: 120,
    enableGrouping: true,
    cell: ({ getValue }) => <SeverityCell value={getValue()} />,
  }),
  columnHelper.accessor("body", {
    header: "Body",
    size: 640,
    enableGrouping: false,
    cell: ({ getValue }) => <BodyCell value={getValue()} />,
  }),
  columnHelper.accessor("resource._id", {
    id: "resource",
    header: "Resource",
    size: 360,
    enableGrouping: true,
    cell: ({ getValue }) => getValue(),
  }),
  columnHelper.accessor(
    // TODO: make a map of the attributes to get with O(1)
    (row) =>
      row.resource.attributes?.find(({ key }) => key === "service.name")?.value
        .stringValue,
    {
      id: "service.name",
      header: "Service Name",
      enableGrouping: true,
      size: 110,
      cell: ({ getValue }) => getValue(),
    },
  ),
  columnHelper.accessor(
    (row) =>
      row.resource.attributes?.find(({ key }) => key === "service.version")
        ?.value.stringValue,
    {
      id: "service.version",
      header: "Service Version",
      enableGrouping: true,

      size: 120,
      cell: ({ getValue }) => getValue(),
    },
  ),
];
