import { Badge } from "@/components/ui/badge";

type BadgeVariant = NonNullable<Parameters<typeof Badge>[0]["variant"]>;

enum Severity {
  Error = "Error",
  Warn = "Warn",
  Info = "Info",
  Debug = "Debug",
  Trace = "Trace",
  Fatal = "Fatal",
  Unspecified = "Unspecified",
  Unknown = "Unknown",
}

const severityTextMap: Partial<Record<string, Severity>> = {
  UNSPECIFIED: Severity.Unspecified,
  ERROR: Severity.Error,
  ERROR2: Severity.Error,
  ERROR3: Severity.Error,
  ERROR4: Severity.Error,
  WARN: Severity.Warn,
  WARN2: Severity.Warn,
  WARN3: Severity.Warn,
  WARN4: Severity.Warn,
  INFO: Severity.Info,
  INFO2: Severity.Info,
  INFO3: Severity.Info,
  INFO4: Severity.Info,
  DEBUG: Severity.Debug,
  DEBUG2: Severity.Debug,
  DEBUG3: Severity.Debug,
  DEBUG4: Severity.Debug,
  TRACE: Severity.Trace,
  TRACE2: Severity.Trace,
  TRACE3: Severity.Trace,
  TRACE4: Severity.Trace,
  FATAL: Severity.Fatal,
  FATAL2: Severity.Fatal,
  FATAL3: Severity.Fatal,
  FATAL4: Severity.Fatal,
};

// TODO add custom colors
const severityVariantMap = {
  [Severity.Error]: "destructive",
  [Severity.Fatal]: "destructive",
  [Severity.Warn]: "default",
  [Severity.Trace]: "secondary",
  [Severity.Info]: "secondary",
  [Severity.Debug]: "outline",
  [Severity.Unspecified]: "outline",
  [Severity.Unknown]: "outline",
} as const satisfies Record<Severity, BadgeVariant>;

function getSeverity(text?: string): Severity {
  const severityText = text?.trim().toUpperCase();

  if (!severityText) {
    return Severity.Unknown;
  }

  return severityTextMap[severityText] ?? Severity.Unknown;
}

function getSeverityVariant(severity: Severity): BadgeVariant {
  return severityVariantMap[severity];
}

export function SeverityCell({ value }: { value?: string }) {
  if (!value) {
    return null;
  }

  const severityValue = getSeverity(value);
  const variant = getSeverityVariant(severityValue);

  return <Badge variant={variant}>{value}</Badge>;
}
