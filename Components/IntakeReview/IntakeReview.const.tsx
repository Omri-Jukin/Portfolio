import type {
  IntakeStatus,
  IntakeRiskLevel,
  IntakeNoteCategory,
} from "$/db/schema/schema.types";
import type { EmailTemplate } from "./IntakeReview.type";

// Status workflow colors
export const STATUS_COLORS: Record<IntakeStatus, string> = {
  new: "#2196f3",
  reviewing: "#ff9800",
  contacted: "#9c27b0",
  proposal_sent: "#00bcd4",
  accepted: "#4caf50",
  declined: "#f44336",
};

// Status workflow icons (Material-UI icon names)
export const STATUS_ICONS: Record<IntakeStatus, string> = {
  new: "FiberNew",
  reviewing: "RateReview",
  contacted: "ContactMail",
  proposal_sent: "Send",
  accepted: "CheckCircle",
  declined: "Cancel",
};

// Status display names
export const STATUS_LABELS: Record<IntakeStatus, string> = {
  new: "New",
  reviewing: "Reviewing",
  contacted: "Contacted",
  proposal_sent: "Proposal Sent",
  accepted: "Accepted",
  declined: "Declined",
};

// Urgency colors (matching email design)
export const URGENCY_COLORS: Record<string, string> = {
  urgent: "#dc3545",
  high: "#fd7e14",
  medium: "#ffc107",
  low: "#28a745",
};

// Risk level colors
export const RISK_LEVEL_COLORS: Record<IntakeRiskLevel, string> = {
  low: "#4caf50",
  medium: "#ff9800",
  high: "#f44336",
};

// Note category colors
export const NOTE_CATEGORY_COLORS: Record<IntakeNoteCategory, string> = {
  "follow-up": "#2196f3",
  "waiting-on-client": "#ff9800",
  "budget-concerns": "#f44336",
  "technical-notes": "#9c27b0",
  general: "#757575",
};

// Note category labels
export const NOTE_CATEGORY_LABELS: Record<IntakeNoteCategory, string> = {
  "follow-up": "Follow-up",
  "waiting-on-client": "Waiting on Client",
  "budget-concerns": "Budget Concerns",
  "technical-notes": "Technical Notes",
  general: "General",
};

// Email templates
export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: "initial-response",
    name: "Initial Response",
    subject: "Re: {projectTitle} - Let's Get Started!",
    body: `Hi {firstName},

Thank you for reaching out! I've reviewed your project details for "{projectTitle}" and I'm excited about the opportunity to work together.

I'd love to schedule a call to discuss your requirements in more detail and answer any questions you might have.

Would you be available for a 30-minute call this week? You can book a time that works for you here: {calendlyLink}

Looking forward to connecting!

Best regards,
Omri Jukin`,
  },
  {
    id: "follow-up",
    name: "Follow-up",
    subject: "Following up on {projectTitle}",
    body: `Hi {firstName},

I wanted to follow up on the project proposal I sent for "{projectTitle}".

Have you had a chance to review it? I'm happy to answer any questions or discuss any adjustments you'd like to make.

Let me know if you'd like to schedule a call to go over the details.

Best regards,
Omri Jukin`,
  },
  {
    id: "request-more-info",
    name: "Request More Information",
    subject: "A few questions about {projectTitle}",
    body: `Hi {firstName},

Thank you for your interest in working together on "{projectTitle}".

To provide you with an accurate proposal, I'd like to clarify a few things:

1. [Question 1]
2. [Question 2]
3. [Question 3]

Once I have this information, I'll be able to put together a comprehensive proposal for you.

Best regards,
Omri Jukin`,
  },
  {
    id: "send-proposal",
    name: "Send Proposal",
    subject: "Proposal for {projectTitle}",
    body: `Hi {firstName},

Please find attached the detailed proposal for "{projectTitle}".

The proposal includes:
- Project scope and deliverables
- Timeline and milestones
- Pricing and payment terms
- Next steps

I'm excited about the opportunity to work on this project and help bring your vision to life. Let me know if you have any questions or would like to discuss any aspects of the proposal.

I'm available for a call at your convenience. You can book time here: {calendlyLink}

Best regards,
Omri Jukin`,
  },
  {
    id: "polite-decline",
    name: "Polite Decline",
    subject: "Re: {projectTitle}",
    body: `Hi {firstName},

Thank you for considering me for "{projectTitle}".

After careful consideration, I don't think I'm the best fit for this particular project at this time. However, I'd be happy to recommend some other professionals who might be a better match for your needs.

I appreciate your time and wish you the best of luck with your project!

Best regards,
Omri Jukin`,
  },
];

// Default hourly rate for value estimation
export const DEFAULT_HOURLY_RATE = 100;

// Technology complexity scores (for value estimation)
export const TECH_COMPLEXITY_SCORES: Record<string, number> = {
  // Frontend
  React: 1.0,
  "Next.js": 1.2,
  Vue: 1.0,
  Angular: 1.1,
  TypeScript: 1.1,
  JavaScript: 0.9,

  // Backend
  "Node.js": 1.0,
  Express: 0.9,
  "Nest.js": 1.1,
  Python: 1.0,
  Django: 1.1,
  Flask: 0.9,

  // Database
  PostgreSQL: 1.0,
  MongoDB: 1.0,
  MySQL: 0.9,
  Redis: 1.1,

  // Cloud & DevOps
  AWS: 1.3,
  Azure: 1.3,
  GCP: 1.3,
  Docker: 1.2,
  Kubernetes: 1.5,

  // Mobile
  "React Native": 1.2,
  Flutter: 1.2,
  Swift: 1.3,
  Kotlin: 1.3,

  // Default for unknown tech
  default: 1.0,
};

// Timeline to hours estimation
export const TIMELINE_TO_HOURS: Record<string, number> = {
  "1 week": 40,
  "2 weeks": 80,
  "1 month": 160,
  "2 months": 320,
  "3 months": 480,
  "6 months": 960,
  "1 year": 1920,
};
