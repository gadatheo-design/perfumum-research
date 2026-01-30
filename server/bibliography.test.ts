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


// ============================================================================
// REFERENCE CITATIONS TESTS (Citations croisées)
// ============================================================================

describe("Reference Citations Procedures", () => {
  const caller = appRouter.createCaller(createMockContext());
  const authenticatedCaller = appRouter.createCaller(createMockContext(true));

  describe("referenceCitations.list", () => {
    it("should return a list of citations with total count", async () => {
      const result = await caller.referenceCitations.list({});
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty("citations");
      expect(result).toHaveProperty("total");
      expect(Array.isArray(result.citations)).toBe(true);
      expect(typeof result.total).toBe("number");
    });

    it("should filter by citation type", async () => {
      const result = await caller.referenceCitations.list({ citationType: "direct" });
      
      expect(result).toBeDefined();
      expect(Array.isArray(result.citations)).toBe(true);
      // All returned citations should be of type 'direct'
      result.citations.forEach((citation: any) => {
        expect(citation.citationType).toBe("direct");
      });
    });

    it("should filter by verified status", async () => {
      const result = await caller.referenceCitations.list({ verified: true });
      
      expect(result).toBeDefined();
      expect(Array.isArray(result.citations)).toBe(true);
      // All returned citations should be verified
      result.citations.forEach((citation: any) => {
        expect(citation.verified).toBe(true);
      });
    });
  });

  describe("referenceCitations.getGraph", () => {
    it("should return nodes and links for graph visualization", async () => {
      const result = await caller.referenceCitations.getGraph({});
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty("nodes");
      expect(result).toHaveProperty("links");
      expect(Array.isArray(result.nodes)).toBe(true);
      expect(Array.isArray(result.links)).toBe(true);
    });

    it("should filter graph by citation type", async () => {
      const result = await caller.referenceCitations.getGraph({ citationType: "methodological" });
      
      expect(result).toBeDefined();
      expect(Array.isArray(result.nodes)).toBe(true);
      expect(Array.isArray(result.links)).toBe(true);
    });

    it("should filter graph by minimum weight", async () => {
      const result = await caller.referenceCitations.getGraph({ minWeight: 3 });
      
      expect(result).toBeDefined();
      expect(Array.isArray(result.links)).toBe(true);
      // All links should have weight >= 3
      result.links.forEach((link: any) => {
        expect(link.weight).toBeGreaterThanOrEqual(3);
      });
    });

    it("should filter graph by verified status", async () => {
      const result = await caller.referenceCitations.getGraph({ verified: true });
      
      expect(result).toBeDefined();
      expect(Array.isArray(result.links)).toBe(true);
    });
  });

  describe("referenceCitations.getStats", () => {
    it("should return citation graph statistics", async () => {
      const result = await caller.referenceCitations.getStats();
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty("totalCitations");
      expect(result).toHaveProperty("totalCitingReferences");
      expect(result).toHaveProperty("totalCitedReferences");
      expect(result).toHaveProperty("verifiedCount");
      expect(result).toHaveProperty("byType");
      expect(result).toHaveProperty("mostCited");
      expect(typeof result.totalCitations).toBe("number");
      expect(Array.isArray(result.byType)).toBe(true);
      expect(Array.isArray(result.mostCited)).toBe(true);
    });
  });

  describe("referenceCitations.getCitationsOf", () => {
    it("should return citations of a reference (who cites this reference)", async () => {
      // Test with a non-existent ID should return empty array
      const result = await caller.referenceCitations.getCitationsOf(99999);
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("referenceCitations.getCitedBy", () => {
    it("should return references cited by a reference", async () => {
      // Test with a non-existent ID should return empty array
      const result = await caller.referenceCitations.getCitedBy(99999);
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});

// ============================================================================
// BIBLIOGRAPHY AXIS LINKS TESTS (Liaisons aux axes de recherche)
// ============================================================================

describe("Bibliography Axis Links Procedures", () => {
  const caller = appRouter.createCaller(createMockContext());

  describe("bibliography.getLinkedAxes", () => {
    it("should return linked axes for a bibliography entry", async () => {
      // Test with a non-existent ID should return empty array
      const result = await caller.bibliography.getLinkedAxes(99999);
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
