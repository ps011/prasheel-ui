import * as React from "react";
import { cn } from "../utils.js";

export type SegmentedOption<Value extends string> = {
  value: Value;
  label: React.ReactNode;
  disabled?: boolean;
};

export type SegmentedControlProps<Value extends string> = {
  "aria-label": string;
  value: Value;
  options: readonly SegmentedOption<Value>[];
  onValueChange: (value: Value) => void;
  className?: string;
};

export function SegmentedControl<Value extends string>({
  value,
  options,
  onValueChange,
  className,
  ...props
}: SegmentedControlProps<Value>) {
  return <div role="group" aria-label={props["aria-label"]} className={cn("ps-segmented-control", className)}>
    {options.map(option => <button
      key={option.value}
      type="button"
      className="ps-segmented-control__item"
      aria-pressed={option.value === value}
      data-state={option.value === value ? "active" : "inactive"}
      disabled={option.disabled}
      onClick={() => onValueChange(option.value)}
    >{option.label}</button>)}
  </div>;
}
