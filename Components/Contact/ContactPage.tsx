"use client";

import React from "react";
import {
  Description as DescriptionIcon,
  Email as EmailIcon,
  LinkedIn as LinkedInIcon,
} from "@mui/icons-material";
import { Box, Button, Link, Paper, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { PROFILE_LINKS } from "$/constants";
import PublicPageShell from "../PublicPageShell";
import MotionWrapper from "../MotionWrapper/MotionWrapper";
import ContactMessageForm from "./ContactMessageForm";

const ContactPage: React.FC = () => {
  const t = useTranslations("contact");

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
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
            gap: 2,
            mb: 4,
          }}
        >
          <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: "divider", borderRadius: 1 }}>
            <Typography variant="h5" component="h2" fontWeight={700}>
              For recruiters and hiring managers
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1, mb: 2, lineHeight: 1.65 }}>
              Send the role, stack, team context, location or remote expectations, and what kind of ownership the position requires. Email and LinkedIn are the fastest ways to reach me.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} useFlexGap flexWrap="wrap">
              <Button component={Link} href="/resume" variant="contained" startIcon={<DescriptionIcon />}>
                Download resume
              </Button>
              <Button component={Link} href={PROFILE_LINKS.LINKEDIN} target="_blank" rel="noopener noreferrer" variant="outlined" startIcon={<LinkedInIcon />}>
                Message on LinkedIn
              </Button>
              <Button component={Link} href={`mailto:${PROFILE_LINKS.EMAIL}`} variant="outlined" startIcon={<EmailIcon />}>
                Email Omri
              </Button>
            </Stack>
          </Paper>
          <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: "divider", borderRadius: 1 }}>
            <Typography variant="h5" component="h2" fontWeight={700}>
              For selected project conversations
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1, mb: 2, lineHeight: 1.65 }}>
              I am open to selected technical conversations where there is a clear product owner, real technical scope, and a strong fit for TypeScript systems work.
            </Typography>
            <Button
              component={Link}
              href={`mailto:${PROFILE_LINKS.EMAIL}`}
              variant="contained"
            >
              Email a technical brief
            </Button>
          </Paper>
        </Box>
      </MotionWrapper>

      <ContactMessageForm />
    </PublicPageShell>
  );
};

export default ContactPage;
