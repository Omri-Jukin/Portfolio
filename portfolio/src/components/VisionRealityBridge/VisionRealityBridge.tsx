import { motion } from "framer-motion";
import { VisionRealityBridgeProps } from "./VisionRealityBridge.type";

export const VisionRealityBridge = ({
  icons = ["👁️", "🔮", "✨", "🎯"],
  duration = 3,
  delay = 0.5,
  ease = "easeInOut",
}: VisionRealityBridgeProps) => {
  return (
    <motion.div
      className="vision-reality-bridge"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      <motion.div
        className="reality-layers"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "3rem",
        }}
      >
        {icons.map((icon, index) => (
          <motion.div
            key={icon}
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.3, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration,
              delay: index * delay,
              repeat: Infinity,
              ease,
            }}
            style={{
              fontSize: "2.5rem",
              filter: "drop-shadow(0 0 15px rgba(255,255,255,0.6))",
            }}
          >
            {icon}
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="reality-portal"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 360],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          background:
            "conic-gradient(from 0deg, #FF6B6B, #4ECDC4, #96CEB4, #FF6B6B)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <motion.div
          animate={{
            rotate: [0, -360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem",
          }}
        >
          🌟
        </motion.div>
        {/* Pulsing rings around the portal */}
        {Array.from({ length: 3 }).map((_, index) => (
          <motion.div
            key={index}
            animate={{
              scale: [0.5, 2, 0.5],
              opacity: [0.8, 0, 0.8],
            }}
            transition={{
              duration: 2,
              delay: index * 0.7,
              repeat: Infinity,
              ease: "easeOut",
            }}
            style={{
              position: "absolute",
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              border: `2px solid rgba(255,255,255,${0.3 - index * 0.1})`,
              pointerEvents: "none",
            }}
          />
        ))}
      </motion.div>

      <motion.div
        className="connection-dots"
        style={{
          display: "flex",
          gap: "1rem",
        }}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <motion.div
            key={index}
            animate={{
              scale: [0.5, 1, 0.5],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.5,
              delay: index * 0.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: `hsl(${index * 60}, 70%, 60%)`,
              boxShadow: `0 0 10px hsl(${index * 60}, 70%, 60%)`,
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};
