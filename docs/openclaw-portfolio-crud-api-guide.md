# OpenClaw Portfolio CRUD API Guide

This guide defines the working OpenClaw v1 API that OpenClaw should use to manage Omri Jukin's portfolio website safely.

This document is a contract for an agent. It should be explicit enough that OpenClaw can decide which endpoint to call, which fields are allowed, which operations are unsafe, and when to ask Omri before acting.

## Status

The only API OpenClaw should use is:

```text
/api/openclaw/v1
```

Implemented in:

```text
src/app/api/openclaw/v1/[[...resource]]/route.ts
```

Use this v1 API only. This guide intentionally documents only the current working API surface.

## Design Goals

- Give OpenClaw safe write access to public-facing portfolio content.
- Give OpenClaw minimal read-only visibility into private/admin business data.
- Keep the API simple enough for an LLM agent to use reliably.
- Make destructive actions explicit.
- Keep one secret-based machine API key instead of dashboard session auth.
- Avoid exposing secrets, tokens, raw private payloads, proposal bodies, intake details, or unnecessary PII.
- Keep the current dashboard and tRPC APIs as internal application APIs.

## Auth

All OpenClaw write and private-summary endpoints require:

```http
x-api-key: <OPENCLAW_API_KEY>
```

The API should also accept:

```http
Authorization: Bearer <OPENCLAW_API_KEY>
```

The server should read:

```text
OPENCLAW_API_KEY
```

No fallback token name is part of this guide. OpenClaw must use `OPENCLAW_API_KEY` only.

## Token Handling

Generate one high-entropy token locally, then store it as a Cloudflare secret.

Recommended local generation:

```powershell
npm.cmd run secret:hex
```

Alternative:

```powershell
npm.cmd run secret:generate
```

Cloudflare dashboard setup:

1. Open the deployed Portfolio Worker or Pages project.
2. Go to Settings.
3. Open Variables and Secrets.
4. Add a secret named `OPENCLAW_API_KEY`.
5. Paste the generated value.
6. Save and redeploy if Cloudflare requires a redeploy for the binding to be available.

Local development:

```env
OPENCLAW_API_KEY=replace-with-generated-secret
```

Never place the real key in docs, screenshots, Git history, prompts, logs, WhatsApp messages, or OpenClaw memory. Examples in this guide intentionally use placeholders only.

## Base URLs

Production:

```text
https://omrijukin.com/api/openclaw/v1
```

Local development:

```text
http://localhost:3000/api/openclaw/v1
```

## Common Headers

Every JSON request should send:

```http
Accept: application/json
Content-Type: application/json
x-api-key: <OPENCLAW_API_KEY>
```

Recommended for writes:

```http
X-Idempotency-Key: <stable-operation-id>
```

Required for hard deletes in v1:

```http
X-OpenClaw-Confirm-Delete: true
```

Recommended for traceability:

```http
X-OpenClaw-Actor: openclaw
X-OpenClaw-Reason: user-requested-content-change
```

## Common Response Envelope

All v1 endpoints should use one response envelope.

Success:

```json
{
  "success": true,
  "resource": "projects",
  "action": "updated",
  "data": {},
  "meta": {
    "requestId": "req_...",
    "version": "v1"
  }
}
```

List success:

```json
{
  "success": true,
  "resource": "projects",
  "data": [],
  "meta": {
    "page": 1,
    "limit": 25,
    "total": 42,
    "hasMore": true,
    "requestId": "req_...",
    "version": "v1"
  }
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request body.",
    "issues": {}
  },
  "meta": {
    "requestId": "req_...",
    "version": "v1"
  }
}
```

## Standard Status Codes

| Status | Meaning |
| --- | --- |
| `200` | Read, update, or delete succeeded. |
| `201` | Create succeeded. |
| `400` | Invalid request body, query, or delete confirmation. |
| `401` | Missing or invalid API key. |
| `403` | API key is valid but not allowed to perform this operation. |
| `404` | Resource not found. |
| `409` | Conflict, usually duplicate id, duplicate slug, or stale update. |
| `422` | Valid JSON but invalid business rule. |
| `429` | Rate limit exceeded. |
| `500` | Unexpected server error. |
| `503` | API key or required runtime dependency is not configured. |

## Standard Error Codes

Use stable machine-readable codes:

```text
AUTH_MISSING
AUTH_INVALID
AUTH_NOT_CONFIGURED
FORBIDDEN
VALIDATION_ERROR
NOT_FOUND
CONFLICT
DELETE_CONFIRMATION_REQUIRED
UNSUPPORTED_OPERATION
RATE_LIMITED
INTERNAL_ERROR
DATABASE_UNAVAILABLE
```

## Pagination And Filtering

All list endpoints should support:

| Query | Default | Notes |
| --- | --- | --- |
| `page` | `1` | Positive integer. |
| `limit` | `25` | Max `100`. |
| `search` | none | Text search when supported. |
| `sort` | resource default | Field name, such as `displayOrder` or `createdAt`. |
| `order` | `asc` | `asc` or `desc`. |
| `includeHidden` | `false` | If true, include non-public records for public-write resources. |
| `includeDeleted` | `false` | Only applies if soft-deleted records exist later. |

Dates should be ISO strings. Date-only values should be accepted as `YYYY-MM-DD` and normalized by the server.

## Idempotency

OpenClaw should send `X-Idempotency-Key` for every create, update, publish, reorder, and delete request.

Recommended key format:

```text
openclaw:<resource>:<operation>:<stable-user-request-id>
```

The server should store recent idempotency keys for a short period and return the first result when the same operation is retried.

## Delete Policy

Omri chose hard delete for public-facing content.

Because hard delete is destructive, every v1 hard delete must include:

```http
X-OpenClaw-Confirm-Delete: true
```

And a JSON body:

```json
{
  "confirm": true,
  "deleteMode": "hard",
  "reason": "Omri explicitly requested deletion.",
  "requestedBy": "omri"
}
```

The API should reject a delete if the confirmation header or body is missing.

OpenClaw must not delete private/admin resources. Private/admin resources are minimal read-only summaries in this guide.

## Visibility And Publishing Rules

OpenClaw must treat public visibility and publishing as explicit actions.

Defaults:

- New blog posts default to `draft`.
- New projects default to `isVisible: false` and `isFeatured: false` unless Omri explicitly asks to publish/show/feature.
- New public-content blocks default to `isVisible: false` unless Omri explicitly asks to show them.
- New skills, work experiences, education records, certifications, services, and testimonials default to hidden/inactive unless Omri explicitly asks to make them public.
- Resume PDF inclusion defaults to false unless Omri explicitly asks to include the item in the PDF.

OpenClaw may update non-public drafts and hidden content without an extra confirmation if the user request is clear.

