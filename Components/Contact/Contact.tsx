import React from "react";
import { ArrowForward as ArrowForwardIcon } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import MotionWrapper from "../MotionWrapper/MotionWrapper";
import {
  ContactContainer,
  ContactTitle,
  ContactSubtitle,
  ContactDescription,
} from "./Contact.style";
import { CONTACT_CONSTANTS } from "./Contact.const";
import type { ContactProps } from "./Contact.type";
import { Typography } from "@mui/material";
import { GalaxyCard, NeonButton } from "..";
import type { GalaxyCardProps } from "../GalaxyCard/GalaxyCard";

const Contact: React.FC<ContactProps> = ({ locale = "en", onContactClick }) => {
  const t = useTranslations("contact");

  const galaxyProps: GalaxyCardProps = {
    offset: { x: 5 },
  };

  return (
    <GalaxyCard
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
      {...galaxyProps}
    >
      <ContactContainer id={CONTACT_CONSTANTS.SECTION_ID}>
        <MotionWrapper
          variant="fadeInUp"
          duration={CONTACT_CONSTANTS.ANIMATION.TITLE_DURATION}
        >
          <ContactTitle>{t("title")}</ContactTitle>
          <ContactSubtitle>{t("subtitle")}</ContactSubtitle>
        </MotionWrapper>

        <MotionWrapper variant="slideUp" duration={0.8} delay={1.4}>
          <Typography
            variant="h5"
            component="p"
            sx={{ color: "primary.main", mb: 2 }}
          >
            {t("title")}
          </Typography>
          <ContactDescription>{t("description")}</ContactDescription>
          <NeonButton
            href={`/${locale}/contact`}
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={onContactClick}
          >
            {t("button")}
          </NeonButton>
        </MotionWrapper>
      </ContactContainer>
    </GalaxyCard>
  );
};

export default Contact;
