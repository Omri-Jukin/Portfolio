import { NextRequest, NextResponse } from "next/server";
import { count, eq } from "drizzle-orm";
import { z } from "zod";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  getPostBySlug,
  updatePost,
} from "$/db/blog/blog";
import { CertificationsService } from "$/db/certifications/certifications";
import { getDB } from "$/db/client";
import { EducationManager } from "$/db/Education/EducationManager";
import { ProjectManager } from "$/db/projects/ProjectManager";
import { PublicContentBlockManager } from "$/db/publicContent/PublicContentBlockManager";
import {
  adminDashboardSections,
  blogPosts,
  calculatorSettings,
  contactInquiries,
  emailTemplates,
  intakes,
  pricingBaseRates,
  pricingDiscounts,
  pricingFeatures,
  pricingMeta,
  pricingMultiplierGroups,
  pricingMultiplierValues,
  pricingProjectTypes,
  projects,
  proposals,
  roles,
  skills,
  users,
} from "$/db/schema/schema.tables";
import { ServiceManager } from "$/db/services/ServiceManager";
import { SkillManager } from "$/db/skills/SkillManager";
import { TestimonialManager } from "$/db/testimonials/TestimonialManager";
import { WorkExperienceManager } from "$/db/workExperiences/WorkExperienceManager";
import { emitAudit, getIpAddress, getUserAgent } from "$/logging/audit";
import type { AuditAction, AuditResource } from "$/logging/audit";
import {
  apiGeneralRateLimiter,
  checkRateLimit,
  getRateLimitIdentifier,
} from "$/rateLimit/rateLimiter";
import type { ResumePdfSectionKey } from "$/types";

const API_VERSION = "v1";
const IDEMPOTENCY_TTL_MS = 15 * 60 * 1000;

const DEFAULT_PDF_SECTION_ORDER: ResumePdfSectionKey[] = [
  "summary",
  "skills",
  "experience",
  "projects",
  "certifications",
  "education",
  "additionalExperience",
];

type RouteContext = { params: Promise<{ resource?: string[] }> };
type JsonRecord = Record<string, unknown>;

type RequestState = {
  actor: string;
  idempotencyKey: string | null;
  method: string;
  path: string[];
  reason: string | null;
  request: NextRequest;
  requestId: string;
  searchParams: URLSearchParams;
};

type CachedResponse = {
  expiresAt: number;
  payload: unknown;
  status: number;
};

type ResourceFilter = {
  field: string;
  param: string;
  type?: "boolean" | "number" | "string";
};

type IntentCheck = {
  description: string;
  needsConfirmation: (data: JsonRecord) => boolean;
};

type CrudResourceConfig = {
  auditResource: AuditResource;
  bulkDelete?: (ids: string[]) => Promise<{ deletedCount: number }>;
  bulkUpdate?: (ids: string[], data: JsonRecord) => Promise<unknown[]>;
  create: (data: JsonRecord, authorId: string) => Promise<unknown>;
  createSchema: z.ZodTypeAny;
  defaults?: JsonRecord;
  filters?: ResourceFilter[];
  get: (id: string) => Promise<unknown | null>;
  intentChecks?: IntentCheck[];
  list: (includeHidden: boolean) => Promise<unknown[]>;
  remove: (id: string) => Promise<boolean>;
  reorder?: (items: Array<{ id: string; displayOrder: number }>) => Promise<void>;
  resource: string;
  searchFields?: string[];
  update: (id: string, data: JsonRecord) => Promise<unknown | null>;
  updateSchema: z.ZodTypeAny;
};

class OpenClawApiError extends Error {
  constructor(
    public code: string,
    public status: number,
    message: string,
    public issues?: unknown
  ) {
    super(message);
  }
}

const idempotencyCache = new Map<string, CachedResponse>();

const configuredApiKey = process.env.OPENCLAW_API_KEY ?? "";
const isApiKeyConfigured =
  configuredApiKey.length > 0 &&
  !configuredApiKey.includes("your-secret-api-key-change-in-production");

const nonEmptyString = z.string().trim().min(1);
const stringArray = z.array(z.string()).default([]);
const optionalStringRecord = z.record(z.string(), z.string()).optional();
const publicContentBlockTypeSchema = z.enum([
  "section",
  "hero",
  "metric",
  "card",
  "link",
  "question",
  "list",
  "cta",
]);
const blogStatusSchema = z.enum(["draft", "published"]);
const certificationCategorySchema = z.enum([
  "technical",
  "programming",
  "cloud",
  "security",
  "project-management",
  "cybersecurity",
  "design",
  "other",
]);
const certificationStatusSchema = z.enum([
  "active",
  "completed",
  "in-progress",
  "planned",
  "expired",
  "revoked",
]);
const employmentTypeSchema = z.enum([
  "full-time",
  "part-time",
  "contract",
  "freelance",
  "internship",
  "voluntary",
]);
const projectStatusSchema = z.enum([
  "completed",
  "in-progress",
  "archived",
  "concept",
  "cancelled",
]);
const projectTypeSchema = z.enum([
  "professional",
  "personal",
  "open-source",
  "academic",
]);
const skillCategorySchema = z.enum([
  "technical",
  "soft",
  "language",
  "tool",
  "framework",
  "database",
  "cloud",
  "cybersecurity",
]);
const proficiencyLevelSchema = z.enum([
  "beginner",
  "intermediate",
  "advanced",
  "expert",
]);
const degreeTypeSchema = z.enum([
  "bachelor",
  "master",
  "phd",
  "diploma",
  "certificate",
  "bootcamp",
]);
const educationStatusSchema = z.enum([
  "completed",
  "in-progress",
  "transferred",
  "dropped",
]);
const serviceCategorySchema = z.enum([
  "development",
  "consulting",
  "design",
  "training",
  "maintenance",
]);
const serviceTypeSchema = z.enum([
  "hourly",
  "project",
  "retainer",
  "subscription",
]);
const pricingTypeSchema = z.enum(["fixed", "hourly", "range", "monthly"]);
const resumePdfSectionSchema = z.enum([
  "summary",
  "skills",
  "experience",
  "projects",
  "education",
  "certifications",
  "additionalExperience",
]);

const validDate = z.date().refine((date) => !Number.isNaN(date.getTime()), {
  message: "Invalid date.",
});

const requiredDateInput = z.preprocess((value) => {
  if (typeof value === "string" || value instanceof Date) {
    return new Date(value);
  }

  return value;
}, validDate);

const optionalDateInput = z.preprocess((value) => {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  if (typeof value === "string" || value instanceof Date) {
    return new Date(value);
  }

  return value;
}, validDate.nullable().optional());

const confirmationSchema = z
  .object({
    confirmed: z.literal(true),
    reason: nonEmptyString,
  })
  .passthrough();

const deleteConfirmationSchema = z
  .object({
    confirm: z.literal(true),
    deleteMode: z.literal("hard"),
    reason: nonEmptyString,
    requestedBy: z.literal("omri"),
  })
  .passthrough();

const reorderSchema = z.object({
  items: z
    .array(
      z.object({
        id: nonEmptyString,
        displayOrder: z.number().int().min(0),
      })
    )
    .min(1),
});

const bulkUpdateSchema = z.object({
  ids: z.array(nonEmptyString).min(1),
  data: z.record(z.string(), z.unknown()),
  confirmation: confirmationSchema.optional(),
  publishConfirmation: confirmationSchema.optional(),
  visibilityConfirmation: confirmationSchema.optional(),
});

const blogCreateSchema = z
  .object({
    title: nonEmptyString.max(200),
    slug: z
      .string()
      .trim()
      .min(1)
      .max(220)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .optional(),
    content: nonEmptyString,
    excerpt: z.string().max(500).nullable().optional(),
    status: blogStatusSchema.default("draft"),
    tags: stringArray,
    imageUrl: z.string().nullable().optional(),
    imageAlt: z.string().max(200).nullable().optional(),
    confirmation: confirmationSchema.optional(),
    publishConfirmation: confirmationSchema.optional(),
  })
  .passthrough();

const blogUpdateSchema = blogCreateSchema.partial().passthrough();

const publicBlockCreateSchema = z
  .object({
    id: nonEmptyString.max(160),
    page: nonEmptyString.max(100),
    locale: z.string().min(2).max(12).default("en"),
    sectionKey: nonEmptyString.max(100),
    blockKey: nonEmptyString.max(100),
    blockType: publicContentBlockTypeSchema,
    title: z.string().nullable().optional(),
    subtitle: z.string().nullable().optional(),
    body: z.string().nullable().optional(),
    href: z.string().nullable().optional(),
    ctaLabel: z.string().nullable().optional(),
    items: z.array(z.unknown()).default([]),
    metadata: z.record(z.string(), z.unknown()).default({}),
    displayOrder: z.number().int().min(0).default(0),
    isVisible: z.boolean().default(false),
    isFeatured: z.boolean().default(false),
    confirmation: confirmationSchema.optional(),
    visibilityConfirmation: confirmationSchema.optional(),
  })
  .passthrough();

const publicBlockUpdateSchema = publicBlockCreateSchema
  .omit({ id: true })
  .partial()
  .passthrough();