OpenClaw must ask for confirmation before:

- Publishing a blog post.
- Making a hidden item visible.
- Featuring a project, testimonial, service, or work experience.
- Adding/removing an item from the resume PDF.
- Deleting any public-write resource.

## Public-Write Resources

Public-write resources are content that can be shown on the public website or resume PDF. These resources get full CRUD in the v1 spec.

| Resource | Base endpoint | Public surface |
| --- | --- | --- |
| Blog posts | `/blog/posts` | `/blog`, `/blog/[slug]` |
| Public content blocks | `/public-content/blocks` | Homepage and public-page CMS sections |
| Projects and case studies | `/projects` | Homepage selected work, `/projects/[slug]`, resume PDF |
| Skills | `/skills` | Resume/public skills sections |
| Work experiences | `/work-experiences` | Resume/public experience sections |
| Education | `/education` | Resume/public education sections |
| Certifications | `/certifications` | Resume/public credentials sections |
| Services | `/services` | Public services pages and pricing context |
| Testimonials | `/testimonials` | Public proof/testimonial sections |
| Resume PDF settings | `/resume-pdf` | Generated resume PDF inclusion/order settings |

## Private Minimal Read-Only Resources

Private/admin resources are not writable through OpenClaw v1. They should expose aggregate summaries only.

| Resource | Endpoint | Allowed data |
| --- | --- | --- |
| Intakes | `/private/intakes/summary` | Counts by status, flagged count, reminder count, newest timestamp. |
| Proposals | `/private/proposals/summary` | Counts by status, total count, expiring count, newest timestamp. |
| Contact inquiries | `/private/contact-inquiries/summary` | Counts by status, unread/open count, newest timestamp. |
| Pricing | `/private/pricing/summary` | Active/inactive counts by pricing table, not raw rates unless explicitly approved later. |
| Discounts | `/private/discounts/summary` | Active count, expired count, total redemptions aggregate, no private campaign details. |
| Email templates | `/private/email-templates/summary` | Template count and last-updated timestamp, no template body. |
| Users | `/private/users/summary` | Counts by role/status, no email list. |
| Roles | `/private/roles/summary` | Role count and active count, no detailed permissions unless approved later. |
| Dashboard metadata | `/private/dashboard/summary` | Section counts and enabled/disabled counts. |
| Operational health | `/health` | Database/API availability, version, route status. |

No private detail endpoints are part of this v1 guide.

## v1 Endpoint Index

All endpoints below are under:

```text
/api/openclaw/v1
```

### Public-Write Endpoint Index

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/blog/posts` | List blog posts. |
| `GET` | `/blog/posts/{id}` | Read one blog post by id. |
| `GET` | `/blog/posts/by-slug/{slug}` | Read one blog post by slug. |
| `POST` | `/blog/posts` | Create blog post. |
| `PATCH` | `/blog/posts/{id}` | Partial update blog post. |
| `PUT` | `/blog/posts/{id}` | Replace blog post. |
| `DELETE` | `/blog/posts/{id}` | Hard delete blog post. |
| `GET` | `/public-content/blocks` | List public content blocks. |
| `GET` | `/public-content/blocks/{id}` | Read one block. |
| `POST` | `/public-content/blocks` | Create block. |
| `PATCH` | `/public-content/blocks/{id}` | Partial update block. |
| `PUT` | `/public-content/blocks/{id}` | Replace block. |
| `DELETE` | `/public-content/blocks/{id}` | Hard delete block. |
| `POST` | `/public-content/blocks/reorder` | Update block display order. |
| `GET` | `/projects` | List projects. |
| `GET` | `/projects/{id}` | Read one project by id. |
| `GET` | `/projects/by-slug/{slug}` | Read one project by case-study slug. |
| `POST` | `/projects` | Create project. |
| `PATCH` | `/projects/{id}` | Partial update project. |
| `PUT` | `/projects/{id}` | Replace project. |
| `DELETE` | `/projects/{id}` | Hard delete project. |
| `POST` | `/projects/reorder` | Update project display order. |
| `GET` | `/skills` | List skills. |
| `GET` | `/skills/{id}` | Read one skill. |
| `POST` | `/skills` | Create skill. |
| `PATCH` | `/skills/{id}` | Partial update skill. |
| `PUT` | `/skills/{id}` | Replace skill. |
| `DELETE` | `/skills/{id}` | Hard delete skill. |
| `POST` | `/skills/reorder` | Update skill display order. |
| `POST` | `/skills/{id}/mark-used` | Set `lastUsed` to now. |
| `GET` | `/work-experiences` | List work experiences. |
| `GET` | `/work-experiences/{id}` | Read one work experience. |
| `POST` | `/work-experiences` | Create work experience. |
| `PATCH` | `/work-experiences/{id}` | Partial update work experience. |
| `PUT` | `/work-experiences/{id}` | Replace work experience. |
| `DELETE` | `/work-experiences/{id}` | Hard delete work experience. |
| `POST` | `/work-experiences/reorder` | Update work display order. |
| `GET` | `/education` | List education records. |
| `GET` | `/education/{id}` | Read one education record. |
| `POST` | `/education` | Create education record. |
| `PATCH` | `/education/{id}` | Partial update education record. |
| `PUT` | `/education/{id}` | Replace education record. |
| `DELETE` | `/education/{id}` | Hard delete education record. |
| `POST` | `/education/reorder` | Update education display order. |
| `GET` | `/certifications` | List certifications. |
| `GET` | `/certifications/{id}` | Read one certification. |
| `POST` | `/certifications` | Create certification. |
| `PATCH` | `/certifications/{id}` | Partial update certification. |
| `PUT` | `/certifications/{id}` | Replace certification. |
| `DELETE` | `/certifications/{id}` | Hard delete certification. |
| `POST` | `/certifications/reorder` | Update certification display order. |
| `POST` | `/certifications/mark-expired` | Mark selected certifications expired. |
| `GET` | `/services` | List services. |
| `GET` | `/services/{id}` | Read one service. |
| `POST` | `/services` | Create service. |
| `PATCH` | `/services/{id}` | Partial update service. |
| `PUT` | `/services/{id}` | Replace service. |
| `DELETE` | `/services/{id}` | Hard delete service. |
| `POST` | `/services/reorder` | Update service display order. |
| `GET` | `/testimonials` | List testimonials. |
| `GET` | `/testimonials/{id}` | Read one testimonial. |
| `POST` | `/testimonials` | Create testimonial. |
| `PATCH` | `/testimonials/{id}` | Partial update testimonial. |
| `PUT` | `/testimonials/{id}` | Replace testimonial. |
| `DELETE` | `/testimonials/{id}` | Hard delete testimonial. |
| `POST` | `/testimonials/reorder` | Update testimonial display order. |
| `POST` | `/testimonials/{id}/verify` | Mark testimonial verified. |
| `GET` | `/resume-pdf/overview` | Read resume PDF inclusion/order overview. |
| `PATCH` | `/resume-pdf/items/{section}/{id}` | Toggle or set PDF inclusion for one item. |
| `PUT` | `/resume-pdf/section-order` | Replace PDF section order. |
| `PATCH` | `/resume-pdf/date-format` | Toggle or set PDF date format. |

### Private Minimal Read Endpoint Index

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/private/intakes/summary` | Minimal intake counts only. |
| `GET` | `/private/proposals/summary` | Minimal proposal counts only. |
| `GET` | `/private/contact-inquiries/summary` | Minimal contact inquiry counts only. |
| `GET` | `/private/pricing/summary` | Minimal pricing configuration counts only. |
| `GET` | `/private/discounts/summary` | Minimal discount counts only. |
| `GET` | `/private/email-templates/summary` | Minimal email template counts only. |
| `GET` | `/private/users/summary` | Minimal user counts only. |
| `GET` | `/private/roles/summary` | Minimal role counts only. |
| `GET` | `/private/dashboard/summary` | Minimal dashboard section metadata only. |
| `GET` | `/health` | API health and implementation status. |

