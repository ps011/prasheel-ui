import * as React from "react";
import { cn } from "../utils.js";

type CheckboxProps = Omit<React.ComponentPropsWithoutRef<"input">, "type">;

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      type="checkbox"
      className={cn(
        "size-4 shrink-0 accent-main disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);

Checkbox.displayName = "Checkbox";

export { Checkbox, type CheckboxProps };
