import { useTranslations } from "next-intl";
import MotionWrapper from "../MotionWrapper/MotionWrapper";
import {
  QAContainer,
  QATitle,
  QASubtitle,
  QAGrid,
  QACard,
  QAQuestion,
  QAAnswer,
} from "./QA.style";
import { QA_CONSTANTS } from "./QA.const";
import type { QAProps } from "./QA.type";

const QA: React.FC<QAProps> = () => {
  const t = useTranslations("qa");

  return (
    <QAContainer>
      <MotionWrapper
        variant="fadeInUp"
        duration={QA_CONSTANTS.ANIMATION.TITLE_DURATION}
      >
        <QATitle>{t("title")}</QATitle>
        <QASubtitle>{t("subtitle")}</QASubtitle>
      </MotionWrapper>

      <QAGrid>
        {t
          .raw("questions")
          .map((qa: { question: string; answer: string }, index: number) => (
            <MotionWrapper
              variant="fadeInUp"
              duration={QA_CONSTANTS.ANIMATION.CARD_DURATION}
              delay={index * QA_CONSTANTS.ANIMATION.CARD_DELAY_INCREMENT}
              key={qa.question}
            >
              <QACard>
                <QAQuestion>{qa.question}</QAQuestion>
                <QAAnswer>{qa.answer}</QAAnswer>
              </QACard>
            </MotionWrapper>
          ))}
      </QAGrid>
    </QAContainer>
  );
};

export default QA;