const publicBlockReplaceSchema = publicBlockCreateSchema
  .omit({ id: true })
  .passthrough();

const projectCreateSchema = z
  .object({
    title: nonEmptyString,
    subtitle: nonEmptyString,
    description: nonEmptyString,
    longDescription: z.string().nullable().optional(),
    technologies: stringArray,
    categories: stringArray,
    status: projectStatusSchema.default("completed"),
    projectType: projectTypeSchema,
    startDate: requiredDateInput,
    endDate: optionalDateInput,
    githubUrl: z.string().nullable().optional(),
    liveUrl: z.string().nullable().optional(),
    demoUrl: z.string().nullable().optional(),
    documentationUrl: z.string().nullable().optional(),
    images: stringArray,
    keyFeatures: stringArray,
    technicalChallenges: z
      .array(
        z.union([
          z.string(),
          z.object({ challenge: z.string(), solution: z.string() }),
        ])
      )
      .default([]),
    codeExamples: z
      .array(
        z.union([
          z.string(),
          z.object({
            title: z.string(),
            language: z.string(),
            code: z.string(),
            explanation: z.string(),
          }),
        ])
      )
      .default([]),
    teamSize: z.number().int().min(1).nullable().optional(),
    myRole: z.string().nullable().optional(),
    clientName: z.string().nullable().optional(),
    budget: z.string().nullable().optional(),
    displayOrder: z.number().int().min(0).default(0),
    isVisible: z.boolean().default(false),
    isFeatured: z.boolean().default(false),
    isOpenSource: z.boolean().default(false),
    isResumeFeatured: z.boolean().default(false),
    caseStudySlug: z.string().nullable().optional(),
    hiringSignal: z.string().nullable().optional(),
    constraints: stringArray,
    decisions: stringArray,
    outcome: z.string().nullable().optional(),
    caseStudyRole: z.string().nullable().optional(),
    proofLinks: z
      .array(
        z.object({
          label: nonEmptyString,
          href: nonEmptyString,
          description: z.string().optional(),
        })
      )
      .default([]),
    privateRepoNote: z.string().nullable().optional(),
    problem: z.unknown().nullable().optional(),
    solution: z.unknown().nullable().optional(),
    architecture: z.unknown().nullable().optional(),
    titleTranslations: optionalStringRecord,
    descriptionTranslations: optionalStringRecord,
    confirmation: confirmationSchema.optional(),
    visibilityConfirmation: confirmationSchema.optional(),
  })
  .passthrough();

const projectUpdateSchema = projectCreateSchema.partial().passthrough();

const skillCreateSchema = z
  .object({
    name: nonEmptyString,
    category: skillCategorySchema,
    subCategory: z.string().nullable().optional(),
    proficiencyLevel: z.number().int().min(0).max(100),
    proficiencyLabel: proficiencyLevelSchema,
    yearsOfExperience: z.number().int().min(0),
    description: z.string().nullable().optional(),
    icon: z.string().nullable().optional(),
    color: z.string().nullable().optional(),
    relatedSkills: stringArray,
    certifications: stringArray,
    projects: stringArray,
    lastUsed: optionalDateInput,
    isVisible: z.boolean().default(false),
    isResumeFeatured: z.boolean().default(false),
    displayOrder: z.number().int().min(0).default(0),
    nameTranslations: optionalStringRecord,
    descriptionTranslations: optionalStringRecord,
    confirmation: confirmationSchema.optional(),
    visibilityConfirmation: confirmationSchema.optional(),
  })
  .passthrough();

const skillUpdateSchema = skillCreateSchema.partial().passthrough();

const workExperienceCreateSchema = z
  .object({
    role: nonEmptyString,
    company: nonEmptyString,
    location: nonEmptyString,
    startDate: requiredDateInput,
    endDate: optionalDateInput,
    description: nonEmptyString,
    achievements: stringArray,
    technologies: stringArray,
    responsibilities: stringArray,
    employmentType: employmentTypeSchema,
    industry: nonEmptyString,
    companyUrl: z.string().nullable().optional(),
    logo: z.string().nullable().optional(),
    displayOrder: z.number().int().min(0).default(0),
    isVisible: z.boolean().default(false),
    isFeatured: z.boolean().default(false),
    isResumeFeatured: z.boolean().default(false),
    roleTranslations: optionalStringRecord,
    companyTranslations: optionalStringRecord,
    descriptionTranslations: optionalStringRecord,
    confirmation: confirmationSchema.optional(),
    visibilityConfirmation: confirmationSchema.optional(),
  })
  .passthrough();

const workExperienceUpdateSchema = workExperienceCreateSchema
  .partial()
  .passthrough();

const educationCreateSchema = z
  .object({
    institution: nonEmptyString,
    degree: nonEmptyString,
    degreeType: degreeTypeSchema,
    fieldOfStudy: nonEmptyString,
    startDate: requiredDateInput,
    endDate: optionalDateInput,
    status: educationStatusSchema.default("completed"),
    gpa: z.string().nullable().optional(),
    achievements: stringArray,
    coursework: stringArray,
    projects: stringArray,
    extracurriculars: stringArray,
    location: nonEmptyString,
    institutionUrl: z.string().nullable().optional(),
    certificateUrl: z.string().nullable().optional(),
    transcript: z.string().nullable().optional(),
    isVisible: z.boolean().default(false),
    isResumeFeatured: z.boolean().default(false),
    displayOrder: z.number().int().min(0).default(0),
    institutionTranslations: optionalStringRecord,
    degreeTranslations: optionalStringRecord,
    fieldOfStudyTranslations: optionalStringRecord,
    confirmation: confirmationSchema.optional(),
    visibilityConfirmation: confirmationSchema.optional(),
  })
  .passthrough();

const educationUpdateSchema = educationCreateSchema.partial().passthrough();

const certificationCreateSchema = z
  .object({
    name: nonEmptyString,
    issuer: nonEmptyString,
    description: nonEmptyString,
    category: certificationCategorySchema,
    status: certificationStatusSchema.default("active"),
    skills: stringArray,
    issueDate: requiredDateInput,
    expiryDate: optionalDateInput,
    credentialId: z.string().nullable().optional(),
    verificationUrl: z.string().nullable().optional(),
    icon: z.string().nullable().optional(),
    color: z.string().nullable().optional(),
    displayOrder: z.number().int().min(0).default(0),
    isVisible: z.boolean().default(false),
    isResumeFeatured: z.boolean().default(false),
    nameTranslations: optionalStringRecord,
    descriptionTranslations: optionalStringRecord,
    issuerTranslations: optionalStringRecord,
    confirmation: confirmationSchema.optional(),
    visibilityConfirmation: confirmationSchema.optional(),
  })
  .passthrough();

const certificationUpdateSchema = certificationCreateSchema
  .partial()
  .passthrough();

const serviceCreateSchema = z
  .object({
    name: nonEmptyString,
    category: serviceCategorySchema,
    serviceType: serviceTypeSchema,
    description: nonEmptyString,
    longDescription: z.string().nullable().optional(),
    features: stringArray,
    technologies: stringArray,
    duration: z.string().nullable().optional(),
    complexity: z.string().nullable().optional(),
    pricingType: pricingTypeSchema,
    basePrice: z.string().nullable().optional(),
    priceRange: z.string().nullable().optional(),
    deliverables: stringArray,
    requirements: stringArray,
    portfolioExamples: stringArray,
    isActive: z.boolean().default(false),
    isPopular: z.boolean().default(false),
    displayOrder: z.number().int().min(0).default(0),
    nameTranslations: optionalStringRecord,
    descriptionTranslations: optionalStringRecord,
    confirmation: confirmationSchema.optional(),
    visibilityConfirmation: confirmationSchema.optional(),
  })
  .passthrough();

const serviceUpdateSchema = serviceCreateSchema.partial().passthrough();

const testimonialCreateSchema = z
  .object({
    quote: nonEmptyString,
    author: nonEmptyString,
    role: nonEmptyString,
    company: nonEmptyString,
    authorImage: z.string().nullable().optional(),
    authorLinkedIn: z.string().nullable().optional(),
    companyUrl: z.string().nullable().optional(),
    companyLogo: z.string().nullable().optional(),
    rating: z.number().int().min(1).max(5).nullable().optional(),
    isVerified: z.boolean().default(false),
    verificationDate: optionalDateInput,
    displayOrder: z.number().int().min(0).default(0),
    isVisible: z.boolean().default(false),
    isFeatured: z.boolean().default(false),
    quoteTranslations: optionalStringRecord,
    authorTranslations: optionalStringRecord,
    roleTranslations: optionalStringRecord,
    companyTranslations: optionalStringRecord,
    confirmation: confirmationSchema.optional(),
    visibilityConfirmation: confirmationSchema.optional(),
  })
  .passthrough();

const testimonialUpdateSchema = testimonialCreateSchema.partial().passthrough();

function createRequestId() {
  return `req_${crypto.randomUUID()}`;
}

function successResponse(
  state: RequestState,
  resource: string,
  action: string,
  data: unknown,
  init?: {
    meta?: JsonRecord;
    status?: number;
  }
) {
  return NextResponse.json(
    {
      success: true,
      resource,
      action,
      data,
      meta: {
        requestId: state.requestId,
        version: API_VERSION,
        ...(init?.meta ?? {}),
      },
    },
    { status: init?.status ?? 200 }
  );
}

