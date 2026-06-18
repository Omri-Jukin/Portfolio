import * as React from "react";
import { cn } from "@/lib/utils";

interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Dialog({
  open,
  onOpenChange,
  className,
  children,
  ...props
}: DialogProps) {
  if (!open) return null;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto overflow-x-hidden bg-background/70 p-2 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onOpenChange?.(false);
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "my-2 max-h-[calc(100dvh-1rem)] w-full max-w-[calc(100vw-1rem)] overflow-y-auto overflow-x-hidden rounded-lg border border-border bg-popover p-4 text-popover-foreground shadow-xl sm:my-0 sm:max-h-[calc(100vh-3rem)] sm:max-w-3xl sm:p-6",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4 space-y-1.5", className)} {...props} />;
}

export function DialogTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn("font-display text-xl font-semibold text-foreground", className)}
      {...props}
    />
  );
}
