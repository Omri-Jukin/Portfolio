import React from "react";
import {
  ArrowForward as ArrowForwardIcon,
  Email as EmailIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import { Link, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { PROFILE_LINKS } from "$/constants";
import MotionWrapper from "../MotionWrapper/MotionWrapper";
import {
  ContactContainer,
  ContactTitle,
  ContactSubtitle,
  ContactDescription,
  ContactActions,
  ContactActionButton,
} from "./Contact.style";
import { CONTACT_CONSTANTS } from "./Contact.const";
import type { ContactProps } from "./Contact.type";

const Contact: React.FC<ContactProps> = ({ onContactClick }) => {
  const t = useTranslations("contact");

  return (
    <ContactContainer id={CONTACT_CONSTANTS.SECTION_ID}>
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
        <ContactDescription id={`${CONTACT_CONSTANTS.SECTION_ID}-description`}>
          {t("description")}
        </ContactDescription>

        <ContactActions>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} useFlexGap flexWrap="wrap">
            <Link href={`mailto:${PROFILE_LINKS.EMAIL}`} underline="none">
              <ContactActionButton variant="contained" startIcon={<EmailIcon />}>
                {t("emailLabel")}
              </ContactActionButton>
            </Link>
            <Link
              href={PROFILE_LINKS.LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
            >
              <ContactActionButton variant="outlined" startIcon={<LinkedInIcon />}>
                {t("linkedinLabel")}
              </ContactActionButton>
            </Link>
            <Link
              href={PROFILE_LINKS.GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
            >
              <ContactActionButton variant="outlined" startIcon={<GitHubIcon />}>
                {t("githubLabel")}
              </ContactActionButton>
            </Link>
            <Link href="/resume" underline="none">
              <ContactActionButton variant="outlined" startIcon={<DescriptionIcon />}>
                {t("resumeLabel")}
              </ContactActionButton>
            </Link>
            <ContactActionButton
              variant="text"
              endIcon={<ArrowForwardIcon />}
              onClick={onContactClick}
            >
              {t("button")}
            </ContactActionButton>
          </Stack>
        </ContactActions>
      </MotionWrapper>
    </ContactContainer>
  );
};

export default Contact;
