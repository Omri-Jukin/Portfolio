import * as React from "react";
import { cn } from "@/lib/utils";

export function Chip({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-border bg-muted px-2 py-1 font-mono text-xs text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}
