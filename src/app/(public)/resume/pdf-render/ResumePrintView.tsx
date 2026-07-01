import type * as React from "react";
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

function Section({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`resume-section ${className}`}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function BulletList({ items, limit }: { items: string[]; limit?: number }) {
  const visibleItems = typeof limit === "number" ? items.slice(0, limit) : items;

  if (visibleItems.length === 0) return null;

  return (
    <ul>
      {visibleItems.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function SummarySection({ resume }: { resume: ResumeData }) {
  const summary = getCompactResumeSummary(resume.summary);
  if (!summary) return null;

  return (
    <Section title="Professional Summary">
      <p>{summary}</p>
    </Section>
  );
}

function SkillsSection({ resume }: { resume: ResumeData }) {
  const skillGroups = getResumeSkillGroups(resume);
  if (skillGroups.length === 0) return null;

  return (
    <Section title="Technical Skills">
      <div className="skill-rows">
        {skillGroups.map((group) => (
          <p key={group.category}>
            <strong>{group.category}:</strong> {group.items.join(", ")}
          </p>
        ))}
      </div>
    </Section>
  );
}

function ExperienceSection({ resume }: { resume: ResumeData }) {
  if (resume.experience.length === 0) return null;

  return (
    <Section title="Professional Experience">
      {resume.experience.map((item) => (
        <article className="resume-entry" key={`${item.company}-${item.role}`}>
          <h3>
            {item.role} | {item.company} | {item.period}
          </h3>
          <BulletList items={item.bullets} limit={MAX_EXPERIENCE_BULLETS} />
        </article>
      ))}
    </Section>
  );
}

function ProjectsSection({ resume }: { resume: ResumeData }) {
  if (!resume.projects?.length) return null;

  return (
    <Section title="Selected Projects">
      {resume.projects.slice(0, MAX_PROJECTS).map((project) => (
        <article className="resume-entry" key={project.name}>
          <h3>{project.name}</h3>
          <p>{project.line}</p>
          <BulletList items={project.bullets ?? []} limit={MAX_PROJECT_BULLETS} />
        </article>
      ))}
    </Section>
  );
}

function AdditionalExperienceSection({ resume }: { resume: ResumeData }) {
  if (resume.additionalExperience?.length) {
    return (
      <Section title="Additional Experience">
        {resume.additionalExperience.map((item) => (
          <article className="resume-entry" key={`${item.company}-${item.role}`}>
            <h3>
              {item.role} | {item.company} | {item.period}
            </h3>
            <BulletList items={item.bullets} limit={2} />
          </article>
        ))}
      </Section>
    );
  }

  if (!resume.additional) return null;

  return (
    <Section title="Additional Activities">
      <p>{resume.additional}</p>
    </Section>
  );
}

function EducationSection({ resume }: { resume: ResumeData }) {
  if (resume.education.length === 0) return null;

  return (
    <Section title="Education">
      {resume.education.map((item) => (
        <article className="resume-entry compact" key={`${item.institution}-${item.degree}`}>
          <h3>
            {item.degree} | {item.institution} | {item.period}
          </h3>
        </article>
      ))}
    </Section>
  );
}

function CertificationsSection({ resume }: { resume: ResumeData }) {
  if (!resume.certifications?.length) return null;

  return (
    <Section title="Certifications">
      {resume.certifications.slice(0, 4).map((item) => (
        <article className="resume-entry compact" key={`${item.name}-${item.issuer}`}>
          <h3>
            {item.name} | {item.issuer}
            {item.period ? ` | ${item.period}` : ""}
          </h3>
        </article>
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

function AtsResume({ resume }: { resume: ResumeData }) {
  return (
    <main className="resume-sheet ats-layout" data-resume-pdf-ready="true">
      <header className="resume-header">
        <h1>{resume.person.name}</h1>
        <p className="headline">{resume.headline ?? resume.person.title}</p>
        <p className="contact-line">{getResumeContactLine(resume)}</p>
      </header>

      {getResumePdfSectionOrder(resume.meta?.pdfSectionOrder).map((section) => (
        <div key={section}>{sectionRenderers[section](resume)}</div>
      ))}
    </main>
  );
}

function VisualResume({ resume }: { resume: ResumeData }) {
  const contactItems = getResumeContactItems(resume);
  const skillGroups = getResumeSkillGroups(resume);

  return (
    <main className="resume-sheet visual-layout" data-resume-pdf-ready="true">
      <header className="visual-header">
        <div>
          <h1>{resume.person.name}</h1>
          <p>{resume.headline ?? resume.person.title}</p>
        </div>
        {resume.person.photoUrl ? (
          <div className="visual-photo-frame" aria-hidden="true">
            <img src={resume.person.photoUrl} alt="" />
          </div>
        ) : null}
      </header>

      <div className="visual-body">
        <aside className="visual-sidebar">
          <section>
            <h2>Contact</h2>
            {contactItems.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </section>
          <section>
            <h2>Skills</h2>
            {skillGroups.map((group) => (
              <div className="sidebar-group" key={group.category}>
                <h3>{group.category}</h3>
                <p>{group.items.join(", ")}</p>
              </div>
            ))}
          </section>
          <EducationSection resume={resume} />
          <CertificationsSection resume={resume} />
        </aside>

        <div className="visual-main">
          <SummarySection resume={resume} />
          <ExperienceSection resume={resume} />
          <ProjectsSection resume={resume} />
          <AdditionalExperienceSection resume={resume} />
        </div>
      </div>
    </main>
  );
}

export function ResumePrintView({
  resume,
  layout,
}: {
  resume: ResumeData;
  layout: ResumePdfLayoutType;
}) {
  return layout === "visual" ? (
    <VisualResume resume={resume} />
  ) : (
    <AtsResume resume={resume} />
  );
}