function listResponse(
  state: RequestState,
  resource: string,
  data: unknown[],
  pagination: ReturnType<typeof getPagination>
) {
  return successResponse(state, resource, "list", data, {
    meta: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      hasMore: pagination.page * pagination.limit < pagination.total,
    },
  });
}

function errorResponse(
  requestId: string,
  code: string,
  message: string,
  status: number,
  issues?: unknown
) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        ...(issues ? { issues } : {}),
      },
      meta: {
        requestId,
        version: API_VERSION,
      },
    },
    { status }
  );
}

function getApiKey(request: NextRequest) {
  return (
    request.headers.get("x-api-key") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    null
  );
}

async function authenticate(request: NextRequest, requestId: string) {
  if (!isApiKeyConfigured) {
    return errorResponse(
      requestId,
      "AUTH_NOT_CONFIGURED",
      "OPENCLAW_API_KEY is not configured.",
      503
    );
  }

  const apiKey = getApiKey(request);
  if (!apiKey) {
    return errorResponse(
      requestId,
      "AUTH_MISSING",
      "Missing OpenClaw API key.",
      401
    );
  }

  if (apiKey !== configuredApiKey) {
    return errorResponse(
      requestId,
      "AUTH_INVALID",
      "Invalid OpenClaw API key.",
      401
    );
  }

  return null;
}

function enforceRateLimit(request: NextRequest) {
  checkRateLimit(
    apiGeneralRateLimiter,
    getRateLimitIdentifier(request, "openclaw")
  );
}

async function getPath(context: RouteContext) {
  const params = await context.params;
  return params.resource ?? [];
}

function createState(request: NextRequest, path: string[]): RequestState {
  const url = new URL(request.url);
  return {
    actor: request.headers.get("x-openclaw-actor") ?? "openclaw",
    idempotencyKey: request.headers.get("x-idempotency-key"),
    method: request.method,
    path,
    reason: request.headers.get("x-openclaw-reason"),
    request,
    requestId: createRequestId(),
    searchParams: url.searchParams,
  };
}

function getIdempotencyCacheKey(state: RequestState) {
  if (state.method === "GET" || !state.idempotencyKey) {
    return null;
  }

  return `${state.method}:${state.path.join("/")}:${state.idempotencyKey}`;
}

function pruneIdempotencyCache() {
  const now = Date.now();
  for (const [key, cached] of idempotencyCache.entries()) {
    if (cached.expiresAt <= now) {
      idempotencyCache.delete(key);
    }
  }
}

async function maybeCacheResponse(
  cacheKey: string | null,
  response: NextResponse
) {
  if (!cacheKey || response.status >= 500) {
    return;
  }

  try {
    const payload = await response.clone().json();
    idempotencyCache.set(cacheKey, {
      expiresAt: Date.now() + IDEMPOTENCY_TTL_MS,
      payload,
      status: response.status,
    });
  } catch {
    // Idempotency is best-effort for JSON responses only.
  }
}

async function readJsonBody(request: NextRequest) {
  const text = await request.text();
  if (!text.trim()) {
    return {};
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new OpenClawApiError(
      "VALIDATION_ERROR",
      400,
      "Request body must be valid JSON."
    );
  }
}

function parseBody<T>(schema: z.ZodType<T>, value: unknown): T {
  const parsed = schema.safeParse(value);
  if (!parsed.success) {
    throw new OpenClawApiError(
      "VALIDATION_ERROR",
      400,
      "Invalid request body.",
      parsed.error.flatten()
    );
  }

  return parsed.data;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function getAdminAuthor() {
  const db = await getDB();
  const [adminUser] = await db
    .select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
    })
    .from(users)
    .where(eq(users.role, "admin"))
    .limit(1);

  if (!adminUser) {
    throw new OpenClawApiError(
      "DATABASE_UNAVAILABLE",
      503,
      "No admin user found. Run the seed flow before using OpenClaw writes."
    );
  }

  const displayName = [adminUser.firstName, adminUser.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    id: adminUser.id,
    name: displayName || adminUser.email,
  };
}

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function stripControlFields(data: JsonRecord): JsonRecord {
  const rest = { ...data };
  delete rest.confirmation;
  delete rest.publishConfirmation;
  delete rest.visibilityConfirmation;

  return withoutUndefined(rest);
}

function withoutUndefined(data: JsonRecord): JsonRecord {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined)
  );
}

function serializeStructuredProjectFields(data: JsonRecord): JsonRecord {
  const serialized = { ...data };
  for (const key of ["problem", "solution", "architecture"]) {
    const value = serialized[key];
    if (value && typeof value === "object") {
      serialized[key] = JSON.stringify(value);
    }
  }

  return serialized;
}

function hasConfirmedIntent(data: JsonRecord) {
  const candidates = [
    data.confirmation,
    data.publishConfirmation,
    data.visibilityConfirmation,
  ];

  return candidates.some(
    (candidate) => confirmationSchema.safeParse(candidate).success
  );
}

function assertIntentConfirmed(
  data: JsonRecord,
  checks: IntentCheck[] | undefined,
  message = "This operation requires explicit confirmation."
) {
  const triggered = checks?.filter((check) => check.needsConfirmation(data));
  if (!triggered?.length) {
    return;
  }

  if (!hasConfirmedIntent(data)) {
    throw new OpenClawApiError("FORBIDDEN", 403, message, {
      requiredConfirmationFor: triggered.map((check) => check.description),
    });
  }
}

function assertDeleteConfirmed(state: RequestState, body: unknown) {
  const header = state.request.headers.get("x-openclaw-confirm-delete");
  if (header?.toLowerCase() !== "true") {
    throw new OpenClawApiError(
      "DELETE_CONFIRMATION_REQUIRED",
      400,
      "Hard deletes require X-OpenClaw-Confirm-Delete: true."
    );
  }

  parseBody(deleteConfirmationSchema, body);
}

function getPaginationParams(searchParams: URLSearchParams) {
  const page = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);
  const requestedLimit = Number(searchParams.get("limit") ?? 25) || 25;
  const limit = Math.min(100, Math.max(1, requestedLimit));

  return { page, limit };
}

function getPagination<T>(items: T[], searchParams?: URLSearchParams) {
  const params = searchParams ?? new URLSearchParams();
  const { page, limit } = getPaginationParams(params);
  const total = items.length;
  const start = (page - 1) * limit;

  return {
    items: items.slice(start, start + limit),
    limit,
    page,
    total,
  };
}

function booleanParam(searchParams: URLSearchParams, key: string) {
  const value = searchParams.get(key);
  if (value === null) return null;
  return value === "true" || value === "1";
}

function includeHidden(searchParams: URLSearchParams) {
  return booleanParam(searchParams, "includeHidden") === true;
}

function compareFilterValue(
  actual: unknown,
  expected: string,
  type: ResourceFilter["type"] = "string"
) {
  if (type === "boolean") {
    return actual === (expected === "true" || expected === "1");
  }

  if (type === "number") {
    return Number(actual) === Number(expected);
  }

  return String(actual).toLowerCase() === expected.toLowerCase();
}

function applyListControls(
  rows: unknown[],
  state: RequestState,
  config?: {
    filters?: ResourceFilter[];
    searchFields?: string[];
  }
) {
  let filtered = [...rows];
  const search = state.searchParams.get("search")?.toLowerCase().trim();

  if (search) {
    filtered = filtered.filter((item) => {
      const record = isRecord(item) ? item : {};
      const values = config?.searchFields?.length
        ? config.searchFields.map((field) => record[field])
        : [item];

      return values.some((value) =>
        JSON.stringify(value ?? "")
          .toLowerCase()
          .includes(search)
      );
    });
  }

  for (const filter of config?.filters ?? []) {
    const expected = state.searchParams.get(filter.param);
    if (expected === null) continue;
    filtered = filtered.filter((item) => {
      const record = isRecord(item) ? item : {};
      return compareFilterValue(record[filter.field], expected, filter.type);
    });
  }

  const sort = state.searchParams.get("sort");
  if (sort) {
    const order = state.searchParams.get("order") === "desc" ? -1 : 1;
    filtered.sort((left, right) => {
      const leftValue = isRecord(left) ? left[sort] : undefined;
      const rightValue = isRecord(right) ? right[sort] : undefined;
      return String(leftValue ?? "").localeCompare(String(rightValue ?? "")) * order;
    });
  }

  return filtered;
}

function countBy<T extends JsonRecord>(rows: T[], key: keyof T) {
  return rows.reduce<Record<string, number>>((acc, row) => {
    const value = row[key];
    if (value === null || value === undefined) return acc;
    const label = String(value);
    acc[label] = (acc[label] ?? 0) + 1;
    return acc;
  }, {});
}

function latestDate<T extends JsonRecord>(rows: T[], key: keyof T) {
  const timestamps = rows
    .map((row) => row[key])
    .map((value) => (value instanceof Date ? value.getTime() : Date.parse(String(value))))
    .filter((value) => !Number.isNaN(value));

  if (timestamps.length === 0) {
    return null;
  }

  return new Date(Math.max(...timestamps)).toISOString();
}

