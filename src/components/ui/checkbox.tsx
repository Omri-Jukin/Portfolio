import * as React from "react";
import { cn } from "@/lib/utils";

export const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type = "checkbox", ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      "h-4 w-4 rounded border border-input bg-background text-accent accent-[var(--accent)] focus-visible:ring-2 focus-visible:ring-ring",
      className
    )}
    {...props}
  />
));
Checkbox.displayName = "Checkbox";
