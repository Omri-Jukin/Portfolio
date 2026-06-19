"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "solid" | "ghost" | "outline" | "quiet" | "destructive";
type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

type CursorPressVars = React.CSSProperties & {
  "--press-x"?: string;
  "--press-y"?: string;
  "--press-rotate-x"?: string;
  "--press-rotate-y"?: string;
};

const resetPressVars: CursorPressVars = {
  "--press-x": "0px",
  "--press-y": "0px",
  "--press-rotate-x": "0deg",
  "--press-rotate-y": "0deg",
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

const variantClasses: Record<ButtonVariant, string> = {
  solid:
    "bg-accent text-accent-foreground shadow-[var(--shadow-subtle)] hover:bg-accent/90",
  ghost: "text-foreground hover:bg-accent/10 hover:text-accent",
  outline:
    "border border-border bg-background text-foreground shadow-[var(--shadow-subtle)] hover:border-accent/50 hover:bg-accent/10",
  quiet: "text-muted-foreground hover:bg-muted hover:text-foreground",
  destructive:
    "bg-destructive text-destructive-foreground shadow-[var(--shadow-subtle)] hover:bg-destructive/90",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 gap-1.5 px-3 text-xs",
  md: "h-10 gap-2 px-4 text-sm",
  lg: "h-11 gap-2.5 px-5 text-base",
  icon: "h-10 w-10 p-0",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "solid",
      size = "md",
      type = "button",
      style,
      onPointerMove,
      onPointerDown,
      onPointerLeave,
      ...props
    },
    ref
  ) => {
    const [pressVars, setPressVars] =
      React.useState<CursorPressVars>(resetPressVars);

    return (
      <button
        ref={ref}
        type={type}
        style={{ ...style, ...pressVars }}
        className={cn(
          "cursor-press inline-flex shrink-0 items-center justify-center rounded-md font-medium transition-[background-color,border-color,color,opacity,transform] duration-200 ease-out",
          "max-w-full",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
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
Button.displayName = "Button";
