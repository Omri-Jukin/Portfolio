import { useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { ColorWormProps } from "./ColorWorm.type";

export const ColorWorm = ({
  opacity = 1,
  scale = 1,
  y = 0,
  type = "default",
  amount = 50,
  size = 8,
  speed = 4,
  delay = 0.2,
  ease = "easeInOut",
  margins = { top: "2vh", bottom: "2vh", left: 0, right: 0 },
}: ColorWormProps) => {
  const theme = useTheme();
  if (type === "worm") {
    return (
      <motion.div
        style={{
          opacity,
          scale,
          y,
          color: theme.palette.primary.main,
          zIndex: 1000,
          margin: `${margins.top} ${margins.right} ${margins.bottom} ${margins.left}`,
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
  }

  return (
    <motion.div
      style={{
        opacity,
        scale,
        y,
        color: theme.palette.primary.main,
        margin: `${margins.top} ${margins.right} ${margins.bottom} ${margins.left}`,
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