## Blog Posts

Resource name:

```text
blog.posts
```

Fields:

| Field | Type | Create | Update | Notes |
| --- | --- | --- | --- | --- |
| `id` | string | server | no | Server-generated id. |
| `title` | string | required | optional | 1-200 chars recommended. |
| `slug` | string | optional | optional | Lowercase hyphen slug. Generated from title if omitted. |
| `content` | string | required | optional | Markdown body. |
| `excerpt` | string | optional | optional | Short listing summary. |
| `status` | enum | optional | optional | `draft`, `published`, `archived`, `scheduled`, `deleted`; OpenClaw defaults to `draft`. |
| `tags` | string[] | optional | optional | Short tag strings. |
| `imageUrl` | string or null | optional | optional | Absolute URL or null. |
| `imageAlt` | string or null | optional | optional | Alt text. |
| `publishedAt` | string or null | server | server | Set when status becomes `published`. |
| `createdAt` | string | server | no | ISO timestamp. |
| `updatedAt` | string or null | server | server | ISO timestamp. |

List:

```http
GET /api/openclaw/v1/blog/posts?status=draft&search=portfolio&page=1&limit=25
```

Read by slug:

```http
GET /api/openclaw/v1/blog/posts/by-slug/portfolio-cms-update
```

Create draft:

```bash
curl -X POST https://omrijukin.com/api/openclaw/v1/blog/posts \
  -H "Content-Type: application/json" \
  -H "x-api-key: $OPENCLAW_API_KEY" \
  -H "X-Idempotency-Key: openclaw:blog:create:portfolio-cms-update" \
  -d '{
    "title": "Portfolio CMS update",
    "slug": "portfolio-cms-update",
    "content": "Markdown body.",
    "excerpt": "Short summary.",
    "status": "draft",
    "tags": ["portfolio", "cms"],
    "imageUrl": null,
    "imageAlt": null
  }'
```

Patch:

```bash
curl -X PATCH https://omrijukin.com/api/openclaw/v1/blog/posts/post-id \
  -H "Content-Type: application/json" \
  -H "x-api-key: $OPENCLAW_API_KEY" \
  -H "X-Idempotency-Key: openclaw:blog:update:post-id" \
  -d '{
    "excerpt": "Updated short summary.",
    "tags": ["portfolio", "cms", "openclaw"]
  }'
```

Publish requires explicit user intent:

```bash
curl -X PATCH https://omrijukin.com/api/openclaw/v1/blog/posts/post-id \
  -H "Content-Type: application/json" \
  -H "x-api-key: $OPENCLAW_API_KEY" \
  -H "X-Idempotency-Key: openclaw:blog:publish:post-id" \
  -d '{
    "status": "published",
    "publishConfirmation": {
      "confirmed": true,
      "reason": "Omri explicitly asked to publish this post."
    }
  }'
```

Hard delete:

```bash
curl -X DELETE https://omrijukin.com/api/openclaw/v1/blog/posts/post-id \
  -H "Content-Type: application/json" \
  -H "x-api-key: $OPENCLAW_API_KEY" \
  -H "X-OpenClaw-Confirm-Delete: true" \
  -d '{
    "confirm": true,
    "deleteMode": "hard",
    "reason": "Omri explicitly requested deletion.",
    "requestedBy": "omri"
  }'
```

Agent rules:

- Default to draft.
- Preserve dictated Markdown exactly unless Omri asks for editing.
- Ask before publishing.
- Never invent career claims, metrics, or proof.

## Public Content Blocks

Resource name:

```text
public_content.blocks
```

Public content blocks power editable homepage and public-page sections.

Fields:

| Field | Type | Create | Update | Notes |
| --- | --- | --- | --- | --- |
| `id` | string | required | no | Stable block id, max 160 recommended. |
| `page` | string | required | optional | Usually `home`. |
| `locale` | string | optional | optional | Defaults to `en`. |
| `sectionKey` | string | required | optional | Example: `hero`, `selected-work`, `contact`. |
| `blockKey` | string | required | optional | Unique within page/locale/section. |
| `blockType` | enum | required | optional | `section`, `hero`, `metric`, `card`, `link`, `question`, `list`, `cta`. |
| `title` | string or null | optional | optional | Max 1000. |
| `subtitle` | string or null | optional | optional | Max 2000. |
| `body` | string or null | optional | optional | Max 8000. |
| `href` | string or null | optional | optional | URL or path. |
| `ctaLabel` | string or null | optional | optional | Button/link label. |
| `items` | array | optional | optional | JSON list data. |
| `metadata` | object | optional | optional | Extra typed data. |
| `displayOrder` | integer | optional | optional | Controls ordering. |
| `isVisible` | boolean | optional | optional | Public visibility. |
| `isFeatured` | boolean | optional | optional | Highlight flag. |
| `createdAt` | string | server | no | ISO timestamp. |
| `updatedAt` | string or null | server | server | ISO timestamp. |

List:

```http
GET /api/openclaw/v1/public-content/blocks?page=home&locale=en&sectionKey=selected-work&includeHidden=true
```

Create:

```bash
curl -X POST https://omrijukin.com/api/openclaw/v1/public-content/blocks \
  -H "Content-Type: application/json" \
  -H "x-api-key: $OPENCLAW_API_KEY" \
  -d '{
    "id": "home-proof-extra-card",
    "page": "home",
    "locale": "en",
    "sectionKey": "proof-links",
    "blockKey": "extra-card",
    "blockType": "card",
    "title": "Extra proof point",
    "subtitle": "Short supporting copy.",
    "body": "Longer copy.",
    "items": [],
    "metadata": {},
    "displayOrder": 30,
    "isVisible": false,
    "isFeatured": false
  }'
```

