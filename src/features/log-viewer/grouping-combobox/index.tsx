"use client";

import { useId, useMemo, useState } from "react";

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
import type { GroupingComboboxOption, GroupingComboboxProps } from "./types";

export function GroupingCombobox({
  grouping,
  options,
  setGrouping,
}: GroupingComboboxProps) {
  const inputId = useId();
  const optionByValue = useMemo(() => {
    return new Map(options.map((option) => [option.value, option] as const));
  }, [options]);
  const selectedValue = useMemo(
    () =>
      grouping.flatMap((columnId) => {
        const option = optionByValue.get(columnId);
        return option ? [option] : [];
      }),
    [grouping, optionByValue],
  );
  const [inputValue, setInputValue] = useState("");
  const filteredOptions = useMemo(() => {
    const normalizedInputValue = inputValue.trim().toLowerCase();

    if (!normalizedInputValue) {
      return options;
    }

    return options.filter((option) =>
      option.label.toLowerCase().includes(normalizedInputValue),
    );
  }, [inputValue, options]);

  return (
    <Combobox<GroupingComboboxOption, true>
      items={options}
      filteredItems={filteredOptions}
      multiple
      value={selectedValue}
      onValueChange={(nextValue) =>
        setGrouping(nextValue.map((option) => option.value))
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
          {(option: GroupingComboboxOption) => (
            <ComboboxItem key={option.value} value={option}>
              {option.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
