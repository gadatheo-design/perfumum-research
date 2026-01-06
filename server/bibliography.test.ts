import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

/**
 * Tests for Bibliography and Research Axes tRPC procedures
 * These tests verify the API operations for:
 * - Bibliography entries (CRUD operations)
 * - Research axes management
 * - Research entries within axes
 */

// Helper to create a mock context
function createMockContext(authenticated = false): TrpcContext {
  const user = authenticated ? {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  } : null;

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("Bibliography Procedures", () => {
  const caller = appRouter.createCaller(createMockContext());
  const authenticatedCaller = appRouter.createCaller(createMockContext(true));

  describe("bibliography.list", () => {
    it("should return a list of bibliography entries", async () => {
      const result = await caller.bibliography.list({});
      
      expect(result).toBeDefined();
      expect(Array.isArray(result.entries)).toBe(true);
      expect(typeof result.total).toBe("number");
    });

    it("should filter by entry type", async () => {
      const result = await caller.bibliography.list({ entryType: "article" });
      
      expect(result).toBeDefined();
      expect(Array.isArray(result.entries)).toBe(true);
      // All returned entries should be articles
      result.entries.forEach(entry => {
        expect(entry.entryType).toBe("article");
      });
    });

    it("should support pagination", async () => {
      const result = await caller.bibliography.list({ limit: 5, offset: 0 });
      
      expect(result).toBeDefined();
      expect(result.entries.length).toBeLessThanOrEqual(5);
    });
  });

  describe("bibliography.getStats", () => {
    it("should return bibliography statistics", async () => {
      const result = await caller.bibliography.getStats();
      
      expect(result).toBeDefined();
      expect(typeof result.total).toBe("number");
      expect(Array.isArray(result.byType)).toBe(true);
      expect(Array.isArray(result.byYear)).toBe(true);
    });
  });
});

describe("Research Axes Procedures", () => {
  const caller = appRouter.createCaller(createMockContext());
  const authenticatedCaller = appRouter.createCaller(createMockContext(true));

  describe("researchAxes.list", () => {
    it("should return a list of research axes", async () => {
      const result = await caller.researchAxes.list({});
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should filter by status", async () => {
      const result = await caller.researchAxes.list({ status: "en_cours" });
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      // All returned axes should have status "en_cours"
      result.forEach(axis => {
        expect(axis.status).toBe("en_cours");
      });
    });

    it("should filter by category", async () => {
      const result = await caller.researchAxes.list({ category: "fondamental" });
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      // All returned axes should have category "fondamental"
      result.forEach(axis => {
        expect(axis.category).toBe("fondamental");
      });
    });
  });

  describe("researchAxes.getStats", () => {
    it("should return research axes statistics", async () => {
      const result = await caller.researchAxes.getStats();
      
      expect(result).toBeDefined();
      expect(typeof result.total).toBe("number");
      expect(Array.isArray(result.byStatus)).toBe(true);
      expect(Array.isArray(result.byCategory)).toBe(true);
      expect(typeof result.averageProgress).toBe("number");
    });
  });
});

describe("Research Entries Procedures", () => {
  const caller = appRouter.createCaller(createMockContext());

  describe("researchEntries.list", () => {
    it("should return a list of research entries when axisId is provided", async () => {
      // First get an axis to use its ID
      const axes = await caller.researchAxes.list({});
      
      if (axes.length > 0) {
        const result = await caller.researchEntries.list({ axisId: axes[0].id });
        
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
      }
    });

    it("should filter by entry type", async () => {
      const axes = await caller.researchAxes.list({});
      
      if (axes.length > 0) {
        const result = await caller.researchEntries.list({ 
          axisId: axes[0].id,
          entryType: "note" 
        });
        
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        // All returned entries should be notes
        result.forEach(entry => {
          expect(entry.entryType).toBe("note");
        });
      }
    });
  });

  describe("researchEntries.getNextCode", () => {
    it("should generate a valid next code for an axis", async () => {
      const result = await caller.researchEntries.getNextCode("AX1");
      
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
      expect(result).toMatch(/^AX1-\d{3}$/);
    });
  });
});


describe("Bibliography-Axis Links", () => {
  const caller = appRouter.createCaller(createMockContext());
  const authenticatedCaller = appRouter.createCaller(createMockContext(true));

  describe("bibliography.getLinkedAxes", () => {
    it("should return linked axes for a bibliography entry", async () => {
      // First get a bibliography entry
      const bibList = await caller.bibliography.list({ limit: 1 });
      
      if (bibList.entries.length > 0) {
        const result = await caller.bibliography.getLinkedAxes(bibList.entries[0].id);
        
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
      }
    });

    it("should return empty array for entry with no links", async () => {
      // Use a non-existent ID that won't have links
      const result = await caller.bibliography.getLinkedAxes(999999);
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
  });

  describe("bibliography.linkToAxis", () => {
    it("should require authentication to link", async () => {
      // Get a bibliography entry and an axis
      const bibList = await caller.bibliography.list({ limit: 1 });
      const axes = await caller.researchAxes.list({});
      
      if (bibList.entries.length > 0 && axes.length > 0) {
        // Unauthenticated caller should fail
        await expect(
          caller.bibliography.linkToAxis({
            bibliographyId: bibList.entries[0].id,
            axisId: axes[0].id,
          })
        ).rejects.toThrow();
      }
    });
  });

  describe("bibliography.unlinkFromAxis", () => {
    it("should require authentication to unlink", async () => {
      // Get a bibliography entry and an axis
      const bibList = await caller.bibliography.list({ limit: 1 });
      const axes = await caller.researchAxes.list({});
      
      if (bibList.entries.length > 0 && axes.length > 0) {
        // Unauthenticated caller should fail
        await expect(
          caller.bibliography.unlinkFromAxis({
            bibliographyId: bibList.entries[0].id,
            axisId: axes[0].id,
          })
        ).rejects.toThrow();
      }
    });
  });
});

describe("BibTeX Import", () => {
  const authenticatedCaller = appRouter.createCaller(createMockContext(true));

  describe("bibliography.importBibTeX", () => {
    it("should require authentication to import", async () => {
      const caller = appRouter.createCaller(createMockContext(false));
      
      await expect(
        caller.bibliography.importBibTeX("@article{test, title={Test}}")
      ).rejects.toThrow();
    });

    it("should parse and import valid BibTeX", async () => {
      const bibtex = `@article{test_import_${Date.now()},
        title = {Test Import Article},
        author = {Test Author},
        year = {2024},
        journal = {Test Journal}
      }`;

      const result = await authenticatedCaller.bibliography.importBibTeX(bibtex);
      
      expect(result).toBeDefined();
      expect(typeof result.success).toBe("number");
      expect(typeof result.failed).toBe("number");
      expect(result.success).toBeGreaterThanOrEqual(0);
    });

    it("should handle empty BibTeX gracefully", async () => {
      const result = await authenticatedCaller.bibliography.importBibTeX("");
      
      expect(result).toBeDefined();
      expect(result.success).toBe(0);
    });
  });
});