function activeSummary<T extends { isActive: boolean; updatedAt?: Date | null }>(
  rows: T[]
) {
  return {
    total: rows.length,
    active: rows.filter((row) => row.isActive).length,
    inactive: rows.filter((row) => !row.isActive).length,
    newestUpdatedAt: latestDate(rows as unknown as JsonRecord[], "updatedAt"),
  };
}

async function auditMutation(
  state: RequestState,
  action: AuditAction,
  resource: AuditResource,
  resourceId: string | null,
  details?: JsonRecord
) {
  await emitAudit({
    action,
    resource,
    resourceId,
    details: {
      actor: state.actor,
      idempotencyKey: state.idempotencyKey,
      reason: state.reason,
      requestId: state.requestId,
      route: `/api/openclaw/${API_VERSION}/${state.path.join("/")}`,
      ...(details ?? {}),
    },
    ipAddress: getIpAddress(state.request),
    success: true,
    userAgent: getUserAgent(state.request),
    userRole: "openclaw",
  });
}

async function handleRoot(state: RequestState) {
  return successResponse(state, "openclaw.v1", "discover", {
    auth: {
      acceptedHeaders: ["x-api-key", "Authorization: Bearer ..."],
      env: "OPENCLAW_API_KEY",
    },
    resources: [
      "blog.posts",
      "public_content.blocks",
      "projects",
      "skills",
      "work_experiences",
      "education",
      "certifications",
      "services",
      "testimonials",
      "resume_pdf",
      "private.summaries",
      "health",
    ],
  });
}

async function handleBlogPosts(
  state: RequestState,
  method: string,
  tail: string[]
) {
  if (method === "GET" && tail[0] === "by-slug" && tail[1]) {
    try {
      const post = await getPostBySlug(tail[1]);
      return successResponse(state, "blog.posts", "read", post);
    } catch (error) {
      if (error instanceof Error && error.message === "Post not found.") {
        throw new OpenClawApiError("NOT_FOUND", 404, "Blog post not found.");
      }
      throw error;
    }
  }

  if (method === "GET" && tail[0]) {
    try {
      const post = await getPostById(tail[0]);
      return successResponse(state, "blog.posts", "read", post);
    } catch (error) {
      if (error instanceof Error && error.message === "Post not found.") {
        throw new OpenClawApiError("NOT_FOUND", 404, "Blog post not found.");
      }
      throw error;
    }
  }

  if (method === "GET") {
    const status =
      state.searchParams.get("status") ??
      (includeHidden(state.searchParams) ? undefined : "published");
    const posts = await getAllPosts(
      status && blogStatusSchema.safeParse(status).success
        ? blogStatusSchema.parse(status)
        : undefined
    );
    const filtered = applyListControls(posts, state, {
      searchFields: ["title", "slug", "excerpt", "content", "tags"],
      filters: [{ param: "status", field: "status" }],
    });
    const pagination = getPagination(filtered, state.searchParams);
    return listResponse(state, "blog.posts", pagination.items, pagination);
  }

  if (method === "POST") {
    const body = parseBody(blogCreateSchema, await readJsonBody(state.request));
    if (body.status === "published") {
      assertIntentConfirmed(
        body,
        [
          {
            description: "publish blog post",
            needsConfirmation: () => true,
          },
        ],
        "Publishing a blog post requires explicit confirmation."
      );
    }

    const slug = body.slug ?? slugify(body.title);
    if (!slug) {
      throw new OpenClawApiError(
        "VALIDATION_ERROR",
        400,
        "Unable to generate a slug from the title."
      );
    }

    const author = await getAdminAuthor();
    const post = await createPost({
      title: body.title,
      slug,
      content: body.content,
      excerpt: body.excerpt ?? undefined,
      status: body.status,
      tags: body.tags,
      imageUrl: body.imageUrl ?? undefined,
      imageAlt: body.imageAlt ?? undefined,
      author: author.name,
      authorId: author.id,
    });

    await auditMutation(state, "create", "blog", post.id, { status: post.status });
    return successResponse(state, "blog.posts", "created", post, { status: 201 });
  }

  if ((method === "PATCH" || method === "PUT") && tail[0]) {
    const schema = method === "PUT" ? blogCreateSchema : blogUpdateSchema;
    const body = parseBody(schema, await readJsonBody(state.request));
    if (body.status === "published") {
      assertIntentConfirmed(
        body,
        [
          {
            description: "publish blog post",
            needsConfirmation: () => true,
          },
        ],
        "Publishing a blog post requires explicit confirmation."
      );
    }

    const data = stripControlFields(body) as {
      content?: string;
      excerpt?: string | null;
      imageAlt?: string | null;
      imageUrl?: string | null;
      slug?: string;
      status?: "draft" | "published";
      tags?: string[];
      title?: string;
    };
    const post = await updatePost({
      id: tail[0],
      title: data.title,
      slug: data.slug,
      content: data.content,
      excerpt: data.excerpt ?? undefined,
      status: data.status,
      tags: data.tags,
      imageUrl: data.imageUrl ?? undefined,
      imageAlt: data.imageAlt ?? undefined,
    });

    await auditMutation(state, "update", "blog", post.id, { status: post.status });
    return successResponse(state, "blog.posts", "updated", post);
  }

  if (method === "DELETE" && tail[0]) {
    const body = await readJsonBody(state.request);
    assertDeleteConfirmed(state, body);
    const post = await deletePost(tail[0]);
    await auditMutation(state, "delete", "blog", post.id, {
      reason: isRecord(body) ? body.reason : undefined,
    });
    return successResponse(state, "blog.posts", "deleted", { id: post.id });
  }

  throw new OpenClawApiError(
    "UNSUPPORTED_OPERATION",
    405,
    "Unsupported blog posts operation."
  );
}

async function handlePublicContentBlocks(
  state: RequestState,
  method: string,
  tail: string[]
) {
  if (method === "GET" && tail[0]) {
    const block = await PublicContentBlockManager.getById(tail[0]);
    if (!block) {
      throw new OpenClawApiError(
        "NOT_FOUND",
        404,
        "Public content block not found."
      );
    }

    return successResponse(state, "public_content.blocks", "read", block);
  }

  if (method === "GET") {
    const page = state.searchParams.get("page");
    const locale = state.searchParams.get("locale") ?? "en";
    const sectionKey = state.searchParams.get("sectionKey");
    const visibleOnly = !includeHidden(state.searchParams);
    const blocks = page
      ? sectionKey
        ? await PublicContentBlockManager.getBySection({
            page,
            locale,
            sectionKey,
            visibleOnly,
          })
        : await PublicContentBlockManager.getByPage({
            page,
            locale,
            visibleOnly,
          })
      : (await PublicContentBlockManager.getAllAdmin()).filter(
          (block) => !visibleOnly || block.isVisible
        );
    const filtered = applyListControls(blocks, state, {
      searchFields: ["id", "page", "sectionKey", "blockKey", "title", "body"],
      filters: [
        { param: "page", field: "page" },
        { param: "locale", field: "locale" },
        { param: "sectionKey", field: "sectionKey" },
        { param: "blockType", field: "blockType" },
        { param: "visible", field: "isVisible", type: "boolean" },
        { param: "featured", field: "isFeatured", type: "boolean" },
      ],
    });
    const pagination = getPagination(filtered, state.searchParams);
    return listResponse(
      state,
      "public_content.blocks",
      pagination.items,
      pagination
    );
  }

  if (method === "POST" && tail[0] === "reorder") {
    const body = parseBody(reorderSchema, await readJsonBody(state.request));
    await PublicContentBlockManager.updateDisplayOrder(body.items);
    await auditMutation(state, "update", "system", "public_content.blocks", {
      operation: "reorder",
      count: body.items.length,
    });
    return successResponse(state, "public_content.blocks", "reordered", {
      count: body.items.length,
    });
  }

  if (method === "POST") {
    const body = parseBody(
      publicBlockCreateSchema,
      await readJsonBody(state.request)
    );
    assertIntentConfirmed(body, [
      {
        description: "make public content block visible",
        needsConfirmation: (data) => data.isVisible === true,
      },
      {
        description: "feature public content block",
        needsConfirmation: (data) => data.isFeatured === true,
      },
    ]);
    const author = await getAdminAuthor();
    const block = await PublicContentBlockManager.create({
      ...(stripControlFields(body) as object),
      createdBy: author.id,
    } as Parameters<typeof PublicContentBlockManager.create>[0]);
    await auditMutation(state, "create", "system", block.id, {
      resource: "public_content.blocks",
    });
    return successResponse(state, "public_content.blocks", "created", block, {
      status: 201,
    });
  }

  if ((method === "PATCH" || method === "PUT") && tail[0]) {
    const schema =
      method === "PUT" ? publicBlockReplaceSchema : publicBlockUpdateSchema;
    const body = parseBody(schema, await readJsonBody(state.request));
    assertIntentConfirmed(body, [
      {
        description: "make public content block visible",
        needsConfirmation: (data) => data.isVisible === true,
      },
      {
        description: "feature public content block",
        needsConfirmation: (data) => data.isFeatured === true,
      },
    ]);
    const data = stripControlFields(body);
    delete data.id;
    const block = await PublicContentBlockManager.update(
      tail[0],
      data as Parameters<typeof PublicContentBlockManager.update>[1]
    );
    if (!block) {
      throw new OpenClawApiError(
        "NOT_FOUND",
        404,
        "Public content block not found."
      );
    }
    await auditMutation(state, "update", "system", block.id, {
      resource: "public_content.blocks",
    });
    return successResponse(state, "public_content.blocks", "updated", block);
  }

  if (method === "DELETE" && tail[0]) {
    const body = await readJsonBody(state.request);
    assertDeleteConfirmed(state, body);
    const deleted = await PublicContentBlockManager.delete(tail[0]);
    if (!deleted) {
      throw new OpenClawApiError(
        "NOT_FOUND",
        404,
        "Public content block not found."
      );
    }
    await auditMutation(state, "delete", "system", tail[0], {
      resource: "public_content.blocks",
      reason: isRecord(body) ? body.reason : undefined,
    });
    return successResponse(state, "public_content.blocks", "deleted", {
      id: tail[0],
    });
  }

  throw new OpenClawApiError(
    "UNSUPPORTED_OPERATION",
    405,
    "Unsupported public content block operation."
  );
}

