ALTER TABLE "work_experiences"
  ADD COLUMN IF NOT EXISTS "is_resume_featured" boolean DEFAULT false NOT NULL;

ALTER TABLE "skills"
  ADD COLUMN IF NOT EXISTS "is_resume_featured" boolean DEFAULT false NOT NULL;

ALTER TABLE "education"
  ADD COLUMN IF NOT EXISTS "is_resume_featured" boolean DEFAULT false NOT NULL;

ALTER TABLE "certifications"
  ADD COLUMN IF NOT EXISTS "is_resume_featured" boolean DEFAULT false NOT NULL;

UPDATE "work_experiences"
SET "is_resume_featured" = true
WHERE "id" IN (
  'the-atheist-line-technical-lead',
  'abra-full-stack-engineer',
  'menora-business-rules'
);

UPDATE "skills"
SET "is_resume_featured" = true
WHERE "id" IN (
  'technical-leadership',
  'full-stack-typescript',
  'nextjs-react',
  'backend-data-modeling',
  'internal-tooling'
);

UPDATE "education"
SET "is_resume_featured" = true
WHERE "id" IN (
  'air-force-technological-college-electrical-engineering',
  'codecademy-full-stack-engineering'
);

UPDATE "certifications"
SET "is_resume_featured" = true
WHERE "id" IN (
  'cert-impact-cyber-diploma'
);
