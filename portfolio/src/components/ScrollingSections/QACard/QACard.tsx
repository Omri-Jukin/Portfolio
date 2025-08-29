import React from "react";
import MotionWrapper from "~/MotionWrapper";
import type { QACardProps } from "./QACard.type";
import { StyledQACard, QAQuestion, QAAnswer } from "./QACard.style";

const QACard: React.FC<QACardProps> = ({
  question,
  answer,
  animationDelay = 0,
  className,
  ...props
}) => {
  return (
    <MotionWrapper variant="fadeInUp" duration={0.8} delay={animationDelay}>
      <StyledQACard className={className} {...props}>
        <QAQuestion>{question}</QAQuestion>
        <QAAnswer>{answer}</QAAnswer>
      </StyledQACard>
    </MotionWrapper>
  );
};

export default QACard;
