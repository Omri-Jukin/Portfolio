import * as React from "react";
import { cn } from "@/lib/utils";

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn("text-sm font-medium leading-none text-foreground", className)}
    {...props}
  />
));
Label.displayName = "Label";

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  error?: React.ReactNode;
  hint?: React.ReactNode;
}

export function FormField({
  className,
  error,
  hint,
  children,
  ...props
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
    </div>
  );
}
