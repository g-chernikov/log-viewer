"use client";

import { useState } from "react";
import type { GroupingState } from "@tanstack/react-table";

import { GroupingCombobox } from "./grouping-combobox";

export function useGroupingCombobox() {
  const [grouping, setGrouping] = useState<GroupingState>([]);

  return {
    grouping,
    setGrouping,
    node: <GroupingCombobox value={grouping} onValueChange={setGrouping} />,
  };
}
