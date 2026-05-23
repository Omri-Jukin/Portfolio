"use client";

import React from "react";
import {
  Box,
  Typography,
  Card,
  Chip,
  Stack,
  Link,
  Button,
} from "@mui/material";
import { useRouter } from "next/navigation";
import MotionWrapper from "../MotionWrapper/MotionWrapper";
import type { ResumeData } from "#/lib/types";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="h6"
      component="h2"
      sx={{
        color: "primary.main",
        fontWeight: 600,
        mb: 2.5,
      }}
    >
      {children}
    </Typography>
  );
}

function ResumeSection({
  children,
  first = false,
}: {
  children: React.ReactNode;
  first?: boolean;
}) {
  return (
    <Box
      sx={{
        mt: first ? 0 : { xs: 4, md: 5 },
      }}
    >
      {children}
    </Box>
  );
}

export interface FullResumeTabProps {
  resumeData: ResumeData;
  locale: string;
  headerProfileLinks: { label: string; url: string }[];
  letsBuildTogether: string;
  readyToDiscuss: string;
  getInTouch: string;
}

const FullResumeTab: React.FC<FullResumeTabProps> = ({
  resumeData,
  locale,
  headerProfileLinks,
  letsBuildTogether,
  readyToDiscuss,
  getInTouch,
}) => {
  const router = useRouter();

  return (
    <>
      <Box component="article" sx={{ mb: 6 }}>
        <MotionWrapper variant="slideUp" duration={0.6} delay={0.4}>
          <ResumeSection first>
            <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
              {resumeData.person.name}
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 0.5, sm: 2 }}
              sx={{ mb: 0.5 }}
            >
              <Typography variant="body2">Phone: {resumeData.person.contacts.phone}</Typography>
              <Typography variant="body2">Email: {resumeData.person.contacts.email}</Typography>
            </Stack>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              {headerProfileLinks.map((profileLink) => {
                const href = profileLink.url.startsWith("http")
                  ? profileLink.url
                  : `https://${profileLink.url}`;

                return (
                  <Link
                    key={profileLink.label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="body2"
                  >
                    {profileLink.label}: {profileLink.url}
                  </Link>
                );
              })}
            </Stack>
          </ResumeSection>
        </MotionWrapper>

        {resumeData.headline ? (
          <MotionWrapper variant="slideUp" duration={0.6} delay={0.5}>
            <ResumeSection>
              <Typography
                variant="subtitle1"
                sx={{ color: "primary.main", fontWeight: 600 }}
              >
                {resumeData.headline}
              </Typography>
            </ResumeSection>
          </MotionWrapper>
        ) : null}

        <MotionWrapper variant="slideUp" duration={0.6} delay={0.55}>
          <ResumeSection>
            <SectionTitle>Summary</SectionTitle>
            <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
              {resumeData.summary}
            </Typography>
          </ResumeSection>
        </MotionWrapper>

        {resumeData.coreSkills && resumeData.coreSkills.length > 0 ? (
          <MotionWrapper variant="slideUp" duration={0.6} delay={0.6}>
            <ResumeSection>
              <SectionTitle>Core Skills</SectionTitle>
              <Stack spacing={1.5}>
                {resumeData.coreSkills.map((cat, i) => (
                  <Box key={i}>
                    <Typography variant="body2" fontWeight="600" sx={{ mb: 0.25 }}>
                      {cat.category}
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {cat.items.map((item, j) => (
                        <Chip
                          key={j}
                          label={item}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: "0.75rem" }}
                        />
                      ))}
                    </Box>
                  </Box>
                ))}
              </Stack>
            </ResumeSection>
          </MotionWrapper>
        ) : null}

        <MotionWrapper variant="slideUp" duration={0.6} delay={0.65}>
          <ResumeSection>
            <SectionTitle>Professional Experience</SectionTitle>
            <Stack spacing={3.5}>
              {resumeData.experience.map((exp, i) => (
                <Box key={i}>
                  <Typography variant="subtitle1" fontWeight="600">
                    {exp.role}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {exp.company} | {exp.period}
                  </Typography>
                  <Box component="ul" sx={{ m: 0, pl: 2.5, mt: 1 }}>
                    {exp.bullets.map((bullet, j) => (
                      <Typography
                        key={j}
                        component="li"
                        variant="body2"
                        sx={{ mb: 0.5, lineHeight: 1.6 }}
                      >
                        {bullet}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              ))}
            </Stack>
          </ResumeSection>
        </MotionWrapper>

        {resumeData.projects && resumeData.projects.length > 0 ? (
          <MotionWrapper variant="slideUp" duration={0.6} delay={0.7}>
            <ResumeSection>
              <SectionTitle>Selected Projects</SectionTitle>
              <Stack spacing={3}>
                {resumeData.projects.map((proj, i) => (
                  <Box key={i}>
                    <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 0.25 }}>
                      {proj.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Personal Project
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      {proj.line}
                    </Typography>
                    <Box component="ul" sx={{ m: 0, pl: 2.5, mb: 0.5 }}>
                      {proj.bullets?.map((bullet, j) => (
                        <Typography
                          key={j}
                          component="li"
                          variant="body2"
                          sx={{ mb: 0.5, lineHeight: 1.6 }}
                        >
                          {bullet}
                        </Typography>
                      ))}
                    </Box>
                    {proj.url ? (
                      <Link
                        href={proj.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="body2"
                        sx={{ display: "inline-block" }}
                      >
                        {proj.url}
                      </Link>
                    ) : null}
                  </Box>
                ))}
              </Stack>
            </ResumeSection>
          </MotionWrapper>
        ) : null}

        {resumeData.education && resumeData.education.length > 0 ? (
          <MotionWrapper variant="slideUp" duration={0.6} delay={0.75}>
            <ResumeSection>
              <SectionTitle>Education</SectionTitle>
              <Stack spacing={2.5}>
                {resumeData.education.map((edu, i) => (
                  <Box key={i}>
                    <Typography variant="subtitle1" fontWeight="600">
                      {edu.degree}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {edu.institution} | {edu.period}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </ResumeSection>
          </MotionWrapper>
        ) : null}

        {resumeData.additionalExperience && resumeData.additionalExperience.length > 0 ? (
          <MotionWrapper variant="slideUp" duration={0.6} delay={0.8}>
            <ResumeSection>
              <SectionTitle>Additional Experience</SectionTitle>
              <Stack spacing={2.5}>
                {resumeData.additionalExperience.map((exp, i) => (
                  <Box key={i}>
                    <Typography variant="subtitle1" fontWeight="600">
                      {exp.role}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {exp.company} | {exp.period}
                    </Typography>
                    <Box component="ul" sx={{ m: 0, pl: 2.5, mt: 1 }}>
                      {exp.bullets.map((bullet, j) => (
                        <Typography
                          key={j}
                          component="li"
                          variant="body2"
                          sx={{ mb: 0.5, lineHeight: 1.6 }}
                        >
                          {bullet}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                ))}
              </Stack>
            </ResumeSection>
          </MotionWrapper>
        ) : null}
      </Box>

      <MotionWrapper variant="slideUp" duration={0.6} delay={0.9}>
        <Card
          elevation={0}
          sx={{
            mt: { xs: 5, md: 6 },
            p: 4,
            textAlign: "center",
            border: 1,
            borderColor: "divider",
            borderRadius: 1.5,
          }}
        >
          <Typography variant="h5" fontWeight={700} sx={{ mb: 1.5 }}>
            {letsBuildTogether}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {readyToDiscuss}
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push(`/${locale}/contact`)}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            {getInTouch}
          </Button>
        </Card>
      </MotionWrapper>
    </>
  );
};

export default FullResumeTab;
