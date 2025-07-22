"use client";

import { motion } from "framer-motion";
import { MotionWrapperProps, animationVariants } from "./MotionWrapper.type";

export default function MotionWrapper({
  children,
  variant = "fadeIn",
  duration = 0.6,
  delay = 0,
  once = true,
  className,
  style,
  custom,
}: MotionWrapperProps) {
  const variants = custom || animationVariants[variant];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-100px" }}
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
