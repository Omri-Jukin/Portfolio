import * as React from "react";
import { cn } from "@/lib/utils";

export function CodeBlock({
  className,
  ...props
}: React.HTMLAttributes<HTMLPreElement>) {
  return (
    <pre
      className={cn(
        "overflow-x-auto rounded-lg border border-border bg-muted p-4 font-mono text-sm leading-6 text-foreground",
        className
      )}
      {...props}
    />
  );
}