async function handleCrudResource(
  state: RequestState,
  method: string,
  tail: string[],
  config: CrudResourceConfig
) {
  if (method === "GET" && tail[0]) {
    const item = await config.get(tail[0]);
    if (!item) {
      throw new OpenClawApiError(
        "NOT_FOUND",
        404,
        `${config.resource} record not found.`
      );
    }
    return successResponse(state, config.resource, "read", item);
  }

  if (method === "GET") {
    const rows = await config.list(includeHidden(state.searchParams));
    const filtered = applyListControls(rows, state, {
      filters: config.filters,
      searchFields: config.searchFields,
    });
    const pagination = getPagination(filtered, state.searchParams);
    return listResponse(state, config.resource, pagination.items, pagination);
  }

  if (method === "POST" && tail[0] === "reorder" && config.reorder) {
    const body = parseBody(reorderSchema, await readJsonBody(state.request));
    await config.reorder(body.items);
    await auditMutation(state, "update", config.auditResource, "reorder", {
      count: body.items.length,
      operation: "reorder",
    });
    return successResponse(state, config.resource, "reordered", {
      count: body.items.length,
    });
  }

  if (method === "PATCH" && tail[0] === "bulk") {
    const body = parseBody(bulkUpdateSchema, await readJsonBody(state.request));
    const parsedData = parseBody(config.updateSchema, body.data) as JsonRecord;
    assertIntentConfirmed(
      {
        ...body,
        ...parsedData,
      },
      config.intentChecks
    );
    const data = stripControlFields(parsedData);
    const rows = config.bulkUpdate
      ? await config.bulkUpdate(body.ids, data)
      : (
          await Promise.all(body.ids.map((id) => config.update(id, data)))
        ).filter(Boolean);
    await auditMutation(state, "update", config.auditResource, "bulk", {
      count: rows.length,
      operation: "bulk-update",
    });
    return successResponse(state, config.resource, "bulk_updated", rows);
  }

  if (method === "DELETE" && tail[0] === "bulk") {
    const body = await readJsonBody(state.request);
    const parsed = parseBody(
      deleteConfirmationSchema.extend({
        ids: z.array(nonEmptyString).min(1),
      }),
      body
    );
    assertDeleteConfirmed(state, body);
    const result = config.bulkDelete
      ? await config.bulkDelete(parsed.ids)
      : {
          deletedCount: (
            await Promise.all(parsed.ids.map((id) => config.remove(id)))
          ).filter(Boolean).length,
        };
    await auditMutation(state, "delete", config.auditResource, "bulk", {
      deletedCount: result.deletedCount,
      operation: "bulk-delete",
      reason: parsed.reason,
    });
    return successResponse(state, config.resource, "bulk_deleted", result);
  }

  if (method === "POST" && tail.length === 0) {
    const body = parseBody(
      config.createSchema,
      await readJsonBody(state.request)
    ) as JsonRecord;
    assertIntentConfirmed(body, config.intentChecks);
    const author = await getAdminAuthor();
    const data = withoutUndefined({
      ...(config.defaults ?? {}),
      ...stripControlFields(body),
      createdBy: author.id,
    });
    const item = await config.create(data, author.id);
    const id = isRecord(item) && typeof item.id === "string" ? item.id : null;
    await auditMutation(state, "create", config.auditResource, id, {
      resource: config.resource,
    });
    return successResponse(state, config.resource, "created", item, {
      status: 201,
    });
  }

  if ((method === "PATCH" || method === "PUT") && tail[0]) {
    const schema = method === "PUT" ? config.createSchema : config.updateSchema;
    const body = parseBody(schema, await readJsonBody(state.request)) as JsonRecord;
    assertIntentConfirmed(body, config.intentChecks);
    const data = stripControlFields(body);
    const item = await config.update(tail[0], data);
    if (!item) {
      throw new OpenClawApiError(
        "NOT_FOUND",
        404,
        `${config.resource} record not found.`
      );
    }
    await auditMutation(state, "update", config.auditResource, tail[0], {
      resource: config.resource,
    });
    return successResponse(state, config.resource, "updated", item);
  }

  if (method === "DELETE" && tail[0]) {
    const body = await readJsonBody(state.request);
    assertDeleteConfirmed(state, body);
    const deleted = await config.remove(tail[0]);
    if (!deleted) {
      throw new OpenClawApiError(
        "NOT_FOUND",
        404,
        `${config.resource} record not found.`
      );
    }
    await auditMutation(state, "delete", config.auditResource, tail[0], {
      resource: config.resource,
      reason: isRecord(body) ? body.reason : undefined,
    });
    return successResponse(state, config.resource, "deleted", { id: tail[0] });
  }

  throw new OpenClawApiError(
    "UNSUPPORTED_OPERATION",
    405,
    `Unsupported ${config.resource} operation.`
  );
}

function visibilityIntentChecks(visibleField = "isVisible"): IntentCheck[] {
  return [
    {
      description: `set ${visibleField} to true`,
      needsConfirmation: (data) => data[visibleField] === true,
    },
    {
      description: "feature public content",
      needsConfirmation: (data) => data.isFeatured === true,
    },
    {
      description: "include public content in resume PDF",
      needsConfirmation: (data) => data.isResumeFeatured === true,
    },
  ];
}

