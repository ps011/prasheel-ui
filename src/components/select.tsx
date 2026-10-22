import * as React from "react";
import { cn } from "../utils.js";

export type SelectProps = React.ComponentPropsWithoutRef<"select">;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, ...props }, ref) => <select ref={ref} className={cn("ps-select", className)} {...props} />,
);

Select.displayName = "Select";
