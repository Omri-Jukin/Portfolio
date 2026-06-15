"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

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
  y = 12,
  children,
  ...props
}: FadeInProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.25, delay, ease: "easeOut" }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
