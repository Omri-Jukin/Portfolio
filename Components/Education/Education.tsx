"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button, Typography, CircularProgress, Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { api } from "#/lib/trpc/client";
import {
  EducationContainer,
  EducationContent,
  EducationHeader,
  EducationTitle,
  EducationSubtitle,
  EducationDescription,
  EducationSection,
  SectionTitle,
  DegreeCard,
  DegreeHeader,
  DegreeTitle,
  InstitutionName,
  DegreeDetails,
  DetailChip,
  AchievementList,
  AchievementItem,
  CourseworkGrid,
  CourseChip,
  CertificationCard,
  CertificationHeader,
  CertificationName,
  CertificationStatus,
  CertificationDetails,
  CTAButton,
} from "./Education.style";
import { EDUCATION_CONSTANTS, EDUCATION_ANIMATIONS } from "./Education.const";
import {
  EducationProps,
  EducationDegree,
  EducationCertification,
} from "./Education.type";

const Education: React.FC<EducationProps> = () => {
  const t = useTranslations("education");
  const router = useRouter();

  // Fetch education data from database
  const {
    data: educationData = [],
    isLoading,
    error,
  } = api.education.getAll.useQuery({
    visibleOnly: true,
  });

  const handleResumeClick = () => {
    router.push("/resume");
  };

  // Transform database data to component format
  const degrees: EducationDegree[] = educationData.map((edu) => ({
    degree: edu.degree,
    institution: edu.institution,
    location: edu.location,
    period: `${new Date(edu.startDate).getFullYear()} - ${
      edu.endDate ? new Date(edu.endDate).getFullYear() : "Present"
    }`,
    gpa: edu.gpa || undefined,
    achievements: edu.achievements || [],
    coursework: edu.coursework || [],
    projects: edu.projects || [],
  }));

  // For now, use hardcoded certifications - can be moved to database later
  const certifications = t.raw("certifications") as EducationCertification[];

  if (isLoading) {
    return (
      <EducationContainer id={EDUCATION_CONSTANTS.SECTION_ID}>
        <EducationContent>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="400px"
          >
            <CircularProgress />
          </Box>
        </EducationContent>
      </EducationContainer>
    );
  }

  if (error) {
    console.error("Error loading education data:", error);
    // Fallback to empty data or show error message
  }

  return (
    <EducationContainer id={EDUCATION_CONSTANTS.SECTION_ID}>
      <EducationContent>
        <motion.div
          variants={EDUCATION_ANIMATIONS.container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <EducationHeader>
            <motion.div variants={EDUCATION_ANIMATIONS.item}>
              <EducationTitle>{t("title")}</EducationTitle>
            </motion.div>
            <motion.div variants={EDUCATION_ANIMATIONS.item}>
              <EducationSubtitle>{t("subtitle")}</EducationSubtitle>
            </motion.div>
            <motion.div variants={EDUCATION_ANIMATIONS.item}>
              <EducationDescription>{t("description")}</EducationDescription>
            </motion.div>
          </EducationHeader>

          <EducationSection>
            <motion.div variants={EDUCATION_ANIMATIONS.item}>
              <SectionTitle>{t("academicBackground")}</SectionTitle>
            </motion.div>

            {degrees.map((degree, index) => (
              <motion.div key={index} variants={EDUCATION_ANIMATIONS.item}>
                <DegreeCard>
                  <DegreeHeader>
                    <DegreeTitle>{degree.degree}</DegreeTitle>
                    <InstitutionName>{degree.institution}</InstitutionName>
                    <DegreeDetails>
                      <DetailChip label={degree.location} size="small" />
                      <DetailChip label={degree.period} size="small" />
                      {degree.gpa && (
                        <DetailChip label={`GPA: ${degree.gpa}`} size="small" />
                      )}
                    </DegreeDetails>
                  </DegreeHeader>

                  <AchievementList>
                    {degree.achievements.map(
                      (achievement, achievementIndex) => (
                        <AchievementItem key={achievementIndex}>
                          {achievement}
                        </AchievementItem>
                      )
                    )}
                  </AchievementList>

                  <Box>
                    <Typography variant="h6" sx={{ mb: 2, color: "#1e293b" }}>
                      Key Coursework:
                    </Typography>
                    <CourseworkGrid>
                      {degree.coursework.map((course, courseIndex) => (
                        <CourseChip
                          key={courseIndex}
                          label={course}
                          size="small"
                        />
                      ))}
                    </CourseworkGrid>
                  </Box>

                  {degree.projects.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="h6" sx={{ mb: 2, color: "#1e293b" }}>
                        Notable Projects:
                      </Typography>
                      <AchievementList>
                        {degree.projects.map((project, projectIndex) => (
                          <AchievementItem key={projectIndex}>
                            {project}
                          </AchievementItem>
                        ))}
                      </AchievementList>
                    </Box>
                  )}
                </DegreeCard>
              </motion.div>
            ))}
          </EducationSection>

          {certifications.length > 0 && (
            <EducationSection>
              <motion.div variants={EDUCATION_ANIMATIONS.item}>
                <SectionTitle>{t("keyAchievements")}</SectionTitle>
              </motion.div>

              {certifications.map((cert, index) => (
                <motion.div key={index} variants={EDUCATION_ANIMATIONS.item}>
                  <CertificationCard>
                    <CertificationHeader>
                      <CertificationName>{cert.name}</CertificationName>
                      <CertificationStatus label={cert.status} size="small" />
                    </CertificationHeader>
                    <CertificationDetails>
                      {cert.issuer} • {cert.date}
                    </CertificationDetails>
                  </CertificationCard>
                </motion.div>
              ))}
            </EducationSection>
          )}

          <motion.div variants={EDUCATION_ANIMATIONS.item}>
            <CTAButton>
              <Typography variant="h5" sx={{ mb: 3, color: "#1e293b" }}>
                {t("interestedInLearning")}
              </Typography>
              <Typography sx={{ mb: 4, color: "#64748b" }}>
                {t("checkOutResume")}
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={handleResumeClick}
                sx={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  borderRadius: "12px",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                {t("viewResume")}
              </Button>
            </CTAButton>
          </motion.div>
        </motion.div>
      </EducationContent>
    </EducationContainer>
  );
};

export default Education;
