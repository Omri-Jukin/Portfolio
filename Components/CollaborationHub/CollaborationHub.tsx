import { motion } from "framer-motion";
import { CollaborationHubProps } from "./CollaborationHub.type";

export const CollaborationHub = ({
  icons = ["🤝", "💬", "🚀", "🎉"],
  duration = 2.5,
  delay = 0.4,
  ease = "easeInOut",
}: CollaborationHubProps) => {
  return (
    <motion.div
      className="collaboration-hub"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
        marginTop: "-1rem",
        marginBottom: "-1rem",
      }}
    >
      <motion.div
        className="collaboration-icons"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "2rem",
        }}
      >
        {icons.map((icon, index) => (
          <motion.div
            key={icon}
            animate={{
              y: [0, -15, 0],
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration,
              delay: index * delay,
              repeat: Infinity,
              ease,
            }}
            style={{
              fontSize: "2.2rem",
              filter: "drop-shadow(0 0 12px rgba(255,255,255,0.5))",
            }}
          >
            {icon}
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="collaboration-orb"
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 70%)",
          border: "3px solid rgba(255,255,255,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2.5rem",
          position: "relative",
        }}
      >
        <motion.div
          animate={{
            rotate: [0, -360],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          ⭐
        </motion.div>
        {/* Floating connection lines */}
        {Array.from({ length: 4 }).map((_, index) => (
          <motion.div
            key={index}
            animate={{
              scaleX: [0, 1, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 2,
              delay: index * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              width: "40px",
              height: "2px",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)",
              transform: `rotate(${index * 90}deg)`,
              transformOrigin: "center",
            }}
          />
        ))}
      </motion.div>

      <motion.div
        className="energy-rings"
        style={{
          display: "flex",
          gap: "0.5rem",
        }}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <motion.div
            key={index}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 2,
              delay: index * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: `hsl(${index * 90}, 80%, 70%)`,
              boxShadow: `0 0 15px hsl(${index * 90}, 80%, 70%)`,
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};
