"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMotionGate } from "./motion-gate";

type MotionSafeDivProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
  | "onDrag"
  | "onDragEnd"
  | "onDragStart"
>;

interface FadeInProps extends MotionSafeDivProps {
  delay?: number;
  y?: number;
}

export function FadeIn({
  className,
  delay = 0,
  y = 18,
  children,
  ...props
}: FadeInProps) {
  const reducedMotion = useReducedMotion();
  const motionGate = useMotionGate();

  if (reducedMotion) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={motionGate.enabled ? false : { opacity: 0, y }}
      animate={motionGate.enabled ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{
        duration: 0.45 * motionGate.durationScale,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
