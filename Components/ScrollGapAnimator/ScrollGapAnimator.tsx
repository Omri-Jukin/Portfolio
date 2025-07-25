import React, { useRef } from "react";
import { Box, Typography } from "@mui/material";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { ScrollGapAnimatorProps } from "./ScrollGapAnimator.type";
import { ScrollGapAnimatorStyle } from "./ScrollGapAnimator.style";

const ScrollGapAnimator: React.FC<ScrollGapAnimatorProps> = ({
  sectionId,
  gapType = "default",
  height = 200,
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
  const progressLineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const renderGapContent = () => {
    switch (gapType) {
      case "hero-about":
        return (
          <motion.div style={{ opacity, scale, y }} className="gap-content">
            <Typography variant="h6" className="gap-text">
              {t("heroAbout.text")}
            </Typography>
            <motion.div
              className="floating-elements"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="floating-dot" />
              <div className="floating-dot" />
              <div className="floating-dot" />
            </motion.div>
          </motion.div>
        );

      case "about-qa":
        return (
          <motion.div style={{ opacity, scale, y }} className="gap-content">
            <Typography variant="body1" className="gap-text">
              {t("aboutQA.text")}
            </Typography>
            <motion.div
              className="progress-line"
              style={{
                scaleX: progressLineScale,
              }}
            />
          </motion.div>
        );

      case "qa-services":
        return (
          <motion.div style={{ opacity, scale, y }} className="gap-content">
            <motion.div
              className="rotating-skill-tags"
              animate={{ rotate: 360 }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {["React", "TypeScript", "Node.js", "Next.js"].map(
                (skill, index) => (
                  <motion.span
                    key={skill}
                    className="skill-tag"
                    style={{
                      transform: `rotate(${index * 90}deg) translateY(-60px)`,
                    }}
                  >
                    {skill}
                  </motion.span>
                )
              )}
            </motion.div>
          </motion.div>
        );

      case "services-career":
        return (
          <motion.div style={{ opacity, scale, y }} className="gap-content">
            <Typography variant="h6" className="gap-text">
              {t("servicesCareer.text")}
            </Typography>
            <motion.div
              className="career-path-animation"
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </motion.div>
        );

      case "career-projects":
        return (
          <motion.div style={{ opacity, scale, y }} className="gap-content">
            <Typography variant="body1" className="gap-text">
              {t("careerProjects.text")}
            </Typography>
            <motion.div
              className="project-showcase-animation"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        );

      case "services-projects":
        return (
          <motion.div style={{ opacity, scale, y }} className="gap-content">
            <Typography variant="h6" className="gap-text">
              {t("servicesProjects.text")}
            </Typography>
            <motion.div
              className="particle-system"
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </motion.div>
        );

      case "projects-contact":
        return (
          <motion.div style={{ opacity, scale, y }} className="gap-content">
            <Typography variant="body1" className="gap-text">
              {t("projectsContact.text")}
            </Typography>
            <motion.div
              className="pulse-circle"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
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
      sx={ScrollGapAnimatorStyle.container(height)}
    >
      {renderGapContent()}
    </Box>
  );
};

export default ScrollGapAnimator;
