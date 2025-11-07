import {
  canAccessAdminSync,
  canEditContentSync,
  canEditTableSync,
  getUserRoleSync,
  clearRolesCache,
  type AuthenticatedUser,
} from "$/auth/rbac";

describe("RBAC", () => {
  beforeEach(() => {
    // Clear cache before each test to ensure consistent behavior
    clearRolesCache();
  });

  describe("canAccessAdminSync", () => {
    it("admin can access admin", () => {
      expect(canAccessAdminSync("admin")).toBe(true);
    });

    it("visitor cannot access admin", () => {
      expect(canAccessAdminSync("visitor")).toBe(false);
    });

    it("editor cannot access admin", () => {
      expect(canAccessAdminSync("editor")).toBe(false);
    });

    it("user cannot access admin", () => {
      expect(canAccessAdminSync("user")).toBe(false);
    });

    it("undefined role cannot access admin", () => {
      expect(() =>
        canAccessAdminSync(undefined as unknown as string)
      ).not.toThrow();
      expect(canAccessAdminSync(undefined as unknown as string)).toBe(false);
    });

    it("null role cannot access admin", () => {
      expect(() => canAccessAdminSync(null as unknown as string)).not.toThrow();
      expect(canAccessAdminSync(null as unknown as string)).toBe(false);
    });

    it("empty string cannot access admin", () => {
      expect(canAccessAdminSync("")).toBe(false);
    });

    it("invalid role cannot access admin", () => {
      expect(canAccessAdminSync("invalid-role")).toBe(false);
    });
  });

  describe("canEditContentSync", () => {
    it("admin can edit content", () => {
      expect(canEditContentSync("admin")).toBe(true);
    });

    it("editor can edit content", () => {
      expect(canEditContentSync("editor")).toBe(true);
    });

    it("visitor cannot edit content", () => {
      expect(canEditContentSync("visitor")).toBe(false);
    });

    it("user cannot edit content", () => {
      expect(canEditContentSync("user")).toBe(false);
    });

    it("undefined role cannot edit content", () => {
      expect(canEditContentSync(undefined as unknown as string)).toBe(false);
    });

    it("null role cannot edit content", () => {
      expect(canEditContentSync(null as unknown as string)).toBe(false);
    });

    it("empty string cannot edit content", () => {
      expect(canEditContentSync("")).toBe(false);
    });

    it("invalid role cannot edit content", () => {
      expect(canEditContentSync("invalid-role")).toBe(false);
    });
  });

  describe("canEditTableSync", () => {
    const adminOnlyTables = [
      "intakes",
      "emailTemplates",
      "calculatorSettings",
      "adminDashboardSections",
      "pricing",
    ];

    const contentTables = [
      "projects",
      "skills",
      "certifications",
      "education",
      "workExperiences",
      "services",
      "testimonials",
      "blog",
    ];

    describe("admin-only tables", () => {
      adminOnlyTables.forEach((table) => {
        it(`admin can edit ${table}`, () => {
          expect(canEditTableSync(table, "admin")).toBe(true);
        });

        it(`editor cannot edit ${table}`, () => {
          expect(canEditTableSync(table, "editor")).toBe(false);
        });

        it(`user cannot edit ${table}`, () => {
          expect(canEditTableSync(table, "user")).toBe(false);
        });

        it(`visitor cannot edit ${table}`, () => {
          expect(canEditTableSync(table, "visitor")).toBe(false);
        });
      });
    });

    describe("content tables", () => {
      contentTables.forEach((table) => {
        it(`admin can edit ${table}`, () => {
          expect(canEditTableSync(table, "admin")).toBe(true);
        });

        it(`editor can edit ${table}`, () => {
          expect(canEditTableSync(table, "editor")).toBe(true);
        });

        it(`user cannot edit ${table}`, () => {
          expect(canEditTableSync(table, "user")).toBe(false);
        });

        it(`visitor cannot edit ${table}`, () => {
          expect(canEditTableSync(table, "visitor")).toBe(false);
        });
      });
    });

    it("handles invalid table name", () => {
      expect(canEditTableSync("invalidTable", "admin")).toBe(true); // Falls back to content table logic
      expect(canEditTableSync("invalidTable", "editor")).toBe(true);
      expect(canEditTableSync("invalidTable", "user")).toBe(false);
    });
  });

  describe("getUserRoleSync", () => {
    it("returns visitor for null user", () => {
      expect(getUserRoleSync(null)).toBe("visitor");
    });

    it("returns visitor for user with no role", () => {
      const user: AuthenticatedUser = {
        id: "1",
        email: "test@example.com",
        name: "Test User",
        firstName: "Test",
        lastName: "User",
        role: "",
      };
      expect(getUserRoleSync(user)).toBe("visitor");
    });

    it("returns admin for admin user", () => {
      const user: AuthenticatedUser = {
        id: "1",
        email: "admin@example.com",
        name: "Admin User",
        firstName: "Admin",
        lastName: "User",
        role: "admin",
      };
      expect(getUserRoleSync(user)).toBe("admin");
    });

    it("returns editor for editor user", () => {
      const user: AuthenticatedUser = {
        id: "1",
        email: "editor@example.com",
        name: "Editor User",
        firstName: "Editor",
        lastName: "User",
        role: "editor",
      };
      expect(getUserRoleSync(user)).toBe("editor");
    });

    it("returns user for user role", () => {
      const user: AuthenticatedUser = {
        id: "1",
        email: "user@example.com",
        name: "Regular User",
        firstName: "Regular",
        lastName: "User",
        role: "user",
      };
      expect(getUserRoleSync(user)).toBe("user");
    });

    it("returns visitor for visitor role", () => {
      const user: AuthenticatedUser = {
        id: "1",
        email: "visitor@example.com",
        name: "Visitor",
        firstName: "Visitor",
        lastName: "User",
        role: "visitor",
      };
      expect(getUserRoleSync(user)).toBe("visitor");
    });

    it("handles case-insensitive roles", () => {
      const user: AuthenticatedUser = {
        id: "1",
        email: "admin@example.com",
        name: "Admin User",
        firstName: "Admin",
        lastName: "User",
        role: "ADMIN",
      };
      expect(getUserRoleSync(user)).toBe("admin");
    });

    it("returns visitor for invalid role", () => {
      const user: AuthenticatedUser = {
        id: "1",
        email: "test@example.com",
        name: "Test User",
        firstName: "Test",
        lastName: "User",
        role: "invalid-role",
      };
      expect(getUserRoleSync(user)).toBe("visitor");
    });
  });
});