Patch:

```bash
curl -X PATCH https://omrijukin.com/api/openclaw/v1/public-content/blocks/home-hero-main \
  -H "Content-Type: application/json" \
  -H "x-api-key: $OPENCLAW_API_KEY" \
  -d '{
    "title": "Updated homepage title",
    "subtitle": "Updated homepage subtitle."
  }'
```

Reorder:

```bash
curl -X POST https://omrijukin.com/api/openclaw/v1/public-content/blocks/reorder \
  -H "Content-Type: application/json" \
  -H "x-api-key: $OPENCLAW_API_KEY" \
  -d '{
    "items": [
      { "id": "home-hero-main", "displayOrder": 0 },
      { "id": "home-section-selected-work", "displayOrder": 20 }
    ]
  }'
```

Hard delete uses the standard delete confirmation body.

Agent rules:

- Do not change block ids unless creating a new block.
- Ask before changing homepage hero, selected-work, resume, or contact CTA copy.
- When only rewording content, preserve `page`, `sectionKey`, `blockKey`, and `blockType`.

## Projects And Case Studies

Resource name:

```text
projects
```

Projects power homepage selected work, public case studies, project cards, and resume PDF project inclusion.

Core fields:

| Field | Type | Create | Update | Notes |
| --- | --- | --- | --- | --- |
| `id` | string | server | no | Server-generated unless explicitly supported. |
| `title` | string | required | optional | Project title. |
| `subtitle` | string | required | optional | Short display subtitle. |
| `description` | string | required | optional | Public summary. |
| `longDescription` | string | optional | optional | Longer case-study text. |
| `technologies` | string[] | required | optional | At least one. |
| `categories` | string[] | required | optional | At least one. |
| `status` | enum | optional | optional | `completed`, `in-progress`, `archived`, `concept`. |
| `projectType` | enum | required | optional | `professional`, `personal`, `open-source`, `academic`. |
| `startDate` | date | required | optional | ISO or `YYYY-MM-DD`. |
| `endDate` | date or null | optional | optional | Null for ongoing. |
| `githubUrl` | string | optional | optional | May be empty/null. |
| `liveUrl` | string | optional | optional | May be empty/null. |
| `demoUrl` | string | optional | optional | May be empty/null. |
| `documentationUrl` | string | optional | optional | May be empty/null. |
| `images` | string[] | optional | optional | Image URLs. |
| `keyFeatures` | string[] | required | optional | At least one. |
| `technicalChallenges` | object[] | optional | optional | `{ challenge, solution }`. |
| `codeExamples` | object[] | optional | optional | `{ title, language, code, explanation }`. |
| `teamSize` | integer | optional | optional | Minimum 1. |
| `myRole` | string | optional | optional | Role summary. |
| `clientName` | string | optional | optional | Avoid private client names unless public-safe. |
| `budget` | string | optional | optional | Avoid private budget unless intended public. |
| `displayOrder` | integer | optional | optional | Homepage/order sorting. |
| `isVisible` | boolean | optional | optional | Public visibility. |
| `isFeatured` | boolean | optional | optional | Homepage selected work. |
| `isOpenSource` | boolean | optional | optional | Open-source flag. |
| `isResumeFeatured` | boolean | optional | optional | Resume PDF inclusion. |

Case-study fields:

| Field | Type | Notes |
| --- | --- | --- |
| `caseStudySlug` | string or null | Used by `/projects/[slug]`; lowercase hyphen slug. |
| `hiringSignal` | string or null | Recruiter-facing signal used in metadata/hero. |
| `constraints` | string[] | Public constraints/tradeoffs. |
| `decisions` | string[] | Public decisions/tradeoffs. |
| `outcome` | string or null | Public outcome statement. |
| `caseStudyRole` | string or null | Public role badge. |
| `proofLinks` | object[] | `{ label, href, description? }`. |
| `privateRepoNote` | string or null | Public-safe note explaining private repo context. |
| `problem` | object or null | `{ title, description, impact }`; shown on case-study page when available. |
| `solution` | object or null | `{ approach, methodology, keyDecisions }`; shown on case-study page when available. |
| `architecture` | object or null | `{ overview, components, dataFlow, technologies, patterns }`; shown on case-study page when available. |

Project case-study note:

The v1 API accepts `problem`, `solution`, and `architecture` because the public project page reads these fields for richer case-study sections.

List:

```http
GET /api/openclaw/v1/projects?includeHidden=true&featured=true&search=portfolio
```

Read by slug:

```http
GET /api/openclaw/v1/projects/by-slug/portfolio-platform
```

Create hidden project:

```bash
curl -X POST https://omrijukin.com/api/openclaw/v1/projects \
  -H "Content-Type: application/json" \
  -H "x-api-key: $OPENCLAW_API_KEY" \
  -d '{
    "title": "Portfolio Platform",
    "subtitle": "Recruiter-facing site plus authenticated CMS.",
    "description": "Production portfolio system with public content, dashboard editing, and typed APIs.",
    "longDescription": "Optional longer case-study copy.",
    "technologies": ["Next.js", "TypeScript", "tRPC", "Drizzle"],
    "categories": ["full-stack", "cms", "portfolio"],
    "status": "completed",
    "projectType": "personal",
    "startDate": "2026-01-01",
    "endDate": null,
    "images": [],
    "keyFeatures": ["Editable public content"],
    "technicalChallenges": [
      {
        "challenge": "Keep public content editable without losing SSR.",
        "solution": "Use database-backed blocks with server-rendered reads."
      }
    ],
    "displayOrder": 10,
    "isVisible": false,
    "isFeatured": false,
    "isOpenSource": false,
    "isResumeFeatured": false,
    "caseStudySlug": "portfolio-platform",
    "hiringSignal": "Shows full-stack ownership across public UI, admin UX, database content, and deployment readiness.",
    "constraints": ["No fake demo links"],
    "decisions": ["Use typed CMS blocks for public copy"],
    "outcome": "Recruiter-friendly portfolio with editable content surfaces.",
    "caseStudyRole": "Full-stack engineer",
    "proofLinks": [
      {
        "label": "Case study",
        "href": "/projects/portfolio-platform",
        "description": "Public case-study page"
      }
    ],
    "privateRepoNote": "Source is private; public case study focuses on implementation and architecture.",
    "problem": {
      "title": "Problem",
      "description": "Portfolio content needed to stay editable without losing public performance.",
      "impact": "Manual edits slowed iteration."
    },
    "solution": {
      "approach": "Use typed CMS records and authenticated dashboard workflows.",
      "methodology": "Keep public rendering and content editing separated.",
      "keyDecisions": ["Database-backed blocks", "Typed route contracts"]
    },
    "architecture": {
      "overview": "Next.js public pages read structured project data through the database layer.",
      "components": ["Public UI", "Dashboard", "Database managers"],
      "dataFlow": "Dashboard writes project data; public pages read by slug.",
      "technologies": ["Next.js", "TypeScript", "Drizzle"],
      "patterns": ["Server-rendered public pages", "Typed data access"]
    }
  }'
```

