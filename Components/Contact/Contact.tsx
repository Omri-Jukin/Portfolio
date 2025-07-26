import Link from "next/link";
import { ArrowForward as ArrowForwardIcon } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import MotionWrapper from "../MotionWrapper/MotionWrapper";
import {
  ContactContainer,
  ContactTitle,
  ContactSubtitle,
  ContactForm,
  ContactDescription,
  ContactButton,
} from "./Contact.style";
import { CONTACT_CONSTANTS } from "./Contact.const";
import type { ContactProps } from "./Contact.type";

const Contact: React.FC<ContactProps> = ({ locale = "en", onContactClick }) => {
  const t = useTranslations("contact");

  return (
    <ContactContainer id={CONTACT_CONSTANTS.SECTION_ID}>
      <MotionWrapper
        variant="fadeInUp"
        duration={CONTACT_CONSTANTS.ANIMATION.TITLE_DURATION}
      >
        <ContactTitle>{t("title")}</ContactTitle>
        <ContactSubtitle>{t("subtitle")}</ContactSubtitle>
      </MotionWrapper>

      <MotionWrapper
        variant="fadeInUp"
        duration={CONTACT_CONSTANTS.ANIMATION.FORM_DURATION}
        delay={CONTACT_CONSTANTS.ANIMATION.FORM_DELAY}
      >
        <ContactForm id={CONTACT_CONSTANTS.FORM_ID}>
          <ContactTitle sx={{ mb: 3, fontSize: "1.5rem" }}>
            {t("title")}
          </ContactTitle>
          <ContactDescription>{t("description")}</ContactDescription>
          <Link
            href={`/${locale}/contact`}
            style={{ textDecoration: "none" }}
            id={CONTACT_CONSTANTS.FORM_BUTTON_ID}
          >
            <ContactButton
              endIcon={<ArrowForwardIcon />}
              onClick={onContactClick}
            >
              {t("button")}
            </ContactButton>
          </Link>
        </ContactForm>
      </MotionWrapper>
    </ContactContainer>
  );
};

export default Contact;
