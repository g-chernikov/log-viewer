import { InstrumentationScope, LogRecord, Resource } from "@/api/logs";

export type TableResource = Partial<Resource> & {
  _id: string;
};

export type TableRowData = LogRecord & {
  resource: TableResource;
  scope?: InstrumentationScope;
};

export type TableData = TableRowData[];
