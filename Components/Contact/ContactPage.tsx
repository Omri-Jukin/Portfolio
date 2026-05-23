"use client";

import React from "react";
import {
  Description as DescriptionIcon,
  Email as EmailIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
} from "@mui/icons-material";
import { Button, Link, Stack, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { PROFILE_LINKS } from "$/constants";
import PublicPageShell from "../PublicPageShell";
import MotionWrapper from "../MotionWrapper/MotionWrapper";
import ContactMessageForm from "./ContactMessageForm";

const ContactPage: React.FC = () => {
  const t = useTranslations("contact");
  const locale = useLocale();

  return (
    <PublicPageShell>
      <MotionWrapper variant="fadeInUp" duration={0.6}>
        <Typography
          variant="h2"
          component="h1"
          sx={{ fontWeight: 700, textAlign: "center", mb: 1.5 }}
        >
          {t("title")}
        </Typography>
        <Typography
          variant="h6"
          component="p"
          color="text.secondary"
          sx={{ textAlign: "center", maxWidth: 720, mx: "auto", mb: 3, lineHeight: 1.6 }}
        >
          {t("subtitle")}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ textAlign: "center", maxWidth: 720, mx: "auto", mb: 3, lineHeight: 1.65 }}
        >
          {t("description")}
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          justifyContent="center"
          useFlexGap
          flexWrap="wrap"
          sx={{ mb: 4 }}
        >
          <Button
            component={Link}
            href={`mailto:${PROFILE_LINKS.EMAIL}`}
            variant="contained"
            startIcon={<EmailIcon />}
          >
            {t("emailLabel")}
          </Button>
          <Button
            component={Link}
            href={PROFILE_LINKS.LINKEDIN}
            target="_blank"
            rel="noopener noreferrer"
            variant="outlined"
            startIcon={<LinkedInIcon />}
          >
            {t("linkedinLabel")}
          </Button>
          <Button
            component={Link}
            href={PROFILE_LINKS.GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            variant="outlined"
            startIcon={<GitHubIcon />}
          >
            {t("githubLabel")}
          </Button>
          <Button
            component={Link}
            href={`/${locale}/resume`}
            variant="outlined"
            startIcon={<DescriptionIcon />}
          >
            {t("resumeLabel")}
          </Button>
        </Stack>
      </MotionWrapper>

      <ContactMessageForm />
    </PublicPageShell>
  );
};

export default ContactPage;
