import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "default" | "accent" | "success" | "warning" | "destructive";

const toneClasses: Record<BadgeTone, string> = {
  default: "border-border bg-muted text-muted-foreground",
  accent: "border-accent/30 bg-accent/10 text-accent",
  success: "border-success/30 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/10 text-warning",
  destructive: "border-destructive/30 bg-destructive/10 text-destructive",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export function Badge({ className, tone = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-medium uppercase leading-5",
        toneClasses[tone],
        className
      )}
      {...props}
    />
  );
}
