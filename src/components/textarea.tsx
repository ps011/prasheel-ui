import * as React from "react";
import { cn } from "../utils.js";

type TextareaProps = React.ComponentPropsWithoutRef<"textarea">;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "min-h-28 w-full min-w-0 rounded-base border-2 border-border bg-background px-3 py-2 text-sm font-normal text-foreground shadow-shadow-sm outline-none ring-offset-background transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);

Textarea.displayName = "Textarea";

export { Textarea, type TextareaProps };
