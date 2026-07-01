"use client";

import * as React from "react";
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { ResumeData, ResumePdfLayoutType, ResumePdfSectionKey } from "$/types";
import {
  getCompactResumeSummary,
  getResumeContactItems,
  getResumeContactLine,
  getResumePdfSectionOrder,
  getResumeSkillGroups,
} from "$/utils/resumePdfData";

const MAX_EXPERIENCE_BULLETS = 4;
const MAX_PROJECTS = 3;
const MAX_PROJECT_BULLETS = 2;
const FONT_FAMILY = "Helvetica";

const colors = {
  text: "#111827",
  muted: "#475569",
  accent: "#1e3a8a",
  dark: "#263244",
  sidebar: "#eef2f6",
  rule: "#cbd5e1",
  white: "#ffffff",
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.white,
    color: colors.text,
    fontFamily: FONT_FAMILY,
    fontSize: 9.5,
    lineHeight: 1.35,
  },
  atsPage: {
    paddingTop: 40,
    paddingRight: 45,
    paddingBottom: 40,
    paddingLeft: 45,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: colors.rule,
    paddingBottom: 10,
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: 700,
    lineHeight: 1.08,
  },
  headline: {
    marginTop: 6,
    color: "#1f2937",
    fontSize: 10,
    fontWeight: 600,
  },
  contactLine: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 8,
  },
  section: {
    marginTop: 11,
  },
  sectionTitle: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: 700,
    marginBottom: 5,
    textTransform: "uppercase",
  },
  paragraph: {
    marginBottom: 4,
  },
  skillRow: {
    marginBottom: 3,
  },
  strong: {
    fontWeight: 700,
  },
  entry: {
    marginTop: 6,
  },
  entryTitle: {
    fontSize: 9.5,
    fontWeight: 700,
    marginBottom: 3,
  },
  bullet: {
    marginBottom: 2,
    paddingLeft: 8,
  },
  visualPage: {
    padding: 0,
  },
  visualHeader: {
    minHeight: 112,
    backgroundColor: colors.dark,
    color: colors.white,
    paddingTop: 28,
    paddingRight: 40,
    paddingBottom: 28,
    paddingLeft: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  visualHeaderText: {
    flex: 1,
    paddingRight: 24,
  },
  visualHeaderHeadline: {
    marginTop: 7,
    color: "#dbeafe",
    fontSize: 10,
    fontWeight: 600,
  },
  photoFrame: {
    width: 82,
    height: 104,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
    borderColor: "#e2e8f0",
    borderRadius: 6,
    borderWidth: 1,
    padding: 4,
  },
  photo: {
    width: 74,
    height: 92,
    objectFit: "contain",
  },
  visualBody: {
    flexDirection: "row",
    alignItems: "stretch",
    minHeight: 730,
  },
  sidebar: {
    width: 164,
    backgroundColor: colors.sidebar,
    paddingTop: 24,
    paddingRight: 17,
    paddingBottom: 28,
    paddingLeft: 17,
  },
  sidebarSection: {
    marginBottom: 15,
  },
  sidebarTitle: {
    borderBottomWidth: 1,
    borderBottomColor: "#94a3b8",
    color: colors.dark,
    fontSize: 9,
    fontWeight: 700,
    marginBottom: 7,
    paddingBottom: 4,
    textTransform: "uppercase",
  },
  sidebarGroupTitle: {
    color: colors.dark,
    fontSize: 8.2,
    fontWeight: 700,
    marginBottom: 2,
  },
  sidebarText: {
    color: "#334155",
    fontSize: 7.5,
    marginBottom: 4,
  },
  visualMain: {
    flex: 1,
    paddingTop: 24,
    paddingRight: 34,
    paddingBottom: 28,
    paddingLeft: 28,
  },
});

