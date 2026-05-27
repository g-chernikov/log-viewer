"use client";

import { useMemo } from "react";
import type { EChartsOption } from "echarts";
import ReactECharts from "echarts-for-react";

type GroupId = string;
type Count = number;

export type Bin = {
  time: number;
  [dimension: GroupId]: Count;
};

export type Group = {
  key: GroupId;
  label: string;
};

export type HistogramData = {
  bins: Bin[];
  groups: Group[];
};

type HistogramProps = {
  data: HistogramData;
};

export function Histogram({ data: histogram }: HistogramProps) {
  const option = useMemo<EChartsOption>(
    () => ({
      dataset: {
        dimensions: ["time", ...histogram.groups.map((group) => group.key)],
        source: histogram.bins,
      },
      grid: {
        bottom: 0,
        left: 0,
        right: 0,
      },
      tooltip: {
        trigger: "axis",
        confine: true,
      },
      xAxis: {
        type: "time",
      },
      legend: {
        type: "scroll",
        top: 0,
      },
      yAxis: {
        minInterval: 1,
        name: "Count",
        type: "value",
      },
      series: histogram.groups.map((group) => ({
        encode: {
          x: "time",
          y: group.key,
        },
        id: group.key,
        name: group.label,
        stack: "logs",
        type: "bar",
      })),
    }),
    [histogram],
  );

  return (
    <ReactECharts
      className="min-h-0 min-w-0 rounded-md w-full border h-full"
      notMerge
      // reset default styles
      style={{ height: undefined }}
      option={option}
    />
  );
}
