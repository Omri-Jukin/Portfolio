import * as React from "react";
import { cn } from "@/lib/utils";

type AlertTone = "default" | "success" | "warning" | "destructive";

const toneClasses: Record<AlertTone, string> = {
  default: "border-border bg-muted text-foreground",
  success: "border-success/30 bg-success/10 text-foreground",
  warning: "border-warning/30 bg-warning/10 text-foreground",
  destructive: "border-destructive/30 bg-destructive/10 text-foreground",
};

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: AlertTone;
}

export function Alert({ className, tone = "default", ...props }: AlertProps) {
  return (
    <div
      role="status"
      className={cn("rounded-lg border p-4 text-sm leading-6", toneClasses[tone], className)}
      {...props}
    />
  );
}