function Section({
  title,
  children,
  sidebar = false,
}: {
  title: string;
  children: React.ReactNode;
  sidebar?: boolean;
}) {
  return (
    <View style={sidebar ? styles.sidebarSection : styles.section}>
      <Text style={sidebar ? styles.sidebarTitle : styles.sectionTitle}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function BulletList({ items, limit }: { items: string[]; limit?: number }) {
  const visibleItems = typeof limit === "number" ? items.slice(0, limit) : items;

  if (visibleItems.length === 0) return null;

  return (
    <View>
      {visibleItems.map((item) => (
        <Text key={item} style={styles.bullet}>
          - {item}
        </Text>
      ))}
    </View>
  );
}

function SummarySection({ resume }: { resume: ResumeData }) {
  const summary = getCompactResumeSummary(resume.summary);
  if (!summary) return null;

  return (
    <Section title="Professional Summary">
      <Text style={styles.paragraph}>{summary}</Text>
    </Section>
  );
}

function SkillsSection({ resume }: { resume: ResumeData }) {
  const groups = getResumeSkillGroups(resume);
  if (groups.length === 0) return null;

  return (
    <Section title="Technical Skills">
      {groups.map((group) => (
        <Text key={group.category} style={styles.skillRow}>
          <Text style={styles.strong}>{group.category}: </Text>
          {group.items.join(", ")}
        </Text>
      ))}
    </Section>
  );
}

function ExperienceSection({ resume }: { resume: ResumeData }) {
  if (resume.experience.length === 0) return null;

  return (
    <Section title="Professional Experience">
      {resume.experience.map((item) => (
        <View style={styles.entry} key={`${item.company}-${item.role}`} wrap={false}>
          <Text style={styles.entryTitle}>
            {item.role} | {item.company} | {item.period}
          </Text>
          <BulletList items={item.bullets} limit={MAX_EXPERIENCE_BULLETS} />
        </View>
      ))}
    </Section>
  );
}

function ProjectsSection({ resume }: { resume: ResumeData }) {
  if (!resume.projects?.length) return null;

  return (
    <Section title="Selected Projects">
      {resume.projects.slice(0, MAX_PROJECTS).map((project) => (
        <View style={styles.entry} key={project.name} wrap={false}>
          <Text style={styles.entryTitle}>{project.name}</Text>
          <Text style={styles.paragraph}>{project.line}</Text>
          <BulletList items={project.bullets ?? []} limit={MAX_PROJECT_BULLETS} />
        </View>
      ))}
    </Section>
  );
}

function AdditionalExperienceSection({ resume }: { resume: ResumeData }) {
  if (resume.additionalExperience?.length) {
    return (
      <Section title="Additional Experience">
        {resume.additionalExperience.map((item) => (
          <View style={styles.entry} key={`${item.company}-${item.role}`} wrap={false}>
            <Text style={styles.entryTitle}>
              {item.role} | {item.company} | {item.period}
            </Text>
            <BulletList items={item.bullets} limit={2} />
          </View>
        ))}
      </Section>
    );
  }

  if (!resume.additional) return null;

  return (
    <Section title="Additional Activities">
      <Text style={styles.paragraph}>{resume.additional}</Text>
    </Section>
  );
}

function EducationSection({
  resume,
  sidebar = false,
}: {
  resume: ResumeData;
  sidebar?: boolean;
}) {
  if (resume.education.length === 0) return null;

  return (
    <Section title="Education" sidebar={sidebar}>
      {resume.education.map((item) => (
        <View style={styles.entry} key={`${item.institution}-${item.degree}`} wrap={false}>
          <Text style={sidebar ? styles.sidebarGroupTitle : styles.entryTitle}>
            {item.degree}
          </Text>
          <Text style={sidebar ? styles.sidebarText : styles.paragraph}>
            {item.institution} | {item.period}
          </Text>
        </View>
      ))}
    </Section>
  );
}

function CertificationsSection({
  resume,
  sidebar = false,
}: {
  resume: ResumeData;
  sidebar?: boolean;
}) {
  if (!resume.certifications?.length) return null;

  return (
    <Section title="Certifications" sidebar={sidebar}>
      {resume.certifications.slice(0, 4).map((item) => (
        <View style={styles.entry} key={`${item.name}-${item.issuer}`} wrap={false}>
          <Text style={sidebar ? styles.sidebarGroupTitle : styles.entryTitle}>
            {item.name}
          </Text>
          <Text style={sidebar ? styles.sidebarText : styles.paragraph}>
            {item.issuer}
            {item.period ? ` | ${item.period}` : ""}
          </Text>
        </View>
      ))}
    </Section>
  );
}

const sectionRenderers: Record<
  ResumePdfSectionKey,
  (resume: ResumeData) => React.ReactNode
> = {
  summary: (resume) => <SummarySection resume={resume} />,
  skills: (resume) => <SkillsSection resume={resume} />,
  experience: (resume) => <ExperienceSection resume={resume} />,
  projects: (resume) => <ProjectsSection resume={resume} />,
  additionalExperience: (resume) => <AdditionalExperienceSection resume={resume} />,
  education: (resume) => <EducationSection resume={resume} />,
  certifications: (resume) => <CertificationsSection resume={resume} />,
};

function AtsDocument({ resume }: { resume: ResumeData }) {
  return (
    <Page size="A4" style={[styles.page, styles.atsPage]}>
      <View style={styles.header} wrap={false}>
        <Text style={styles.name}>{resume.person.name}</Text>
        <Text style={styles.headline}>{resume.headline ?? resume.person.title}</Text>
        <Text style={styles.contactLine}>{getResumeContactLine(resume)}</Text>
      </View>

      {getResumePdfSectionOrder(resume.meta?.pdfSectionOrder).map((section) => {
        const element = sectionRenderers[section](resume);

        return React.isValidElement(element)
          ? React.cloneElement(element, { key: section })
          : null;
      })}
    </Page>
  );
}

function VisualDocument({ resume }: { resume: ResumeData }) {
  const contactItems = getResumeContactItems(resume);
  const skillGroups = getResumeSkillGroups(resume);

  return (
    <Page size="A4" style={[styles.page, styles.visualPage]}>
      <View style={styles.visualHeader} wrap={false}>
        <View style={styles.visualHeaderText}>
          <Text style={styles.name}>{resume.person.name}</Text>
          <Text style={styles.visualHeaderHeadline}>
            {resume.headline ?? resume.person.title}
          </Text>
        </View>
        {resume.person.photoUrl ? (
          <View style={styles.photoFrame} wrap={false}>
            <Image src={resume.person.photoUrl} style={styles.photo} />
          </View>
        ) : null}
      </View>

      <View style={styles.visualBody}>
        <View style={styles.sidebar}>
          <Section title="Contact" sidebar>
            {contactItems.map((item) => (
              <Text key={item} style={styles.sidebarText}>
                {item}
              </Text>
            ))}
          </Section>
          <Section title="Skills" sidebar>
            {skillGroups.map((group) => (
              <View key={group.category} style={styles.entry} wrap={false}>
                <Text style={styles.sidebarGroupTitle}>{group.category}</Text>
                <Text style={styles.sidebarText}>{group.items.join(", ")}</Text>
              </View>
            ))}
          </Section>
          <EducationSection resume={resume} sidebar />
          <CertificationsSection resume={resume} sidebar />
        </View>

        <View style={styles.visualMain}>
          <SummarySection resume={resume} />
          <ExperienceSection resume={resume} />
          <ProjectsSection resume={resume} />
          <AdditionalExperienceSection resume={resume} />
        </View>
      </View>
    </Page>
  );
}

export function ResumePdfDocument({
  resume,
  layoutType,
}: {
  resume: ResumeData;
  layoutType: ResumePdfLayoutType;
}) {
  return (
    <Document
      title={`Omri Jukin Resume - ${layoutType === "ats" ? "ATS" : "Design"}`}
      author={resume.meta?.author ?? resume.person.name}
      subject="Full-Stack TypeScript Engineer resume"
    >
      {layoutType === "visual" ? (
        <VisualDocument resume={resume} />
      ) : (
        <AtsDocument resume={resume} />
      )}
    </Document>
  );
}
