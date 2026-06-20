"use client";

import * as React from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
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

interface StaggerProps extends MotionSafeDivProps {
  delayChildren?: number;
  staggerChildren?: number;
}

export function Stagger({
  className,
  delayChildren = 0,
  staggerChildren = 0.15,
  children,
  ...props
}: StaggerProps) {
  const reducedMotion = useReducedMotion();
  const motionGate = useMotionGate();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (reducedMotion) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }

  const isVisible = !mounted || (motionGate.enabled && inView);

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={isVisible ? "show" : "hidden"}
      variants={{
        hidden: {},
        show: {
          transition: {
            delayChildren,
            staggerChildren: staggerChildren * motionGate.durationScale,
          },
        },
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

type StaggerItemProps = MotionSafeDivProps;

export function StaggerItem({
  className,
  children,
  ...props
}: StaggerItemProps) {
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
      variants={{
        hidden: { opacity: 0, y: 18, scale: 0.985 },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.42 * motionGate.durationScale,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
