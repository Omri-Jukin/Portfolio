import * as React from "react";
import { cn } from "@/lib/utils";

export function DropdownMenu({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("relative inline-block", className)} {...props} />;
}

export function DropdownMenuContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "absolute right-0 z-50 mt-2 min-w-44 rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg",
        className
      )}
      {...props}
    />
  );
}

export function DropdownMenuItem({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-muted",
        className
      )}
      {...props}
    />
  );
}
