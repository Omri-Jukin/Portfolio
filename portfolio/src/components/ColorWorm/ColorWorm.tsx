import { useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { ColorWormProps } from "./ColorWorm.type";

export const ColorWorm = ({
  opacity = 1,
  scale = 1,
  y = 0,
  amount = 50,
  size = 8,
  speed = 4,
  delay = 0.2,
  ease = "easeInOut",
}: ColorWormProps) => {
  const theme = useTheme();

  return (
    <motion.div
      style={{
        opacity,
        scale,
        y,
        color: theme.palette.primary.main,
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      className="gap-content"
    >
      <div className="tech-particles">
        {Array.from({ length: amount }).map((_, index) => (
          <motion.div
            key={index}
            className="particle"
            animate={{
              x: [0, Math.sin(index * 0.5) * 100, 0],
              y: [0, Math.cos(index * 0.3) * 80, 0],
              scale: [0, 1, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: speed,
              delay: index * delay,
              repeat: Infinity,
              ease: ease,
            }}
            style={{
              position: "absolute",
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: "50%",
              background: `hsl(${index * 30}, 70%, 60%)`,
              boxShadow: `0 0 ${size * 2}px hsl(${index * 30}, 70%, 60%)`,
              left: `${50 + Math.sin(index) * 30}%`,
              top: `${50 + Math.cos(index) * 30}%`,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};
