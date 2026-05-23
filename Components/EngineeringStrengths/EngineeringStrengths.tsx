import { useTranslations } from "next-intl";
import MotionWrapper from "../MotionWrapper/MotionWrapper";
import {
  ScrollingSectionTitle,
  SectionSubtitle,
} from "../ScrollingSections/ScrollingSections.style";
import {
  StrengthCard,
  StrengthItem,
  StrengthsContainer,
  StrengthsGrid,
  StrengthTitle,
} from "./EngineeringStrengths.style";
import { ENGINEERING_STRENGTHS_CONSTANTS } from "./EngineeringStrengths.const";
import type { StrengthCategory } from "./EngineeringStrengths.type";

const EngineeringStrengths: React.FC = () => {
  const t = useTranslations("engineeringStrengths");
  const categories = t.raw("categories") as StrengthCategory[];

  return (
    <StrengthsContainer id={ENGINEERING_STRENGTHS_CONSTANTS.SECTION_ID}>
      <MotionWrapper variant="fadeInUp" duration={0.6}>
        <ScrollingSectionTitle>{t("title")}</ScrollingSectionTitle>
        <SectionSubtitle>{t("subtitle")}</SectionSubtitle>
      </MotionWrapper>

      <MotionWrapper variant="fadeInUp" duration={0.6} delay={0.1}>
        <StrengthsGrid>
          {categories.map((category) => (
            <StrengthCard key={category.title} elevation={0}>
              <StrengthTitle variant="h6">{category.title}</StrengthTitle>
              {category.items.map((item) => (
                <StrengthItem key={item}>{item}</StrengthItem>
              ))}
            </StrengthCard>
          ))}
        </StrengthsGrid>
      </MotionWrapper>
    </StrengthsContainer>
  );
};

export default EngineeringStrengths;
