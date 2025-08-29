import { motion } from "framer-motion";
import { FloatingEmojisProps } from "./FloatingEmojis.type";

export const FloatingEmojis = ({
  emojis = ["📈", "🎯", "🚀", "💡"],
  duration = 2,
  delay = 0.3,
  ease = "easeInOut",
}: FloatingEmojisProps) => {
  return (
    <motion.div
      className="floating-emojis"
      style={{
        display: "flex",
        gap: "1rem",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      {emojis.map((icon, index) => (
        <motion.div
          key={icon}
          animate={{
            y: [0, -10, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration,
            delay: index * delay,
            repeat: Infinity,
            ease,
          }}
          style={{
            fontSize: "1.5rem",
            filter: "drop-shadow(0 0 8px rgba(255,255,255,0.4))",
          }}
        >
          {icon}
        </motion.div>
      ))}
    </motion.div>
  );
};
