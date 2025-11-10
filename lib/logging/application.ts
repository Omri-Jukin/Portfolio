/**
 * Application logging module
 * General purpose logging for application events, errors, and diagnostics
 */

import { createApplicationLog } from "$/db/logging/applicationLogs";
import type {
  ApplicationLogLevel,
  ApplicationLogCategory,
} from "$/db/schema/schema.types";

export interface LogContext {
  userId?: string | null;
  resourceType?: string | null;
  resourceId?: string | null;
  errorCode?: string | null;
  stackTrace?: string | null;
  duration?: number | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  [key: string]: unknown;
}

/**
 * Create an application log entry
 */
export async function logApplication(
  level: ApplicationLogLevel,
  category: ApplicationLogCategory,
  message: string,
  context?: LogContext
): Promise<void> {
  try {
    await createApplicationLog({
      level,
      category,
      message,
      metadata: context
        ? Object.fromEntries(
            Object.entries(context).filter(
              ([key]) =>
                ![
                  "userId",
                  "resourceType",
                  "resourceId",
                  "errorCode",
                  "stackTrace",
                  "duration",
                  "ipAddress",
                  "userAgent",
                ].includes(key)
            )
          )
        : {},
      userId: context?.userId || null,
      resourceType: context?.resourceType || null,
      resourceId: context?.resourceId || null,
      errorCode: context?.errorCode || null,
      stackTrace: context?.stackTrace || null,
      duration: context?.duration || null,
      ipAddress: context?.ipAddress || null,
      userAgent: context?.userAgent || null,
    });

    // Also log to console in development
    if (process.env.NODE_ENV === "development") {
      const consoleMethod =
        level === "error"
          ? console.error
          : level === "warn"
          ? console.warn
          : level === "info"
          ? console.info
          : console.debug;
      consoleMethod(
        `[${level.toUpperCase()}] [${category}] ${message}`,
        context
      );
    }
  } catch (error) {
    // Don't throw errors from logging - it should never break the main flow
    console.error("[APPLICATION_LOG] Failed to create log entry:", error);
  }
}

/**
 * Convenience functions for different log levels
 */
export const logError = (
  category: ApplicationLogCategory,
  message: string,
  context?: LogContext
) => logApplication("error", category, message, context);

export const logWarn = (
  category: ApplicationLogCategory,
  message: string,
  context?: LogContext
) => logApplication("warn", category, message, context);

export const logInfo = (
  category: ApplicationLogCategory,
  message: string,
  context?: LogContext
) => logApplication("info", category, message, context);

export const logDebug = (
  category: ApplicationLogCategory,
  message: string,
  context?: LogContext
) => logApplication("debug", category, message, context);

/**
 * Log an error with stack trace
 */
export async function logErrorWithStack(
  category: ApplicationLogCategory,
  message: string,
  error: Error,
  context?: LogContext
): Promise<void> {
  await logError(category, message, {
    ...context,
    errorCode: error.name,
    stackTrace: error.stack || undefined,
    errorMessage: error.message,
  });
}
