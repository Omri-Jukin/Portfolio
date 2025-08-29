import React from "react";
import MotionWrapper from "~/MotionWrapper";
import type { SectionCardProps } from "./SectionCard.type";
import {
  SectionContainer,
  SectionTitle,
  SectionSubtitle,
  SectionContent,
} from "./SectionCard.style";

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  subtitle,
  children,
  id,
  animationDelay = 0.2,
  animationVariant = "fadeInUp",
  className,
  ...props
}) => {
  return (
    <SectionContainer
      id={id}
      className={className}
      aria-labelledby={id ? `${id}-title` : undefined}
      {...props}
    >
      <MotionWrapper
        variant={animationVariant}
        duration={1.0}
        delay={animationDelay}
      >
        {title && (
          <SectionTitle id={id ? `${id}-title` : undefined}>
            {title}
          </SectionTitle>
        )}
        {subtitle && <SectionSubtitle>{subtitle}</SectionSubtitle>}
      </MotionWrapper>

      <SectionContent>{children}</SectionContent>
    </SectionContainer>
  );
};

export default SectionCard;
