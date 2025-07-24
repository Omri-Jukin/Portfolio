import {
  Code as CodeIcon,
  Star as StarIcon,
  Email as EmailIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { useTranslations } from "next-intl";
import MotionWrapper from "../MotionWrapper/MotionWrapper";
import {
  ServicesContainer,
  ServicesSubtitle,
  ServicesGrid,
  ServiceCard,
  ServiceIcon,
  ServiceTitle,
  ServiceDescription,
  ServiceButton,
} from "./Services.style";
import { SERVICES_CONSTANTS } from "./Services.const";
import type { ServicesProps } from "./Services.type";

const Services: React.FC<ServicesProps> = ({ onServiceClick }) => {
  const t = useTranslations("services");

  const getIcon = (index: number) => {
    switch (index) {
      case 0:
        return <CodeIcon />;
      case 1:
        return <StarIcon />;
      case 2:
        return <EmailIcon />;
      default:
        return <CodeIcon />;
    }
  };

  return (
    <ServicesContainer>
      <MotionWrapper
        variant="fadeInUp"
        duration={SERVICES_CONSTANTS.ANIMATION.SUBTITLE_DURATION}
      >
        <ServicesSubtitle>{t("subtitle")}</ServicesSubtitle>
      </MotionWrapper>

      <ServicesGrid>
        {t.raw("services").map(
          (
            service: {
              title: string;
              description: string;
              buttonText: string;
              buttonVariant: string;
            },
            index: number
          ) => (
            <MotionWrapper
              variant="bounce"
              duration={SERVICES_CONSTANTS.ANIMATION.CARD_DURATION}
              delay={index * SERVICES_CONSTANTS.ANIMATION.CARD_DELAY_INCREMENT}
              key={service.title}
            >
              <ServiceCard>
                <ServiceIcon>{getIcon(index)}</ServiceIcon>
                <ServiceTitle>{service.title}</ServiceTitle>
                <ServiceDescription>{service.description}</ServiceDescription>
                <ServiceButton
                  className={service.buttonVariant}
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => onServiceClick?.(index)}
                >
                  {service.buttonText}
                </ServiceButton>
              </ServiceCard>
            </MotionWrapper>
          )
        )}
      </ServicesGrid>
    </ServicesContainer>
  );
};

export default Services;
