"use client";

import { useId, useMemo, useState } from "react";
import type { GroupingState } from "@tanstack/react-table";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox";
import { columns } from "./columns";

type GroupingComboboxProps = {
  value: GroupingState;
  onValueChange: (value: GroupingState) => void;
};

const options = columns
  .map((column) => ({
    label: column.header,
    value: column.id,
  }))
  .filter(
    (option): option is { label: string; value: string } =>
      typeof option.label === "string" && typeof option.value === "string",
  );

type GroupingOption = (typeof options)[number];

const optionByValue = new Map(
  options.map((option) => [option.value, option] as const),
);

export function GroupingCombobox({
  value,
  onValueChange,
}: GroupingComboboxProps) {
  const inputId = useId();
  const selectedValue = value.flatMap((columnId) => {
    const option = optionByValue.get(columnId);
    return option ? [option] : [];
  });
  const [inputValue, setInputValue] = useState("");
  const filteredOptions = useMemo(() => {
    const normalizedInputValue = inputValue.trim().toLowerCase();

    if (!normalizedInputValue) {
      return options;
    }

    return options.filter((option) =>
      option.label.toLowerCase().includes(normalizedInputValue),
    );
  }, [inputValue]);

  return (
    <Combobox<GroupingOption, true>
      items={options}
      filteredItems={filteredOptions}
      multiple
      value={selectedValue}
      onValueChange={(nextValue) =>
        onValueChange(nextValue.map((option) => option.value))
      }
      onInputValueChange={setInputValue}
      itemToStringLabel={(option) => option.label}
      itemToStringValue={(option) => option.value}
      autoHighlight
    >
      <div className="flex max-w-md flex-col gap-1.5">
        <label htmlFor={inputId} className="text-sm font-medium">
          Group logs by
        </label>
        <ComboboxChips>
          <ComboboxValue>
            {selectedValue.map((option) => (
              <ComboboxChip key={option.value}>{option.label}</ComboboxChip>
            ))}
          </ComboboxValue>
          <ComboboxChipsInput
            id={inputId}
            placeholder={selectedValue.length === 0 ? "Search columns" : ""}
            className="min-w-24 placeholder:text-muted-foreground"
            showClear={selectedValue.length > 0}
          />
          <ComboboxTrigger
            aria-label="Open grouping options"
            className="ml-auto inline-flex size-6 shrink-0 items-center justify-center rounded-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
        </ComboboxChips>
      </div>
      <ComboboxContent sideOffset={4}>
        <ComboboxEmpty>No columns found.</ComboboxEmpty>
        <ComboboxList>
          {(option: GroupingOption) => (
            <ComboboxItem key={option.value} value={option}>
              {option.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