function getCrudConfig(resource: string): CrudResourceConfig | null {
  switch (resource) {
    case "projects":
      return {
        auditResource: "project",
        bulkDelete: ProjectManager.bulkDelete.bind(ProjectManager),
        bulkUpdate: (ids, data) =>
          ProjectManager.bulkUpdate(ids, serializeStructuredProjectFields(data)),
        create: (data) =>
          ProjectManager.create(
            serializeStructuredProjectFields(data) as Parameters<
              typeof ProjectManager.create
            >[0]
          ),
        createSchema: projectCreateSchema,
        filters: [
          { param: "status", field: "status" },
          { param: "projectType", field: "projectType" },
          { param: "featured", field: "isFeatured", type: "boolean" },
          { param: "resumeFeatured", field: "isResumeFeatured", type: "boolean" },
          { param: "visible", field: "isVisible", type: "boolean" },
          { param: "openSource", field: "isOpenSource", type: "boolean" },
        ],
        get: ProjectManager.getById.bind(ProjectManager),
        intentChecks: visibilityIntentChecks(),
        list: (showHidden) => ProjectManager.getAll(!showHidden),
        remove: ProjectManager.delete.bind(ProjectManager),
        reorder: ProjectManager.updateDisplayOrder.bind(ProjectManager),
        resource: "projects",
        searchFields: [
          "title",
          "subtitle",
          "description",
          "technologies",
          "categories",
          "caseStudySlug",
          "hiringSignal",
        ],
        update: (id, data) =>
          ProjectManager.update(
            id,
            serializeStructuredProjectFields(data) as Parameters<
              typeof ProjectManager.update
            >[1]
          ),
        updateSchema: projectUpdateSchema,
      };

    case "skills":
      return {
        auditResource: "skill",
        bulkDelete: SkillManager.bulkDelete.bind(SkillManager),
        bulkUpdate: (ids, data) =>
          SkillManager.bulkUpdate(
            ids,
            data as Parameters<typeof SkillManager.bulkUpdate>[1]
          ),
        create: (data) =>
          SkillManager.create({
            ...data,
            lastUsed: data.lastUsed ?? new Date(),
          } as Parameters<typeof SkillManager.create>[0]),
        createSchema: skillCreateSchema,
        filters: [
          { param: "category", field: "category" },
          { param: "proficiencyLabel", field: "proficiencyLabel" },
          { param: "visible", field: "isVisible", type: "boolean" },
          { param: "resumeFeatured", field: "isResumeFeatured", type: "boolean" },
        ],
        get: SkillManager.getById.bind(SkillManager),
        intentChecks: visibilityIntentChecks(),
        list: (showHidden) => SkillManager.getAll(!showHidden),
        remove: SkillManager.delete.bind(SkillManager),
        reorder: SkillManager.updateDisplayOrder.bind(SkillManager),
        resource: "skills",
        searchFields: ["name", "category", "subCategory", "description"],
        update: (id, data) =>
          SkillManager.update(
            id,
            data as Parameters<typeof SkillManager.update>[1]
          ),
        updateSchema: skillUpdateSchema,
      };

    case "work-experiences":
      return {
        auditResource: "work_experience",
        bulkDelete: WorkExperienceManager.bulkDelete.bind(WorkExperienceManager),
        bulkUpdate: (ids, data) =>
          WorkExperienceManager.bulkUpdate(
            ids,
            data as Parameters<typeof WorkExperienceManager.bulkUpdate>[1]
          ),
        create: (data) =>
          WorkExperienceManager.create(
            data as Parameters<typeof WorkExperienceManager.create>[0]
          ),
        createSchema: workExperienceCreateSchema,
        filters: [
          { param: "employmentType", field: "employmentType" },
          { param: "industry", field: "industry" },
          { param: "featured", field: "isFeatured", type: "boolean" },
          { param: "resumeFeatured", field: "isResumeFeatured", type: "boolean" },
          { param: "visible", field: "isVisible", type: "boolean" },
        ],
        get: WorkExperienceManager.getById.bind(WorkExperienceManager),
        intentChecks: visibilityIntentChecks(),
        list: (showHidden) => WorkExperienceManager.getAll(!showHidden),
        remove: WorkExperienceManager.delete.bind(WorkExperienceManager),
        reorder: WorkExperienceManager.updateDisplayOrder.bind(
          WorkExperienceManager
        ),
        resource: "work_experiences",
        searchFields: ["role", "company", "location", "description", "industry"],
        update: (id, data) =>
          WorkExperienceManager.update(
            id,
            data as Parameters<typeof WorkExperienceManager.update>[1]
          ),
        updateSchema: workExperienceUpdateSchema,
      };

    case "education":
      return {
        auditResource: "education",
        bulkDelete: EducationManager.bulkDelete.bind(EducationManager),
        bulkUpdate: async (ids, data) =>
          Promise.all(
            ids.map((id) =>
              EducationManager.update(
                id,
                data as Parameters<typeof EducationManager.update>[1]
              )
            )
          ),
        create: (data) =>
          EducationManager.create(
            data as Parameters<typeof EducationManager.create>[0]
          ),
        createSchema: educationCreateSchema,
        filters: [
          { param: "degreeType", field: "degreeType" },
          { param: "status", field: "status" },
          { param: "resumeFeatured", field: "isResumeFeatured", type: "boolean" },
          { param: "visible", field: "isVisible", type: "boolean" },
        ],
        get: EducationManager.getById.bind(EducationManager),
        intentChecks: visibilityIntentChecks(),
        list: (showHidden) => EducationManager.getAll(!showHidden),
        remove: EducationManager.delete.bind(EducationManager),
        reorder: async (items) => {
          await EducationManager.bulkUpdateOrder(items);
        },
        resource: "education",
        searchFields: ["institution", "degree", "fieldOfStudy", "location"],
        update: async (id, data) => {
          try {
            return await EducationManager.update(
              id,
              data as Parameters<typeof EducationManager.update>[1]
            );
          } catch (error) {
            if (
              error instanceof Error &&
              error.message.includes("not found")
            ) {
              return null;
            }
            throw error;
          }
        },
        updateSchema: educationUpdateSchema,
      };

    case "certifications":
      return {
        auditResource: "certification",
        create: (data) =>
          CertificationsService.create(
            data as Parameters<typeof CertificationsService.create>[0]
          ),
        createSchema: certificationCreateSchema,
        filters: [
          { param: "category", field: "category" },
          { param: "status", field: "status" },
          { param: "resumeFeatured", field: "isResumeFeatured", type: "boolean" },
          { param: "visible", field: "isVisible", type: "boolean" },
        ],
        get: CertificationsService.getById.bind(CertificationsService),
        intentChecks: visibilityIntentChecks(),
        list: (showHidden) => CertificationsService.getAll(!showHidden),
        remove: CertificationsService.delete.bind(CertificationsService),
        reorder: CertificationsService.updateDisplayOrder.bind(
          CertificationsService
        ),
        resource: "certifications",
        searchFields: ["name", "issuer", "description", "category", "skills"],
        update: (id, data) =>
          CertificationsService.update(
            id,
            data as Parameters<typeof CertificationsService.update>[1]
          ),
        updateSchema: certificationUpdateSchema,
      };

    case "services":
      return {
        auditResource: "pricing",
        bulkDelete: ServiceManager.bulkDelete.bind(ServiceManager),
        bulkUpdate: (ids, data) =>
          ServiceManager.bulkUpdate(
            ids,
            data as Parameters<typeof ServiceManager.bulkUpdate>[1]
          ),
        create: (data) =>
          ServiceManager.create(
            data as Parameters<typeof ServiceManager.create>[0]
          ),
        createSchema: serviceCreateSchema,
        filters: [
          { param: "category", field: "category" },
          { param: "serviceType", field: "serviceType" },
          { param: "active", field: "isActive", type: "boolean" },
          { param: "popular", field: "isPopular", type: "boolean" },
        ],
        get: ServiceManager.getById.bind(ServiceManager),
        intentChecks: [
          {
            description: "make service active",
            needsConfirmation: (data) => data.isActive === true,
          },
          {
            description: "mark service popular",
            needsConfirmation: (data) => data.isPopular === true,
          },
        ],
        list: (showHidden) => ServiceManager.getAll(!showHidden),
        remove: ServiceManager.delete.bind(ServiceManager),
        reorder: ServiceManager.updateDisplayOrder.bind(ServiceManager),
        resource: "services",
        searchFields: ["name", "category", "description", "technologies"],
        update: (id, data) =>
          ServiceManager.update(
            id,
            data as Parameters<typeof ServiceManager.update>[1]
          ),
        updateSchema: serviceUpdateSchema,
      };

    case "testimonials":
      return {
        auditResource: "system",
        bulkDelete: TestimonialManager.bulkDelete.bind(TestimonialManager),
        bulkUpdate: (ids, data) =>
          TestimonialManager.bulkUpdate(
            ids,
            data as Parameters<typeof TestimonialManager.bulkUpdate>[1]
          ),
        create: (data) =>
          TestimonialManager.create(
            data as Parameters<typeof TestimonialManager.create>[0]
          ),
        createSchema: testimonialCreateSchema,
        filters: [
          { param: "featured", field: "isFeatured", type: "boolean" },
          { param: "verified", field: "isVerified", type: "boolean" },
          { param: "visible", field: "isVisible", type: "boolean" },
        ],
        get: TestimonialManager.getById.bind(TestimonialManager),
        intentChecks: [
          ...visibilityIntentChecks(),
          {
            description: "mark testimonial verified",
            needsConfirmation: (data) => data.isVerified === true,
          },
        ],
        list: (showHidden) => TestimonialManager.getAll(!showHidden),
        remove: TestimonialManager.delete.bind(TestimonialManager),
        reorder: TestimonialManager.updateDisplayOrder.bind(TestimonialManager),
        resource: "testimonials",
        searchFields: ["quote", "author", "role", "company"],
        update: (id, data) =>
          TestimonialManager.update(
            id,
            data as Parameters<typeof TestimonialManager.update>[1]
          ),
        updateSchema: testimonialUpdateSchema,
      };

    default:
      return null;
  }
}

async function handleProjectSpecial(
  state: RequestState,
  method: string,
  tail: string[]
) {
  if (method === "GET" && tail[0] === "by-slug" && tail[1]) {
    const project = await ProjectManager.getBySlug(tail[1], false);
    if (!project) {
      throw new OpenClawApiError("NOT_FOUND", 404, "Project not found.");
    }
    return successResponse(state, "projects", "read", project);
  }

  return null;
}

async function handleSkillSpecial(
  state: RequestState,
  method: string,
  tail: string[]
) {
  if (method === "POST" && tail[0] && tail[1] === "mark-used") {
    const skill = await SkillManager.updateLastUsed(tail[0]);
    if (!skill) {
      throw new OpenClawApiError("NOT_FOUND", 404, "Skill not found.");
    }
    await auditMutation(state, "update", "skill", tail[0], {
      operation: "mark-used",
    });
    return successResponse(state, "skills", "marked_used", skill);
  }

  return null;
}

async function handleCertificationSpecial(
  state: RequestState,
  method: string,
  tail: string[]
) {
  if (method === "POST" && tail[0] === "mark-expired") {
    const body = parseBody(
      z.object({ ids: z.array(nonEmptyString).min(1) }),
      await readJsonBody(state.request)
    );
    await CertificationsService.markAsExpired(body.ids);
    await auditMutation(state, "update", "certification", "mark-expired", {
      count: body.ids.length,
      operation: "mark-expired",
    });
    return successResponse(state, "certifications", "marked_expired", {
      count: body.ids.length,
    });
  }

  return null;
}