Patch visibility:

```bash
curl -X PATCH https://omrijukin.com/api/openclaw/v1/projects/project-id \
  -H "Content-Type: application/json" \
  -H "x-api-key: $OPENCLAW_API_KEY" \
  -d '{
    "isVisible": true,
    "visibilityConfirmation": {
      "confirmed": true,
      "reason": "Omri explicitly asked to show this project publicly."
    }
  }'
```

Reorder:

```bash
curl -X POST https://omrijukin.com/api/openclaw/v1/projects/reorder \
  -H "Content-Type: application/json" \
  -H "x-api-key: $OPENCLAW_API_KEY" \
  -d '{
    "items": [
      { "id": "portfolio-platform", "displayOrder": 10 },
      { "id": "snow-hq", "displayOrder": 20 }
    ]
  }'
```

Agent rules:

- Do not invent proof, client names, production metrics, budgets, or repo availability.
- For sensitive projects, keep public copy focused on technical architecture, runtime boundaries, and implementation work.
- Prefer `isFeatured: false` to remove from homepage without deleting.
- Prefer `isVisible: false` to hide from public surfaces without deleting.
- Hard delete only after explicit user request.

## Skills

Resource name:

```text
skills
```

Fields:

| Field | Type | Notes |
| --- | --- | --- |
| `name` | string | Required. |
| `category` | enum | `technical`, `soft`, `language`, `tool`, `framework`, `database`, `cloud`, `cybersecurity`. |
| `subCategory` | string or null | Optional grouping. |
| `proficiencyLevel` | integer | Numeric proficiency. |
| `proficiencyLabel` | enum | `beginner`, `intermediate`, `advanced`, `expert`. |
| `yearsOfExperience` | integer | 0-50 recommended. |
| `description` | string or null | Optional public description. |
| `icon` | string or null | Optional icon identifier. |
| `color` | string or null | Optional hex color. |
| `relatedSkills` | string[] | Related skills. |
| `certifications` | string[] | Certification references. |
| `projects` | string[] | Project references. |
| `lastUsed` | date | ISO or `YYYY-MM-DD`. |
| `isVisible` | boolean | Public visibility. |
| `isResumeFeatured` | boolean | Resume PDF inclusion. |
| `displayOrder` | integer | Sort order. |
| `nameTranslations` | object | Optional. |
| `descriptionTranslations` | object | Optional. |

Endpoints:

```http
GET /api/openclaw/v1/skills?category=technical&includeHidden=true
GET /api/openclaw/v1/skills/{id}
POST /api/openclaw/v1/skills
PATCH /api/openclaw/v1/skills/{id}
PUT /api/openclaw/v1/skills/{id}
DELETE /api/openclaw/v1/skills/{id}
POST /api/openclaw/v1/skills/reorder
POST /api/openclaw/v1/skills/{id}/mark-used
```

Create:

```json
{
  "name": "TypeScript",
  "category": "technical",
  "subCategory": "Language",
  "proficiencyLevel": 9,
  "proficiencyLabel": "expert",
  "yearsOfExperience": 5,
  "description": "Primary language for frontend, backend, and tooling work.",
  "relatedSkills": ["React", "Node.js"],
  "certifications": [],
  "projects": ["portfolio-platform"],
  "lastUsed": "2026-06-21",
  "isVisible": false,
  "isResumeFeatured": false,
  "displayOrder": 10
}
```

## Work Experiences

Resource name:

```text
work_experiences
```

Fields:

| Field | Type | Notes |
| --- | --- | --- |
| `role` | string | Required. |
| `company` | string | Required. |
| `location` | string | Required. |
| `startDate` | date | Required. |
| `endDate` | date or null | Null for current. |
| `description` | string | Required. |
| `achievements` | string[] | Required list. |
| `technologies` | string[] | Required list. |
| `responsibilities` | string[] | Required list. |
| `employmentType` | enum | `full-time`, `part-time`, `contract`, `freelance`, `internship`, `voluntary`. |
| `industry` | string | Required. |
| `companyUrl` | string or null | Optional. |
| `logo` | string or null | Optional. |
| `displayOrder` | integer | Sort order. |
| `isVisible` | boolean | Public visibility. |
| `isFeatured` | boolean | Highlight flag. |
| `isResumeFeatured` | boolean | Resume PDF inclusion. |
| `roleTranslations` | object | Optional. |
| `companyTranslations` | object | Optional. |
| `descriptionTranslations` | object | Optional. |

Endpoints:

```http
GET /api/openclaw/v1/work-experiences?includeHidden=true
GET /api/openclaw/v1/work-experiences/{id}
POST /api/openclaw/v1/work-experiences
PATCH /api/openclaw/v1/work-experiences/{id}
PUT /api/openclaw/v1/work-experiences/{id}
DELETE /api/openclaw/v1/work-experiences/{id}
POST /api/openclaw/v1/work-experiences/reorder
```

Create:

```json
{
  "role": "Full-stack Developer",
  "company": "Company Name",
  "location": "Remote",
  "startDate": "2025-01-01",
  "endDate": null,
  "description": "Public-safe role summary.",
  "achievements": ["Built a typed content workflow."],
  "technologies": ["TypeScript", "Next.js"],
  "responsibilities": ["Frontend", "Backend", "Deployment"],
  "employmentType": "freelance",
  "industry": "Software",
  "companyUrl": "",
  "displayOrder": 10,
  "isVisible": false,
  "isFeatured": false,
  "isResumeFeatured": false
}
```

Agent rules:

- Do not invent employment history.
- Do not expose private employer/client details unless Omri explicitly provides them for public use.
- Prefer hiding over deleting if history should be preserved.

## Education

Resource name:

```text
education
```

Fields:

| Field | Type | Notes |
| --- | --- | --- |
| `institution` | string | Required. |
| `degree` | string | Required. |
| `degreeType` | enum | `bachelor`, `master`, `phd`, `diploma`, `certificate`, `bootcamp`. |
| `fieldOfStudy` | string | Required. |
| `startDate` | date | Required. |
| `endDate` | date or null | Optional. |
| `status` | enum | `completed`, `in-progress`, `transferred`, `dropped`. |
| `gpa` | string or null | Optional. |
| `achievements` | string[] | Optional. |
| `coursework` | string[] | Optional. |
| `projects` | string[] | Optional. |
| `extracurriculars` | string[] | Optional. |
| `location` | string | Required. |
| `institutionUrl` | string or null | Optional. |
| `certificateUrl` | string or null | Optional. |
| `transcript` | string or null | Optional; do not expose private documents unless public-safe. |
| `isVisible` | boolean | Public visibility. |
| `isResumeFeatured` | boolean | Resume PDF inclusion. |
| `displayOrder` | integer | Sort order. |

Endpoints:

```http
GET /api/openclaw/v1/education?includeHidden=true
GET /api/openclaw/v1/education/{id}
POST /api/openclaw/v1/education
PATCH /api/openclaw/v1/education/{id}
PUT /api/openclaw/v1/education/{id}
DELETE /api/openclaw/v1/education/{id}
POST /api/openclaw/v1/education/reorder
```

Create:

```json
{
  "institution": "Institution Name",
  "degree": "Certificate",
  "degreeType": "certificate",
  "fieldOfStudy": "Software Engineering",
  "startDate": "2026-01-01",
  "endDate": "2026-06-01",
  "status": "completed",
  "achievements": [],
  "coursework": ["Web architecture"],
  "projects": [],
  "extracurriculars": [],
  "location": "Remote",
  "isVisible": false,
  "isResumeFeatured": false,
  "displayOrder": 10
}
```

## Certifications

Resource name:

```text
certifications
```

Fields:

| Field | Type | Notes |
| --- | --- | --- |
| `name` | string | Required. |
| `issuer` | string | Required. |
| `description` | string | Required. |
| `category` | enum | `technical`, `programming`, `cloud`, `security`, `project-management`, `cybersecurity`, `design`, `other`. |
| `status` | enum | `active`, `completed`, `in-progress`, `planned`, `expired`, `revoked`. |
| `skills` | string[] | Related skill names. |
| `issueDate` | date | Required. |
| `expiryDate` | date or null | Optional. |
| `credentialId` | string or null | Optional; avoid private ids if not public-safe. |
| `verificationUrl` | string or null | Optional. |
| `icon` | string or null | Optional. |
| `color` | string or null | Optional hex color. |
| `displayOrder` | integer | Sort order. |
| `isVisible` | boolean | Public visibility. |
| `isResumeFeatured` | boolean | Resume PDF inclusion. |

Endpoints:

```http
GET /api/openclaw/v1/certifications?includeHidden=true
GET /api/openclaw/v1/certifications/{id}
POST /api/openclaw/v1/certifications
PATCH /api/openclaw/v1/certifications/{id}
PUT /api/openclaw/v1/certifications/{id}
DELETE /api/openclaw/v1/certifications/{id}
POST /api/openclaw/v1/certifications/reorder
POST /api/openclaw/v1/certifications/mark-expired
```

Create:

```json
{
  "name": "Certification Name",
  "issuer": "Issuer",
  "description": "Public-safe description.",
  "category": "technical",
  "status": "active",
  "skills": ["TypeScript"],
  "issueDate": "2026-01-01",
  "expiryDate": null,
  "credentialId": "",
  "verificationUrl": "",
  "displayOrder": 10,
  "isVisible": false,
  "isResumeFeatured": false
}
```

## Services

Resource name:

```text
services
```

Services use `isActive` rather than `isVisible`.

Fields:

| Field | Type | Notes |
| --- | --- | --- |
| `name` | string | Required. |
| `category` | enum | `development`, `consulting`, `design`, `training`, `maintenance`. |
| `serviceType` | enum | `hourly`, `project`, `retainer`, `subscription`. |
| `description` | string | Required. |
| `longDescription` | string or null | Optional. |
| `features` | string[] | Public feature list. |
| `technologies` | string[] | Related technologies. |
| `duration` | string or null | Optional. |
| `complexity` | string or null | Optional. |
| `pricingType` | enum | `fixed`, `hourly`, `range`, `monthly`. |
| `basePrice` | string or null | Optional; ensure public-safe. |
| `priceRange` | string or null | Optional; ensure public-safe. |
| `deliverables` | string[] | Public deliverables. |
| `requirements` | string[] | Client requirements. |
| `portfolioExamples` | string[] | Related project ids/slugs. |
| `isActive` | boolean | Public availability. |
| `isPopular` | boolean | Popular/highlight flag. |
| `displayOrder` | integer | Sort order. |

Endpoints:

```http
GET /api/openclaw/v1/services?includeHidden=true
GET /api/openclaw/v1/services/{id}
POST /api/openclaw/v1/services
PATCH /api/openclaw/v1/services/{id}
PUT /api/openclaw/v1/services/{id}
DELETE /api/openclaw/v1/services/{id}
POST /api/openclaw/v1/services/reorder
```

Create:

```json
{
  "name": "Portfolio CMS buildout",
  "category": "development",
  "serviceType": "project",
  "description": "Build editable portfolio content workflows.",
  "longDescription": "A public-safe description of the service.",
  "features": ["Content modeling", "Admin dashboard", "Deployment support"],
  "technologies": ["Next.js", "TypeScript"],
  "duration": "2-4 weeks",
  "complexity": "medium",
  "pricingType": "range",
  "basePrice": "",
  "priceRange": "",
  "deliverables": ["Working CMS", "Deployment notes"],
  "requirements": ["Existing site access"],
  "portfolioExamples": ["portfolio-platform"],
  "isActive": false,
  "isPopular": false,
  "displayOrder": 10
}
```

## Testimonials

Resource name:

```text
testimonials
```

Fields:

| Field | Type | Notes |
| --- | --- | --- |
| `quote` | string | Required. |
| `author` | string | Required. |
| `role` | string | Required. |
| `company` | string | Required. |
| `authorImage` | string or null | Optional URL. |
| `authorLinkedIn` | string or null | Optional URL. |
| `companyUrl` | string or null | Optional URL. |
| `companyLogo` | string or null | Optional URL. |
| `rating` | integer or null | Optional 1-5. |
| `isVerified` | boolean | Verification flag. |
| `verificationDate` | date or null | Set when verified. |
| `displayOrder` | integer | Sort order. |
| `isVisible` | boolean | Public visibility. |
| `isFeatured` | boolean | Featured/highlight flag. |
| `quoteTranslations` | object | Optional. |
| `authorTranslations` | object | Optional. |
| `roleTranslations` | object | Optional. |
| `companyTranslations` | object | Optional. |

Endpoints:

