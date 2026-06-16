ALTER TABLE "work_experiences"
  ADD COLUMN IF NOT EXISTS "is_resume_featured" boolean DEFAULT false NOT NULL;

ALTER TABLE "skills"
  ADD COLUMN IF NOT EXISTS "is_resume_featured" boolean DEFAULT false NOT NULL;

ALTER TABLE "education"
  ADD COLUMN IF NOT EXISTS "is_resume_featured" boolean DEFAULT false NOT NULL;

ALTER TABLE "certifications"
  ADD COLUMN IF NOT EXISTS "is_resume_featured" boolean DEFAULT false NOT NULL;
