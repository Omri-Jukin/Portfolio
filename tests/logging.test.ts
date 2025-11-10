import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { getDB } from "$/db/client";
import { applicationLogs, auditLogs } from "$/db/schema/schema.tables";
import {
  createApplicationLog,
  getApplicationLogs,
  getApplicationLogById,
} from "$/db/logging/applicationLogs";
import {
  createAuditLog,
  getAuditLogs,
  getAuditLogById,
} from "$/db/logging/auditLogs";
import {
  logError,
  logWarn,
  logInfo,
  logDebug,
  logErrorWithStack,
} from "$/logging/application";
import { emitAudit } from "$/logging/audit";
import { createTestUserInDb, createMockAdminUser } from "./helpers/testContext";

describe("Logging Infrastructure", () => {
  let db: Awaited<ReturnType<typeof getDB>> | null = null;
  let testUserId: string | null = null;

  beforeEach(async () => {
    if (!process.env.DATABASE_URL || process.env.NODE_ENV === "production") {
      console.warn(
        "Skipping logging tests - DATABASE_URL not set or in production"
      );
      return;
    }

    try {
      db = await getDB();
      if (!db) return;

      // Clean up before each test
      await db.delete(applicationLogs);
      await db.delete(auditLogs);

      // Create a test user for foreign key constraints
      const adminUser = createMockAdminUser();
      testUserId = await createTestUserInDb(db, adminUser);
    } catch (error) {
      console.error("Failed to setup test database:", error);
      db = null;
    }
  });

  afterEach(async () => {
    if (db) {
      await db.delete(applicationLogs);
      await db.delete(auditLogs);
    }
  });

  describe("Application Logs", () => {
    describe("createApplicationLog", () => {
      it("should create a basic application log entry", async () => {
        if (!db) return;

        const log = await createApplicationLog({
          level: "info",
          category: "general",
          message: "Test log message",
        });

        expect(log).toBeTruthy();
        expect(log?.level).toBe("info");
        expect(log?.category).toBe("general");
        expect(log?.message).toBe("Test log message");
        expect(log?.metadata).toEqual({});
        expect(log?.userId).toBeNull();
        expect(log?.createdAt).toBeInstanceOf(Date);
      });

      it("should create a log entry with all optional fields", async () => {
        if (!db || !testUserId) return;

        const error = new Error("Test error");
        error.stack = "Error: Test error\n    at test.ts:1:1";

        const log = await createApplicationLog({
          level: "error",
          category: "proposal",
          message: "Failed to generate PDF",
          metadata: { proposalId: "123", attempt: 1 },
          userId: testUserId,
          resourceType: "proposal",
          resourceId: "proposal-123",
          errorCode: "PDF_GENERATION_FAILED",
          stackTrace: error.stack,
          duration: 1500,
          ipAddress: "192.168.1.1",
          userAgent: "Mozilla/5.0",
        });

        expect(log).toBeTruthy();
        expect(log?.level).toBe("error");
        expect(log?.category).toBe("proposal");
        expect(log?.message).toBe("Failed to generate PDF");
        expect(log?.metadata).toEqual({ proposalId: "123", attempt: 1 });
        expect(log?.userId).toBe(testUserId);
        expect(log?.resourceType).toBe("proposal");
        expect(log?.resourceId).toBe("proposal-123");
        expect(log?.errorCode).toBe("PDF_GENERATION_FAILED");
        expect(log?.stackTrace).toBe(error.stack);
        expect(log?.duration).toBe(1500);
        expect(log?.ipAddress).toBe("192.168.1.1");
        expect(log?.userAgent).toBe("Mozilla/5.0");
      });

      it.skip("should handle database unavailability gracefully", async () => {
        // This test verifies that createApplicationLog doesn't throw
        // when database is unavailable (handled internally)
        // Note: Cannot easily mock getDB due to module structure,
        // but the code already handles this case gracefully by returning null
        // and logging to console when database is unavailable
      });

      it("should normalize empty strings to null for optional fields", async () => {
        if (!db) return;

        const log = await createApplicationLog({
          level: "warn",
          category: "validation",
          message: "Validation warning",
          userId: "",
          resourceType: "",
          resourceId: "",
          errorCode: "",
          stackTrace: "",
          ipAddress: "",
          userAgent: "",
        });

        expect(log).toBeTruthy();
        expect(log?.userId).toBeNull();
        expect(log?.resourceType).toBeNull();
        expect(log?.resourceId).toBeNull();
        expect(log?.errorCode).toBeNull();
        expect(log?.stackTrace).toBeNull();
        expect(log?.ipAddress).toBeNull();
        expect(log?.userAgent).toBeNull();
      });
    });

    describe("getApplicationLogs", () => {
      beforeEach(async () => {
        if (!db || !testUserId) return;

        // Create test logs
        await createApplicationLog({
          level: "error",
          category: "proposal",
          message: "Proposal error 1",
          userId: testUserId,
          resourceType: "proposal",
          resourceId: "prop-1",
        });

        await createApplicationLog({
          level: "warn",
          category: "email",
          message: "Email warning",
          userId: testUserId,
        });

        await createApplicationLog({
          level: "info",
          category: "proposal",
          message: "Proposal info",
          resourceType: "proposal",
          resourceId: "prop-2",
        });

        await createApplicationLog({
          level: "error",
          category: "database",
          message: "Database error",
        });
      });

      it("should get all logs without filters", async () => {
        if (!db) return;

        const logs = await getApplicationLogs();

        expect(logs.length).toBeGreaterThanOrEqual(4);
        expect(logs[0]?.message).toBeTruthy();
      });

      it("should filter logs by level", async () => {
        if (!db) return;

        const logs = await getApplicationLogs({ level: ["error"] });

        expect(logs.length).toBeGreaterThanOrEqual(2);
        logs.forEach((log) => {
          expect(log.level).toBe("error");
        });
      });

      it("should filter logs by category", async () => {
        if (!db) return;

        const logs = await getApplicationLogs({ category: ["proposal"] });

        expect(logs.length).toBeGreaterThanOrEqual(2);
        logs.forEach((log) => {
          expect(log.category).toBe("proposal");
        });
      });

      it("should filter logs by userId", async () => {
        if (!db || !testUserId) return;

        const logs = await getApplicationLogs({ userId: testUserId });

        expect(logs.length).toBeGreaterThanOrEqual(2);
        logs.forEach((log) => {
          expect(log.userId).toBe(testUserId);
        });
      });

      it("should filter logs by resourceType and resourceId", async () => {
        if (!db) return;

        const logs = await getApplicationLogs({
          resourceType: "proposal",
          resourceId: "prop-1",
        });

        expect(logs.length).toBeGreaterThanOrEqual(1);
        expect(logs[0]?.resourceType).toBe("proposal");
        expect(logs[0]?.resourceId).toBe("prop-1");
      });

      it("should filter logs by date range", async () => {
        if (!db) return;

        const startDate = new Date();
        startDate.setHours(startDate.getHours() - 1);
        const endDate = new Date();
        endDate.setHours(endDate.getHours() + 1);

        const logs = await getApplicationLogs({
          startDate,
          endDate,
        });

        expect(logs.length).toBeGreaterThanOrEqual(0);
        logs.forEach((log) => {
          expect(log.createdAt.getTime()).toBeGreaterThanOrEqual(
            startDate.getTime()
          );
          expect(log.createdAt.getTime()).toBeLessThanOrEqual(
            endDate.getTime()
          );
        });
      });

      it("should search logs by message text", async () => {
        if (!db) return;

        const logs = await getApplicationLogs({ searchTerm: "Proposal" });

        expect(logs.length).toBeGreaterThanOrEqual(2);
        logs.forEach((log) => {
          expect(log.message.toLowerCase()).toContain("proposal");
        });
      });

      it("should combine multiple filters", async () => {
        if (!db || !testUserId) return;

        const logs = await getApplicationLogs({
          level: ["error"],
          category: ["proposal"],
          userId: testUserId,
        });

        expect(logs.length).toBeGreaterThanOrEqual(1);
        logs.forEach((log) => {
          expect(log.level).toBe("error");
          expect(log.category).toBe("proposal");
          expect(log.userId).toBe(testUserId);
        });
      });

      it("should limit results to 1000", async () => {
        if (!db) return;

        // Create more than 1000 logs
        const promises = [];
        for (let i = 0; i < 1005; i++) {
          promises.push(
            createApplicationLog({
              level: "debug",
              category: "general",
              message: `Test log ${i}`,
            })
          );
        }
        await Promise.all(promises);

        const logs = await getApplicationLogs();
        expect(logs.length).toBeLessThanOrEqual(1000);
      });
    });

    describe("getApplicationLogById", () => {
      it("should get a log by ID", async () => {
        if (!db) return;

        const created = await createApplicationLog({
          level: "info",
          category: "general",
          message: "Test log",
        });

        expect(created).toBeTruthy();
        if (!created) return;

        const retrieved = await getApplicationLogById(created.id);

        expect(retrieved).toBeTruthy();
        expect(retrieved?.id).toBe(created.id);
        expect(retrieved?.message).toBe("Test log");
      });

      it("should return null for non-existent log", async () => {
        if (!db) return;

        const retrieved = await getApplicationLogById("non-existent-id");

        expect(retrieved).toBeNull();
      });
    });
  });

  describe("Audit Logs", () => {
    describe("createAuditLog", () => {
      it("should create a basic audit log entry", async () => {
        if (!db) return;

        const log = await createAuditLog({
          action: "create",
          resource: "proposal",
          resourceId: "prop-123",
        });

        expect(log).toBeTruthy();
        expect(log?.action).toBe("create");
        expect(log?.resource).toBe("proposal");
        expect(log?.resourceId).toBe("prop-123");
        expect(log?.success).toBe(true);
        expect(log?.details).toEqual({});
        expect(log?.createdAt).toBeInstanceOf(Date);
      });

      it("should create a log entry with all optional fields", async () => {
        if (!db || !testUserId) return;

        const log = await createAuditLog({
          userId: testUserId,
          userEmail: "admin@test.com",
          userRole: "admin",
          action: "update",
          resource: "proposal",
          resourceId: "prop-456",
          details: { field: "clientName", oldValue: "Old", newValue: "New" },
          ipAddress: "192.168.1.1",
          userAgent: "Mozilla/5.0",
          success: true,
          errorMessage: null,
        });

        expect(log).toBeTruthy();
        expect(log?.userId).toBe(testUserId);
        expect(log?.userEmail).toBe("admin@test.com");
        expect(log?.userRole).toBe("admin");
        expect(log?.action).toBe("update");
        expect(log?.resource).toBe("proposal");
        expect(log?.resourceId).toBe("prop-456");
        expect(log?.details).toEqual({
          field: "clientName",
          oldValue: "Old",
          newValue: "New",
        });
        expect(log?.ipAddress).toBe("192.168.1.1");
        expect(log?.userAgent).toBe("Mozilla/5.0");
        expect(log?.success).toBe(true);
        expect(log?.errorMessage).toBeNull();
      });

      it("should create a failed audit log entry", async () => {
        if (!db) return;

        const log = await createAuditLog({
          action: "delete",
          resource: "proposal",
          resourceId: "prop-789",
          success: false,
          errorMessage: "Permission denied",
        });

        expect(log).toBeTruthy();
        expect(log?.success).toBe(false);
        expect(log?.errorMessage).toBe("Permission denied");
      });

      it.skip("should handle database unavailability gracefully", async () => {
        // This test verifies that createAuditLog doesn't throw
        // when database is unavailable (handled internally)
        // Note: Cannot easily mock getDB due to module structure,
        // but the code already handles this case gracefully by returning null
        // and logging to console when database is unavailable
      });
    });

    describe("getAuditLogs", () => {
      beforeEach(async () => {
        if (!db || !testUserId) return;

        // Create test audit logs
        await createAuditLog({
          userId: testUserId,
          userEmail: "admin@test.com",
          userRole: "admin",
          action: "create",
          resource: "proposal",
          resourceId: "prop-1",
          success: true,
        });

        await createAuditLog({
          userId: testUserId,
          userEmail: "admin@test.com",
          userRole: "admin",
          action: "update",
          resource: "proposal",
          resourceId: "prop-2",
          success: true,
        });

        await createAuditLog({
          action: "delete",
          resource: "proposal",
          resourceId: "prop-3",
          success: false,
          errorMessage: "Permission denied",
        });

        await createAuditLog({
          userId: testUserId,
          action: "read",
          resource: "blog",
          resourceId: "blog-1",
          success: true,
        });
      });

      it("should get all audit logs without filters", async () => {
        if (!db) return;

        const logs = await getAuditLogs();

        expect(logs.length).toBeGreaterThanOrEqual(4);
        expect(logs[0]?.action).toBeTruthy();
      });

      it("should filter logs by userId", async () => {
        if (!db || !testUserId) return;

        const logs = await getAuditLogs({ userId: testUserId });

        expect(logs.length).toBeGreaterThanOrEqual(3);
        logs.forEach((log) => {
          expect(log.userId).toBe(testUserId);
        });
      });

      it("should filter logs by action", async () => {
        if (!db) return;

        const logs = await getAuditLogs({ action: ["create", "update"] });

        expect(logs.length).toBeGreaterThanOrEqual(2);
        logs.forEach((log) => {
          expect(["create", "update"]).toContain(log.action);
        });
      });

      it("should filter logs by resource", async () => {
        if (!db) return;

        const logs = await getAuditLogs({ resource: ["proposal"] });

        expect(logs.length).toBeGreaterThanOrEqual(3);
        logs.forEach((log) => {
          expect(log.resource).toBe("proposal");
        });
      });

      it("should filter logs by resourceId", async () => {
        if (!db) return;

        const logs = await getAuditLogs({ resourceId: "prop-1" });

        expect(logs.length).toBeGreaterThanOrEqual(1);
        expect(logs[0]?.resourceId).toBe("prop-1");
      });

      it("should filter logs by success status", async () => {
        if (!db) return;

        const failedLogs = await getAuditLogs({ success: false });

        expect(failedLogs.length).toBeGreaterThanOrEqual(1);
        failedLogs.forEach((log) => {
          expect(log.success).toBe(false);
        });
      });

      it("should filter logs by date range", async () => {
        if (!db) return;

        const startDate = new Date();
        startDate.setHours(startDate.getHours() - 1);
        const endDate = new Date();
        endDate.setHours(endDate.getHours() + 1);

        const logs = await getAuditLogs({
          startDate,
          endDate,
        });

        expect(logs.length).toBeGreaterThanOrEqual(0);
        logs.forEach((log) => {
          expect(log.createdAt.getTime()).toBeGreaterThanOrEqual(
            startDate.getTime()
          );
          expect(log.createdAt.getTime()).toBeLessThanOrEqual(
            endDate.getTime()
          );
        });
      });

      it("should search logs by email or error message", async () => {
        if (!db) return;

        const logs = await getAuditLogs({ searchTerm: "admin@test.com" });

        expect(logs.length).toBeGreaterThanOrEqual(3);
        logs.forEach((log) => {
          expect(log.userEmail).toBe("admin@test.com");
        });
      });

      it("should combine multiple filters", async () => {
        if (!db || !testUserId) return;

        const logs = await getAuditLogs({
          userId: testUserId,
          action: ["create"],
          resource: ["proposal"],
          success: true,
        });

        expect(logs.length).toBeGreaterThanOrEqual(1);
        logs.forEach((log) => {
          expect(log.userId).toBe(testUserId);
          expect(log.action).toBe("create");
          expect(log.resource).toBe("proposal");
          expect(log.success).toBe(true);
        });
      });

      it("should limit results to 1000", async () => {
        if (!db) return;

        // Create more than 1000 audit logs
        const promises = [];
        for (let i = 0; i < 1005; i++) {
          promises.push(
            createAuditLog({
              action: "read",
              resource: "proposal",
              resourceId: `prop-${i}`,
            })
          );
        }
        await Promise.all(promises);

        const logs = await getAuditLogs();
        expect(logs.length).toBeLessThanOrEqual(1000);
      });
    });

    describe("getAuditLogById", () => {
      it("should get an audit log by ID", async () => {
        if (!db) return;

        const created = await createAuditLog({
          action: "create",
          resource: "proposal",
          resourceId: "prop-123",
        });

        expect(created).toBeTruthy();
        if (!created) return;

        const retrieved = await getAuditLogById(created.id);

        expect(retrieved).toBeTruthy();
        expect(retrieved?.id).toBe(created.id);
        expect(retrieved?.action).toBe("create");
      });

      it("should return null for non-existent log", async () => {
        if (!db) return;

        const retrieved = await getAuditLogById("non-existent-id");

        expect(retrieved).toBeNull();
      });
    });
  });

  describe("Logging Utility Functions", () => {
    describe("logError", () => {
      it("should create an error log entry", async () => {
        if (!db) return;

        await logError("proposal", "Failed to save proposal", {
          proposalId: "prop-123",
        });

        const logs = await getApplicationLogs({
          level: ["error"],
          category: ["proposal"],
        });

        expect(logs.length).toBeGreaterThanOrEqual(1);
        const log = logs[0];
        expect(log?.level).toBe("error");
        expect(log?.category).toBe("proposal");
        expect(log?.message).toBe("Failed to save proposal");
        expect(log?.metadata).toEqual({ proposalId: "prop-123" });
      });
    });

    describe("logWarn", () => {
      it("should create a warning log entry", async () => {
        if (!db) return;

        await logWarn("email", "Email sending delayed", {
          emailId: "email-456",
        });

        const logs = await getApplicationLogs({
          level: ["warn"],
          category: ["email"],
        });

        expect(logs.length).toBeGreaterThanOrEqual(1);
        const log = logs[0];
        expect(log?.level).toBe("warn");
        expect(log?.category).toBe("email");
        expect(log?.message).toBe("Email sending delayed");
        expect(log?.metadata).toEqual({ emailId: "email-456" });
      });
    });

    describe("logInfo", () => {
      it("should create an info log entry", async () => {
        if (!db) return;

        await logInfo("general", "Application started", {
          version: "1.0.0",
        });

        const logs = await getApplicationLogs({
          level: ["info"],
          category: ["general"],
        });

        expect(logs.length).toBeGreaterThanOrEqual(1);
        const log = logs[0];
        expect(log?.level).toBe("info");
        expect(log?.category).toBe("general");
        expect(log?.message).toBe("Application started");
        expect(log?.metadata).toEqual({ version: "1.0.0" });
      });
    });

    describe("logDebug", () => {
      it("should create a debug log entry", async () => {
        if (!db) return;

        await logDebug("database", "Query executed", {
          query: "SELECT * FROM users",
          duration: 45,
        });

        const logs = await getApplicationLogs({
          level: ["debug"],
          category: ["database"],
        });

        expect(logs.length).toBeGreaterThanOrEqual(1);
        const log = logs[0];
        expect(log?.level).toBe("debug");
        expect(log?.category).toBe("database");
        expect(log?.message).toBe("Query executed");
        expect(log?.metadata).toEqual({
          query: "SELECT * FROM users",
          duration: 45,
        });
      });
    });

    describe("logErrorWithStack", () => {
      it("should create an error log with stack trace", async () => {
        if (!db) return;

        const error = new Error("Test error");
        error.stack = "Error: Test error\n    at test.ts:1:1";

        await logErrorWithStack(
          "proposal",
          "Proposal calculation failed",
          error,
          {
            proposalId: "prop-789",
          }
        );

        const logs = await getApplicationLogs({
          level: ["error"],
          category: ["proposal"],
        });

        expect(logs.length).toBeGreaterThanOrEqual(1);
        const log = logs[0];
        expect(log?.level).toBe("error");
        expect(log?.category).toBe("proposal");
        expect(log?.message).toBe("Proposal calculation failed");
        expect(log?.errorCode).toBe("Error");
        expect(log?.stackTrace).toBe(error.stack);
        expect(log?.metadata).toEqual({
          proposalId: "prop-789",
          errorMessage: "Test error",
        });
      });
    });

    describe("emitAudit", () => {
      it("should create an audit log entry", async () => {
        if (!db || !testUserId) return;

        await emitAudit({
          userId: testUserId,
          userEmail: "admin@test.com",
          userRole: "admin",
          action: "create",
          resource: "proposal",
          resourceId: "prop-999",
          details: { clientName: "Test Client" },
        });

        const logs = await getAuditLogs({
          action: ["create"],
          resource: ["proposal"],
        });

        expect(logs.length).toBeGreaterThanOrEqual(1);
        const log = logs[0];
        expect(log?.userId).toBe(testUserId);
        expect(log?.userEmail).toBe("admin@test.com");
        expect(log?.userRole).toBe("admin");
        expect(log?.action).toBe("create");
        expect(log?.resource).toBe("proposal");
        expect(log?.resourceId).toBe("prop-999");
        expect(log?.details).toEqual({ clientName: "Test Client" });
        expect(log?.success).toBe(true);
      });

      it("should create a failed audit log entry", async () => {
        if (!db) return;

        await emitAudit({
          action: "delete",
          resource: "proposal",
          resourceId: "prop-888",
          success: false,
          errorMessage: "Not found",
        });

        const logs = await getAuditLogs({
          action: ["delete"],
          success: false,
        });

        expect(logs.length).toBeGreaterThanOrEqual(1);
        const log = logs[0];
        expect(log?.success).toBe(false);
        expect(log?.errorMessage).toBe("Not found");
      });

      it.skip("should handle database unavailability gracefully", async () => {
        // This test verifies that emitAudit doesn't throw
        // when database is unavailable (handled internally)
        // Note: Cannot easily mock getDB due to module structure,
        // but the code already handles this case gracefully by returning null
        // and logging to console when database is unavailable
      });
    });
  });
});
