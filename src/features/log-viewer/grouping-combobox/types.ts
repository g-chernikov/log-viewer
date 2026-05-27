export type GroupingComboboxOption = {
  label: string;
  value: string;
};

type GroupingState = string[];

export type GroupingComboboxProps = {
  grouping: GroupingState;
  options: GroupingComboboxOption[];
  setGrouping: (grouping: GroupingState) => void;
};
