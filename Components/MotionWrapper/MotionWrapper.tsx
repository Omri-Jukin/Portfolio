"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { MotionWrapperProps, animationVariants } from "./MotionWrapper.type";

export default function MotionWrapper({
  children,
  variant = "fadeIn",
  duration = 0.6,
  delay = 0,
  className,
  style,
  custom,
}: MotionWrapperProps) {
  const [mounted, setMounted] = useState(false);
  const variants = custom || animationVariants[variant];

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate={mounted ? "visible" : "hidden"}
      className={className}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      style={style}
    >
      {children}
    </motion.div>
  );
}
