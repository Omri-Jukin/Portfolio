import { SignJWT, jwtVerify } from "jose";

const INTAKE_SESSION_SECRET =
  process.env.INTAKE_SESSION_SECRET ||
  process.env.JWT_SECRET ||
  "default-secret-change-in-production";
const INTAKE_SESSION_EXPIRY_HOURS = 24;

export interface IntakeSessionPayload {
  email: string;
  eventUri?: string;
  inviteeUri?: string;
  issuedAt: number;
  // Custom client link fields
  isCustomLink?: boolean;
  firstName?: string;
  lastName?: string;
  organizationName?: string;
  organizationWebsite?: string;
}

/**
 * Generate a session token for intake form access
 * Token expires after 24 hours
 */
export async function generateIntakeSessionToken(
  payload: Omit<IntakeSessionPayload, "issuedAt">
): Promise<string> {
  const secret = new TextEncoder().encode(INTAKE_SESSION_SECRET);

  const jwt = await new SignJWT({
    email: payload.email,
    eventUri: payload.eventUri,
    inviteeUri: payload.inviteeUri,
    isCustomLink: payload.isCustomLink || false,
    firstName: payload.firstName,
    lastName: payload.lastName,
    organizationName: payload.organizationName,
    organizationWebsite: payload.organizationWebsite,
    issuedAt: Date.now(),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${INTAKE_SESSION_EXPIRY_HOURS}h`)
    .sign(secret);

  return jwt;
}

/**
 * Verify and decode intake session token
 * Returns null if token is invalid or expired
 */
export async function verifyIntakeSessionToken(
  token: string
): Promise<IntakeSessionPayload | null> {
  try {
    const secret = new TextEncoder().encode(INTAKE_SESSION_SECRET);
    const { payload } = await jwtVerify(token, secret);

    if (!payload || typeof payload !== "object") {
      return null;
    }

    // Validate required fields
    if (!("email" in payload) || typeof payload.email !== "string") {
      return null;
    }

    return {
      email: payload.email as string,
      eventUri: payload.eventUri as string | undefined,
      inviteeUri: payload.inviteeUri as string | undefined,
      isCustomLink: payload.isCustomLink as boolean | undefined,
      firstName: payload.firstName as string | undefined,
      lastName: payload.lastName as string | undefined,
      organizationName: payload.organizationName as string | undefined,
      organizationWebsite: payload.organizationWebsite as string | undefined,
      issuedAt:
        typeof payload.issuedAt === "number" ? payload.issuedAt : Date.now(),
    };
  } catch (error) {
    console.error("Failed to verify intake session token:", error);
    return null;
  }
}

/**
 * Generate a custom intake link token for a specific client
 * This bypasses the Calendly requirement
 */
export async function generateCustomIntakeLinkToken(
  email: string,
  options?: {
    firstName?: string;
    lastName?: string;
    organizationName?: string;
    organizationWebsite?: string;
    expiresInHours?: number;
  }
): Promise<string> {
  const secret = new TextEncoder().encode(INTAKE_SESSION_SECRET);
  const expiresInHours = options?.expiresInHours || 30 * 24; // Default 30 days

  const jwt = await new SignJWT({
    email,
    isCustomLink: true,
    firstName: options?.firstName,
    lastName: options?.lastName,
    organizationName: options?.organizationName,
    organizationWebsite: options?.organizationWebsite,
    issuedAt: Date.now(),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${expiresInHours}h`)
    .sign(secret);

  return jwt;
}

// Note: Token expiry is handled by JWT expiration time
// This function is kept for potential future use if manual expiry checking is needed
// export function isIntakeSessionExpired(issuedAt: number): boolean {
//   const expiryTime = issuedAt + INTAKE_SESSION_EXPIRY_HOURS * 60 * 60 * 1000;
//   return Date.now() > expiryTime;
// }
