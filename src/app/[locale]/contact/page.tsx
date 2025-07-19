"use client";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Stack,
  Chip,
  Link,
} from "@mui/material";
import { useTranslations } from "next-intl";
import MotionWrapper from "#/Components/MotionWrapper";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Language as WebsiteIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Telegram as TelegramIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
} from "@mui/icons-material";

export default function ContactPage() {
  const t = useTranslations("contact");

  const contactMethods = [
    {
      icon: <EmailIcon />,
      label: "Email",
      value: t("email"),
      href: `mailto:${t("email")}`,
      primary: true,
    },
    {
      icon: <PhoneIcon />,
      label: "Phone",
      value: t("phone"),
      href: `tel:${t("phone")}`,
      primary: true,
    },
    {
      icon: <WebsiteIcon />,
      label: "Website",
      value: "Personal Website",
      href: t("website"),
      primary: false,
    },
    {
      icon: <TimeIcon />,
      label: "Timezone",
      value: t("timezone"),
      href: null,
      primary: false,
    },
    {
      icon: <LocationIcon />,
      label: "Citizenship",
      value: t("citizenship"),
      href: null,
      primary: false,
    },
  ];

  const socialLinks = [
    {
      icon: <GitHubIcon />,
      label: "GitHub",
      username: `@${t("github")}`,
      href: `https://github.com/${t("github")}`,
      color: "#333",
    },
    {
      icon: <LinkedInIcon />,
      label: "LinkedIn",
      username: `@${t("linkedin")}`,
      href: `https://www.linkedin.com/in/${t("linkedin")}/`,
      color: "#0077B5",
    },
    {
      icon: <TelegramIcon />,
      label: "Telegram",
      username: `@${t("telegram")}`,
      href: `https://t.me/${t("telegram")}`,
      color: "#0088CC",
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: "1000px", mx: "auto" }}>
      {/* Header */}
      <MotionWrapper variant="fadeIn" duration={0.8} delay={0.2}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: "2rem", md: "3rem" },
              fontWeight: "bold",
              mb: 2,
            }}
          >
            {t("title")}
          </Typography>

          <Typography
            variant="h5"
            component="p"
            sx={{
              color: "text.secondary",
              fontWeight: "normal",
              mb: 3,
            }}
          >
            Let&apos;s connect and build something amazing together
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              fontSize: "1.1rem",
              lineHeight: 1.6,
            }}
          >
            I&apos;m always open to discussing new opportunities,
            collaborations, or just having a great conversation about technology
            and innovation.
          </Typography>
        </Box>
      </MotionWrapper>

      {/* Primary Contact Methods */}
      <MotionWrapper variant="slideUp" duration={0.8} delay={0.4}>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{ color: "primary.main", mb: 3 }}
        >
          Get In Touch
        </Typography>
      </MotionWrapper>

      <Grid container spacing={3} sx={{ mb: 6 }}>
        {contactMethods
          .filter((method) => method.primary)
          .map((method, index) => (
            <Grid component="div" key={index}>
              <MotionWrapper
                variant="slideUp"
                duration={0.8}
                delay={0.6 + index * 0.1}
              >
                <Card
                  sx={{
                    height: "100%",
                    backgroundColor: "background.paper",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      transition: "all 0.3s ease-in-out",
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, textAlign: "center" }}>
                    <Box sx={{ color: "primary.main", mb: 2 }}>
                      {method.icon}
                    </Box>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {method.label}
                    </Typography>
                    {method.href ? (
                      <Button
                        component={Link}
                        href={method.href}
                        variant="contained"
                        sx={{
                          textTransform: "none",
                          fontSize: "1rem",
                        }}
                      >
                        {method.value}
                      </Button>
                    ) : (
                      <Typography variant="body1" color="text.secondary">
                        {method.value}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </MotionWrapper>
            </Grid>
          ))}
      </Grid>

      {/* Social Links */}
      <MotionWrapper variant="slideUp" duration={0.8} delay={0.8}>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{ color: "primary.main", mb: 3 }}
        >
          Connect on Social
        </Typography>
      </MotionWrapper>

      <Grid container spacing={3} sx={{ mb: 6 }}>
        {socialLinks.map((social, index) => (
          <Grid component="div" key={index}>
            <MotionWrapper
              variant="slideUp"
              duration={0.8}
              delay={1.0 + index * 0.1}
            >
              <Card
                sx={{
                  height: "100%",
                  backgroundColor: "background.paper",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    transition: "all 0.3s ease-in-out",
                    boxShadow: 4,
                    borderColor: social.color,
                  },
                }}
              >
                <CardContent sx={{ p: 3, textAlign: "center" }}>
                  <Box sx={{ color: social.color, mb: 2, fontSize: "2rem" }}>
                    {social.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {social.label}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {social.username}
                  </Typography>
                  <Button
                    component={Link}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outlined"
                    size="small"
                    sx={{
                      textTransform: "none",
                      borderColor: social.color,
                      color: social.color,
                      "&:hover": {
                        backgroundColor: social.color,
                        color: "white",
                      },
                    }}
                  >
                    Connect
                  </Button>
                </CardContent>
              </Card>
            </MotionWrapper>
          </Grid>
        ))}
      </Grid>

      {/* Additional Information */}
      <MotionWrapper variant="slideUp" duration={0.8} delay={1.3}>
        <Card sx={{ backgroundColor: "background.paper" }}>
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h5"
              component="h3"
              gutterBottom
              sx={{ color: "secondary.main" }}
            >
              Additional Information
            </Typography>
            <Stack spacing={2}>
              {contactMethods
                .filter((method) => !method.primary)
                .map((method, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", alignItems: "center", gap: 2 }}
                  >
                    <Box sx={{ color: "text.secondary" }}>{method.icon}</Box>
                    <Typography variant="body1" fontWeight="medium">
                      {method.label}:
                    </Typography>
                    {method.href ? (
                      <Link
                        href={method.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Chip label={method.value} size="small" />
                      </Link>
                    ) : (
                      <Chip label={method.value} size="small" />
                    )}
                  </Box>
                ))}
            </Stack>
          </CardContent>
        </Card>
      </MotionWrapper>

      {/* Call to Action */}
      <MotionWrapper variant="slideUp" duration={0.8} delay={1.5}>
        <Box
          sx={{
            mt: 6,
            p: 4,
            textAlign: "center",
            backgroundColor: "primary.main",
            color: "primary.contrastText",
            borderRadius: 3,
          }}
        >
          <Typography
            variant="h4"
            component="p"
            sx={{ mb: 2, fontWeight: "bold" }}
          >
            Ready to Start a Conversation?
          </Typography>
          <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
            Whether it&apos;s about a project, opportunity, or just tech talk -
            I&apos;d love to hear from you!
          </Typography>
          <Button
            component={Link}
            href={`mailto:${t("email")}`}
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<EmailIcon />}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontSize: "1.1rem",
              fontWeight: "bold",
            }}
          >
            Send Me an Email
          </Button>
        </Box>
      </MotionWrapper>
    </Box>
  );
}