```http
GET /api/openclaw/v1/testimonials?includeHidden=true
GET /api/openclaw/v1/testimonials/{id}
POST /api/openclaw/v1/testimonials
PATCH /api/openclaw/v1/testimonials/{id}
PUT /api/openclaw/v1/testimonials/{id}
DELETE /api/openclaw/v1/testimonials/{id}
POST /api/openclaw/v1/testimonials/reorder
POST /api/openclaw/v1/testimonials/{id}/verify
```

Create:

```json
{
  "quote": "Public-approved testimonial quote.",
  "author": "Person Name",
  "role": "Role",
  "company": "Company",
  "authorImage": "",
  "authorLinkedIn": "",
  "companyUrl": "",
  "companyLogo": "",
  "rating": 5,
  "isVerified": false,
  "verificationDate": null,
  "displayOrder": 10,
  "isVisible": false,
  "isFeatured": false
}
```

Agent rules:

- Do not create fake testimonials.
- Only add testimonials Omri provides or explicitly approves.
- Ask before making a testimonial visible or featured.

## Resume PDF Settings

Resource name:

```text
resume_pdf
```

Resume PDF settings are not a standalone content table. They coordinate inclusion/order across profile blocks, work experiences, projects, skills, education, and certifications.

Overview:

```http
GET /api/openclaw/v1/resume-pdf/overview
```

Expected response data:

```json
{
  "profile": {},
  "sectionOrder": ["profile", "skills", "work", "projects", "education", "certifications"],
  "dateFormat": "month-year",
  "workExperiences": [],
  "projects": [],
  "skills": [],
  "education": [],
  "certifications": []
}
```

Set inclusion:

```bash
curl -X PATCH https://omrijukin.com/api/openclaw/v1/resume-pdf/items/projects/project-id \
  -H "Content-Type: application/json" \
  -H "x-api-key: $OPENCLAW_API_KEY" \
  -d '{
    "isResumeFeatured": true,
    "confirmation": {
      "confirmed": true,
      "reason": "Omri explicitly asked to include this project in the resume PDF."
    }
  }'
```

Valid `section` values:

```text
work-experiences
projects
skills
education
certifications
```

Replace section order:

```bash
curl -X PUT https://omrijukin.com/api/openclaw/v1/resume-pdf/section-order \
  -H "Content-Type: application/json" \
  -H "x-api-key: $OPENCLAW_API_KEY" \
  -d '{
    "sectionOrder": ["profile", "skills", "work", "projects", "education", "certifications"]
  }'
```

Date format:

```bash
curl -X PATCH https://omrijukin.com/api/openclaw/v1/resume-pdf/date-format \
  -H "Content-Type: application/json" \
  -H "x-api-key: $OPENCLAW_API_KEY" \
  -d '{
    "dateFormat": "month-year"
  }'
```

Agent rules:

- Ask before adding/removing resume PDF items.
- Do not change public content to make the PDF look better unless Omri asks for content edits.
- Treat PDF inclusion as a presentation setting, not as proof that a project or job is more important.

## Shared Reorder Body

All reorder endpoints should use:

```json
{
  "items": [
    {
      "id": "record-id",
      "displayOrder": 10
    }
  ]
}
```

Validation:

- `items` must contain at least one item.
- Every id must exist.
- `displayOrder` must be a non-negative integer.
- The operation should be transactional when possible.

## Shared Bulk Operations

Bulk operations are optional. If implemented, keep them limited to public-write resources.

Bulk update:

```http
PATCH /api/openclaw/v1/projects/bulk
```

```json
{
  "ids": ["project-a", "project-b"],
  "data": {
    "isFeatured": false
  }
}
```

Bulk delete:

```http
DELETE /api/openclaw/v1/projects/bulk
```

```json
{
  "ids": ["project-a", "project-b"],
  "confirm": true,
  "deleteMode": "hard",
  "reason": "Omri explicitly requested bulk deletion.",
  "requestedBy": "omri"
}
```

Bulk delete must also require:

```http
X-OpenClaw-Confirm-Delete: true
```

## Private Minimal Summary Shapes

Private summaries should intentionally avoid record bodies.

### Intakes Summary

```http
GET /api/openclaw/v1/private/intakes/summary
```

```json
{
  "success": true,
  "resource": "private.intakes.summary",
  "data": {
    "total": 12,
    "byStatus": {
      "new": 2,
      "reviewing": 3,
      "contacted": 4,
      "proposal_sent": 1,
      "accepted": 1,
      "declined": 1
    },
    "flagged": 1,
    "withReminder": 2,
    "newestCreatedAt": "2026-06-21T00:00:00.000Z"
  }
}
```

Must not include:

- Full intake form payloads.
- Client names.
- Client emails.
- Phone numbers.
- Proposal markdown.
- Notes.

### Proposals Summary

```http
GET /api/openclaw/v1/private/proposals/summary
```

```json
{
  "success": true,
  "resource": "private.proposals.summary",
  "data": {
    "total": 8,
    "byStatus": {
      "draft": 2,
      "sent": 3,
      "accepted": 2,
      "declined": 1,
      "expired": 0
    },
    "expiringSoon": 1,
    "newestCreatedAt": "2026-06-21T00:00:00.000Z"
  }
}
```

Must not include:

- Proposal body/content.
- Share tokens.
- Client names/emails.
- Pricing line items.
- Private notes.

### Contact Inquiries Summary

```http
GET /api/openclaw/v1/private/contact-inquiries/summary
```

```json
{
  "success": true,
  "resource": "private.contact_inquiries.summary",
  "data": {
    "total": 20,
    "byStatus": {
      "open": 3,
      "pending": 2,
      "closed": 15
    },
    "newestCreatedAt": "2026-06-21T00:00:00.000Z"
  }
}
```

Must not include names, emails, subjects, or message bodies.

### Pricing Summary

```http
GET /api/openclaw/v1/private/pricing/summary
```

```json
{
  "success": true,
  "resource": "private.pricing.summary",
  "data": {
    "projectTypes": { "total": 4, "active": 4 },
    "baseRates": { "total": 8, "active": 8 },
    "features": { "total": 20, "active": 18 },
    "multiplierGroups": { "total": 5, "active": 5 },
    "meta": { "total": 3, "active": 3 },
    "updatedAt": "2026-06-21T00:00:00.000Z"
  }
}
```

Do not expose raw rates by default in this minimal-read mode.

### Discounts Summary

```http
GET /api/openclaw/v1/private/discounts/summary
```

```json
{
  "success": true,
  "resource": "private.discounts.summary",
  "data": {
    "total": 5,
    "active": 2,
    "expired": 1,
    "totalUsedCount": 12,
    "newestCreatedAt": "2026-06-21T00:00:00.000Z"
  }
}
```

Do not expose discount codes unless Omri explicitly approves a separate API expansion.

### Email Templates Summary

