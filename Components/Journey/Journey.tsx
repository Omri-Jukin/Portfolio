import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { WaveText } from "../WaveText/WaveText";
import { JourneyProps } from "./Journey.type";

export const Journey = ({
  duration = 4,
  delay = 0.5,
  ease = "easeInOut",
}: JourneyProps) => {
  const t = useTranslations("scrollGaps");

  return (
    <motion.div style={{ opacity: 1, scale: 1, y: 0 }} className="gap-content">
      {/* Floating background elements */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <motion.div
            key={index}
            animate={{
              x: [0, Math.sin((index * 45 * Math.PI) / 180) * 100, 0],
              y: [0, Math.cos((index * 45 * Math.PI) / 180) * 50, 0],
              scale: [0, 1, 0],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration,
              delay: index * delay,
              repeat: Infinity,
              ease,
            }}
            style={{
              position: "absolute",
              width: "3px",
              height: "3px",
              borderRadius: "50%",
              background: `hsl(${index * 45}, 70%, 60%)`,
              boxShadow: `0 0 6px hsl(${index * 45}, 70%, 60%)`,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </div>

      {/* Enhanced dots with glow effect */}
      <motion.div
        style={{
          position: "relative",
          marginBottom: "1rem",
        }}
      >
        <WaveText
          type="dots"
          margins={{ top: "2vh", bottom: 0, left: "2vw", right: 0 }}
        />
        {/* Glow effect around dots */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "200px",
            height: "60px",
            borderRadius: "30px",
            background:
              "radial-gradient(ellipse, rgba(78, 205, 196, 0.2) 0%, transparent 70%)",
            filter: "blur(10px)",
            pointerEvents: "none",
          }}
        />
      </motion.div>

      {/* Enhanced text with unique effects */}
      <motion.div style={{ position: "relative" }}>
        <motion.div
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            background:
              "linear-gradient(90deg, #4ECDC4, #96CEB4, #64B5F6, #4ECDC4)",
            backgroundSize: "200% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            padding: "0.5rem 1rem",
            borderRadius: "20px",
            position: "relative",
          }}
        >
          <WaveText
            text={t("heroAbout.text")}
            type="text"
            animationDirection="vertical"
          />
          {/* Glowing border effect */}
          <motion.div
            animate={{
              boxShadow: [
                "0 0 10px rgba(78, 205, 196, 0.3)",
                "0 0 20px rgba(78, 205, 196, 0.6)",
                "0 0 10px rgba(78, 205, 196, 0.3)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: "20px",
              border: "1px solid rgba(78, 205, 196, 0.5)",
              pointerEvents: "none",
            }}
          />
        </motion.div>
        {/* Floating letters effect */}
        {t("heroAbout.text")
          .split("")
          .map((char, index) => (
            <motion.div
              key={index}
              animate={{
                y: [0, -5, 0],
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                delay: index * 0.1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                position: "absolute",
                fontSize: "0.8rem",
                color: "rgba(78, 205, 196, 0.8)",
                top: "50%",
                left: `${10 + (index * 80) / t("heroAbout.text").length}%`,
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
                zIndex: -1,
              }}
            >
              {char}
            </motion.div>
          ))}
      </motion.div>

      {/* CTA with unique text effects */}
      <motion.div style={{ position: "relative", marginTop: "1rem" }}>
        <motion.div
          animate={{
            textShadow: [
              "0 0 5px rgba(78, 205, 196, 0.5)",
              "0 0 15px rgba(78, 205, 196, 0.8)",
              "0 0 5px rgba(78, 205, 196, 0.5)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "relative",
            padding: "0.5rem 1rem",
            borderRadius: "15px",
            background: "rgba(78, 205, 196, 0.1)",
            backdropFilter: "blur(5px)",
          }}
        >
          <WaveText
            text={t("heroAbout.cta")}
            type="text"
            animationDirection="vertical"
          />
          {/* Animated underline */}
          <motion.div
            animate={{
              scaleX: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              bottom: 0,
              left: "10%",
              right: "10%",
              height: "2px",
              background:
                "linear-gradient(90deg, transparent, #4ECDC4, transparent)",
              borderRadius: "1px",
            }}
          />
          {/* Floating dots around text */}
          {Array.from({ length: 6 }).map((_, index) => (
            <motion.div
              key={index}
              animate={{
                y: [0, -10, 0],
                x: [0, Math.sin((index * 60 * Math.PI) / 180) * 5, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: index * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                position: "absolute",
                width: "3px",
                height: "3px",
                borderRadius: "50%",
                background: "rgba(78, 205, 196, 0.8)",
                top: "50%",
                left: `${15 + index * 12}%`,
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Floating geometric shapes */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        {["▲", "●", "■", "◆"].map((shape, index) => (
          <motion.div
            key={shape}
            animate={{
              rotate: [0, 360],
              y: [0, -30, 0],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: 6,
              delay: index * 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              fontSize: "1rem",
              color: "rgba(78, 205, 196, 0.6)",
              top: `${20 + index * 20}%`,
              left: `${10 + index * 25}%`,
            }}
          >
            {shape}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
