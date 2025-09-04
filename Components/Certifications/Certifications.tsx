"use client";

import React from "react";
import { Box, Typography, Link } from "@mui/material";
import { useTranslations } from "next-intl";
import { api } from "$/trpc/client";

import MotionWrapper from "../MotionWrapper/MotionWrapper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import {
  OpenInNew as OpenInNewIcon,
  Verified as VerifiedIcon,
} from "@mui/icons-material";
import {
  CertificationsContainer,
  CertificationsTitle,
  CertificationsSubtitle,
  CertificationsSwiperContainer,
  CertificationCard,
  CertificationContent,
  CertificationHeader,
  CertificationIcon,
  CertificationName,
  CertificationIssuer,
  CertificationDate,
  CertificationDescription,
  CertificationSkills,
  SkillChip,
  CategoryBadge,
  VerificationLink,
} from "./Certifications.style";
import { CERTIFICATIONS_CONSTANTS } from "./Certifications.const";
import type { Certification, CertificationsProps } from "./Certifications.type";

const Certifications: React.FC<CertificationsProps> = ({
  onCertificationClick,
}) => {
  const t = useTranslations("certifications");

  const staticCertifications: Certification[] = [
    {
      id: "aws-certified-developer",
      name: "AWS Certified Developer - Associate",
      issuer: "Amazon Web Services",
      description:
        "Demonstrated expertise in developing and maintaining applications on AWS platform, including deployment, monitoring, and security best practices",
      category: "cloud",
      status: "active",
      skills: [
        "AWS",
        "Cloud Infrastructure",
        "Deployment",
        "CI/CD",
        "Docker",
        "Vercel",
      ],
      issueDate: "2023-06-15",
      expiryDate: "2026-06-15",
      credentialId: "AWS-DEV-OMRI-2023",
      verificationUrl: "https://aws.amazon.com/verification",
      icon: "☁️",
      color: null,
      displayOrder: 1,
      isVisible: true,
      nameTranslations: {},
      descriptionTranslations: {},
      issuerTranslations: {},
      createdBy: "system",
      createdAt: "2023-06-15T00:00:00Z",
      updatedAt: null,
    },
    {
      id: "comp-tia-a-plus",
      name: "CompTIA A+ Certification",
      issuer: "CompTIA",
      description:
        "Industry-standard certification demonstrating foundational IT skills, hardware/software troubleshooting, and essential electrical/electronic knowledge",
      category: "technical",
      status: "active",
      skills: [
        "Hardware Troubleshooting",
        "Software Installation",
        "Network Configuration",
        "Electrical Safety",
        "Electronic Components",
        "System Maintenance",
      ],
      issueDate: "2023-08-20",
      expiryDate: "2026-08-20",
      credentialId: "COMPTIA-A-PLUS-OMRI-2023",
      verificationUrl: "https://www.comptia.org/verification",
      icon: "🔧",
      color: null,
      displayOrder: 2,
      isVisible: true,
      nameTranslations: {},
      descriptionTranslations: {},
      issuerTranslations: {},
      createdBy: "system",
      createdAt: "2023-08-20T00:00:00Z",
      updatedAt: null,
    },
  ];

  const {
    data: certificationsData = staticCertifications,
    isLoading,
    error,
  } = api.certifications.getAll.useQuery({
    visibleOnly: true,
  });

  const certifications = certificationsData.filter((cert) => cert.isVisible);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const handleVerificationClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCertificationClick = (certificationId: string) => {
    if (onCertificationClick) {
      onCertificationClick(certificationId);
    }
  };

  if (isLoading) {
    return (
      <CertificationsContainer id={CERTIFICATIONS_CONSTANTS.SECTION_ID}>
        <MotionWrapper
          variant="fadeInUp"
          duration={CERTIFICATIONS_CONSTANTS.ANIMATION.DURATION}
          delay={CERTIFICATIONS_CONSTANTS.ANIMATION.INITIAL_DELAY}
        >
          <CertificationsTitle variant="h2">{t("title")}</CertificationsTitle>
          <CertificationsSubtitle variant="h6">
            Loading certifications...
          </CertificationsSubtitle>
        </MotionWrapper>
      </CertificationsContainer>
    );
  }

  if (error) {
    return (
      <CertificationsContainer id={CERTIFICATIONS_CONSTANTS.SECTION_ID}>
        <MotionWrapper
          variant="fadeInUp"
          duration={CERTIFICATIONS_CONSTANTS.ANIMATION.DURATION}
          delay={CERTIFICATIONS_CONSTANTS.ANIMATION.INITIAL_DELAY}
        >
          <CertificationsTitle variant="h2">{t("title")}</CertificationsTitle>
          <CertificationsSubtitle variant="h6">
            Unable to load certifications. Please try again later.
          </CertificationsSubtitle>
        </MotionWrapper>
      </CertificationsContainer>
    );
  }

  if (!certifications || certifications.length === 0) {
    return (
      <CertificationsContainer id={CERTIFICATIONS_CONSTANTS.SECTION_ID}>
        <MotionWrapper
          variant="fadeInUp"
          duration={CERTIFICATIONS_CONSTANTS.ANIMATION.DURATION}
          delay={CERTIFICATIONS_CONSTANTS.ANIMATION.INITIAL_DELAY}
        >
          <CertificationsTitle variant="h2">{t("title")}</CertificationsTitle>
          <CertificationsSubtitle variant="h6">
            No certifications available at the moment.
          </CertificationsSubtitle>
        </MotionWrapper>
      </CertificationsContainer>
    );
  }

  const sortedCertifications = [...certifications].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

  return (
    <CertificationsContainer id={CERTIFICATIONS_CONSTANTS.SECTION_ID}>
      <MotionWrapper
        variant="fadeInUp"
        duration={CERTIFICATIONS_CONSTANTS.ANIMATION.DURATION}
        delay={CERTIFICATIONS_CONSTANTS.ANIMATION.INITIAL_DELAY}
      >
        <CertificationsTitle variant="h2">{t("title")}</CertificationsTitle>

        <CertificationsSubtitle variant="h6">
          {t("subtitle")}
        </CertificationsSubtitle>
      </MotionWrapper>

      <MotionWrapper
        variant="fadeInUp"
        duration={CERTIFICATIONS_CONSTANTS.ANIMATION.DURATION}
        delay={CERTIFICATIONS_CONSTANTS.ANIMATION.INITIAL_DELAY + 0.2}
      >
        <CertificationsSwiperContainer>
          <Swiper
            modules={[Navigation, Pagination, EffectCoverflow]}
            spaceBetween={CERTIFICATIONS_CONSTANTS.SWIPER.SPACE_BETWEEN}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            breakpoints={{
              640: {
                slidesPerView:
                  CERTIFICATIONS_CONSTANTS.SWIPER.SLIDES_PER_VIEW.MOBILE,
                effect: "slide",
                centeredSlides: false,
              },
              768: {
                slidesPerView:
                  CERTIFICATIONS_CONSTANTS.SWIPER.SLIDES_PER_VIEW.TABLET,
                effect: "slide",
                centeredSlides: false,
              },
              1024: {
                slidesPerView:
                  CERTIFICATIONS_CONSTANTS.SWIPER.SLIDES_PER_VIEW.DESKTOP,
                effect: "slide",
                centeredSlides: false,
              },
            }}
          >
            {sortedCertifications.map(
              (certification: Certification, index: number) => (
                <SwiperSlide key={certification.id}>
                  <MotionWrapper
                    variant="fadeInUp"
                    duration={CERTIFICATIONS_CONSTANTS.ANIMATION.DURATION}
                    delay={
                      CERTIFICATIONS_CONSTANTS.ANIMATION.INITIAL_DELAY +
                      index * CERTIFICATIONS_CONSTANTS.ANIMATION.STAGGER_DELAY
                    }
                  >
                    <CertificationCard
                      onClick={() => handleCertificationClick(certification.id)}
                      sx={{
                        cursor: onCertificationClick ? "pointer" : "default",
                      }}
                    >
                      <CategoryBadge
                        label={t(`categories.${certification.category}`)}
                        category={certification.category}
                        size="small"
                      />

                      <CertificationContent>
                        <CertificationHeader>
                          <Box sx={{ flex: 1 }}>
                            <CertificationIcon>
                              {certification.icon ||
                                CERTIFICATIONS_CONSTANTS.CATEGORY_ICONS[
                                  certification.category as keyof typeof CERTIFICATIONS_CONSTANTS.CATEGORY_ICONS
                                ]}
                            </CertificationIcon>

                            <CertificationName>
                              {certification.name}
                            </CertificationName>

                            <CertificationIssuer>
                              {certification.issuer}
                            </CertificationIssuer>

                            <CertificationDate>
                              {formatDate(certification.issueDate)}
                              {certification.expiryDate &&
                                ` - ${formatDate(certification.expiryDate)}`}
                            </CertificationDate>
                          </Box>
                        </CertificationHeader>

                        <CertificationDescription>
                          {certification.description}
                        </CertificationDescription>

                        <CertificationSkills>
                          {certification.skills.map(
                            (skill: string, skillIndex: number) => (
                              <SkillChip
                                key={skillIndex}
                                label={skill}
                                size="small"
                                category={certification.category}
                              />
                            )
                          )}
                        </CertificationSkills>

                        {certification.verificationUrl && (
                          <VerificationLink>
                            <Link
                              href={certification.verificationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleVerificationClick(
                                  certification.verificationUrl!
                                );
                              }}
                            >
                              <VerifiedIcon fontSize="small" />
                              {t("verify")}
                              <OpenInNewIcon fontSize="small" />
                            </Link>
                          </VerificationLink>
                        )}

                        {certification.credentialId && (
                          <Typography
                            variant="caption"
                            sx={{
                              mt: 1,
                              color: "text.secondary",
                              fontSize: "0.75rem",
                            }}
                          >
                            {t("credentialId")}: {certification.credentialId}
                          </Typography>
                        )}
                      </CertificationContent>
                    </CertificationCard>
                  </MotionWrapper>
                </SwiperSlide>
              )
            )}
          </Swiper>
        </CertificationsSwiperContainer>
      </MotionWrapper>
    </CertificationsContainer>
  );
};

export default Certifications;
