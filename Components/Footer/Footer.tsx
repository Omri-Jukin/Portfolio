"use client";

import React from "react";
import { Box, Typography, Link, IconButton } from "@mui/material";
import Grid from "@mui/material/Grid";
import { FooterContainer, FooterSection } from "./Footer.style";
import type { FooterProps } from "./Footer.type";
import EmailIcon from "@mui/icons-material/Email";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TelegramIcon from "@mui/icons-material/Telegram";
import WebsiteIcon from "@mui/icons-material/Language";

export const Footer: React.FC<FooterProps> = ({
  title,
  children,
  links,
  linksTitle,
  social,
  socialTitle,
  emailTitle,
  email,
  copyright,
}) => (
  <FooterContainer id="footer-container">
    <Grid container spacing={4} justifyContent="center" id="footer-grid">
      <Grid component="div" id="footer-grid-item">
        <FooterSection id="footer-section">
          <Typography variant="h6" gutterBottom id="footer-title">
            {title}
          </Typography>
          <Typography variant="body2" id="footer-children">
            {children}
          </Typography>
        </FooterSection>
      </Grid>
      <Grid component="div" id="footer-grid-item">
        <FooterSection id="footer-section">
          <Typography variant="h6" gutterBottom id="footer-links-title">
            {linksTitle}
          </Typography>
          {links?.map((item) => (
            <Link
              id={`footer-link-${item.label}`}
              href={item.href}
              color="inherit"
              underline="hover"
              key={item.label}
              sx={{
                display: "flex",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              {item.label}
            </Link>
          ))}
        </FooterSection>
      </Grid>
      <Grid component="div" id="footer-grid-item">
        <FooterSection id="footer-section">
          <Typography variant="h6" gutterBottom id="footer-social-title">
            {socialTitle}
          </Typography>
          {social?.map((item) => (
            <IconButton
              id={`footer-social-icon-${item.label}`}
              color="inherit"
              key={item.label}
              aria-label={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              {item.icon === "GitHub" ? (
                <GitHubIcon />
              ) : item.icon === "LinkedIn" ? (
                <LinkedInIcon />
              ) : item.icon === "Telegram" ? (
                <TelegramIcon />
              ) : (
                <WebsiteIcon />
              )}
            </IconButton>
          ))}
        </FooterSection>
      </Grid>
      <Grid component="div" id="footer-grid-item">
        <FooterSection id="footer-section">
          <Typography variant="h6" gutterBottom id="footer-email-title">
            {emailTitle}
          </Typography>
          <Box display="flex" alignItems="center" id="footer-email-box">
            <IconButton
              id="footer-email-icon"
              color="inherit"
              aria-label="Email"
              href={`mailto:${email}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <EmailIcon />
            </IconButton>
          </Box>
        </FooterSection>
      </Grid>
    </Grid>
    <Box mt={4} textAlign="center" id="footer-copyright-box">
      <Typography variant="body2" color="text.secondary" id="footer-copyright">
        {copyright}
      </Typography>
    </Box>
  </FooterContainer>
);

export default Footer;
