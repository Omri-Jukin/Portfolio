import * as React from "react";
import { cn } from "@/lib/utils";

export function LoadingState({
  className,
  children = "Loading",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex min-h-32 items-center justify-center rounded-lg border border-border bg-muted/40 p-6 text-sm text-muted-foreground",
        className
      )}
      {...props}
    >
      <span className="h-2 w-2 rounded-full bg-accent" />
      <span className="ml-3">{children}</span>
    </div>
  );
}

export function EmptyState({
  className,
  children = "No records found.",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center text-sm text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
