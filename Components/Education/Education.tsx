"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { getResumeData } from "#/lib/data/getResumeData";
import { EDUCATION_CONSTANTS, EDUCATION_ANIMATIONS } from "./Education.const";
import type { EducationProps } from "./Education.type";
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
  CTAButton,
  EducationCTAButton,
} from "./Education.style";

const Education: React.FC<EducationProps> = () => {
  const t = useTranslations("education");
  const locale = useLocale();
  const router = useRouter();
  const degrees = getResumeData(locale).education;

  const handleResumeClick = () => {
    router.push(`/${locale}/resume`);
  };

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
              <motion.div key={`${degree.degree}-${index}`} variants={EDUCATION_ANIMATIONS.item}>
                <DegreeCard>
                  <DegreeHeader>
                    <DegreeTitle>{degree.degree}</DegreeTitle>
                    <InstitutionName>{degree.institution}</InstitutionName>
                    <DegreeDetails>
                      {degree.location ? (
                        <DetailChip label={degree.location} size="small" variant="outlined" />
                      ) : null}
                      <DetailChip label={degree.period} size="small" variant="outlined" />
                    </DegreeDetails>
                  </DegreeHeader>
                </DegreeCard>
              </motion.div>
            ))}
          </EducationSection>

          <motion.div variants={EDUCATION_ANIMATIONS.item}>
            <CTAButton>
              <Typography variant="h6" sx={{ mb: 1.5 }}>
                {t("interestedInLearning")}
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                {t("checkOutResume")}
              </Typography>
              <EducationCTAButton
                variant="contained"
                size="large"
                onClick={handleResumeClick}
              >
                {t("viewResume")}
              </EducationCTAButton>
            </CTAButton>
          </motion.div>
        </motion.div>
      </EducationContent>
    </EducationContainer>
  );
};

export default Education;
