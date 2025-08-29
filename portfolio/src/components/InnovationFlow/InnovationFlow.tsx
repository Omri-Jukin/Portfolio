import { motion } from "framer-motion";
import { InnovationFlowProps } from "./InnovationFlow.type";

export const InnovationFlow = ({
  icons = ["📱", "💻", "🎨", "🔧"],
  duration = 2,
  delay = 0.3,
  ease = "easeInOut",
}: InnovationFlowProps) => {
  return (
    <motion.div
      className="innovation-flow"
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
        className="flowing-arrows"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "2rem",
        }}
      >
        {icons.map((arrow, index) => (
          <motion.div
            key={index}
            animate={{
              x: [0, index % 2 === 0 ? -20 : 20, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration,
              delay: index * delay,
              repeat: Infinity,
              ease,
            }}
            style={{
              fontSize: "2rem",
              filter: "drop-shadow(0 0 10px rgba(255,255,255,0.5))",
            }}
          >
            {arrow}
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="innovation-sphere"
        animate={{
          rotate: 0,
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 70%)",
          border: "2px solid rgba(255,255,255,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2rem",
          position: "relative",
        }}
      >
        🤘🏻
        {/* Floating particles around the sphere */}
        {Array.from({ length: 50 }).map((_, index) => (
          <motion.div
            key={index}
            animate={{
              x: [0, Math.cos((index * 60 * Math.PI) / 180) * 60, 0],
              y: [0, Math.sin((index * 60 * Math.PI) / 180) * 60, 0],
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              delay: index * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: `hsl(${index * 60}, 80%, 70%)`,
              boxShadow: `0 0 8px hsl(${index * 60}, 80%, 70%)`,
            }}
          />
        ))}
      </motion.div>

      <motion.div
        className="project-cards"
        style={{
          display: "flex",
          gap: "1rem",
        }}
      >
        {icons.map((icon, index) => (
          <motion.div
            key={icon}
            animate={{
              y: [0, -15, 0],
              rotate: [0, 15, 0],
            }}
            transition={{
              duration: 2.5,
              delay: index * 0.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              fontSize: "1.8rem",
              padding: "0.5rem",
              borderRadius: "8px",
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            {icon}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};
