import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  eyebrow?: React.ReactNode;
  headingLevel?: 1 | 2;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
}

export function SectionHeader({
  eyebrow,
  headingLevel = 2,
  title,
  subtitle,
  className,
  ...props
}: SectionHeaderProps) {
  const Heading = headingLevel === 1 ? "h1" : "h2";

  return (
    <div className={cn("max-w-3xl space-y-3", className)} {...props}>
      {eyebrow ? (
        <p className="font-mono text-xs font-semibold uppercase tracking-normal text-cherry">
          {eyebrow}
        </p>
      ) : null}
      <Heading className="font-display text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
        {title}
      </Heading>
      {subtitle ? (
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
