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
import dynamic from "next/dynamic";

// Dynamically import heavy components to improve build performance
const GalaxyCard = dynamic(
  () =>
    import("#/Components/HeavyComponents").then((mod) => ({
      default: mod.GalaxyCard,
    })),
  { ssr: false }
);
import { type GalaxyCardProps } from "../GalaxyCard/GalaxyCard";
import { NeonButton } from "..";
import ContactForm from "../ContactForm";

const Contact: React.FC<ContactProps> = ({ locale = "en", onContactClick }) => {
  const t = useTranslations("contact");
  const contactHref = locale
    ? `/${locale}#${CONTACT_CONSTANTS.SECTION_ID}`
    : `#${CONTACT_CONSTANTS.SECTION_ID}`;

  const handleContactButtonClick = (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    if (onContactClick) {
      event.preventDefault();
      onContactClick();
    }
  };

  const galaxyProps: GalaxyCardProps = {
    offset: { x: 5 },
    id: CONTACT_CONSTANTS.SECTION_ID,
  };

  return (
    <GalaxyCard
      id={CONTACT_CONSTANTS.SECTION_ID}
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
      <ContactContainer id={`${CONTACT_CONSTANTS.SECTION_ID}-container`}>
        <MotionWrapper
          variant="fadeInUp"
          duration={CONTACT_CONSTANTS.ANIMATION.TITLE_DURATION}
        >
          <ContactTitle id={`${CONTACT_CONSTANTS.SECTION_ID}-title`}>
            {t("title")}
          </ContactTitle>
          <ContactSubtitle id={`${CONTACT_CONSTANTS.SECTION_ID}-subtitle`}>
            {t("subtitle")}
          </ContactSubtitle>
          <ContactDescription
            id={`${CONTACT_CONSTANTS.SECTION_ID}-description`}
          >
            {t("description")}
          </ContactDescription>
          <NeonButton
            href={contactHref}
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={handleContactButtonClick}
            id={`${CONTACT_CONSTANTS.SECTION_ID}-button`}
            sx={{ mb: 4 }}
          >
            {t("button")}
          </NeonButton>
        </MotionWrapper>

        {/* Contact Form */}
        <ContactForm
          onSuccess={() => {
            console.log("Contact form submitted successfully");
          }}
          onError={(error) => {
            console.error("Contact form error:", error);
          }}
        />
      </ContactContainer>
    </GalaxyCard>
  );
};

export default Contact;
