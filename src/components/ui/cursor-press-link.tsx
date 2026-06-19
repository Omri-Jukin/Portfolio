"use client";

import * as React from "react";
import Link, { type LinkProps } from "next/link";
import { cn } from "@/lib/utils";

type CursorPressVars = React.CSSProperties & {
  "--press-x"?: string;
  "--press-y"?: string;
  "--press-rotate-x"?: string;
  "--press-rotate-y"?: string;
};

export interface CursorPressLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: LinkProps["href"];
}

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
    { className, style, onPointerMove, onPointerLeave, onPointerDown, ...props },
    ref
  ) => {
    const [pressVars, setPressVars] =
      React.useState<CursorPressVars>(resetPressVars);

    return (
      <Link
        ref={ref}
        className={cn("cursor-press", className)}
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