```http
GET /api/openclaw/v1/private/email-templates/summary
```

```json
{
  "success": true,
  "resource": "private.email_templates.summary",
  "data": {
    "total": 6,
    "newestUpdatedAt": "2026-06-21T00:00:00.000Z"
  }
}
```

Do not expose HTML, text content, CSS, variables, recipients, or send history.

### Users Summary

```http
GET /api/openclaw/v1/private/users/summary
```

```json
{
  "success": true,
  "resource": "private.users.summary",
  "data": {
    "total": 3,
    "byRole": {
      "admin": 1,
      "editor": 1,
      "visitor": 1
    },
    "byStatus": {
      "approved": 2,
      "pending": 1,
      "rejected": 0
    }
  }
}
```

Do not expose emails, names, OAuth ids, access tokens, refresh tokens, session ids, or social links.

### Roles Summary

```http
GET /api/openclaw/v1/private/roles/summary
```

```json
{
  "success": true,
  "resource": "private.roles.summary",
  "data": {
    "total": 4,
    "active": 4
  }
}
```

Do not expose detailed permission objects unless explicitly approved later.

### Dashboard Summary

```http
GET /api/openclaw/v1/private/dashboard/summary
```

```json
{
  "success": true,
  "resource": "private.dashboard.summary",
  "data": {
    "sections": {
      "total": 12,
      "enabled": 11,
      "disabled": 1
    },
    "contentResources": {
      "projects": 6,
      "skills": 40,
      "blogPosts": 8
    }
  }
}
```

## Health Endpoint

```http
GET /api/openclaw/v1/health
```

Response:

```json
{
  "success": true,
  "resource": "health",
  "data": {
    "status": "ok",
    "version": "v1",
    "database": "ok",
    "implementedResources": [
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
      "health"
    ]
  }
}
```

The health endpoint must never reveal secret values or connection strings.

## Agent Decision Flow

OpenClaw should classify user requests in this order:

1. If the user asks to write, edit, publish, hide, show, feature, delete, reorder, or add public website/resume content, use a public-write resource.
2. If the user asks for private/admin status such as "how many proposals are open" or "are there new intakes", use the minimal private summary endpoint.
3. If the user asks for full private details, explain that the OpenClaw API intentionally exposes only summaries and suggest using the dashboard.
4. If the user asks for a destructive action, repeat the target and only call DELETE when the request is explicit.
5. If the user asks to publish or make content visible, require explicit confirmation.
6. If required fields are missing, ask a focused follow-up question instead of inventing content.

## Agent Safety Rules

OpenClaw must:

- Use only `OPENCLAW_API_KEY` from its secret store.
- Never show, log, summarize, or transmit the API key.
- Never invent resume, career, project, education, certification, testimonial, or client facts.
- Never expose raw private/admin payloads.
- Never call private/admin write endpoints because they are out of scope.
- Default new public-write records to hidden/draft/inactive.
- Preserve Markdown exactly when Omri dictates Markdown.
- Preserve ids and slugs unless Omri explicitly asks to change them.
- Prefer targeted `PATCH` over full `PUT` unless replacing an entire record is intentional.
- Include an idempotency key for retries.
- Include a reason header/body for deletes, publish operations, and visibility changes.

OpenClaw should ask Omri before:

- Publishing a post.
- Making hidden content visible.
- Featuring a project/testimonial/service/work experience.
- Changing homepage hero, selected work, resume, or contact CTA copy.
- Adding/removing resume PDF content.
- Deleting anything.
- Writing public content based on uncertain facts.

## Implementation Notes For v1 Maintenance

Current server structure:

```text
src/app/api/openclaw/v1/[[...resource]]/route.ts
```

Potential supporting modules if the route grows further:

```text
lib/openclaw/auth.ts
lib/openclaw/errors.ts
lib/openclaw/response.ts
lib/openclaw/deleteConfirmation.ts
lib/openclaw/idempotency.ts
lib/openclaw/resources/*.ts
```

Recommended implementation rules:

- Keep route handlers thin.
- Reuse existing managers and services where they already exist.
- Reuse existing Zod schemas, but create OpenClaw-specific request schemas where public-write behavior differs from dashboard behavior.
- Keep authentication isolated in one helper.
- Keep private summaries implemented separately from admin tRPC detail endpoints.
- Do not proxy arbitrary tRPC calls through OpenClaw.
- Do not expose dashboard session cookies or NextAuth state to OpenClaw.
- Add rate limiting before exposing broad write access publicly.
- Add audit logging for every write and delete.

Recommended audit fields:

```json
{
  "actor": "openclaw",
  "resource": "projects",
  "resourceId": "project-id",
  "action": "updated",
  "reason": "Omri requested an updated hiring signal.",
  "requestId": "req_...",
  "idempotencyKey": "openclaw:projects:update:project-id",
  "createdAt": "2026-06-21T00:00:00.000Z"
}
```

## Validation Checklist

Before treating a v1 endpoint as live:

- Confirm `OPENCLAW_API_KEY` is configured in Cloudflare.
- Confirm missing key returns `401`.
- Confirm wrong key returns `401`.
- Confirm missing runtime secret returns `503`.
- Confirm invalid JSON returns `400`.
- Confirm validation errors return `400` or `422` with `issues`.
- Confirm every public-write resource supports list, read, create, patch, put, and hard delete where applicable.
- Confirm delete requires `X-OpenClaw-Confirm-Delete: true`.
- Confirm private summary endpoints do not leak PII, proposal content, intake payloads, tokens, secrets, or raw email/template bodies.
- Confirm all write operations add audit logs.
- Confirm all write operations have rate limits.
- Run repository checks:

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test -- --runInBand
npm.cmd run build
```

## Implemented v1 Coverage Summary

Implemented in this API:

- Blog list/read/create/update/delete with separate create and update semantics.
- Public content block list/read/create/update/delete/reorder.
- Project list/read/create/update/delete/reorder, including rich case-study fields.
- Skills CRUD, reorder, and mark-used.
- Work experience CRUD and reorder.
- Education CRUD and reorder.
- Certification CRUD, reorder, and mark-expired.
- Services CRUD and reorder.
- Testimonials CRUD, reorder, and verify.
- Resume PDF overview, item inclusion settings, section order, and date format.
- Minimal private summaries for intakes, proposals, contact inquiries, pricing, discounts, email templates, users, roles, dashboard metadata, and operational health.
- Standard v1 response envelope.
- Standard hard-delete confirmation.
- Best-effort in-memory idempotency for non-GET requests with `X-Idempotency-Key`.
- Audit logging calls for writes and deletes through the existing audit interface.

OpenClaw must still treat private/admin resources as read-only summaries. The v1 route intentionally does not expose private detail endpoints or private write endpoints.
