import {
  Code as CodeIcon,
  Star as StarIcon,
  Email as EmailIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { useTranslations } from "next-intl";
import MotionWrapper from "../MotionWrapper/MotionWrapper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import {
  ServicesContainer,
  ServicesSubtitle,
  ServicesSwiperContainer,
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

      <MotionWrapper
        variant="fadeInUp"
        duration={SERVICES_CONSTANTS.ANIMATION.CARD_DURATION}
        delay={0.2}
      >
        <ServicesSwiperContainer>
          <Swiper
            modules={[Navigation, Pagination, EffectFade]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              600: {
                slidesPerView: 1,
                spaceBetween: 25,
              },
              900: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1200: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
              1400: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
            }}
            navigation
            pagination={{ clickable: true }}
            loop={true}
            centeredSlides={false}
            grabCursor={true}
            effect="slide"
            speed={400}
            style={{
              paddingBottom: "60px", // Space for pagination dots
            }}
          >
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
                <SwiperSlide key={service.title}>
                  <MotionWrapper
                    variant="bounce"
                    duration={SERVICES_CONSTANTS.ANIMATION.CARD_DURATION}
                    delay={
                      index * SERVICES_CONSTANTS.ANIMATION.CARD_DELAY_INCREMENT
                    }
                  >
                    <ServiceCard>
                      <ServiceIcon>{getIcon(index)}</ServiceIcon>
                      <ServiceTitle>{service.title}</ServiceTitle>
                      <ServiceDescription>
                        {service.description}
                      </ServiceDescription>
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
                </SwiperSlide>
              )
            )}
          </Swiper>
        </ServicesSwiperContainer>
      </MotionWrapper>
    </ServicesContainer>
  );
};

export default Services;
