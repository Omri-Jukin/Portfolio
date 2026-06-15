import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <div className={cn("max-w-3xl space-y-3", className)} {...props}>
      {eyebrow ? (
        <p className="font-mono text-xs font-semibold uppercase tracking-normal text-accent">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
