import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export function useGroupByResourceSwitch() {
  const [groupByResource, setGroupByResource] = useState(false);
  return {
    groupByResource,
    node: (
      <Switch checked={groupByResource} onCheckedChange={setGroupByResource} />
    ),
  };
}
