import { motion } from "framer-motion";
import { ConnectionLineProps } from "./ConnectionLine.type";

export const ConnectionLine = ({
  width = 300,
  height = 2,
  background = "linear-gradient(90deg, transparent, #4ECDC4, #96CEB4, transparent)",
  borderRadius = "1px",
  duration = 2,
  ease = "easeInOut",
}: ConnectionLineProps) => {
  return (
    <motion.div
      className="connection-line"
      animate={{
        scaleX: [0, 1],
        opacity: [0, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: "reverse",
        ease,
      }}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        background,
        borderRadius,
        margin: "1vh auto",
      }}
    />
  );
};
