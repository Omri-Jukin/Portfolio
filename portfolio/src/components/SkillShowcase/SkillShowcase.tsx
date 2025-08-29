import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { Close as CloseIcon, Star as StarIcon } from "@mui/icons-material";
import MotionWrapper from "~/MotionWrapper";
import type { SkillShowcaseProps } from "./SkillShowcase.type";
import {
  StyledDialog,
  StyledDialogTitle,
  StyledDialogContent,
  StyledCloseButton,
  ExperienceChip,
  TechnologyChip,
  ExampleChip,
  ContentSection,
  SectionTitle,
  ChipContainer,
  ExperienceContainer,
  DescriptionText,
} from "./SkillShowcase.style";
import { ANIMATION_DELAYS, CHIP_ANIMATION_DELAY } from "./SkillShowcase.const";

const SkillShowcase: React.FC<SkillShowcaseProps> = ({
  skillDetail,
  open,
  onClose,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (open) {
      setIsAnimating(true);
    }
  }, [open]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 200); // Allow animation to complete
  };

  return (
    <StyledDialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        backdrop: {
          timeout: 500,
          onEnter: () => setIsAnimating(true),
          onExit: () => setIsAnimating(false),
        },
        paper: {
          className: isAnimating ? "MuiDialog-paperOpen" : "",
        },
      }}
    >
      <StyledDialogTitle>
        <MotionWrapper
          variant="fadeInUp"
          duration={0.6}
          delay={ANIMATION_DELAYS.TITLE}
        >
          <Typography variant="h5" component="div">
            {skillDetail.title}
          </Typography>
        </MotionWrapper>
        <StyledCloseButton onClick={handleClose}>
          <CloseIcon />
        </StyledCloseButton>
      </StyledDialogTitle>

      <StyledDialogContent>
        <MotionWrapper
          variant="fadeInUp"
          duration={0.6}
          delay={ANIMATION_DELAYS.DESCRIPTION}
        >
          <ContentSection>
            <DescriptionText variant="body1">
              {skillDetail.description}
            </DescriptionText>
          </ContentSection>
        </MotionWrapper>

        <MotionWrapper
          variant="fadeInUp"
          duration={0.6}
          delay={ANIMATION_DELAYS.EXPERIENCE}
        >
          <ContentSection>
            <ExperienceContainer>
              <ExperienceChip
                icon={<StarIcon />}
                label={`${skillDetail.experience} Level`}
              />
              <Typography variant="body2" color="text.secondary">
                {skillDetail.years} of experience
              </Typography>
            </ExperienceContainer>
          </ContentSection>
        </MotionWrapper>

        <MotionWrapper
          variant="fadeInUp"
          duration={0.6}
          delay={ANIMATION_DELAYS.TECHNOLOGIES}
        >
          <ContentSection>
            <SectionTitle variant="h6">Technologies & Tools</SectionTitle>
            <ChipContainer>
              {skillDetail.technologies.map((tech, index) => (
                <TechnologyChip
                  key={tech}
                  label={tech}
                  size="small"
                  sx={{
                    animationDelay: `${index * CHIP_ANIMATION_DELAY}s`,
                    opacity: 0,
                    animation: isAnimating
                      ? "fadeInUp 0.5s ease forwards"
                      : "none",
                  }}
                />
              ))}
            </ChipContainer>
          </ContentSection>
        </MotionWrapper>

        <MotionWrapper
          variant="fadeInUp"
          duration={0.6}
          delay={ANIMATION_DELAYS.EXAMPLES}
        >
          <ContentSection>
            <SectionTitle variant="h6">Key Expertise</SectionTitle>
            <ChipContainer>
              {skillDetail.examples.map((example, index) => (
                <ExampleChip
                  key={example}
                  label={example}
                  size="small"
                  sx={{
                    animationDelay: `${index * CHIP_ANIMATION_DELAY}s`,
                    opacity: 0,
                    animation: isAnimating
                      ? "fadeInUp 0.5s ease forwards"
                      : "none",
                  }}
                />
              ))}
            </ChipContainer>
          </ContentSection>
        </MotionWrapper>
      </StyledDialogContent>

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </StyledDialog>
  );
};

export default SkillShowcase;
