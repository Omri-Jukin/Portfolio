import { motion } from "framer-motion";
import { ParticleBridgeProps } from "./ParticleBridge.type";

export const ParticleBridge = ({
  opacity = 0.8,
  scale = 0.8,
  y = 20,
  x = 100,
  ease = "easeInOut",
  particleCount = 8,
  duration = 3,
  delay = 0.2,
}: ParticleBridgeProps) => {
  return (
    <motion.div
      className="particle-bridge"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      {Array.from({ length: particleCount }).map((_, index) => (
        <motion.div
          key={index}
          className="bridge-particle"
          animate={{
            x: [0, x, 0],
            y: [0, Math.sin(index * 0.5) * y, 0],
            scale: [scale, 1, scale],
            opacity: [opacity, 1, opacity],
          }}
          transition={{
            duration,
            delay: index * delay,
            repeat: Infinity,
            ease,
          }}
          style={{
            position: "absolute",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: `hsl(${index * (360 / particleCount)}, 70%, 60%)`,
            boxShadow: `0 0 15px hsl(${
              index * (360 / particleCount)
            }, 70%, 60%)`,
            left: `${(index / (particleCount - 1)) * 100}%`,
          }}
        />
      ))}
    </motion.div>
  );
};
