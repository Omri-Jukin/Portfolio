import React, { useRef } from "react";
import { Box, Typography } from "@mui/material";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { ScrollGapAnimatorProps } from "./ScrollGapAnimator.type";
import { ScrollGapAnimatorStyle } from "./ScrollGapAnimator.style";
import { ColorWorm } from "../ColorWorm/ColorWorm";
import { ConnectionLine } from "../ConnectionLine";
import { FloatingEmojis } from "../FloatingEmojis";
import { InnovationFlow } from "../InnovationFlow";
import { VisionRealityBridge } from "../VisionRealityBridge";
import { CollaborationHub } from "../CollaborationHub";
import { WaveText } from "../WaveText/WaveText";

const ScrollGapAnimator: React.FC<ScrollGapAnimatorProps> = ({
  sectionId,
  gapType = "default",
  height = 300,
}) => {
  const t = useTranslations("scrollGaps");
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.8, 1, 1, 0.8]
  );
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [50, 0, -50]);

  const renderGapContent = () => {
    switch (gapType) {
      case "hero-about":
        return (
          <motion.div style={{ opacity, scale, y }} className="gap-content">
            <WaveText text={t("heroAbout.text")} type="text" />
            <ColorWorm amount={17} size={10} speed={3} />
          </motion.div>
        );

      case "about-qa":
        return (
          <motion.div style={{ opacity, scale, y }} className="gap-content">
            <motion.div
              className="bridge-animation"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5rem",
                marginTop: "-1rem",
                marginBottom: "-1rem",
              }}
            >
              <ConnectionLine
                width={400}
                height={3}
                background="linear-gradient(90deg, transparent, #4ECDC4, #96CEB4, #64B5F6, transparent)"
              />

              <motion.div
                className="floating-text"
                animate={{
                  y: [0, -10, 0],
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Typography
                  variant="h6"
                  className="gap-text"
                  sx={{
                    fontSize: "1.2rem",
                    fontWeight: 600,
                    textAlign: "center",
                    background:
                      "linear-gradient(45deg, #4ECDC4, #96CEB4, #64B5F6)",
                    backgroundSize: "200% 200%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    animation: "gradientShift 4s ease-in-out infinite",
                    "@keyframes gradientShift": {
                      "0%, 100%": { backgroundPosition: "0% 50%" },
                      "50%": { backgroundPosition: "100% 50%" },
                    },
                  }}
                >
                  {t("aboutQA.text")}
                </Typography>
              </motion.div>

              <motion.div
                className="bridge-elements"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                {["💡", "🔗", "⚡", "🎯"].map((icon, index) => (
                  <motion.div
                    key={icon}
                    animate={{
                      y: [0, -15, 0],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      delay: index * 0.3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{
                      fontSize: "1.5rem",
                      filter: "drop-shadow(0 0 10px rgba(255,255,255,0.3))",
                    }}
                  >
                    {icon}
                  </motion.div>
                ))}
              </motion.div>

              <ConnectionLine
                width={400}
                height={3}
                background="linear-gradient(90deg, transparent, #4ECDC4, #96CEB4, #64B5F6, transparent)"
              />
            </motion.div>
          </motion.div>
        );

      case "qa-services":
        return (
          <motion.div style={{ opacity, scale, y }} className="gap-content">
            <ColorWorm amount={50} size={15} speed={3} />
          </motion.div>
        );

      case "services-career":
        return (
          <motion.div
            style={{
              opacity,
              scale,
              y,
              justifyContent: "center",
              alignItems: "center",
            }}
            className="gap-content"
          >
            <div>
              <ConnectionLine
                width={400}
                height={3}
                background="linear-gradient(90deg, transparent, #4ECDC4, #96CEB4, #64B5F6, transparent)"
              />
              <FloatingEmojis />
              <ConnectionLine
                width={400}
                height={3}
                background="linear-gradient(90deg, transparent, #4ECDC4, #96CEB4, #64B5F6, transparent)"
              />
            </div>
          </motion.div>
        );

      case "career-projects":
        return (
          <motion.div style={{ opacity, scale, y }} className="gap-content">
            <InnovationFlow />
          </motion.div>
        );

      case "services-projects":
        return (
          <motion.div style={{ opacity, scale, y }} className="gap-content">
            <VisionRealityBridge />
          </motion.div>
        );

      case "projects-contact":
        return (
          <motion.div style={{ opacity, scale, y }} className="gap-content">
            <CollaborationHub />
          </motion.div>
        );

      default:
        return (
          <motion.div style={{ opacity, scale, y }} className="gap-content">
            <motion.div
              className="default-animation"
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </motion.div>
        );
    }
  };

  return (
    <Box
      ref={containerRef}
      id={sectionId}
      sx={{
        ...ScrollGapAnimatorStyle.container(height),
        background: "transparent",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {renderGapContent()}
    </Box>
  );
};

export default ScrollGapAnimator;
