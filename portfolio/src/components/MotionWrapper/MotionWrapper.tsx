"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { MotionWrapperProps, animationVariants } from "./MotionWrapper.type";

const MotionWrapper: React.FC<MotionWrapperProps> = ({
  children,
  variant = "fadeIn",
  duration = 0.6,
  delay = 0,
  className,
  style,
  custom,
}) => {
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
};

export default MotionWrapper;