async function handleTestimonialSpecial(
  state: RequestState,
  method: string,
  tail: string[]
) {
  if (method === "POST" && tail[0] && tail[1] === "verify") {
    const body = await readJsonBody(state.request);
    assertIntentConfirmed(isRecord(body) ? body : {}, [
      {
        description: "verify testimonial",
        needsConfirmation: () => true,
      },
    ]);
    const testimonial = await TestimonialManager.verify(tail[0]);
    if (!testimonial) {
      throw new OpenClawApiError("NOT_FOUND", 404, "Testimonial not found.");
    }
    await auditMutation(state, "update", "system", tail[0], {
      operation: "verify-testimonial",
    });
    return successResponse(state, "testimonials", "verified", testimonial);
  }

  return null;
}

function getBlockMetadata(block: { metadata: unknown }) {
  return block.metadata && typeof block.metadata === "object"
    ? (block.metadata as JsonRecord)
    : {};
}

function normalizePdfSectionOrder(value: unknown): ResumePdfSectionKey[] {
  const allowed = new Set<ResumePdfSectionKey>(DEFAULT_PDF_SECTION_ORDER);
  const seen = new Set<ResumePdfSectionKey>();
  const ordered: ResumePdfSectionKey[] = [];

  if (Array.isArray(value)) {
    for (const item of value) {
      if (typeof item !== "string") continue;
      const section = item as ResumePdfSectionKey;
      if (!allowed.has(section) || seen.has(section)) continue;
      ordered.push(section);
      seen.add(section);
    }
  }

  return [
    ...ordered,
    ...DEFAULT_PDF_SECTION_ORDER.filter((section) => !seen.has(section)),
  ];
}

async function getResumeProfileBlock() {
  const blocks = await PublicContentBlockManager.getBySection({
    page: "resume",
    sectionKey: "profile",
    locale: "en",
    visibleOnly: false,
  });

  return blocks.find((block) => block.blockKey === "profile") ?? null;
}

async function handleResumePdf(
  state: RequestState,
  method: string,
  tail: string[]
) {
  if (method === "GET" && tail[0] === "overview") {
    const [
      profileBlocks,
      allWorkExperiences,
      allProjects,
      allSkills,
      allEducation,
      allCertifications,
    ] = await Promise.all([
      PublicContentBlockManager.getBySection({
        page: "resume",
        sectionKey: "profile",
        locale: "en",
        visibleOnly: false,
      }),
      WorkExperienceManager.getAll(false),
      ProjectManager.getAll(false),
      SkillManager.getAll(false),
      EducationManager.getAll(false),
      CertificationsService.getAll(false),
    ]);
    const profile = profileBlocks.find((block) => block.blockKey === "profile");
    const metadata = profile ? getBlockMetadata(profile) : {};

    return successResponse(state, "resume_pdf", "overview", {
      profileBlocks,
      workExperiences: allWorkExperiences,
      projects: allProjects,
      skills: allSkills,
      education: allEducation,
      certifications: allCertifications,
      sectionOrder: normalizePdfSectionOrder(metadata.pdfSectionOrder),
      dateFormat: metadata.pdfDateFormat === "year" ? "year" : "month-year",
    });
  }

  if (method === "PATCH" && tail[0] === "items" && tail[1] && tail[2]) {
    const body = parseBody(
      z.object({
        isResumeFeatured: z.boolean().optional(),
        confirmation: confirmationSchema,
      }),
      await readJsonBody(state.request)
    );
    const desired = body.isResumeFeatured;
    const section = tail[1];
    const id = tail[2];
    let updated: unknown | null = null;

    switch (section) {
      case "work-experiences": {
        const current = await WorkExperienceManager.getById(id);
        if (!current) break;
        updated = await WorkExperienceManager.update(id, {
          isResumeFeatured: desired ?? !current.isResumeFeatured,
        });
        break;
      }
      case "projects": {
        const current = await ProjectManager.getById(id);
        if (!current) break;
        updated = await ProjectManager.update(id, {
          isResumeFeatured: desired ?? !current.isResumeFeatured,
        });
        break;
      }
      case "skills": {
        const current = await SkillManager.getById(id);
        if (!current) break;
        updated = await SkillManager.update(id, {
          isResumeFeatured: desired ?? !current.isResumeFeatured,
        });
        break;
      }
      case "education": {
        const current = await EducationManager.getById(id);
        if (!current) break;
        updated = await EducationManager.update(id, {
          isResumeFeatured: desired ?? !current.isResumeFeatured,
        });
        break;
      }
      case "certifications": {
        const current = await CertificationsService.getById(id);
        if (!current) break;
        updated = await CertificationsService.update(id, {
          isResumeFeatured: desired ?? !current.isResumeFeatured,
        });
        break;
      }
      default:
        throw new OpenClawApiError(
          "VALIDATION_ERROR",
          400,
          "Invalid resume PDF item section."
        );
    }

    if (!updated) {
      throw new OpenClawApiError(
        "NOT_FOUND",
        404,
        "Resume PDF item not found."
      );
    }

    await auditMutation(state, "update", "system", id, {
      operation: "resume-pdf-inclusion",
      section,
    });
    return successResponse(state, "resume_pdf", "item_updated", updated);
  }

  if (method === "PUT" && tail[0] === "section-order") {
    const body = parseBody(
      z.object({
        sectionOrder: z.array(resumePdfSectionSchema).min(1),
      }),
      await readJsonBody(state.request)
    );
    const profile = await getResumeProfileBlock();
    if (!profile) {
      throw new OpenClawApiError(
        "NOT_FOUND",
        404,
        "Resume profile block not found."
      );
    }

    const metadata = getBlockMetadata(profile);
    const sectionOrder = normalizePdfSectionOrder(body.sectionOrder);
    const updated = await PublicContentBlockManager.update(profile.id, {
      metadata: {
        ...metadata,
        pdfSectionOrder: sectionOrder,
      },
    });

    await auditMutation(state, "update", "system", profile.id, {
      operation: "resume-pdf-section-order",
    });
    return successResponse(state, "resume_pdf", "section_order_updated", {
      sectionOrder,
      profileBlock: updated,
    });
  }

  if (method === "PATCH" && tail[0] === "date-format") {
    const body = parseBody(
      z.object({
        dateFormat: z.enum(["month-year", "year"]).optional(),
      }),
      await readJsonBody(state.request)
    );
    const profile = await getResumeProfileBlock();
    if (!profile) {
      throw new OpenClawApiError(
        "NOT_FOUND",
        404,
        "Resume profile block not found."
      );
    }

    const metadata = getBlockMetadata(profile);
    const currentFormat =
      metadata.pdfDateFormat === "year" ? "year" : "month-year";
    const nextFormat =
      body.dateFormat ?? (currentFormat === "year" ? "month-year" : "year");
    const updated = await PublicContentBlockManager.update(profile.id, {
      metadata: {
        ...metadata,
        pdfDateFormat: nextFormat,
      },
    });

    await auditMutation(state, "update", "system", profile.id, {
      operation: "resume-pdf-date-format",
    });
    return successResponse(state, "resume_pdf", "date_format_updated", {
      dateFormat: nextFormat,
      profileBlock: updated,
    });
  }

  throw new OpenClawApiError(
    "UNSUPPORTED_OPERATION",
    405,
    "Unsupported resume PDF operation."
  );
}

