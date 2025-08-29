import React from "react";
import { Box, Typography, Paper, Grid, Chip, Divider } from "@mui/material";
import MotionWrapper from "../MotionWrapper/MotionWrapper";
import { RESUME_CONSTANTS } from "./Resume.const";
import {
  ResumeContainer,
  ResumePaper,
  ResumeHeader,
  ResumeTitle,
  ResumeSubtitle,
  ResumeDescription,
  SectionContainer,
  SectionTitle,
  LanguageCard,
  LanguageFlag,
  LanguageName,
  SkillChip,
  ContactInfo,
  ContactText,
} from "./Resume.style";
import type { CondensedResumeProps } from "./Resume.type";

const CondensedResume: React.FC<CondensedResumeProps> = ({ className }) => {
  const { LANGUAGES, PROGRAMMING_LANGUAGES, EDUCATION, KEY_SKILLS, CONTACT } =
    RESUME_CONSTANTS;

  return (
    <ResumeContainer className={className}>
      <MotionWrapper variant="fadeInUp" duration={0.8}>
        <ResumePaper elevation={3}>
          {/* Header */}
          <ResumeHeader>
            <ResumeTitle variant="h3" gutterBottom>
              Omri Jukin
            </ResumeTitle>
            <ResumeSubtitle variant="h5">
              Full-Stack Developer & MiddleEnd Specialist
            </ResumeSubtitle>
            <ResumeDescription variant="body1">
              Experienced developer specializing in creating seamless
              integrations between frontend and backend systems. Expert in
              TypeScript, React, Node.js, and modern web technologies with a
              focus on performance and user experience.
            </ResumeDescription>
          </ResumeHeader>

          <Divider sx={{ my: 3 }} />

          {/* Languages */}
          <SectionContainer>
            <SectionTitle variant="h5" gutterBottom>
              Languages
            </SectionTitle>
            <Grid container spacing={2}>
              {LANGUAGES.map((lang, index) => (
                <Grid key={index} component="div">
                  <LanguageCard elevation={1}>
                    <LanguageFlag variant="h4">{lang.flag}</LanguageFlag>
                    <LanguageName variant="h6" gutterBottom>
                      {lang.name}
                    </LanguageName>
                    <Chip label={lang.level} color="primary" size="small" />
                  </LanguageCard>
                </Grid>
              ))}
            </Grid>
          </SectionContainer>

          {/* Programming Languages */}
          <SectionContainer>
            <SectionTitle variant="h5" gutterBottom>
              Programming Languages
            </SectionTitle>
            <Grid container spacing={2}>
              {PROGRAMMING_LANGUAGES.map((lang, index) => (
                <Grid key={index} component="div">
                  <LanguageCard elevation={1}>
                    <LanguageName variant="h6" gutterBottom>
                      {lang.name}
                    </LanguageName>
                    <SkillChip
                      label={lang.level}
                      color={lang.color}
                      size="small"
                    />
                  </LanguageCard>
                </Grid>
              ))}
            </Grid>
          </SectionContainer>

          {/* Education */}
          <SectionContainer>
            <SectionTitle variant="h5" gutterBottom>
              Education
            </SectionTitle>
            {EDUCATION.map((edu, index) => (
              <Paper key={index} elevation={1} sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  component="h4"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  {edu.degree}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "text.secondary", mb: 1 }}
                >
                  {edu.field}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {edu.institution} • {edu.year}
                </Typography>
              </Paper>
            ))}
          </SectionContainer>

          {/* Key Skills */}
          <SectionContainer>
            <SectionTitle variant="h5" gutterBottom>
              Key Skills
            </SectionTitle>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {KEY_SKILLS.map((skill, index) => (
                <SkillChip
                  key={index}
                  label={skill}
                  variant="outlined"
                  color="primary"
                />
              ))}
            </Box>
          </SectionContainer>

          {/* Contact */}
          <ContactInfo>
            <ContactText variant="body2">
              {CONTACT.availability} • Contact: {CONTACT.email}
            </ContactText>
          </ContactInfo>
        </ResumePaper>
      </MotionWrapper>
    </ResumeContainer>
  );
};

export default CondensedResume;
