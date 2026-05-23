import { useTranslations } from "next-intl";
import MotionWrapper from "../MotionWrapper/MotionWrapper";
import {
  CredibilityCard,
  CredibilityContainer,
  CredibilityGrid,
  CredibilityHeader,
  CredibilityLabel,
  CredibilitySubtitle,
  CredibilityTitle,
  CredibilityValue,
  SignalItem,
  SignalsList,
} from "./Credibility.style";
import { CREDIBILITY_CONSTANTS } from "./Credibility.const";
import type { CredibilityItem } from "./Credibility.type";

const Credibility: React.FC = () => {
  const t = useTranslations("credibility");
  const items = t.raw("items") as CredibilityItem[];
  const signals = t.raw("signals") as string[];

  return (
    <CredibilityContainer id={CREDIBILITY_CONSTANTS.SECTION_ID}>
      <MotionWrapper variant="fadeInUp" duration={0.6}>
        <CredibilityHeader>
          <CredibilityTitle>{t("title")}</CredibilityTitle>
          <CredibilitySubtitle>{t("subtitle")}</CredibilitySubtitle>
        </CredibilityHeader>
      </MotionWrapper>

      <MotionWrapper variant="fadeInUp" duration={0.6} delay={0.1}>
        <CredibilityGrid>
          {items.map((item) => (
            <CredibilityCard key={item.label} elevation={0}>
              <CredibilityLabel>{item.label}</CredibilityLabel>
              <CredibilityValue>{item.value}</CredibilityValue>
            </CredibilityCard>
          ))}
        </CredibilityGrid>

        <SignalsList>
          <CredibilityLabel sx={{ textTransform: "none", letterSpacing: 0 }}>
            {t("signalsTitle")}
          </CredibilityLabel>
          {signals.map((signal) => (
            <SignalItem key={signal}>{signal}</SignalItem>
          ))}
        </SignalsList>
      </MotionWrapper>
    </CredibilityContainer>
  );
};

export default Credibility;
