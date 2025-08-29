import { motion } from "framer-motion";
import { WaveTextProps } from "./WaveText.type";
import { useTheme } from "@mui/material";

/**
 * WaveText component
 * @param {WaveTextProps} props - WaveTextProps
 * @returns WaveText component
 */
export const WaveText = ({
  text,
  duration = 1.5,
  delay = 0,
  repeat = Infinity,
  repeatType = "loop",
  ease = "easeInOut",
  type = "dots",
  animationDirection = "vertical",
  amplitude = 10,
  frequency = 0.5,
  phase = 0,
  phaseOffset = 0,
  style,
}: WaveTextProps) => {
  const theme = useTheme();

  if (type === "dots") {
    return (
      <motion.div
        className="floating-elements"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        {[0, 1, 2, 3, 4].map((index) => (
          <motion.div
            key={index}
            className="floating-dot"
            animate={{
              y:
                animationDirection === "vertical"
                  ? [0, -amplitude, 0]
                  : [0, 0, 0],
              x:
                animationDirection === "horizontal"
                  ? [
                      0,
                      Math.sin(
                        (index * frequency + phase + phaseOffset) * Math.PI
                      ) * amplitude,
                      0,
                    ]
                  : [0, 0, 0],
            }}
            transition={{
              duration: duration,
              delay: delay + index * 0.2,
              repeat: repeat,
              repeatType: repeatType,
              ease: ease,
            }}
          />
        ))}
      </motion.div>
    );
  }

  // Text wave animation
  return (
    <motion.div
      className="wave-text"
      style={{
        color: theme.palette.primary.main,
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        position: "relative",
        ...style,
      }}
    >
      {text?.split(" ").map((word, wordIndex) => (
        <motion.div key={wordIndex} style={{ display: "flex", gap: "2px" }}>
          {word.split("").map((char, charIndex) => {
            const globalCharIndex =
              text?.split(" ").slice(0, wordIndex).join("").length + charIndex;
            return (
              <motion.span
                key={`${wordIndex}-${charIndex}`}
                className="wave-text-char"
                animate={{
                  y:
                    animationDirection === "vertical"
                      ? [0, -amplitude, 0]
                      : [0, 0, 0],
                  x:
                    animationDirection === "horizontal"
                      ? [
                          0,
                          Math.sin(
                            (globalCharIndex * frequency +
                              phase +
                              phaseOffset) *
                              Math.PI
                          ) * amplitude,
                          0,
                        ]
                      : [0, 0, 0],
                }}
                transition={{
                  duration: duration,
                  delay: delay + globalCharIndex * 0.05,
                  repeat: repeat,
                  repeatType: repeatType,
                  ease: ease,
                }}
                style={{ display: "inline-block" }}
              >
                {char}
              </motion.span>
            );
          })}
        </motion.div>
      ))}
    </motion.div>
  );
};