async function getPrivateSummary(state: RequestState, tail: string[]) {
  if (tail.length !== 2 || tail[1] !== "summary") {
    throw new OpenClawApiError(
      "UNSUPPORTED_OPERATION",
      404,
      "Private OpenClaw v1 exposes summary endpoints only."
    );
  }

  const db = await getDB();
  const resource = tail[0];

  if (resource === "intakes") {
    const rows = await db
      .select({
        status: intakes.status,
        flagged: intakes.flagged,
        reminderDate: intakes.reminderDate,
        createdAt: intakes.createdAt,
      })
      .from(intakes);
    return successResponse(state, "private.intakes.summary", "read", {
      total: rows.length,
      byStatus: countBy(rows, "status"),
      flagged: rows.filter((row) => row.flagged).length,
      withReminder: rows.filter((row) => row.reminderDate).length,
      newestCreatedAt: latestDate(rows, "createdAt"),
    });
  }

  if (resource === "proposals") {
    const rows = await db
      .select({
        status: proposals.status,
        validUntil: proposals.validUntil,
        createdAt: proposals.createdAt,
      })
      .from(proposals);
    const now = Date.now();
    const expiringWindow = now + 14 * 24 * 60 * 60 * 1000;
    return successResponse(state, "private.proposals.summary", "read", {
      total: rows.length,
      byStatus: countBy(rows, "status"),
      expiringSoon: rows.filter((row) => {
        if (!row.validUntil) return false;
        const value = row.validUntil.getTime();
        return value >= now && value <= expiringWindow;
      }).length,
      newestCreatedAt: latestDate(rows, "createdAt"),
    });
  }

  if (resource === "contact-inquiries") {
    const rows = await db
      .select({
        status: contactInquiries.status,
        createdAt: contactInquiries.createdAt,
      })
      .from(contactInquiries);
    return successResponse(
      state,
      "private.contact_inquiries.summary",
      "read",
      {
        total: rows.length,
        byStatus: countBy(rows, "status"),
        open: rows.filter((row) => row.status === "open").length,
        newestCreatedAt: latestDate(rows, "createdAt"),
      }
    );
  }

  if (resource === "pricing") {
    const [
      settingsRows,
      projectTypeRows,
      baseRateRows,
      featureRows,
      groupRows,
      valueRows,
      metaRows,
    ] = await Promise.all([
      db
        .select({
          isActive: calculatorSettings.isActive,
          updatedAt: calculatorSettings.updatedAt,
        })
        .from(calculatorSettings),
      db
        .select({
          isActive: pricingProjectTypes.isActive,
          updatedAt: pricingProjectTypes.updatedAt,
        })
        .from(pricingProjectTypes),
      db
        .select({
          isActive: pricingBaseRates.isActive,
          updatedAt: pricingBaseRates.updatedAt,
        })
        .from(pricingBaseRates),
      db
        .select({
          isActive: pricingFeatures.isActive,
          updatedAt: pricingFeatures.updatedAt,
        })
        .from(pricingFeatures),
      db
        .select({
          isActive: pricingMultiplierGroups.isActive,
          updatedAt: pricingMultiplierGroups.updatedAt,
        })
        .from(pricingMultiplierGroups),
      db
        .select({
          isActive: pricingMultiplierValues.isActive,
          updatedAt: pricingMultiplierValues.updatedAt,
        })
        .from(pricingMultiplierValues),
      db
        .select({
          isActive: pricingMeta.isActive,
          updatedAt: pricingMeta.updatedAt,
        })
        .from(pricingMeta),
    ]);
    const allRows = [
      ...settingsRows,
      ...projectTypeRows,
      ...baseRateRows,
      ...featureRows,
      ...groupRows,
      ...valueRows,
      ...metaRows,
    ];
    return successResponse(state, "private.pricing.summary", "read", {
      settings: activeSummary(settingsRows),
      projectTypes: activeSummary(projectTypeRows),
      baseRates: activeSummary(baseRateRows),
      features: activeSummary(featureRows),
      multiplierGroups: activeSummary(groupRows),
      multiplierValues: activeSummary(valueRows),
      meta: activeSummary(metaRows),
      newestUpdatedAt: latestDate(allRows, "updatedAt"),
    });
  }

  if (resource === "discounts") {
    const rows = await db
      .select({
        isActive: pricingDiscounts.isActive,
        endsAt: pricingDiscounts.endsAt,
        usedCount: pricingDiscounts.usedCount,
        createdAt: pricingDiscounts.createdAt,
      })
      .from(pricingDiscounts);
    const now = Date.now();
    return successResponse(state, "private.discounts.summary", "read", {
      total: rows.length,
      active: rows.filter((row) => row.isActive).length,
      expired: rows.filter(
        (row) => row.endsAt && row.endsAt.getTime() < now
      ).length,
      totalUsedCount: rows.reduce((sum, row) => sum + row.usedCount, 0),
      newestCreatedAt: latestDate(rows, "createdAt"),
    });
  }

  if (resource === "email-templates") {
    const rows = await db
      .select({
        updatedAt: emailTemplates.updatedAt,
        createdAt: emailTemplates.createdAt,
      })
      .from(emailTemplates);
    return successResponse(state, "private.email_templates.summary", "read", {
      total: rows.length,
      newestUpdatedAt: latestDate(rows, "updatedAt"),
      newestCreatedAt: latestDate(rows, "createdAt"),
    });
  }

  if (resource === "users") {
    const rows = await db
      .select({
        role: users.role,
        status: users.status,
      })
      .from(users);
    return successResponse(state, "private.users.summary", "read", {
      total: rows.length,
      byRole: countBy(rows, "role"),
      byStatus: countBy(rows, "status"),
    });
  }

  if (resource === "roles") {
    const rows = await db
      .select({
        isActive: roles.isActive,
      })
      .from(roles);
    return successResponse(state, "private.roles.summary", "read", {
      total: rows.length,
      active: rows.filter((row) => row.isActive).length,
      inactive: rows.filter((row) => !row.isActive).length,
    });
  }

  if (resource === "dashboard") {
    const [sectionRows, projectCount, skillCount, blogCount] = await Promise.all([
      db
        .select({
          enabled: adminDashboardSections.enabled,
        })
        .from(adminDashboardSections),
      db.select({ total: count() }).from(projects),
      db.select({ total: count() }).from(skills),
      db.select({ total: count() }).from(blogPosts),
    ]);
    return successResponse(state, "private.dashboard.summary", "read", {
      sections: {
        total: sectionRows.length,
        enabled: sectionRows.filter((row) => row.enabled).length,
        disabled: sectionRows.filter((row) => !row.enabled).length,
      },
      contentResources: {
        projects: projectCount[0]?.total ?? 0,
        skills: skillCount[0]?.total ?? 0,
        blogPosts: blogCount[0]?.total ?? 0,
      },
    });
  }

  throw new OpenClawApiError(
    "UNSUPPORTED_OPERATION",
    404,
    "Unknown private summary resource."
  );
}

async function handleHealth(state: RequestState) {
  const db = await getDB();
  await db.select({ total: count() }).from(users);
  return successResponse(state, "health", "read", {
    status: "ok",
    version: API_VERSION,
    database: "ok",
    implementedResources: [
      "blog.posts",
      "public_content.blocks",
      "projects",
      "skills",
      "work_experiences",
      "education",
      "certifications",
      "services",
      "testimonials",
      "resume_pdf",
      "private.summaries",
      "health",
    ],
  });
}

async function dispatch(state: RequestState) {
  const [resource, subresource, ...tail] = state.path;

  if (!resource) {
    return handleRoot(state);
  }

  if (resource === "health" && state.method === "GET") {
    return handleHealth(state);
  }

  if (resource === "blog" && subresource === "posts") {
    return handleBlogPosts(state, state.method, tail);
  }

  if (resource === "public-content" && subresource === "blocks") {
    return handlePublicContentBlocks(state, state.method, tail);
  }

  if (resource === "projects") {
    const special = await handleProjectSpecial(state, state.method, [
      subresource,
      ...tail,
    ].filter(Boolean));
    if (special) return special;
  }

  if (resource === "skills") {
    const special = await handleSkillSpecial(state, state.method, [
      subresource,
      ...tail,
    ].filter(Boolean));
    if (special) return special;
  }

  if (resource === "certifications") {
    const special = await handleCertificationSpecial(state, state.method, [
      subresource,
      ...tail,
    ].filter(Boolean));
    if (special) return special;
  }

  if (resource === "testimonials") {
    const special = await handleTestimonialSpecial(state, state.method, [
      subresource,
      ...tail,
    ].filter(Boolean));
    if (special) return special;
  }

  const config = getCrudConfig(resource);
  if (config) {
    return handleCrudResource(
      state,
      state.method,
      [subresource, ...tail].filter(Boolean),
      config
    );
  }

  if (resource === "resume-pdf") {
    return handleResumePdf(
      state,
      state.method,
      [subresource, ...tail].filter(Boolean)
    );
  }

  if (resource === "private" && state.method === "GET" && subresource) {
    return getPrivateSummary(state, [subresource, ...tail]);
  }

  throw new OpenClawApiError(
    "UNSUPPORTED_OPERATION",
    404,
    "Unknown OpenClaw v1 endpoint."
  );
}

function classifyUnexpectedError(error: unknown) {
  if (error instanceof OpenClawApiError) {
    return error;
  }

  if (error instanceof Error) {
    if (/rate limit/i.test(error.message)) {
      return new OpenClawApiError("RATE_LIMITED", 429, error.message);
    }

    if (/not found/i.test(error.message)) {
      return new OpenClawApiError("NOT_FOUND", 404, error.message);
    }

    if (/duplicate|unique/i.test(error.message)) {
      return new OpenClawApiError("CONFLICT", 409, error.message);
    }

    if (/database|connection/i.test(error.message)) {
      return new OpenClawApiError("DATABASE_UNAVAILABLE", 503, error.message);
    }

    return new OpenClawApiError("INTERNAL_ERROR", 500, error.message);
  }

  return new OpenClawApiError(
    "INTERNAL_ERROR",
    500,
    "Unexpected OpenClaw API error."
  );
}

async function handleRequest(request: NextRequest, context: RouteContext) {
  const path = await getPath(context);
  const state = createState(request, path);

  const authError = await authenticate(request, state.requestId);
  if (authError) {
    return authError;
  }

  try {
    enforceRateLimit(request);
    pruneIdempotencyCache();

    const cacheKey = getIdempotencyCacheKey(state);
    if (cacheKey) {
      const cached = idempotencyCache.get(cacheKey);
      if (cached && cached.expiresAt > Date.now()) {
        return NextResponse.json(cached.payload, { status: cached.status });
      }
    }

    const response = await dispatch(state);
    await maybeCacheResponse(cacheKey, response);
    return response;
  } catch (error) {
    const apiError = classifyUnexpectedError(error);
    return errorResponse(
      state.requestId,
      apiError.code,
      apiError.message,
      apiError.status,
      apiError.issues
    );
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  return handleRequest(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return handleRequest(request, context);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return handleRequest(request, context);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return handleRequest(request, context);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return handleRequest(request, context);
}
