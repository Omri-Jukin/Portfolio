import * as React from "react";
import { cn } from "@/lib/utils";

export function TabsList({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex rounded-lg border border-border bg-muted p-1",
        className
      )}
      {...props}
    />
  );
}

interface TabButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export function TabButton({
  className,
  active = false,
  type = "button",
  ...props
}: TabButtonProps) {
  return (
    <button
      role="tab"
      aria-selected={active}
      type={type}
      className={cn(
        "rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors",
        active && "bg-background text-foreground shadow-[var(--shadow-subtle)]",
        className
      )}
      {...props}
    />
  );
}
