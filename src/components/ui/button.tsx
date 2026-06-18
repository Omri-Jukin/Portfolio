import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "solid" | "ghost" | "outline" | "quiet" | "destructive";
type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
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
    { className, variant = "solid", size = "md", type = "button", ...props },
    ref
  ) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-md font-medium transition-[background-color,border-color,color,opacity,transform] duration-150 ease-out",
        "max-w-full",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:pointer-events-none disabled:opacity-50 motion-safe:hover:-translate-y-px motion-safe:active:translate-y-0",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
