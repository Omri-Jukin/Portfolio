import * as React from "react";
import { cn } from "@/lib/utils";

export function Toast({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="status"
      className={cn(
        "rounded-lg border border-border bg-popover px-4 py-3 text-sm text-popover-foreground shadow-lg",
        className
      )}
      {...props}
    />
  );
}
