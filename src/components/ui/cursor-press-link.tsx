"use client";

import * as React from "react";
import Link, { type LinkProps } from "next/link";
import { cn } from "@/lib/utils";

type PressLinkVariant = "solid" | "outline" | "ghost" | "quiet";
type PressLinkSize = "sm" | "md" | "lg" | "icon";

type CursorPressVars = React.CSSProperties & {
  "--press-x"?: string;
  "--press-y"?: string;
  "--press-rotate-x"?: string;
  "--press-rotate-y"?: string;
};

export interface CursorPressLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: LinkProps["href"];
  variant?: PressLinkVariant;
  size?: PressLinkSize;
}

const variantClasses: Record<PressLinkVariant, string> = {
  solid:
    "bg-accent text-accent-foreground shadow-[var(--shadow-subtle)] hover:bg-accent/90",
  outline:
    "border border-border bg-background text-foreground shadow-[var(--shadow-subtle)] hover:border-accent/50 hover:bg-accent/10",
  ghost: "text-foreground hover:bg-accent/10 hover:text-accent",
  quiet: "text-muted-foreground hover:bg-muted hover:text-foreground",
};

const sizeClasses: Record<PressLinkSize, string> = {
  sm: "h-8 gap-1.5 px-3 text-xs",
  md: "h-10 gap-2 px-4 text-sm",
  lg: "h-11 gap-2.5 px-5 text-sm",
  icon: "h-10 w-10 p-0",
};

function getPressVars(event: React.PointerEvent<HTMLElement>): CursorPressVars {
  const rect = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;

  return {
    "--press-x": `${x * 4}px`,
    "--press-y": `${y * 3}px`,
    "--press-rotate-x": `${y * -5}deg`,
    "--press-rotate-y": `${x * 6}deg`,
  };
}

const resetPressVars: CursorPressVars = {
  "--press-x": "0px",
  "--press-y": "0px",
  "--press-rotate-x": "0deg",
  "--press-rotate-y": "0deg",
};

export const CursorPressLink = React.forwardRef<
  HTMLAnchorElement,
  CursorPressLinkProps
>(
  (
    {
      className,
      style,
      variant = "outline",
      size = "md",
      onPointerMove,
      onPointerLeave,
      onPointerDown,
      ...props
    },
    ref
  ) => {
    const [pressVars, setPressVars] =
      React.useState<CursorPressVars>(resetPressVars);

    return (
      <Link
        ref={ref}
        className={cn(
          "cursor-press inline-flex max-w-full shrink-0 items-center justify-center rounded-md font-medium transition-[background-color,border-color,color,opacity,transform] duration-200 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        style={{ ...style, ...pressVars }}
        onPointerMove={(event) => {
          setPressVars(getPressVars(event));
          onPointerMove?.(event);
        }}
        onPointerDown={(event) => {
          setPressVars(getPressVars(event));
          onPointerDown?.(event);
        }}
        onPointerLeave={(event) => {
          setPressVars(resetPressVars);
          onPointerLeave?.(event);
        }}
        {...props}
      />
    );
  }
);

CursorPressLink.displayName = "CursorPressLink";
